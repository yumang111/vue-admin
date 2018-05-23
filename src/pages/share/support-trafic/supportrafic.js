import { fdcHttp } from 'fdc-common/http'

export default {
  data() {
    return {
      ruleForm: {
        business: '',
        money: '',
        school: '',
        hospital: '',
        entertainment: '',
        park: '',
        other: '',
        circlelocate: '',
        district: '',
        trafic: '',
        bus: '',
        driving: ''
      },
      rules: {
        business: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        money: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        school: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        hospital: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        entertainment: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        park: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        other: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        circlelocate: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        district: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        trafic: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        bus: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }],
        driving: [{ min: 0, max: 400, message: '请输入1——400个汉字', trigger: 'blur' }]
      },
      surpportraficData: {},
      submitState: '提交'
    }
  },
  methods: {
    // 获取交通配套数据
    getsurpportraficData() {
      fdcHttp.get('/homeworkstation', 'homeworkstation.base.supportingtraffic.getSupportingTraffic', { resdidentialInfoId: sessionStorage.getItem('plotid') })
        .then((response) => {
          const data = response.data
          if (data) {
            this.surpportraficData = data
            // this.$parent.STstatename = '保存'
            this.submitState = '保存'
            this.ruleForm.business = data.business
            this.ruleForm.financial = data.financial
            this.ruleForm.money = data.financial
            this.ruleForm.hospital = data.medical
            this.ruleForm.school = data.school
            this.ruleForm.entertainment = data.entertainment
            this.ruleForm.other = data.other
            this.ruleForm.circlelocate = data.loopPosition
            this.ruleForm.district = data.trandingArea
            this.ruleForm.trafic = data.subway
            this.ruleForm.park = data.park
            this.ruleForm.bus = data.bus
            this.ruleForm.driving = data.drivingLine
          }
        })
    },
    editeSupportrafic() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addSupportrafic()
        } else {
          return false
        }
      })
    },
    addSupportrafic() {
      var param = {
        resdidentialInfoId: sessionStorage.getItem('plotid'),
        business: this.ruleForm.business,
        financial: this.ruleForm.money,
        school: this.ruleForm.school,
        medical: this.ruleForm.hospital,
        entertainment: this.ruleForm.entertainment,
        other: this.ruleForm.other,
        loopPosition: this.ruleForm.circlelocate,
        trandingArea: this.ruleForm.district,
        subway: this.ruleForm.trafic,
        bus: this.ruleForm.bus,
        park: this.ruleForm.park,
        drivingLine: this.ruleForm.driving
      }
      if (this.submitState !== '提交') {
        param.id = this.surpportraficData.id
      }
      let method, msg
      if (this.submitState === '提交') {
        method = 'homeworkstation.base.supportingtraffic.add'
        msg = '添加配套及交通成功'
      } else {
        method = 'homeworkstation.base.supportingtraffic.modify'
        msg = '保存成功'
      }
      fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', method, param)
        .then((response) => {
          if (response.data === 1) {
            this.getsurpportraficData()
            this.$message({
              message: msg,
              type: 'success'
            })
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    }
  },
  mounted() {
    this.getsurpportraficData()
  }
}
