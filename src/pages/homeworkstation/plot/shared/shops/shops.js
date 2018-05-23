import {
  validateBillionInt,
  validateHundredPoint1,
  validateHundredInt,
  validateThousandPoint1
} from '@/validate/validate'
import {
  getShopsInfo,
  addShopsInfo,
  updateShopsInfo
} from '@/api/plot.api'
import {
  fdcDict
} from 'fdc-common/http'
import mixins from '@/mixins/mixins'
import {
  dateFormat
} from '@/filters/filters.js'
export default {
  data() {
    let validateAcreageMin = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (this.shopsForm.acreageMax) {
          this.$refs.shopsForm.validateField('acreageMax')
        }
        validateBillionInt(rule, value, callback)
      }
    }
    let validateAcreageMax = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Number(value) <= Number(this.shopsForm.acreageMin)) {
        callback(new Error('须大于' + this.shopsForm.acreageMin))
      } else {
        validateBillionInt(rule, value, callback)
      }
      // } else if (value > 0 && value < 100000 && /^[0-9]*[1-9][0-9]*$/.test(value)) {
      //   if (Number(value) <= Number(this.shopsForm.acreageMin)) {
      //     callback(new Error('须大于' + this.shopsForm.acreageMin))
      //   } else {
      //     callback()
      //   }
      // } else {
      //   callback(new Error('请输入10万以内正整数'))
      // }
    }
    let validateHeightMin = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (this.shopsForm.heightMax) {
          this.$refs.shopsForm.validateField('heightMax')
        }
        validateHundredPoint1(rule, value, callback)
      }
    }
    let validateHeightMax = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Number(value) <= Number(this.shopsForm.heightMin)) {
        callback(new Error('须大于' + this.shopsForm.heightMin))
      } else {
        validateHundredPoint1(rule, value, callback)
      }
    }
    let validateRentalIncomeMin = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (this.shopsForm.rentalIncomeMax) {
          this.$refs.shopsForm.validateField('rentalIncomeMax')
        }
        validateBillionInt(rule, value, callback)
      }
    }
    let validateRentalIncomeMax = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Number(value) <= Number(this.shopsForm.rentalIncomeMin)) {
        callback(new Error('须大于' + this.shopsForm.rentalIncomeMin))
      } else {
        validateBillionInt(rule, value, callback)
      }
    }
    let validateWideMin = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (this.shopsForm.wideMax) {
          this.$refs.shopsForm.validateField('wideMax')
        }
        validateHundredInt(rule, value, callback)
      }
    }
    let validateWideMax = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Number(value) <= Number(this.shopsForm.wideMin)) {
        callback(new Error('须大于' + this.shopsForm.wideMin))
      } else {
        validateHundredInt(rule, value, callback)
      }
    }
    let validateDepthMin = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (this.shopsForm.depthMax) {
          this.$refs.shopsForm.validateField('depthMax')
        }
        validateHundredInt(rule, value, callback)
      }
    }
    let validateDepthMax = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Number(value) <= Number(this.shopsForm.depthMin)) {
        callback(new Error('须大于' + this.shopsForm.depthMin))
      } else {
        validateHundredInt(rule, value, callback)
      }
    }
    return {
      throttle: true,
      plotid: '',
      businessScopeList: [],
      divisionList: [{
        dictItemCode: '1',
        dictItemValue: '可以'
      }, {
        dictItemCode: '0',
        dictItemValue: '不可以'
      }],
      shopsForm: {
        id: '',
        acreageMin: '', // 开间面积下限
        acreageMax: '', // 开间面积上限
        acreageShow: '', // 面积区间-展示
        openTime: '', // 开业日期
        openTimeShow: '', // 开业日期-展示
        heightMin: '', // 层高下限
        heightMax: '', // 层高上限
        heightShow: '', // 层高-展示
        parkingFee: '', // 停车费
        profit: '', // 收益
        profitShow: '', // 收益-展示
        rentalIncomeMin: '', // 租金收益下限
        rentalIncomeMax: '', // 租金收益上限
        division: '', // 是否可以分割,0 不可以 1 可以
        businessScope: [], // 经营范围
        businessScopeShow: '', // '经营范围-展示
        wideMin: '', // 面宽下限
        wideMax: '', // 面宽上限
        wideShow: '', // 面宽-展示
        depthMin: '', // 进深下限
        depthMax: '', // 进深上限
        depthShow: '' // 进深展示
      },
      rules: {
        businessScopeShow: [{
          min: 1,
          max: 200,
          message: '请输入1~200个汉字长度',
          trigger: 'change&blur'
        }],
        depthShow: [{
          min: 1,
          max: 50,
          message: '请输入1~50个汉字长度',
          trigger: 'change&blur'
        }],
        wideShow: [{
          min: 1,
          max: 50,
          message: '请输入1~50个汉字长度',
          trigger: 'change&blur'
        }],
        profitShow: [{
          min: 1,
          max: 50,
          message: '请输入1~50个汉字长度',
          trigger: 'change&blur'
        }],
        heightShow: [{
          min: 1,
          max: 50,
          message: '请输入1~50个汉字长度',
          trigger: 'change&blur'
        }],
        openTimeShow: [{
          min: 1,
          max: 50,
          message: '请输入1~50个汉字长度',
          trigger: 'change&blur'
        }],
        acreageShow: [{
          min: 1,
          max: 50,
          message: '请输入1~50个汉字长度',
          trigger: 'change&blur'
        }],
        profit: [{
          validator: validateHundredInt,
          trigger: 'change&blur'
        }],
        parkingFee: [{
          validator: validateThousandPoint1,
          trigger: 'change&blur'
        }],
        wideMin: [{
          validator: validateWideMin,
          trigger: 'change&blur'
        }],
        wideMax: [{
          validator: validateWideMax,
          trigger: 'change&blur'
        }],
        depthMin: [{
          validator: validateDepthMin,
          trigger: 'change&blur'
        }],
        depthMax: [{
          validator: validateDepthMax,
          trigger: 'change&blur'
        }],
        rentalIncomeMin: [{
          validator: validateRentalIncomeMin,
          trigger: 'change&blur'
        }],
        rentalIncomeMax: [{
          validator: validateRentalIncomeMax,
          trigger: 'change&blur'
        }],
        acreageMin: [{
          validator: validateAcreageMin,
          trigger: 'change&blur'
        }],
        acreageMax: [{
          validator: validateAcreageMax,
          trigger: 'change&blur'
        }],
        heightMin: [{
          validator: validateHeightMin,
          trigger: 'change&blur'
        }],
        heightMax: [{
          validator: validateHeightMax,
          trigger: 'change&blur'
        }]
      }
    }
  },
  props: {
    propertyTypeArr: Array, //
    subInfoId: String
  },
  watch: {
    propertyTypeArr(n) {
      let params = {
        propertyParent: n[0],
        propertyType: n[1],
        subInfoId: this.subInfoId
      }
      this.getShopsForm(params)
    }
  },
  methods: {
    getShopsForm(params) {
      if (!params.propertyType) return
      getShopsInfo(params).then(res => {
        if (res.data && res.data.id) {
          this.reset()
          let filter = []
          if (res.data.businessScope) {
            res.data.businessScope = JSON.parse(res.data.businessScope)
            res.data.businessScope.forEach(v => {
              filter.push(v.value)
            })
            res.data.businessScope = filter
          } else {
            res.data.businessScope = []
          }
          Object.assign(this.shopsForm, res.data)
        }
      })
    },
    changeBusinessScope(arr) {
      if (arr && arr.length) {
        this.shopsForm.businessScopeShow = arr.join('、')
      } else {
        this.shopsForm.businessScopeShow = ''
      }
    },
    reset() {
      this.$refs.shopsForm.resetFields()
      this.shopsForm.id = ''
    },
    changeDate(val) {
      this.shopsForm.openTimeShow = val ? dateFormat(val) : ''
    },
    change(val) {
      if (val === 'rentalIncome') {
        if (!this.shopsForm[val + 'Min'] || !this.shopsForm[val + 'Max']) {
          this.shopsForm.profitShow = this.shopsForm[val + 'Min'] + this.shopsForm[val + 'Max']
        } else {
          this.shopsForm.profitShow = this.shopsForm[val + 'Min'] + ' ~ ' + this.shopsForm[val + 'Max']
        }
      } else {
        if (!this.shopsForm[val + 'Min'] || !this.shopsForm[val + 'Max']) {
          this.shopsForm[val + 'Show'] = this.shopsForm[val + 'Min'] + this.shopsForm[val + 'Max']
        } else {
          this.shopsForm[val + 'Show'] = this.shopsForm[val + 'Min'] + ' ~ ' + this.shopsForm[val + 'Max']
        }
      }
    },
    submit() {
      if (this.throttle) {
        this.throttle = false
        console.log(this.shopsForm)
        this.$refs.shopsForm.validate(valid => {
          if (valid) {
            let form = JSON.parse(JSON.stringify(this.shopsForm))
            let filter = []
            form.businessScope.forEach(v => {
              this.businessScopeList.find(val => {
                if (val.dictItemValue === v) {
                  filter.push({
                    id: val.dictItemId,
                    shortKey: val.dictItemCode,
                    value: val.dictItemValue
                  })
                }
              })
            })
            form.businessScope = JSON.stringify(filter)
            form.openTime = form.openTime ? new Date(form.openTime).getTime() : ''
            if (this.shopsForm.id) {
              updateShopsInfo({
                id: this.shopsForm.id,
                ...form
              }).then(res => {
                this.throttle = true
                if (res.data === 1) {
                  this.showInfoMsg('success', '更新商业公共数据成功')
                }
              }).catch(err => {
                this.throttle = true
                this.showInfoMsg('error', err)
              })
            } else {
              addShopsInfo({
                ...form,
                residentialInfoId: this.plotid,
                residentialSubInfoId: this.subInfoId,
                propertyParent: this.propertyTypeArr[0],
                propertyType: this.propertyTypeArr[1]
              }).then(res => {
                this.throttle = true
                if (res.data === 1) {
                  this.showInfoMsg('success', '新增商业公共数据成功')
                  this.getShopsForm({
                    propertyParent: this.propertyTypeArr[0],
                    propertyType: this.propertyTypeArr[1],
                    subInfoId: this.subInfoId
                  })
                }
              }).catch(err => {
                this.throttle = true
                this.showInfoMsg('error', err)
              })
            }
          } else {
            this.throttle = true
          }
        })
      }
    }
  },
  mixins: [mixins],
  created() {
    this.plotid = sessionStorage.getItem('plotid')
    fdcDict(process.env.API_ROOT_DICT, 'businessRange').then(data => {
      this.businessScopeList = data
    })
  }
}
