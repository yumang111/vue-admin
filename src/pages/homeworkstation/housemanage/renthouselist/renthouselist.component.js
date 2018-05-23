import searchbox from '@/pages/share/searchbox/searchbox.vue'
import linkcm from '@/pages/share/linkcm/linkcm.vue'
import housebaseinfo from '@/pages/share/housebaseinfo/housebaseinfo.vue'
import deletedialog from '@/pages/share/deletedialog/deletedialog.vue'
import {
  fdcHttp
} from 'fdc-common/http'
import {
  getOwnContact,
  recoverRentHouse
} from '@/api/api'

export default {
  data() {
    return {
      houseLink: process.env.RENT_HOUSE_URL,
      throttle: true,
      loading: false,
      type: '',
      oldhouseData: [],
      dialogshow: false,
      curpage: 1,
      pagesize: 10,
      totalDataNum: 0,
      searchparam: {},
      checkedNum: 0, // 默认选中第一条
      checkedHouseId: '',
      ownDialogshow: false,
      contactPeople: '',
      contactPeopleData: [],
      dealTime: '',
      contactPhone: '',
      houseInfo: {},
      ruleForm: {
        contactPeople: ''
      },
      rules: {
        contactPeople: [{
          required: true,
          message: '联系人不能为空'
        }]
      },
      multipleSelection: [],
      rentType: 1
    }
  },
  methods: {
    renderHeaderTime() {
      return (
        <div>
           <span>更新时间</span>
           <i onClick={ this.changeSort.bind(this, 'time', 'asc')} class='iconsort iconfont icon-shang'></i>
           <i onClick={ this.changeSort.bind(this, 'time', 'desc')} class='iconsort iconfont icon-xia'></i>
        </div>
      )
    },
    renderHeaderStatus() {
      return (
        <div>
           <span>状态</span>
           <i onClick={ this.changeSort.bind(this, 'status', 'asc')} class='iconsort iconfont icon-shang'></i>
           <i onClick={ this.changeSort.bind(this, 'status', 'desc')} class='iconsort iconfont icon-xia'></i>
        </div>
      )
    },
    changeSort(type, status) {
      this.searchparam.sqlOrderBy = type // time/status 排序字段
      this.searchparam.orderType = status // asc 上 desc 下
      this.getRldhouseData()
    },
    reset() {
      this.type = ''
      this.checkedHouseId = ''
      this.checkedNum = 0
      this.oldhouseData = []
      this.totalDataNum = 0
      this.getRldhouseData()
    },
    getRldhouseData() {
      this.loading = true
      this.searchparam.pages = this.curpage
      this.searchparam.pagesize = this.pagesize
      this.searchparam.rentType = this.rentType
      if (this.rentType === 1) {
        this.searchparam.rentType = '1'
        this.searchparam.rentTypeDesc = '整租'
      } else if (this.rentType === 2) {
        this.searchparam.rentType = '2'
        this.searchparam.rentTypeDesc = '合租'
      } else {
        this.searchparam.rentType = '3'
        this.searchparam.rentTypeDesc = '公寓品牌'
      }

      fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.houserent.limitpage', this.searchparam)
        .then((response) => {
          this.loading = false
          this.oldhouseData = response.data
          this.totalDataNum = response.totalDatas
          if (this.oldhouseData.length > 0) {
            this.checkedHouseId = this.oldhouseData[0].id
          } else if (this.oldhouseData.length === 0) {
            this.checkedHouseId = ''
          }
        }).catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    // 通过
    housePass(val) {
      if (val.isRes === '1') {
        this.loading = true
        fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.houserent.auditpass', {
          id: val.id
        }).then((response) => {
          if (response.data == 1) {
            this.$message({
              message: '审核通过',
              type: 'success'
            })
          }
          this.getRldhouseData()
        }).catch(err => {
          this.loading = false
          this.$message.error(err)
        })
      } else {
        this.$message.error('请先关联小区,再进行确认操作')
      }
    },
    // 转自营
    toOwn(val) {
      this.houseInfo = val
      this.ownDialogshow = true
      this.dealTime = ''
      this.loading = true
      getOwnContact({
        departNo: 'yf0110'
      }).then((response) => {
        this.loading = false
        this.contactPeopleData = response.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除+加入黑名单
    deleteBlanklist(data, type) {
      this.type = type
      this.multipleSelection[0] = data
      this.$refs.deletedialog.deleteDialogshow = true
    },
    recover(row) {
      this.$confirm('是否恢复该房源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return recoverRentHouse({
          id: row.id
        })
      }).then(res => {
        if (res.data === 1) {
          this.getRldhouseData()
          this.$message.success('恢复房源成功')
        }
      }).catch(err => {
        if (err === 'cancel') {} else {
          this.$message.error(err)
        }
      })
    },
    // 下架
    downCm(id) {
      fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.houserent.upordown', {
        id: id,
        upOrDown: 'down'
      })
        .then((response) => {
          if (response.data == 1) {
            this.getRldhouseData()
            this.$message({
              message: '下架成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 上架
    upCm(id) {
      if (this.throttle) {
        this.throttle = false
        fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.houserent.upordown', {
          id: id,
          upOrDown: 'up'
        })
          .then((response) => {
            this.throttle = true
            if (response.data === 1) {
              this.getRldhouseData()
              this.$message({
                message: '上架成功',
                type: 'success'
              })
            }
          }).catch(err => {
            this.throttle = true
            this.$message({
              message: err,
              type: 'success'
            })
          })
      }
    },
    // 关联小区
    linkcmDialog(id) {
      this.$refs.linkhouse.dialogshow = true
      this.$refs.linkhouse.houseId = id
    },
    handleCurrentChange(val) {
      this.curpage = val
      this.getRldhouseData()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getRldhouseData()
    },
    tableRowClassName(row, index) {
      if (index === this.checkedNum) {
        return 'cur-row'
      }
    },
    rowClick(row, event, column) {
      this.checkedHouseId = row.id
      this.oldhouseData.forEach((val, index) => {
        if (this.checkedHouseId === val.id) {
          this.checkedNum = index
        }
      })
    },
    clearOwnData() {
      this.ruleForm.contactPeople = ''
      this.dealTime = ''
    },
    transferOwn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let param = this.houseInfo
          param.isAgent = 1
          param.agentId = this.ruleForm.contactPeople.split('/val/')[0]
          param.agentPhone = this.ruleForm.contactPeople.split('/val/')[1]
          param.agentName = this.ruleForm.contactPeople.split('/val/')[2]
          param.agentTime = this.dealTime
          param.agentProcessBy = 'administrator'
          param.houseDetailDesc = ''
          fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housesource.auditpass', param)
            .then((response) => {
              if (response.data == 1) {
                this.getRldhouseData()
                this.$message({
                  message: '转自营成功',
                  type: 'success'
                })
              }
            })
            .catch(err => {
              this.$message.error(err)
            })
          // alert('submit!')
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    changeOwncontact() {
      this.contactPhone = this.ruleForm.contactPeople.split('/val/')[1]
      this.dealTime = new Date().getTime()
    }
  },
  components: {
    searchbox,
    linkcm,
    housebaseinfo,
    deletedialog
  },
  watch: {
    rentType: {
      handler() {
        this.getRldhouseData()
      },
      deep: true
    }
  },
  mounted() {
    this.getRldhouseData()
  }
}
