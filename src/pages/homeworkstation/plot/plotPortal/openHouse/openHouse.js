import {
  getResidentialsubPlot, // 小区-分期
  getCurrentSub, // 当前分期
  getBuildingSub
} from '@/api/plot.api'
import mixins from '@/mixins/mixins'
import {
  validateInt,
  validateInt1
} from '@/validate/validate'
import {
  getoldhouseBasedata
} from '@/api/api'
import {
  dateFormat
} from '@/filters/filters.js'
import {
  getHousingTypeListInfo,
  addOpenHouseInfo,
  getOpenHouseListInfo,
  getOpenHouseInfo,
  updateOpenHouseInfo,
  getPreSalePermitList,
  getPriceListInfo,
  editPriceInfo,
  addPriceInfo
} from './openHouse.api'
import dict from '@/directives/dict.directive.js'
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      proObj: '', // 选中二级物业类型对象
      propertyType: '', // 选中二级物业类型编码
      priceTable: [{
        price: '',
        prePrice: '',
        intro: '',
        createTime: ''
      }],
      priceDialog: false,
      priceForm: {
        avgPrice: '',
        preAvgPrice: '',
        priceDesc: ''
      },
      preSalePermitList: [],
      throttle: true,
      isFirst: 0, // 是否第一次
      openHouseID: '',
      sellinfoNewList: [],
      houseOrientationList: [],
      houseStyleList: [],
      selectHouseType: '', // 当前楼栋已保存勾选的户型
      plotid: '', // 小区id
      installmentList: [], // 分期信息list
      currentInstallmentId: '', // 当前分期id
      proTypeList: [], // 二级物业类型list
      tableData: [], // 户型表格数据
      curOpenHouseId: '', // 当前开盘id
      buildingList: [], // 楼栋List
      checkboxGroup: [], // 选中的楼栋list
      openHouseInstallment: '1',
      openHouseList: [], // 开盘名list
      ruleForm: {
        preSalePermitPersonAdd: '', // 人工填写预售证
        preSalePermit: [],
        saleStatus: '',
        openTime: '',
        prepareOpenTime: '',
        intro: '',
        openBuildings: '',
        houseResourceIds: ''
      },
      priceRules: {
        avgPrice: [{
          validator: validateInt1,
          trigger: 'change&blur'
        }],
        preAvgPrice: [{
          validator: validateInt,
          trigger: 'change&blur'
        }],
        priceDesc: [{
          max: 2000,
          message: '字数不得超过2000字',
          trigger: 'change&blur'
        }]
      },
      rules: {
        preSalePermitPersonAdd: [{
          max: 50,
          message: '字数不得超过50字',
          trigger: 'change&blur'
        }],
        prepareOpenTime: [{
          required: true,
          message: '预开盘时间不得为空',
          trigger: 'change&blur'
        },
        {
          max: 30,
          message: '字数不得超过30字',
          trigger: 'change&blur'
        }
        ],
        saleStatus: [{
          required: true,
          message: '销售状态不得为空',
          trigger: 'change&blur'
        }],
        intro: [{
          max: 2000,
          message: '字数不得超过2000字',
          trigger: 'change&blur'
        }]
      }
    }
  },
  mixins: [mixins],
  methods: {
    // 处理每页显示条数
    handleSizeChange(size) {
      this.pageSize = size
      this.getPriceTable()
    },
    // 更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getPriceTable()
    },
    addPrice() {
      this.resetPriceForm()
      this.priceDialog = true
    },
    editPrice(form) {
      this.priceDialog = true
      this.resetPriceForm()
      Object.assign(this.priceForm, form)
    },
    submitEditPrice() {
      this.throttle = false
      setTimeout(() => {
        this.throttle = true
      }, 2000)
      this.$refs.priceForm.validate((valid) => {
        if (valid) {
          if (this.priceForm.id) {
            editPriceInfo(this.priceForm).then(res => {
              if (res.data === 1) {
                this.priceDialog = false
                this.showInfoMsg('success', '修改价格信息成功')
                this.getPriceTable()
              }
            })
          } else {
            addPriceInfo({
              residentialInfoId: this.plotid,
              residentialInfoSubId: this.currentInstallmentId,
              openInfoId: this.curOpenHouseId,
              parentPropertyType: this.proObj.propertyParent,
              parentPropertyTypeName: this.proObj.propertyParentName,
              propertyType: this.proObj.propertyType,
              propertyTypeName: this.proObj.propertyTypeName,
              ...this.priceForm
            }).then(res => {
              if (res.data === 1) {
                this.priceDialog = false
                this.showInfoMsg('success', '新增价格成功')
                this.getPriceTable()
              }
            })
          }
        }
      })
    },
    deletePrice(form) {
      let param = { ...form
      }
      param.delState = '1'
      this.$confirm('是否删除该条价格', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editPriceInfo(param).then(res => {
          if (res.data === 1) {
            this.showInfoMsg('success', '删除成功！')
            this.getPriceTable()
          }
        })
      })
    },
    changePropertyType(val) {
      if (!val) {
        this.proObj = {}
      } else {
        this.proObj = this.proTypeList.find(v => v.propertyType === val)
      }
      this.getPriceTable()
    },
    getPriceTable() {
      this.priceTable = []
      if (!this.curOpenHouseId || !this.proObj.propertyType) return
      getPriceListInfo({
        openInfoId: this.curOpenHouseId,
        propertyType: this.proObj.propertyType,
        pages: this.currentPage,
        pagesize: this.pageSize
      }).then(res => {
        this.priceTable = res.data
        this.totalCount = res.totalDatas
      })
    },
    resetPriceForm() {
      this.priceForm = {
        avgPrice: '',
        preAvgPrice: '',
        priceDesc: ''
      }
      this.$refs.priceForm && this.$refs.priceForm.resetFields()
    },
    dictTransform(value, dictName) {
      let res = this[dictName].find(v => v.dictItemCode === value)
      return res ? res.dictItemValue : ''
    },
    // 勾选户型
    selectHousingType(selection) {
      let arr = []
      selection.forEach(v => {
        arr.push(v.houseResourceId)
      })
      this.ruleForm.houseResourceIds = arr.join(',')
      this.ruleForm.preSalePermit = []
      getPreSalePermitList({
        residentialSubInfoId: this.currentInstallmentId,
        houseResourceIds: this.ruleForm.houseResourceIds
      }).then(res => {
        if (res.data) {
          this.ruleForm.preSalePermit = res.data.split(',')
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
      }
    },
    // 选择楼栋
    getHousingType(val) {
      this.ruleForm.openBuildings = this.checkboxGroup.join(',')
      if (!this.ruleForm.openBuildings) { // 若没楼栋id--缺少参数
        this.tableData = [] // 手动置空户型表格数据
        return false
      }
      getHousingTypeListInfo({
        residentialSubInfoId: this.currentInstallmentId,
        buildingId: this.ruleForm.openBuildings,
        houseResourceIds: this.selectHouseType
      }).then(res => {
        if (res.data) {
          this.tableData = res.data
          let arr = []
          this.tableData.forEach(v => {
            if (this.ruleForm.houseResourceIds.indexOf(v.houseResourceId) !== -1) {
              arr.push(v)
            }
          })
          if (!val) {
            return arr
          }
        } else {
          this.tableData = []
        }
      }).then(res => {
        this.toggleSelection(res)
      })
    },
    // 切换开盘
    checkOpenHouse(id) {
      this.propertyType = ''
      this.curOpenHouseId = id
      this.resetRuleForm()
      this.getOpenHouse(id)
      this.$router.push({
        path: '/homeworkstation/plot/plotPortal/openHouse',
        query: {
          currentInstallmentId: this.currentInstallmentId,
          curOpenHouseId: id
        }
      })
    },
    // 提交修改或新增
    submit(formName) {
      if (this.throttle) {
        this.throttle = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = JSON.parse(JSON.stringify(this.ruleForm))
            form.openTime = form.openTime ? dateFormat(new Date(form.openTime)) : ''
            form.preSalePermit = form.preSalePermit.join(',')
            if (!form.id) {
              addOpenHouseInfo({
                ...form,
                residentialInfoId: this.plotid,
                residentialSubId: this.currentInstallmentId
              }).then(res => {
                if (res.data === 1) {
                  this.showInfoMsg('success', '新增开盘成功')
                  this.getOpenHouseList(-1) // 非0请求最新一次添加的开盘
                } else {
                  this.throttle = true
                }
              }).catch(err => {
                this.throttle = true
                console.log(err)
              })
            } else {
              updateOpenHouseInfo(form).then(res => {
                this.showInfoMsg('success', '修改开盘信息成功')
                this.getOpenHouse(form.id)
              }).catch(err => {
                this.throttle = true
                console.log(err)
              })
            }
          } else {
            this.throttle = true
          }
        })
      }
    },
    // 重置开盘表单
    resetRuleForm() {
      this.ruleForm = {
        preSalePermitPersonAdd: '',
        preSalePermit: [],
        saleStatus: '',
        openTime: '',
        prepareOpenTime: '',
        intro: '',
        openBuildings: '',
        houseResourceIds: ''
      }
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
      this.tableData = []
      this.checkboxGroup = []
      this.selectHouseType = ''
    },
    // 获取开盘列表
    getOpenHouseList(num) {
      // num 存在 -- 请求最新一次开盘
      getOpenHouseListInfo({
        residentialInfoId: this.plotid,
        residentialSubId: this.currentInstallmentId,
        curpage: 1,
        pages: 1,
        pagesize: 1000
      }).then(res => {
        this.openHouseList = res.data.simpleVOList
        console.log(this.openHouseID)
        if (this.openHouseList.length) {
          if (!num) {
            this.curOpenHouseId = this.openHouseID || this.openHouseList[this.openHouseList.length - 1].id
          } else {
            this.curOpenHouseId = this.openHouseList[this.openHouseList.length - 1].id
          }
        } else {
          this.curOpenHouseId = ''
        }
      })
    },
    // 获取当前开盘信息
    getOpenHouse(id) {
      if (!id) {
        return false
      }
      getOpenHouseInfo({
        id: id
      }).then(res => {
        if (this.proTypeList.length) {
          this.propertyType = this.proTypeList[0].propertyType
        }
        let data = res.data
        this.throttle = true
        data.preSalePermit = data.preSalePermit ? data.preSalePermit.split(',') : []
        Object.assign(this.ruleForm, data)
        this.checkboxGroup = this.ruleForm.openBuildings ? this.ruleForm.openBuildings.split(',') : []
        this.selectHouseType = this.ruleForm.houseResourceIds
        this.getHousingType()
      }).catch(err => {
        this.throttle = true
        console.log(err)
      })
    },
    // 选择分期
    selectInstallment(val) {
      this.resetRuleForm()
      this.currentInstallmentId = val
      if (this.isFirst) { // 不是第一次进入
        this.openHouseID = ''
        this.$router.push({
          path: '/homeworkstation/plot/plotPortal/openHouse',
          query: {
            currentInstallmentId: this.currentInstallmentId
          }
        })
      }
      this.isFirst++
      this.proTypeList = []
      getBuildingSub({
        residentialSubId: val
      }).then(res => {
        this.buildingList = res.data
        console.log(res.data, 'buildingList')
      })
      getCurrentSub({
        id: val
      }).then(res => {
        if (res.bottomData) {
          this.proTypeList = res.bottomData
          this.propertyType = this.proTypeList[0].propertyType
        } else {
          this.propertyType = ''
        }
      }).then(() => {
        this.getOpenHouseList()
      })
    },
    addOpenHouse() {
      if (!this.openHouseList && !this.openHouseList.length && !this.openHouseList[this.openHouseList.length - 1].id) {
        this.showInfoMsg('warning', '请先完善上一个开盘创建')
        return false
      }
      let len = this.openHouseList.length
      this.curOpenHouseId = ''
      this.openHouseList.push({
        serialNumber: len + 1,
        id: ''
      })
      this.resetRuleForm()
    },
    getDropDown() {
      let dictArr = ['houseOrientation', 'sellinfo', 'houseStyle']
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
      // 小区 - 分期
      getResidentialsubPlot({
        residentialInfoId: this.plotid,
        getType: 'vo'
      }).then(res => {
        if (res.data) {
          if (res.data.simpleInfoVOList && res.data.simpleInfoVOList.length) {
            this.installmentList = res.data.simpleInfoVOList
            this.currentInstallmentId = id || this.installmentList[this.installmentList.length - 1].id
          }
        }
      })
    }
  },
  directives: {
    dict
  },
  created() {
    let arr = window.location.href.split(/[=|&]/)
    this.openHouseID = arr[3]
    this.plotid = sessionStorage.getItem('plotid')
    this.init(arr[1])
  }
}
