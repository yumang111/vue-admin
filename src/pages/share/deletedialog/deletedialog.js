import {
  downHouse,
  toBlacklist,
  downLog,
  downNewHouse,
  deleteOldHouse,
  deleteRentHouse,
  deleteHouse
} from './deletedialog.api'
import dict from '@/directives/dict.directive'
import Cookie from 'js-cookie'
export default {
  props: {
    multipleSelection: Array, // 删除房源列表
    type: String
  },
  data() {
    return {
      status: '删除',
      user: '',
      blackListReason: [{
        dictItemCode: '1',
        dictItemValue: '多套不同房源'
      },
      {
        dictItemCode: '2',
        dictItemValue: '虚假信息'
      },
      {
        dictItemCode: '3',
        dictItemValue: '中介'
      }
      ],
      ruleFormDelete: {
        reason: '', // 删除原因
        processBy: '', // 处理人（登录人）
        processOtherReason: '', // 其他（理由描述）
        details: '', // 加黑名单详情说明
        reasonType: '' // 加黑名单原因
      },
      deleteDialogshow: false,
      rules: {
        reason: [{
          required: true,
          message: '下架原因不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    type(n) {
      if (n === 'newHouse' || n === 'house') {
        this.status = '下架'
      } else {
        this.status = '删除'
      }
    }
  },
  directives: {
    dict
  },
  methods: {
    deleteConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 下架日志（包含批量下架）
          let deleteReason = []
          let processMode = '1'
          let processModeDesc = '删除'
          let operationTip = '删除成功'
          if (this.type === 'newHouse' || this.type === 'house') {
            processMode = '3'
            processModeDesc = '人工下架'
            operationTip = '下架成功'
          }
          this.multipleSelection.forEach(v => {
            deleteReason.push({
              source: '1',
              processMode: processMode,
              processModeDesc: processModeDesc,
              hsNo: v.houseNo,
              hsId: v.id,
              hsBusinessType: v.businessType,
              hsBusinessTypeDesc: v.businessTypeDesc,
              processBy: this.ruleFormDelete.processBy,
              processReason: this.ruleFormDelete.reason,
              processReasonDesc: this.$refs.reason.selectedLabel,
              processOtherReason: this.ruleFormDelete.processOtherReason
            })
          })
          let params = {
            hsProcessRecords: JSON.stringify({
              hsProcessRecords: deleteReason
            })
          }
          this.chooseRequest().then(res => {
            if (res && res.data === 1) {
              this.deleteDialogshow = false
              this.$parent.multipleSelection = []
              // 单个加黑名单
              if (this.type === 'oldHouseBlackList' || this.type === 'rentHouseBlackList') {
                console.log(this.ruleFormDelete.processBy, this.ruleFormDelete.reasonType, this.$refs.reasonType.selectedLabel, this.multipleSelection[0].contactPhone)
                toBlacklist({
                  curUser: this.ruleFormDelete.processBy,
                  reasonType: this.ruleFormDelete.reasonType,
                  reasonTypeDesc: this.$refs.reasonType.selectedLabel,
                  phoneNum: this.multipleSelection[0].contactPhone
                }).then(res => {
                  if (res.data === '1') {
                    this.$message({
                      message: '成功删除并添加到黑名单',
                      type: 'success'
                    })
                    downLog(params) // 操作记录
                    this.$emit('reset', 'deleteSuccess')
                  }
                }).catch(err => {
                  this.$message.error(err)
                })
              } else {
                this.$message({
                  message: operationTip,
                  type: 'success'
                })
                downLog(params) // 操作记录
                this.$emit('reset', 'deleteSuccess')
              }
            }
          }).catch(err => {
            this.$message.error(err)
          })
        } else {
          console.log('验证未通过！')
        }
      })
    },
    chooseRequest() {
      switch (this.type) {
        case 'newHouse': // 新房下架
          return downNewHouse({
            id: this.multipleSelection[0].id,
            unitId: this.multipleSelection[0].unitId,
            flag: 'down'
          })
        case 'house': // 二手房、租房下架
          let filterArr = []
          this.multipleSelection.forEach(v => {
            filterArr.push({
              id: v.id,
              businessType: v.businessType
            })
          })
          let param = {
            houses: JSON.stringify({
              houses: filterArr
            })
          }
          return downHouse(param)
        case 'oldHouseDelete':
        case 'oldHouseBlackList': // 二手房删除
          return deleteOldHouse({
            id: this.multipleSelection[0].id
          })
        case 'rentHouseDelete':
        case 'rentHouseBlackList': // 租房删除
          return deleteRentHouse({
            id: this.multipleSelection[0].id
          })
        case 'deleteHouse': // 批量删除
          filterArr = []
          this.multipleSelection.forEach(v => {
            filterArr.push({
              id: v.id,
              businessType: v.businessType,
              delState: v.delState
            })
          })
          param = {
            houses: JSON.stringify({
              houses: filterArr
            })
          }
          return deleteHouse(param)
      }
    },
    cleardeleteData() {
      this.ruleFormDelete.reason = ''
      this.ruleFormDelete.reasonType = ''
      this.$refs.rulesDeletes.resetFields()
    }
  },
  created() {
    this.ruleFormDelete.processBy = Cookie.get('adminNo')
  }
}
