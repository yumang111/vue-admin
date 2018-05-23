// 获取下拉项
import {
  validatePoint2,
  validateRePoint2,
  unEmpty,
  validateInt
} from '@/validate/validate'
import picUpload from '../../album/album-upload/album-upload.vue'
import dict from '@/directives/dict.directive'
import {
  getAllhouseTypeInfo,
  addHousingType, // 添加户型
  modifyHousingTypeInfo,
  getHousingTypeInfo
} from '../../houseType/houseType.api'
import {
  getImgList,
  deleteImgInfo,
  tagUseCount
} from '@/api/plot.api'
import editImg from '../../album/editImg/editImg.vue'
import checkTag from '@/pages/share/checktag/checktag.vue'
import mixins from '@/mixins/mixins'
export default {
  props: ['title', 'sub', 'formId'],
  data() {
    return {
      throttle: true,
      formData: { // 编辑图片对象
        imgName: '',
        urlLink: '',
        imgDesc: '',
        id: ''
      },
      oldTagIds: '',
      newTagIds: '',
      imgList: [],
      activeTypeName: '户型图',
      activeType: '1',
      roomTypeList: [],
      plotid: '',
      ruleForm: {
        housingImgId: '',
        housingTypeName: '',
        sellStatus: '',
        avagPrice: '',
        orientation: '',
        shortkey: '',
        roomTypeId: '',
        coveredArea: '',
        insideSpace: '',
        familyProperty: '',
        floorHeight: '',
        imgIds: '',
        housingDesc: '',
        tagsIds: ''
      },
      ruleFormRules: {
        housingTypeName: [{
          required: true,
          message: '户型名不能为空！',
          trigger: 'change&blur'
        },
        {
          max: 50,
          message: '户型名必须在50字以内',
          trigger: 'change&blur'
        }
        ],
        housingDesc: [{
          max: 2000,
          message: '描述在2000字以内',
          trigger: 'change&blur'
        }],
        imgIds: [{
          required: true,
          message: '至少上传一张图片',
          trigger: 'change'
        }],
        floorHeight: [{
          validator: validatePoint2,
          trigger: 'change&blur'
        }],
        avagPrice: [{
          validator: validateInt,
          trigger: 'change&blur'
        }],
        coveredArea: [{
          validator: validateRePoint2,
          trigger: 'change&blur'
        }],
        insideSpace: [{
          validator: validatePoint2,
          trigger: 'change&blur'
        }],
        sellStatus: [{
          validator: unEmpty,
          trigger: 'change'
        }],
        shortkey: [{
          validator: unEmpty,
          trigger: 'change'
        }],
        roomTypeId: [{
          validator: unEmpty,
          trigger: 'change'
        }]
      }
    }
  },
  mixins: [mixins],
  directives: {
    dict
  },
  watch: {
    formId(n) {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
      this.getHousingType(n)
    }
  },
  methods: {
    editImg(item) {
      this.$refs.editImg.isShowEditDialog = true
      this.$refs.editImg.casArr = []
      this.formData = JSON.parse(JSON.stringify(item))
    },
    deleteImg(id) {
      deleteImgInfo({
        id: id
      }).then(res => {
        if (res.data === 1) {
          this.showInfoMsg('success', '删除成功')
          this.imgList.find((v, i) => {
            if (v && v.id === id) {
              this.imgList.splice(i, 1)
            }
          })
          let ids = ''
          this.imgList.forEach((v, i) => {
            ids += i === 0 ? v.id : ',' + v.id
          })
          this.ruleForm.imgIds = ids
        }
      })
    },
    getHousingType(id) {
      getHousingTypeInfo({
        id: id
      }).then(res => {
        this.imgList = res.imglist
        res.data.familyProperty = this.dealIdValue(res.data.familyProperty)
        Object.assign(this.ruleForm, res.data)
        let ids = ''
        this.imgList.forEach((v, i) => {
          ids += i === 0 ? v.id : ',' + v.id
        })
        this.ruleForm.imgIds = ids
        this.oldTagIds = this.ruleForm.tagsIds
      })
    },
    reset(ids) {
      let requireIds = ''
      this.imgList.forEach((v, i) => {
        requireIds += i === 0 ? v.id : ',' + v.id
      })
      if (ids !== '1') {
        requireIds = !requireIds ? ids.join(',') : requireIds + ',' + ids.join(',')
      }
      getImgList({
        id: requireIds
      }).then(res => {
        this.imgList = res.data
        this.ruleForm.imgIds = requireIds
      }).catch(err => {
        console.log(err, 'err')
      })
    },
    showUploadDialog() {
      this.$refs.picUpload.dialogVisible = true
      this.$refs.picUpload.form.imgList = []
    },
    statistics() {
      this.newTagIds = this.ruleForm.tagsIds
      tagUseCount({
        oldTagIds: this.oldTagIds,
        newTagIds: this.newTagIds
      }).then(res => {
        if (res.data) {
          console.log('统计标签使用成功！')
        }
      })
    },
    modify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = { ...this.ruleForm
          }
          form.roomTypeName = this.$refs.roomType.selectedLabel
          form.familyProperty = this.dealIdValue(form.familyProperty, 'familyProperty')
          form.residentialInfoId = this.plotid
          modifyHousingTypeInfo(form).then(res => {
            if (res.data === '1') {
              this.statistics()
              this.showInfoMsg('success', '修改户型信息成功')
              this.$emit('reset')
            }
          }).catch(err => {
            this.showInfoMsg('error', err)
          })
        }
      })
    },
    submitForm(formName) {
      if (this.throttle) {
        this.throttle = false
        this.$refs[formName].validate(valid => {
          if (valid) {
            let form = { ...this.ruleForm
            }
            form.roomTypeName = this.$refs.roomType.selectedLabel
            form.familyProperty = this.dealIdValue(form.familyProperty, 'familyProperty')
            form.residentialInfoId = this.plotid
            addHousingType(form).then(res => {
              if (res.data === '1') {
                this.throttle = true
                this.statistics()
                this.$router.push('/homeworkstation/plot/plotPortal/houseType')
                this.showInfoMsg('success', '新增户型成功')
              }
            }).catch(res => {
              this.throttle = true
              this.showInfoMsg('error', res)
            })
          } else {
            this.throttle = true
          }
        })
      }
    },
    tofixed($event, num) {
      $event.target.value = Number($event.target.value).toFixed(num)
    },
    getDropDown() {
      getAllhouseTypeInfo({
        rowsPerPage: 100
      }).then(res => {
        this.roomTypeList = res.data
      })
    },
    init() {
      this.getDropDown()
      if (this.formId) {
        this.getHousingType(this.formId)
      }
    },
    // 将字段处理成{id:'',value:''}
    dealIdValue(value, refName) {
      if (refName) {
        return JSON.stringify({
          id: value,
          value: this.$refs[refName].selectedLabel
        })
      } else {
        if (value) {
          value = JSON.parse(value).id
        }
        return value
      }
    }
  },
  components: {
    picUpload,
    checkTag,
    editImg
  },
  created() {
    this.plotid = sessionStorage.getItem('plotid')
    this.init()
  }
}
