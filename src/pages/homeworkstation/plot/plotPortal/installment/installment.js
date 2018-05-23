import mixins from '@/mixins/mixins'
import dict from '@/directives/dict.directive'
import checkTag from '@/pages/share/checktag/checktag.vue'
import thinkSearch from '@/pages/share/think-search/think-search.vue'
import shops from '@/pages/homeworkstation/plot/shared/shops/shops.vue'
import {
  getoldhouseBasedata
} from '@/api/api'
import {
  validateHundredInt,
  validateInt,
  validatePhone,
  validateQQ,
  validataID,
  validateRate,
  validatePoint2
} from '@/validate/validate'
import {
  getTimeFromInter,
  tagUseCount,
  othercompanyUse,
  getProvinceInfo,
  getCityInfo,
  getCountyInfo,
  getFirstType,
  getSecondType,
  getResidentialsubPlot
} from '@/api/plot.api'
import {
  getPhone400,
  updateTypeForm,
  getTypeForm,
  addInstallmentInfo,
  changeInstallmentInfo,
  getInstallmentInfo,
  saveTypeForm,
  getDownPaymentFor
} from './installment.api'
export default {
  data() {
    return {
      throttle: true,
      propertyRightYearList: [], // 产权
      valid: validataID,
      millisecond: '',
      pickerOptions: {
        disabledDate: time => {
          // 当前时间满足返回值为false时，禁用
          return time.getTime() > this.millisecond || time.getTime() < new Date('1970-01-01 8:00:00').getTime()
        }
      },
      loading: false,
      installmentList: [],
      options: [],
      ruleForm: {
        tellingYou: [{
          title: '',
          description: ''
        }],
        id: '', // 分期id
        residentialSubName: '',
        saleStatus: '',
        buildingAge: '',
        companyPropertyDeveloper: {
          name: '',
          id: ''
        },
        companyInvestor: {
          name: '',
          id: ''
        },
        companyAgency: {
          name: '',
          id: ''
        },
        constructionCompanies: {
          name: '',
          id: ''
        },
        companyLandscape: {
          name: '',
          id: ''
        },
        companyArchitecturalDesign: {
          name: '',
          id: ''
        },
        builderLicense: '',
        landUsePermit: '',
        landUseCertificate: '',
        constructionPlanningPermit: '',
        intro: '',
        salesDepartmentAddress: {
          provinceName: '',
          provinceId: '',
          cityName: '',
          cityId: '',
          areaName: '',
          areaId: '',
          streetDetail: ''
        },
        tagsId: ''
      },
      ruleFormRules: {
        intro: [{
          max: 2000,
          message: '描述在2000字以内',
          trigger: 'change&blur'
        }],
        companyAgency: [{
          validator: validataID,
          trigger: 'change&blur'
        }],
        companyInvestor: [{
          validator: validataID,
          trigger: 'change&blur'
        }],
        constructionCompanies: [{
          validator: validataID,
          trigger: 'change&blur'
        }],
        companyLandscape: [{
          validator: validataID,
          trigger: 'change&blur'
        }],
        companyArchitecturalDesign: [{
          validator: validataID,
          trigger: 'change&blur'
        }],
        companyPropertyDeveloper: [{
          validator: validataID,
          trigger: 'change&blur'
        }],
        residentialSubName: [{
          required: true,
          message: '请输入分期名称',
          trigger: 'blur'
        },
        {
          max: 30,
          message: '分期名必须在30字以内',
          trigger: 'change&blur'
        }
        ],
        saleStatus: [{
          required: true,
          message: '请选择销售状态',
          trigger: 'change&blur'
        },
        {
          max: 30,
          message: '销售状态必须在10字以内',
          trigger: 'change&blur'
        }
        ],
        builderLicense: [{
          max: 30,
          message: '必须在30字以内',
          trigger: 'change&blur'
        }],
        landUsePermit: [{
          max: 30,
          message: '必须在30字以内',
          trigger: 'change&blur'
        }],
        landUseCertificate: [{
          max: 30,
          message: '必须在30字以内',
          trigger: 'change&blur'
        }],
        constructionPlanningPermit: [{
          max: 30,
          message: '必须在30字以内',
          trigger: 'change&blur'
        }]
      },
      ruleForm2: {
        id: '',
        downPaymentRatio: '', // 首付比例
        residentialSubInfoId: '',
        propertyParentName: '', // 物业类型
        propertyParent: '', // 物业类型id
        propertyTypeName: '', // 二级物业
        propertyType: '', // 二级物业id
        natureOfLandId: '', // 用地性质
        propertyRightsLimitsYear: '', // 产权
        salePhone1: '', // 销售电话1
        salePhone2: '', // 销售电话2
        phone400: '', // 400电话
        qq: '', // qq号
        counterpartSchoolsName: [{
          name: '',
          id: ''
        }], // 对口学校 多个
        usedLandArea: '', // 占地面积
        constructionArea: '', // 建筑面积
        counterpartSchoolsType: '',
        plotRatio: null, // 容积率
        greenRates: '', // 绿化率
        poolRate: '',
        parkingNumber: '', // 车位数
        parkingSpaceThan: '', // 车位配比
        landedPropertyCompany: {
          name: '',
          id: ''
        }, // 物业公司
        housingResourcesCounts: '', // 房源总套数
        landedPropertyFee: '', // 物业费
        redecoratedInfoId: '', // 装修情况
        decorationStandard: '', // 装修标准
        junctionRoomStandard: '', // 交房标准
        waterType: '', // 供水类型
        powerType: '', // 供电类型
        gasType: '', // 供气类型
        heatingType: '' // 供暖类型
      },
      ruleForm2Rules: {
        downPaymentRatio: [{
          validator: validateHundredInt,
          trigger: 'change&blur'
        }],
        propertyParentName: [{
          required: true,
          message: '物业类型不得为空',
          trigger: 'blur'
        }],
        counterpartSchoolsName: [{
          validator: validataID,
          trigger: 'change&blur'
        }],
        plotRatio: [{
          validator: validateRate,
          trigger: 'change&blur'
        }],
        greenRates: [{
          validator: validateRate,
          trigger: 'change&blur'
        }],
        parkingSpaceThan: [{
          validator: validatePoint2,
          trigger: 'change&blur'
        }],
        landedPropertyFee: [{
          validator: validatePoint2,
          trigger: 'change&blur'
        }],
        landedPropertyCompany: [{
          validator: validataID,
          trigger: 'change&blur'
        }],
        qq: [{
          validator: validateQQ,
          trigger: 'blur'
        }],
        natureOfLandId: [{
          required: true,
          message: '请选择用地性质',
          trigger: 'change&blur'
        }],
        propertyRightsLimitsYear: [{
          required: true,
          message: '请选择产权年限',
          trigger: 'blur'
        }],
        salePhone1: [{
          validator: validatePhone,
          trigger: 'blur'
        }],
        salePhone2: [{
          validator: validatePhone,
          trigger: 'blur'
        }],
        parkingNumber: [{
          validator: validateInt,
          trigger: 'change'
        }],
        usedLandArea: [{
          validator: validateInt,
          trigger: 'change'
        }],
        constructionArea: [{
          validator: validateInt,
          trigger: 'change'
        }],
        housingResourcesCounts: [{
          validator: validateInt,
          trigger: 'change'
        }],
        decorationStandard: [{
          validator: validateInt,
          trigger: 'change'
        }]
      },
      provinceList: [],
      cityList: [],
      countyList: [],
      address: null,
      propertyTypeArr: [], // 物业类型级联
      installmentId: '', // 当前分期id
      plotid: '',
      oldList: [],
      newList: [],
      oldTagIds: '',
      newTagIds: '',
      maintenancedList: [] // 维护过的物业信息
    }
  },
  mixins: [mixins],
  methods: {
    tofixed2($event) {
      $event.target.value = Number($event.target.value).toFixed(2)
    },
    tellyou(val) {
      if (val === 'add') {
        this.ruleForm.tellingYou.push({
          title: '',
          description: ''
        })
      } else {
        this.ruleForm.tellingYou.pop()
      }
    },
    // 选中设置物业信息
    getPropertyType(val) {
      this.ruleForm2.propertyParent = val[0]
      this.ruleForm2.propertyType = val[1]
      this.resetForm2()
      getTypeForm({
        propertyParent: val[0],
        propertyType: val[1],
        residentialSubInfoId: this.ruleForm.id
      })
        .then(res => {
          let data = res.data
          if (data) {
            data.usedLandArea = data.usedLandArea && Math.round(data.usedLandArea)
            data.constructionArea = data.constructionArea && Math.round(data.constructionArea)
            data.natureOfLandId = this.dealIdValue(data.natureOfLandId)
            data.redecoratedInfoId = this.dealIdValue(data.redecoratedInfoId)
            data.propertyRightsLimitsYear = this.dealIdValue(data.propertyRightsLimitsYear)
            data.junctionRoomStandard = this.dealIdValue(data.junctionRoomStandard)
            data.waterType = this.dealIdValue(data.waterType)
            data.powerType = this.dealIdValue(data.powerType)
            data.gasType = this.dealIdValue(data.gasType)
            data.heatingType = this.dealIdValue(data.heatingType)
            data.landedPropertyCompany = this.companyFilter(data.landedPropertyCompany)
            data.counterpartSchoolsName = data.counterpartSchoolsName ? JSON.parse(data.counterpartSchoolsName) : [{
              name: '',
              id: ''
            }]
            this.ruleForm2 = Object.assign(this.ruleForm2, res.data)
            this.getSecondTypeList(this.ruleForm2.propertyParent)
            return this.ruleForm2
          } else {
            let option1 = this.options.find(v => v.value === val[0])
            let option2 = option1.children.find(v => v.value === val[1])
            this.ruleForm2.propertyParentName = option1.label
            this.ruleForm2.propertyParent = option1.value
            this.ruleForm2.propertyTypeName = option2.label
            this.ruleForm2.propertyType = option2.value
            getPhone400({
              residentialSubInfoId: this.ruleForm.id,
              propertyParent: option1.value
            }).then(res => {
              this.ruleForm2.phone400 = res.phone400
              this.ruleForm2.salePhone1 = res.salePhone
            })
            this.getDownPaymentRatio()
          }
        })
        .then(res => {
          if (res) {
            this.propertyTypeArr[0] = res.propertyParent
            this.propertyTypeArr[1] = res.propertyType
          }
        })
    },
    getDownPaymentRatio() {
      getDownPaymentFor({
        propertyParentName: this.ruleForm2.propertyParentName,
        propertyName: this.ruleForm2.propertyTypeName
      }).then(res => {
        this.ruleForm2.downPaymentRatio = res.data.downPaymentRatio
      })
    },
    // 选中一级物业类型
    handleTypeChange(val) {
      this.getSecondTypeList(val[0])
    },
    // 请求二级物业类型
    getSecondTypeList(val) {
      return getSecondType({
        propertyParent: val
      })
        .then(res => {
          let arr = []
          res.data.forEach(v => {
            arr.push({
              label: v.propertyName,
              value: v.shortKey,
              id: v.id
            })
          })
          this.options
            .find(v => v.value === val)
            .children = arr
        })
    },
    // 统计其他公司+标签使用次数
    statistics() {
      this.newTagIds = this.ruleForm.tagsId
      this.countTimes('newList')
      let oldList = this.oldList.join(',') || '""'
      let newList = this.newList.join(',') || '""'
      if (!oldList && !newList) return
      // 统计其他公司使用次数
      othercompanyUse({
        oldList: oldList,
        newList: newList
      }).then(res => {
        if (res.data) {
          console.log('统计公司使用成功！')
        }
      })
      // 统计标签使用次数
      tagUseCount({
        oldTagIds: this.oldTagIds,
        newTagIds: this.newTagIds
      }).then(res => {
        if (res.data) {
          console.log('统计标签使用成功！')
        }
      })
    },
    // 添加学校
    addSchoolName() {
      this.ruleForm2.counterpartSchoolsName.push({
        name: '',
        id: ''
      })
    },
    // 提交表单1
    submitRuleForm(formName) {
      if (this.throttle) {
        this.throttle = false
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.ruleForm.salesDepartmentAddress.provinceName = this.$refs.provinceInfo.selectedLabel
            this.ruleForm.salesDepartmentAddress.cityName = this.$refs.cityInfo.selectedLabel
            this.ruleForm.salesDepartmentAddress.areaName = this.$refs.areaInfo.selectedLabel
            let form = { ...this.ruleForm
            }
            form.buildingAge = form.buildingAge instanceof Date ? form.buildingAge.getFullYear() : (form.buildingAge ? form.buildingAge : '')
            form.tellingYou = JSON.stringify(form.tellingYou)
            form.salesDepartmentAddress = JSON.stringify(form.salesDepartmentAddress)
            form.companyPropertyDeveloper = JSON.stringify(form.companyPropertyDeveloper)
            form.companyInvestor = JSON.stringify(form.companyInvestor)
            form.companyAgency = JSON.stringify(form.companyAgency)
            form.constructionCompanies = JSON.stringify(form.constructionCompanies)
            form.companyLandscape = JSON.stringify(form.companyLandscape)
            form.companyArchitecturalDesign = JSON.stringify(form.companyArchitecturalDesign)
            if (!form.id) {
              form.residentialInfoId = this.plotid
              addInstallmentInfo(form).then(res => {
                if (res.data === 1) {
                  this.statistics()
                  this.showInfoMsg('success', '新增分期成功！')
                  this.init(res.id)
                } else if (res.repeat === 1) {
                  this.throttle = true
                  this.showInfoMsg('error', '分期名重复！')
                } else {
                  this.throttle = true
                }
              }).catch(err => {
                this.throttle = true
                console.log(err)
              })
            } else {
              changeInstallmentInfo(form).then(res => {
                if (res.data) {
                  this.statistics()
                  this.showInfoMsg('success', '修改分期信息成功！')
                  this.getCurrentInstallment(form.id)
                } else {
                  this.throttle = true
                }
              }).catch(err => {
                this.throttle = true
                console.log(err)
              })
            }
          } else {
            this.throttle = true
            this.showInfoMsg('error', '验证未通过！')
          }
        })
      }
    },
    // 提交表单2
    submitRuleForm2(formName) {
      if (this.throttle) {
        this.throttle = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm2.residentialSubInfoId = this.installmentId
            // 新增
            let form = { ...this.ruleForm2
            }
            if (typeof (form.landedPropertyCompany) !== 'string') {
              form.landedPropertyCompany = JSON.stringify(form.landedPropertyCompany)
            }
            if (typeof (form.counterpartSchoolsName) !== 'string') {
              form.counterpartSchoolsName = JSON.stringify(form.counterpartSchoolsName)
            }
            form.natureOfLandId = this.dealIdValue(form.natureOfLandId, 'natureOfLandId')
            form.redecoratedInfoId = this.dealIdValue(form.redecoratedInfoId, 'redecoratedInfoId')
            form.propertyRightsLimitsYear = this.dealIdValue(form.propertyRightsLimitsYear, 'propertyRightsLimitsYear')
            form.junctionRoomStandard = this.dealIdValue(form.junctionRoomStandard, 'junctionRoomStandard')
            form.waterType = this.dealIdValue(form.waterType, 'waterType')
            form.powerType = this.dealIdValue(form.powerType, 'powerType')
            form.gasType = this.dealIdValue(form.gasType, 'gasType')
            form.heatingType = this.dealIdValue(form.heatingType, 'heatingType')
            if (!form.id) {
              form.residentialInfoId = this.plotid
              saveTypeForm(form).then(res => {
                if (res.data === 1) {
                  this.getCurrentInstallment(this.installmentId)
                  this.showInfoMsg('success', '新增' + form.propertyParentName + '-' + form.propertyTypeName + '信息成功！')
                } else {
                  this.throttle = true // 防止有其他返回值锁死
                }
              }).catch(err => {
                this.throttle = true
                console.log(err)
              })
            } else {
              // 更新
              updateTypeForm(form).then(res => {
                this.throttle = true
                if (res.data) {
                  this.showInfoMsg('success', '修改' + form.propertyParentName + '-' + form.propertyTypeName + '信息成功！')
                }
              }).catch(err => {
                this.throttle = true
                console.log(err)
              })
            }
          } else {
            this.throttle = true
            this.showInfoMsg('error', '验证未通过！')
          }
        })
      }
    },
    // 将字段处理成{id:'',value:''}
    dealIdValue(value, refName) {
      if (refName) {
        if (refName === 'propertyRightsLimitsYear') {
          let obj = this.propertyRightYearList.find(v => v.dictItemCode === value)
          return JSON.stringify({
            id: obj.dictItemCode,
            value: obj.dictItemValue
          })
        } else {
          return JSON.stringify({
            id: value,
            value: this.$refs[refName].selectedLabel
          })
        }
      } else {
        if (value) {
          value = JSON.parse(value).id
        }
        return value
      }
    },
    // 重置表单1
    resetForm1() {
      this.ruleForm = {
        tellingYou: [{
          title: '',
          description: ''
        }],
        id: '', // 分期id
        residentialSubName: '',
        saleStatus: '',
        buildingAge: '',
        companyPropertyDeveloper: {
          name: '',
          id: ''
        },
        companyInvestor: {
          name: '',
          id: ''
        },
        companyAgency: {
          name: '',
          id: ''
        },
        constructionCompanies: {
          name: '',
          id: ''
        },
        companyLandscape: {
          name: '',
          id: ''
        },
        companyArchitecturalDesign: {
          name: '',
          id: ''
        },
        builderLicense: '',
        landUsePermit: '',
        landUseCertificate: '',
        constructionPlanningPermit: '',
        intro: '',
        salesDepartmentAddress: {
          provinceName: '',
          provinceId: '',
          cityName: '',
          cityId: '',
          areaName: '',
          areaId: '',
          streetDetail: ''
        },
        tagsId: ''
      }
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
    },
    resetForm2() {
      this.ruleForm2 = {
        id: '',
        downPaymentRatio: '', // 首付比例
        residentialSubInfoId: '',
        propertyParentName: '', // 物业类型
        propertyParent: '', // 物业类型id
        propertyTypeName: '', // 二级物业
        propertyType: '', // 二级物业id
        natureOfLandId: '', // 用地性质
        propertyRightsLimitsYear: '', // 产权
        salePhone1: '', // 销售电话1
        salePhone2: '', // 销售电话2
        phone400: '', // 400电话
        qq: '', // qq号
        counterpartSchoolsName: [{
          name: '',
          id: ''
        }], // 对口学校 多个
        usedLandArea: '', // 占地面积
        constructionArea: '', // 建筑面积
        counterpartSchoolsType: '',
        plotRatio: null, // 容积率
        greenRates: '', // 绿化率
        poolRate: '',
        parkingNumber: '', // 车位数
        parkingSpaceThan: '', // 车位配比
        landedPropertyCompany: {
          name: '',
          id: ''
        }, // 物业公司
        housingResourcesCounts: '', // 房源总套数
        landedPropertyFee: '', // 物业费
        redecoratedInfoId: '', // 装修情况
        decorationStandard: '', // 装修标准
        junctionRoomStandard: '', // 交房标准
        waterType: '', // 供水类型
        powerType: '', // 供电类型
        gasType: '', // 供气类型
        heatingType: '' // 供暖类型
      }
      this.$refs.ruleForm2 && this.$refs.ruleForm2.resetFields()
    },
    // 新增分期
    addInstallment() {
      this.installmentList.push({
        residentialSubName: '',
        id: '',
        serialNumber: this.installmentList.length + 1
      })
      this.installmentId = ''
      this.resetForm1()
      this.resetForm2()
      this.address = {
        provinceName: '湖北省',
        provinceId: '420000',
        cityName: '武汉市',
        cityId: '420100',
        areaName: '',
        areaId: '',
        streetDetail: ''
      }
      this.getAddressDropDown(this.address)
    },
    // 切换分期
    checkThisInstallment(id) {
      this.resetForm1()
      this.resetForm2()
      if (id) {
        this.getCurrentInstallment(id)
        this.$router.push({
          path: '/homeworkstation/plot/plotPortal/installment',
          query: {
            installmentId: id
          }
        })
      }
    },
    getCurrentInstallment(id) {
      getInstallmentInfo({
        id: id
      })
        .then(res => {
          if (res) {
            let data = res.data
            this.resetForm1()
            if (!data.salesDepartmentAddress) {
              data.salesDepartmentAddress = '{ "provinceName": "", "provinceId": "", "cityName": "", "cityId": "", "areaName": "", "areaId": "","streetDetail": "" }'
            }
            if (!data.tellingYou) {
              data.tellingYou = '[{"title": "","description": ""}]'
            }
            this.address = JSON.parse(data.salesDepartmentAddress)
            data.tellingYou = JSON.parse(data.tellingYou)
            data.salesDepartmentAddress = JSON.parse(data.salesDepartmentAddress)
            if (data.salesDepartmentAddress.areaId === undefined) {
              data.salesDepartmentAddress.areaId = ''
            }
            data.companyPropertyDeveloper = this.companyFilter(data.companyPropertyDeveloper)
            data.companyInvestor = this.companyFilter(data.companyInvestor)
            data.companyAgency = this.companyFilter(data.companyAgency)
            data.constructionCompanies = this.companyFilter(data.constructionCompanies)
            data.companyLandscape = this.companyFilter(data.companyLandscape)
            data.companyArchitecturalDesign = this.companyFilter(data.companyArchitecturalDesign)
            Object.assign(this.ruleForm, data)
            // this.ruleForm = JSON.parse(JSON.stringify(data))
            console.log(this.ruleForm, 'rom')
            this.countTimes('oldList')
            this.oldTagIds = this.ruleForm.tagsId
            this.maintenancedList = res.bottomData
            if (this.address && this.address.provinceId) {
              return this.address.provinceId
            }
          }
        })
        .then(() => {
          this.getAddressDropDown(this.address)
          if (this.maintenancedList && this.maintenancedList.length) {
            let data = this.maintenancedList[0]
            this.resetForm2()
            this.getProTypeForm({
              propertyParent: data.propertyParent,
              propertyType: data.propertyType,
              residentialSubInfoId: this.installmentId
            })
          } else {
            // 没有数据，默认为 住宅/住宅
            this.propertyTypeArr = []
            this.propertyTypeArr.push('w401')
            this.ruleForm2.propertyParent = 'w401'
            this.ruleForm2.propertyParentName = '住宅'
            this.getSecondTypeList('w401').then(() => {
              this.propertyTypeArr.push('w303')
              this.ruleForm2.propertyType = 'w303'
              this.ruleForm2.propertyTypeName = '住宅'
            }).then(() => {
              this.getDownPaymentRatio()
            })
          }
          this.throttle = true
        }).catch(err => {
          console.log(err)
          this.throttle = true
        })
    },
    companyFilter(value) {
      value = value ? JSON.parse(value) : {
        id: '',
        name: ''
      }
      return value
    },
    getAddressDropDown(address) {
      // 省市县
      getProvinceInfo().then(res => {
        this.provinceList = res.data
        this.ruleForm.salesDepartmentAddress.provinceName = address.provinceName
        this.ruleForm.salesDepartmentAddress.provinceId = address.provinceId
      }).then(res => {
        this.ruleForm.salesDepartmentAddress.cityName = address.cityName
        this.ruleForm.salesDepartmentAddress.cityId = address.cityId
      }).then(res => {
        this.ruleForm.salesDepartmentAddress.areaName = address.areaName
        this.ruleForm.salesDepartmentAddress.areaId = address.areaId
      })
    },
    // 选择省，请求市
    changeProvince(val) {
      this.ruleForm.salesDepartmentAddress.cityName = ''
      this.ruleForm.salesDepartmentAddress.cityId = ''
      this.ruleForm.salesDepartmentAddress.areaName = ''
      this.ruleForm.salesDepartmentAddress.areaId = ''
      if (val) {
        this.ruleForm.salesDepartmentAddress.provinceId = val
        getCityInfo({
          provinceid: val
        }).then(res => {
          this.cityList = res.data
        })
      } else {
        this.ruleForm.salesDepartmentAddress.provinceId = val
        this.cityList = ''
      }
    },
    // 选择市，请求县
    changeCity(val) {
      this.ruleForm.salesDepartmentAddress.areaName = ''
      this.ruleForm.salesDepartmentAddress.areaId = ''
      if (val) {
        this.ruleForm.salesDepartmentAddress.cityId = val
        getCountyInfo({
          cityid: val
        }).then(res => {
          this.countyList = res.data
        })
      } else {
        this.ruleForm.salesDepartmentAddress.cityId = ''
        this.countyList = []
      }
    },
    // 选择县，得到省市县的信息
    // changeCounty(val) {
    //   if (val) {
    //     this.ruleForm.salesDepartmentAddress.areaId = val
    //   } else {
    //     this.ruleForm.salesDepartmentAddress.areaId = ''
    //   }
    // },
    // 统计其他公司次数 旧-新(ids)
    countTimes(listStr) {
      this[listStr] = []
      this.ruleForm.companyInvestor.id && this[listStr].push(this.ruleForm.companyInvestor.id)
      this.ruleForm.companyAgency.id && this[listStr].push(this.ruleForm.companyAgency.id)
      this.ruleForm.companyLandscape.id && this[listStr].push(this.ruleForm.companyLandscape.id)
      this.ruleForm.constructionCompanies.id && this[listStr].push(this.ruleForm.constructionCompanies.id)
      this.ruleForm.companyArchitecturalDesign.id && this[listStr].push(this.ruleForm.companyArchitecturalDesign.id)
    },
    // 根据分期、一级、二级物业获取物业信息表
    getProTypeForm(params) {
      // toFix
      if (!params.propertyParent || !params.propertyType || !params.residentialSubInfoId) return
      return getTypeForm(params).then(res => {
        let data = res.data
        if (data) {
          data.usedLandArea = data.usedLandArea && Math.round(data.usedLandArea)
          data.constructionArea = data.constructionArea && Math.round(data.constructionArea)
          data.natureOfLandId = this.dealIdValue(data.natureOfLandId)
          data.redecoratedInfoId = this.dealIdValue(data.redecoratedInfoId)
          data.propertyRightsLimitsYear = this.dealIdValue(data.propertyRightsLimitsYear)
          data.junctionRoomStandard = this.dealIdValue(data.junctionRoomStandard)
          data.waterType = this.dealIdValue(data.waterType)
          data.powerType = this.dealIdValue(data.powerType)
          data.gasType = this.dealIdValue(data.gasType)
          data.heatingType = this.dealIdValue(data.heatingType)
          data.landedPropertyCompany = this.companyFilter(data.landedPropertyCompany)
          data.counterpartSchoolsName = data.counterpartSchoolsName ? JSON.parse(data.counterpartSchoolsName) : [{
            name: '',
            id: ''
          }]
          Object.assign(this.ruleForm2, res.data)
          console.log(this.ruleForm2, 'ruleForm2')
          this.getSecondTypeList(this.ruleForm2.propertyParent)
          return this.ruleForm2
        }
      }).then(res => {
        // 显示联想
        if (res) {
          this.propertyTypeArr = []
          this.propertyTypeArr.push(res.propertyParent)
          this.propertyTypeArr.push(res.propertyType)
        }
      })
    },
    init(id) {
      getResidentialsubPlot({
        residentialInfoId: this.plotid,
        getType: 'vo'
      }).then(res => {
        if (res.data) {
          this.installmentList = res.data.simpleInfoVOList
          if (id) {
            this.installmentId = id
          } else {
            this.installmentId = this.installmentList[this.installmentList.length - 1].id
          }
        }
      })
    }
  },
  components: {
    checkTag,
    thinkSearch,
    shops
  },
  directives: {
    dict
  },
  created() {
    let queryId = window.location.href.split('=')[1]
    getTimeFromInter().then(res => {
      this.millisecond = res.millisecond
    })
    this.plotid = sessionStorage.getItem('plotid')

    // 下拉项
    getoldhouseBasedata({
      dictCatCode: 'propertyRightYear'
    }).then(res => {
      this.propertyRightYearList = res.data
    })

    // 一级物业类型
    getFirstType({
      dictCatCode: 'propertyType'
    }).then(res => {
      this.options = []
      res.data.forEach(v => {
        this.options.push({
          label: v.dictItemValue,
          value: v.dictItemCode,
          id: v.dictItemId,
          children: []
        })
      })
    })
    if (queryId === 'add') {
      this.addInstallment()
    } else {
      this.init(queryId)
    }
  }
}
