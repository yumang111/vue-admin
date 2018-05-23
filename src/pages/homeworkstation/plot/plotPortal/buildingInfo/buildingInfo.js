import mixins from '@/mixins/mixins'
import {
  getoldhouseBasedata
} from '@/api/api'
import {
  tagUseCount,
  getResidentialsubPlot
} from '@/api/plot.api'
import {
  getBuildingYFYJ,
  bindBuildingYFYJ,
  unbindBuildingYFYJ,
  addBuildingInfo,
  getBuildingInfo,
  getAllBuildingInfo,
  modifyBuildingInfo,
  copyBuildingInfo
} from './buildingInfo.api'
import {
  validateBuildName,
  validatePoint1,
  validateRate
} from '@/validate/validate'
import visualBuilding from '../../shared/visualBuilding/visualBuilding.component'
import checkTag from '@/pages/share/checktag/checktag.vue'
import dict from '@/directives/dict.directive'
export default {
  data() {
    return {
      copyBuildDialog: false,
      copyForm: {
        id: '',
        name: ''
      },
      copyFormRules: {
        id: [{
          required: true,
          message: '不能为空',
          trigger: 'change&blur'
        }],
        name: [{
          validator: validateBuildName,
          trigger: 'change&blur'
        }]
      },
      throttle: true,
      isFirst: 0, // 是否第一次进入
      buildingID: '', // 地址栏中记录的楼栋id
      loading: false, // 加载中
      proType: '住宅',
      proSType: '商业',
      building: {
        junctionRoomShowTime: '', // 预交房时间
        junctionRoomTime: '', // 交房时间
        bulidingNum: '',
        saleState: '',
        orientation: '',
        sunshineTime: '',
        tags: '',
        buildingDesc: '',
        share: ''
      },
      rules: {
        junctionRoomShowTime: [{
          max: 30,
          message: '字数不得超过30字',
          trigger: 'change&blur'
        }],
        sunshineTime: [{
          validator: validatePoint1,
          trigger: 'change&blur'
        }],
        share: [{
          validator: validateRate,
          trigger: 'change&blur'
        }],
        bulidingNum: [{
          validator: validateBuildName,
          trigger: 'change&blur'
        }],
        saleState: [{
          required: true,
          message: '销售状态不能为空',
          trigger: 'change&blur'
        }],
        buildingDesc: [{
          max: 2000,
          message: '描述不得超过2000字',
          trigger: 'change&blur'
        }]
      },
      installmentList: [],
      currentInstallmentId: '',
      buildingList: [],
      buildingNumList: [],
      curBuildId: '',
      residentialInfoId: '',
      houseOrientationList: [],
      sellinfoNewList: [],
      bindBuildingDialog: false,
      yfyjBuildingList: [],
      selectyfyjBuilding: '', // yfyf 楼栋下拉选择的值
      selectyfyjBuildingRow: '', // 选择要绑定的yfyj的楼栋信息
      oldTagIds: '',
      newTagIds: ''
    }
  },
  directives: {
    dict
  },
  mixins: [mixins],
  methods: {
    tofixed($event, i) {
      if (!$event.target.value) {
        return false
      }
      $event.target.value = Number($event.target.value).toFixed(i)
    },
    copyBuild() {
      this.$refs.copyForm.validate(valid => {
        if (valid) {
          copyBuildingInfo({
            id: this.copyForm.id,
            bulidingNum: this.copyForm.name,
            residentialSubId: this.currentInstallmentId,
            residentialInfoId: this.residentialInfoId
          }).then(res => {
            if (res.data === 1) {
              this.showInfoMsg('success', '复制楼栋成功')
              this.copyBuildDialog = false
              this.selectInstallment(this.currentInstallmentId)
            }
          }).catch(err => {
            this.showInfoMsg('error', err)
          })
        }
      })
    },
    checkBuilding() {
      this.selectyfyjBuilding = ''
      this.bindBuildingDialog = true
      getBuildingYFYJ({
        residentialId: this.residentialInfoId
      }).then(res => {
        console.log(res, 'yfyj ld')
        this.yfyjBuildingList = res.data
      })
    },
    changeyfyjBuilding(val) {
      console.log(val, 'change')
      this.selectyfyjBuildingRow = this.yfyjBuildingList.find(v => v.id === val)
      console.log(this.$refs.yfyjBuilding.selectedLabel, 'change')
    },
    // 绑定楼栋
    bindBuilding() {
      if (!this.selectyfyjBuildingRow) {
        this.showInfoMsg('warning', '请选择一房一价楼栋')
        return false
      }
      this.loading = true
      bindBuildingYFYJ({
        // propertyType: this.selectyfyjBuildingRow.propertyType,
        projectName: this.selectyfyjBuildingRow.projectName,
        building: this.selectyfyjBuildingRow.building,
        bindId: this.building.id,
        bindShow: this.building.bulidingNum,
        residentialInfoFrontId: this.residentialInfoId
      }).then(res => {
        if (res.buildingBindResult && res.housePriceResult) {
          this.yfyjUnit = ''
          this.loading = false
          this.showInfoMsg('success', '绑定楼栋成功！')
          this.bindBuildingDialog = false
          this.getBuildingFromInstallment(this.currentInstallmentId)
          this.getBuilding()
        }
      }).catch(res => {
        this.showInfoMsg('error', res)
      })
    },
    // 楼栋解绑
    unbindBuilding() {
      if (this.$refs.visual.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      this.$confirm('是否要解除该楼栋绑定的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.loading = true
        return unbindBuildingYFYJ({
          id: this.building.id
        })
      }).then(res => {
        if (res.buildingBindResult && res.housePriceResult) {
          this.yfyjUnit = ''
          this.loading = false
          this.selectyfyjBuilding = ''
          this.showInfoMsg('success', '解绑楼栋成功！')
          this.getBuildingFromInstallment(this.currentInstallmentId)
          this.getBuilding()
          this.$refs.visual.getHouseList()
          this.$refs.visual2.getHouseList()
        }
      }).catch(res => {
        if (res === 'cancel') {} else {
          this.showInfoMsg('error', res)
        }
      })
    },
    onSubmit(formName) {
      if (this.throttle) {
        this.throttle = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newTagIds = this.building.tags
            // 统计标签使用次数
            tagUseCount({
              oldTagIds: this.oldTagIds,
              newTagIds: this.newTagIds
            }).then(res => {
              if (res.data) {
                console.log('统计标签使用成功！')
              }
            })
            let params = { ...this.building
            }
            params.residentialSubId = this.currentInstallmentId
            if (!params.junctionRoomTime) {
              delete params.junctionRoomTime
            } else {
              params.junctionRoomTime = new Date(params.junctionRoomTime).getTime()
            }
            if (!this.building.id) {
              params.residentialInfoId = this.residentialInfoId
              // 传送数据，创建小区
              addBuildingInfo(params).then(res => {
                this.showInfoMsg('success', '新增楼栋成功！')
                this.getBuildingFromInstallment(this.currentInstallmentId)
              }).catch(err => {
                this.throttle = true
                this.showInfoMsg('error', err)
              })
            } else {
              modifyBuildingInfo(params).then(res => {
                if (res.data === 1) {
                  this.showInfoMsg('success', '修改楼栋信息成功')
                  this.getBuilding(params.id)
                } else {
                  this.throttle = true
                }
              }).catch(err => {
                this.throttle = true
                this.showInfoMsg('error', err)
              })
            }
          } else {
            this.throttle = true
            this.showInfoMsg('error', '验证未通过！')
          }
        })
      }
    },
    // 选择分期
    selectInstallment(val) {
      this.currentInstallmentId = val
      if (this.isFirst) { // 不是第一次进入
        this.buildingID = ''
        this.$router.push({
          path: '/homeworkstation/plot/plotPortal/buildingInfo',
          query: {
            currentInstallmentId: this.currentInstallmentId
          }
        })
      }
      this.isFirst++
      this.buildingNumList = []
      this.resetBuildingInfo()
      this.getBuildingFromInstallment(val)
    },
    // 切换楼栋
    changeBuilding(id) {
      if (!id) return
      this.curBuildId = id
      this.buildingID = id
      this.resetBuildingInfo()
      this.getBuilding(id)
      this.$router.push({
        path: '/homeworkstation/plot/plotPortal/buildingInfo',
        query: {
          currentInstallmentId: this.currentInstallmentId,
          buildingId: id
        }
      })
    },
    // 重置楼栋表单信息
    resetBuildingInfo() {
      this.building = {
        junctionRoomShowTime: '', // 预交房时间
        junctionRoomTime: '', // 交房时间
        bulidingNum: '',
        saleState: '',
        orientation: '',
        sunshineTime: '',
        tags: '',
        buildingDesc: '',
        share: ''
      }
      this.$refs.building && this.$refs.building.resetFields()
    },
    // 添加楼栋
    addBuilding() {
      if (this.buildingNumList.length !== 0 && !this.buildingNumList[this.buildingNumList.length - 1].id) {
        this.showInfoMsg('warning', '请完成上一个楼栋的创建！')
        return false
      }
      this.curBuildId = ''
      this.buildingID = ''
      this.buildingNumList.push({
        bulidingNum: '',
        id: ''
      })
      this.resetBuildingInfo()
    },
    // 根据楼栋id获取楼栋信息
    getBuilding(id) {
      getBuildingInfo({
        id: id || this.building.id
      }).then(res => {
        this.throttle = true
        Object.assign(this.building, res.data)
        this.oldTagIds = this.building.tags
        this.$refs.visual && this.$refs.visual.getHouseList(this.building.id)
      }).catch(err => {
        this.throttle = true
        this.showInfoMsg('error', err)
      })
    },
    // 根据分期id获取楼栋信息 && 获取楼栋信息
    getBuildingFromInstallment(installmentId) {
      getAllBuildingInfo({
        residentialSubId: installmentId
      }).then(res => {
        if (res.data.length) {
          this.buildingNumList = res.data
          this.curBuildId = this.buildingID || res.data[res.data.length - 1].id
        }
      })
    },
    getDropDown() {
      let dictArr = ['houseOrientation', 'sellinfo']
      dictArr.forEach((v, i) => {
        getoldhouseBasedata({
          dictCatCode: v
        }).then(res => {
          this[v + 'List'] = res.data
        })
      })
    },
    init(id) {
      this.getDropDown()
      // 获取分期
      getResidentialsubPlot({
        residentialInfoId: this.residentialInfoId,
        getType: 'vo'
      }).then(res => {
        if (res.data) {
          this.installmentList = res.data.simpleInfoVOList
          this.currentInstallmentId = id || this.installmentList[this.installmentList.length - 1].id
        }
      })
    }
  },
  components: {
    visualBuilding,
    checkTag
  },
  created() {
    let arr = window.location.href.split(/[=|&]/)
    this.buildingID = arr[3]
    this.residentialInfoId = sessionStorage.getItem('plotid')

    // 获取所有分期
    this.init(arr[1])
  }
}
