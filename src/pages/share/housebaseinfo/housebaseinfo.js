import checktag from '@/pages/share/checktag/checktag.vue'
import picUpload from '@/pages/share/album-upload/album-upload.vue'
import deletedialog from '@/pages/share/deletedialog/deletedialog.vue'
import deleteLog from '@/pages/share/delete-log/delete-log.vue'
import {
  validateHundredInt,
  validatePoint2,
  validatePhone
} from '@/validate/validate'
import {
  recoverHouse
} from './housebaseinfo.api'
import {
  getTimeFromInter
} from '@/api/plot.api'
import {
  fdcHttp,
  fdcJsonp
} from 'fdc-common/http'
import {
  getoldhouseBasedata,
  getLooplineDate
} from '@/api/api'
import {
  getTagList
} from '../checktag/tag.api.js'
export default {
  data() {
    const constRoomNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else if (!/^[1-9]$/.test(value.toString().replace(/\s+/g, ''))) {
        callback(new Error('请输入1-9的整数'))
      } else {
        callback()
      }
    }
    const constRoomHall = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('不能为空'))
      } else if (!/^[0-9]$/.test(value.toString().replace(/\s+/g, ''))) {
        callback(new Error('请输入0-9的整数'))
      } else {
        callback()
      }
    }

    let validateCurrentFloorNum = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (this.ruleForm.totalFloorNum) {
          this.$refs.ruleForm.validateField('totalFloorNum')
        }
        validateHundredInt(rule, value, callback)
      }
    }
    let validateTotalFloorNum = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Number(value) < Number(this.ruleForm.currentFloorNum)) {
        callback(new Error('不得小于' + this.ruleForm.currentFloorNum))
      } else {
        validateHundredInt(rule, value, callback)
      }
    }
    return {
      showDeleteLog: false, // 下架记录是否展示
      landlordDialog: false, // 房东联系方式弹框
      millisecond: '',
      pickerOptions: {
        disabledDate: time => {
          // 当前时间满足返回值为false时，禁用
          return time.getTime() > this.millisecond || time.getTime() < new Date('1970-01-01 8:00:00').getTime()
        }
      },
      cmbaseinfo: {
        cmprovice: '湖北',
        cmcity: '武汉',
        cmregion: '',
        cmaddress: '',
        cmbusiness: '',
        cmbusinessSub: '',
        cmdistrict: '',
        cmnewapartment: '',
        cmcircle: ''
      },
      ruleForm: {
        housebaseservice: [],
        houseTag: [],
        featureTag: [],
        name: '',
        contactName: '',
        fixedPhone: '',
        phone: '',
        houseTitle: '',
        totlePrice: '',
        houseSourceTypeval: '',
        propertyRightYearval: '',
        decorationval: '',
        houseOrientationval: '',
        propertyRightval: '',
        prSignDate: '',
        housebaseserviceval: [],
        acreage: '',
        currentFloorNum: '',
        totalFloorNum: '',
        buildingval: '',
        cellval: '',
        propertyval: '',
        propertySubval: '',
        elevator: '',
        textarea: '',
        roomNum: '',
        periodval: '',
        rentPrice: '', // 租房租金
        rentPayType: '', // 租房支付方式
        rentRoomType: '', // 出租间
        buildingArea: '',
        rentSex: '',
        apartmentAgent: '',
        ptfw: [],
        yytagval: '', // 运营标签值
        roomnum: '', // 室
        hallnum: '', // 厅
        toiletnum: '' // 卫
      },
      rules: {
        currentFloorNum: [{
          validator: validateCurrentFloorNum,
          trigger: 'change&blur'
        }],
        totalFloorNum: [{
          validator: validateTotalFloorNum,
          trigger: 'change&blur'
        }],
        fixedPhone: [{
          validator: validatePhone,
          trigger: 'blur'
        }],
        contactName: [{
          required: true,
          message: '联系人不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 4,
          message: '长度在 4 个字以内',
          trigger: 'blur'
        }
        ],
        phone: [{
          required: true,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          validator: validatePhone,
          trigger: 'blur'
        }
        ],
        houseTitle: [{
          required: true,
          message: '房源标题不能为空',
          trigger: 'blur'
        }],
        // propertyYear: [{ validator: validateYear, trigger: 'blur' }],
        // propertyRightYearval: [{
        //   required: true,
        //   message: '产权年限不能为空',
        //   trigger: 'change'
        // }],
        // houseOrientationval: [{
        //   required: true,
        //   message: '朝向不能为空',
        //   trigger: 'change'
        // }],
        houseSourceTypeval: [{
          required: true,
          message: '房型不能为空',
          trigger: 'change'
        }],
        acreage: [{
          required: true,
          message: '面积不能为空'
        },
        {
          validator: validatePoint2,
          trigger: 'blur'
        }
        ],
        rentPrice: [{
          required: true,
          message: '租金不能为空'
        },
        {
          validator: validatePoint2,
          trigger: 'blur'
        }
        ],
        rentPayType: [{
          required: true,
          message: '支付类型不能为空',
          trigger: 'change'
        }],
        buildingArea: [{
          validator: validatePoint2,
          trigger: 'blur'
        }],
        apartmentAgent: [{
          required: true,
          message: '公寓代理商不能为空'
        }],
        totlePrice: [{
          required: true,
          message: '总价不能为空'
        },
        {
          validator: validatePoint2,
          trigger: 'blur'
        }
        ],
        roomnum: [
          {
            validator: constRoomNum,
            trigger: 'blur&&change'
          }
        ],
        hallnum: [
          {
            validator: constRoomHall,
            trigger: 'blur&&change'
          }
        ],
        toiletnum: [
          {
            validator: constRoomHall,
            trigger: 'blur&&change'
          }
        ]
      },
      imgInfoArr: [],
      houseInfoData: {}, // 通过id获得的房源信息
      listloopData: [], // 环线基础数据
      houseSourceTypeData: [], // 房源类型数据
      propertyRightYearData: [], // 产权年限
      decorationData: [], // 装修数据
      houseOrientationData: [], // 朝向
      propertyRightData: [], // 产权概况
      housebaseserviceData: [], // 配套设施
      buildingData: [], // 楼栋数据
      cellData: [], // 单元数据
      propertyData: [], // 一级物业信息
      propertySubData: [], // 二级物业信息
      rentPayTypeData: [], // 租房支付方式
      rentRoomTypeData: [], // 出租间类型
      rentSexData: [], // 性别要去
      yyTagData: [], // 运营标签
      houseTagData: [], // 房源标签
      rightLink: false,
      periodData: [],
      roomNumData: [],
      rentPayType: [],
      ptfwData: [], // 代理商服务
      propertyNum: 0,
      publishedNum: '',
      linkHouseDialog: false, // 关联房源列表弹出显示
      publishedList: [],
      multipleSelection: [],
      ptfw: [], // 代理商服务值
      listCurpage: 1,
      listPagesize: 5,
      listPageTotalnum: 0,
      // tagArr: [],
      tagsId: [],
      featureTagData: [], // 特色标签
      deleteImgId: '',
      imgDeleteDialog: false,
      bigImgSrc: ''
    }
  },
  components: {
    checktag,
    picUpload,
    deletedialog,
    deleteLog
  },
  watch: {
    houseId: {
      handler() {
        this.gethouseinfo()
      },
      deep: true
    },
    houseInfoData: {
      handler() {
        this.getResidentialsub()
      },
      deep: true
    },
    rentType: {
      handler() {
        this.gethouseinfo()
      },
      deep: true
    }
  },
  methods: {
    gethouseinfo() {
      if (!this.houseId) {
        return false
      }
      let method = ''
      let param = {
        id: this.houseId
      }
      if (this.houseinfoType === '1') {
        method = 'homeworkstation.base.housesource.getByid'
      } else {
        method = 'homeworkstation.base.houserent.getByid'
      }
      this.tagsId = []
      fdcHttp
        .get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', method, param)
        .then(response => {
          // todo: 处理房源关联数据不正确问题
          if (response.data) {
            this.propertyNum = 0
            const data = response.data
            console.log(data, 'houseInfo')
            this.houseInfoData = response.data
            if (
              response.data.tradingArea &&
              JSON.parse(response.data.tradingArea)
            ) {
              this.cmbaseinfo.cmbusiness = JSON.parse(
                response.data.tradingArea
              ).areaName
              this.cmbaseinfo.cmbusinessSub = JSON.parse(
                response.data.tradingArea
              ).areaSubName
            }

            if (response.data.businessZone) {
              this.cmbaseinfo.cmnewapartment = JSON.parse(
                response.data.businessZone
              ).businessZoneName
            }
            this.ruleForm.contactName = data.contact
            // 座机号： telephone -- 二手房 tel -- 租房
            this.ruleForm.fixedPhone = data.telephone || data.tel
            this.ruleForm.phone = data.contactPhone
            this.ruleForm.houseTitle = data.houseTitle
            this.ruleForm.totlePrice = data.totalPrice
            this.ruleForm.agentName = data.agentName
            this.ruleForm.agentPhone = data.agentPhone
            if (data.decorateType) {
              this.decorationData.forEach(val => {
                if (data.decorateType === val.dictItemCode) {
                  this.ruleForm.decorationval =
                    val.dictItemCode + '/val/' + val.dictItemValue
                }
              })
            }
            if (data.orientationType) {
              this.houseOrientationData.forEach(val => {
                if (data.orientationType === val.dictItemCode) {
                  this.ruleForm.houseOrientationval =
                    val.dictItemCode + '/val/' + val.dictItemValue
                }
              })
            }
            if (data.houseType) {
              this.houseSourceTypeData.forEach(val => {
                if (data.houseType === val.dictItemCode) {
                  this.ruleForm.houseSourceTypeval =
                    val.dictItemCode + '/val/' + val.dictItemValue
                }
              })
            }
            this.ruleForm.periodval = data.residentialSubId
            this.ruleForm.buildingval = data.buildingId
            this.ruleForm.cellval = data.unitId
            if (data.floor) {
              let roomNum = this.houseinfoType === '2' ? data.roomNumber : data.roomNum
              console.log(roomNum)
              this.ruleForm.roomNum = roomNum + '/val/' + data.floor + '//' + data.bindHouseId
            } else {
              this.ruleForm.roomNum = ''
            }
            this.ruleForm.propertyval = data.propertyParent
            this.ruleForm.propertySubval = data.propertyType
            if (data.prSituation) {
              this.propertyRightData.forEach(val => {
                if (data.prSituation === val.dictItemCode) {
                  this.ruleForm.propertyRight =
                    val.dictItemCode + '/val/' + val.dictItemValue
                }
              })
            }
            this.ruleForm.roomnum = data.room
            this.ruleForm.hallnum = data.hall
            this.ruleForm.toiletnum = data.toilet
            this.ruleForm.acreage = data.acreage
            this.ruleForm.currentFloorNum = data.currentFloorNum
            this.ruleForm.totalFloorNum = data.totalFloorNum
            if (data.operateLabel) {
              this.yyTagData.find(v => {
                if (data.operateLabel === v.shortKey) {
                  this.ruleForm.yytagval = v.id
                }
              })
            } else {
              this.ruleForm.yytagval = ''
            }
            if (data.tagsIds) {
              this.tagsId = data.tagsIds.split(',')
              this.ruleForm.housebaseservice = []
              this.ruleForm.houseTag = []
              this.ruleForm.featureTag = []
              this.tagsId.forEach((val, index) => {
                this.yyTagData.forEach(yyTag => {
                  if (val === yyTag.id) {
                    this.ruleForm.yytagval = val
                  }
                })
                this.housebaseserviceData.forEach(housebaseservice => {
                  if (val === housebaseservice.id) {
                    this.ruleForm.housebaseservice.push(val)
                  }
                })
                if (this.houseinfoType === '1') {
                  this.houseTagData.forEach(houseTag => {
                    if (val === houseTag.id) {
                      this.ruleForm.houseTag.push(val)
                    }
                  })
                } else if (this.houseinfoType === '2') {
                  this.featureTagData.forEach(featureTag => {
                    if (val === featureTag.id) {
                      this.ruleForm.featureTag.push(val)
                    }
                  })
                }
              })
            }
            if (this.houseinfoType === '1') {
              this.ruleForm.prSignDate = data.prSignDate ? new Date(data.prSignDate + '-01-01 0:00:00') : ''
              this.ruleForm.elevator = data.elevator
              if (data.prAgeLimit) {
                this.propertyRightYearData.forEach(val => {
                  if (val.dictItemCode === data.prAgeLimit) {
                    this.ruleForm.propertyRightYearval =
                      val.dictItemCode + '/val/' + val.dictItemValue
                  }
                })
              }
            }
            if (this.houseinfoType === '2') {
              if (data.isLiftHouse || data.isLiftHouse === '0') {
                this.ruleForm.elevator = Number(data.isLiftHouse)
              } else {
                this.ruleForm.elevator = ''
              }

              this.rentPayTypeData.forEach(val => {
                if (data.payType === val.dictItemCode) {
                  data.payType = val.dictItemCode
                  this.ruleForm.rentPayType =
                    val.dictItemCode + '/val/' + val.dictItemValue
                }
              })
              this.ruleForm.rentPrice = data.price
              if (this.rentType == 2) {
                // 合租
                if (data.roomType) {
                  this.ruleForm.rentRoomType =
                    data.roomType + '/val/' + data.roomTypeDesc
                }
                if (data.rentSex) {
                  this.ruleForm.rentSex =
                    data.rentSex + '/val/' + data.rentSexDesc
                }
                this.ruleForm.buildingArea = data.buildingArea
              } else if (this.rentType == 3) {
                // 品牌公寓
                this.ruleForm.apartmentAgent = data.apartmentAgent
                if (data.apartmentAgentService) {
                  JSON.parse(data.apartmentAgentService).forEach(val => {
                    this.ruleForm.ptfw.push(val.id + '/val/' + val.labelDesc)
                  })
                }
              }
            }
            this.imgInfoArr = []
            response.imgs.forEach(val => {
              let img = new Image()
              img.addEventListener('load', () => {
                this.imgInfoArr.push({
                  id: val.id,
                  src: val.imgSrc,
                  isCover: val.isCover,
                  w: img.width,
                  h: img.height
                })
              })
              img.src = val.imgSrc
            })
            this.getPublishedByPhone()
            if (data.residentialId) {
              this.getResidentialData(data.residentialId)
            }
            this.ruleForm.textarea = data.houseDetailDesc
            this.cmbaseinfo.districtDesc = data.districtDesc
            this.cmbaseinfo.houseAddress = data.houseAddress
            this.cmbaseinfo.districtSubDesc = data.districtSubDesc
            this.cmbaseinfo.loopLineId = data.loopLineId
            if (data.buildingId && data.unitId && data.roomNum) {
              this.rightLink = true
            } else {
              this.rightLink = false
            }
            if ((data.businessType === '1' && data.publishState === '3') || (data.businessType === '3' && data.publishState === '1' && data.auditState === '2')) {
              this.showDeleteLog = true
            } else {
              this.showDeleteLog = false
            }
          }
        })
    },
    getResidentialData(val) {
      fdcHttp
        .get(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          'homeworkstation.base.residentialinfo.getResidentialInfo', {
            id: val
          }
        )
        .then(res => {
          if (!res.data) {
            return false
          }
          let data = res.data
          if (data.tradingArea && JSON.parse(data.tradingArea)) {
            this.cmbaseinfo.cmbusiness = JSON.parse(data.tradingArea).areaName
            this.cmbaseinfo.cmbusinessSub = JSON.parse(
              data.tradingArea
            ).areaSubName
          }

          if (data.businessZone) {
            this.cmbaseinfo.cmnewapartment = JSON.parse(
              data.businessZone
            ).businessZoneName
          }
          this.cmbaseinfo.districtDesc = data.districtName
          this.cmbaseinfo.houseAddress = data.address
          this.cmbaseinfo.districtSubDesc = data.districtSubName
          this.cmbaseinfo.loopLineId = data.loopLineId
        })
    },
    getBaseData() {
      // 获取环线数据
      getLooplineDate()
        .then(response => {
          this.listloopData = response.data
        })

      // 房源类型
      getoldhouseBasedata({
        dictCatCode: 'houseSourceType'
      }).then(response => {
        this.houseSourceTypeData = response.data
        // console.log(response)
      })
      // 产权年限
      getoldhouseBasedata({
        dictCatCode: 'propertyRightYear'
      }).then(response => {
        this.propertyRightYearData = response.data
      })
      // 装修情况
      getoldhouseBasedata({
        dictCatCode: 'decoration'
      }).then(response => {
        this.decorationData = response.data
      })
      // 朝向
      getoldhouseBasedata({
        dictCatCode: 'houseOrientation'
      }).then(response => {
        this.houseOrientationData = response.data
      })
      // 产权概况
      getoldhouseBasedata({
        dictCatCode: 'propertyRight'
      }).then(response => {
        this.propertyRightData = response.data
      })
      let rootId = ''
      if (this.houseinfoType === '1') {
        rootId = 5
      } else {
        rootId = 6
      }
      getTagList({
        rootId: rootId
      }).then(res => {
        this.housebaseserviceData = res.list[0].tagThreeList[0].tagsList
        if (this.houseinfoType === '1') {
          this.houseTagData = res.list[1].tagThreeList[0].tagsList
          this.yyTagData = res.list[2].tagThreeList[0].tagsList
        } else {
          this.yyTagData = res.list[1].tagThreeList[0].tagsList
          this.featureTagData = res.list[2].tagThreeList[0].tagsList
        }

        //  console.log(res.list[0].tagThreeList[0].tagsList)
      })
      // 配套
      // getoldhouseBasedata({dictCatCode: 'housebaseservice'})
      //   .then((response) => {
      //     this.housebaseserviceData = response.data
      //   })
      // 一级物业信息
      getoldhouseBasedata({
        dictCatCode: 'propertyType'
      }).then(response => {
        this.propertyData = response.data
      })
      if (this.houseinfoType == 2) {
        // 一级物业信息
        getoldhouseBasedata({
          dictCatCode: 'rentPayType'
        }).then(response => {
          this.rentPayTypeData = response.data
        })
        // 出租间类型
        getoldhouseBasedata({
          dictCatCode: 'rentRoomType'
        }).then(response => {
          this.rentRoomTypeData = response.data
        })
        // 性别要求
        getoldhouseBasedata({
          dictCatCode: 'rentSex'
        }).then(response => {
          this.rentSexData = response.data
        })
        // 代理商服务
        getoldhouseBasedata({
          dictCatCode: 'ptfw'
        }).then(response => {
          this.ptfwData = response.data
          console.log(response)
        })
      }
      // // 获取删除原因
      // getoldhouseBasedata({dictCatCode: 'hsDelReason'})
      //   .then((response) => {
      //     this.deleteReasonData = response.data
      //   })
    },
    changeBuild(value) {
      if (!value) {
        this.ruleForm.buildingval = ''
        this.buildingData = []
      }
      if (this.ruleForm.periodval) {
        // 根据分期id获取楼栋信息
        fdcHttp
          .get(
            process.env.API_ROOT_HOMEWORK + '/homeworkstation',
            'homeworkstation.base.building.limitpage', {
              residentialSubId: this.ruleForm.periodval
            }
          )
          .then(response => {
            this.buildingData = response.data
          })
      }
    },
    changeCell(value) {
      if (!value) {
        this.ruleForm.cellval = ''
        this.cellData = []
      }
      if (!this.ruleForm.buildingval) {
        return false
      }
      // 根据楼栋id获取单元信息
      fdcHttp
        .get(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          'homeworkstation.base.unit.getconditionlist', {
            buildingId: this.ruleForm.buildingval
          }
        )
        .then(response => {
          this.cellData = response.data
        })
    },
    getResidentialsub() {
      // 根据小区id获取分期信息
      if (this.houseInfoData.residentialId) {
        fdcHttp
          .get(
            process.env.API_ROOT_HOMEWORK + '/homeworkstation',
            'homeworkstation.base.residentialsub.getlist', {
              residentialInfoId: this.houseInfoData.residentialId
            }
          )
          .then(response => {
            this.periodData = response.data
          })
      }
    },
    changHomenum(value) {
      if (!value) {
        this.ruleForm.roomNum = ''
        this.roomNumData = []
      }
      if (!this.ruleForm.cellval) {
        return false
      }
      // 查询房号的接口
      fdcHttp
        .get(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          'homeworkstation.base.housepriceresources.getlist', {
            unitId: this.ruleForm.cellval
          }
        )
        .then(response => {
          this.roomNumData = response.data
        })
    },
    changeProperty() {
      ++this.propertyNum
      if (this.propertyNum > 1) {
        this.ruleForm.propertySubval = ''
      }

      // 二级物业信息
      fdcJsonp(
          process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.propertytype.parent',
          'homebaseaction.base.propertytype.parent', {
            propertyParent: this.ruleForm.propertyval
          }
        )
        .then(response => {
          this.propertySubData = response.data
        })
    },
    saveChange() {
      let filterNull = (val) => {
        if (!val) {
          return ''
        } else {
          return val
        }
      }
      this.ruleForm.propertyval = filterNull(this.ruleForm.propertyval)
      this.ruleForm.decorationval = filterNull(this.ruleForm.decorationval)
      this.ruleForm.propertySubval = filterNull(this.ruleForm.propertySubval)
      this.ruleForm.propertyRight = filterNull(this.ruleForm.propertyRight)
      this.ruleForm.rentSex = filterNull(this.ruleForm.rentSex)
      let param = {
        id: this.houseId,
        houseTitle: this.ruleForm.houseTitle,
        room: this.ruleForm.roomnum,
        hall: this.ruleForm.hallnum,
        toilet: this.ruleForm.toiletnum,
        totalPrice: this.ruleForm.totlePrice,
        houseDetailDesc: document.querySelector('.editable-text').innerHTML,
        currentFloorNum: this.ruleForm.currentFloorNum,
        totalFloorNum: this.ruleForm.totalFloorNum,
        houseType: this.ruleForm.houseSourceTypeval.split('/val/')[0],
        houseTypeDesc: this.ruleForm.houseSourceTypeval.split('/val/')[1],
        elevator: this.ruleForm.elevator,
        houseLabel: '',
        contact: this.ruleForm.contactName,
        contactPhone: this.ruleForm.phone
      }
      if (this.ruleForm.houseOrientationval) {
        param.orientationType = this.ruleForm.houseOrientationval.split(
          '/val/'
        )[0]
        param.orientationTypeDesc = this.ruleForm.houseOrientationval.split(
          '/val/'
        )[1]
      }
      if (this.ruleForm.propertyRight) {
        param.prSituation = this.ruleForm.propertyRight.split('/val/')[0]
        param.prSituationDesc = this.ruleForm.propertyRight.split('/val/')[1]
      }
      if (this.ruleForm.decorationval) {
        param.decorateType = this.ruleForm.decorationval.split('/val/')[0]
        param.decorateTypeDesc = this.ruleForm.decorationval.split('/val/')[1]
      }
      if (this.ruleForm.propertyRightYearval) {
        param.prAgeLimit = this.ruleForm.propertyRightYearval.split('/val/')[0]
        param.prAgeLimitDesc = this.ruleForm.propertyRightYearval.split(
          '/val/'
        )[1]
      }
      param.propertyParent = this.ruleForm.propertyval
      param.propertyType = this.ruleForm.propertySubval

      param.acreage = this.ruleForm.acreage
      var updateMethod = 'homeworkstation.base.housesource.updateById'
      let tagsArr = []
      tagsArr.push(this.ruleForm.yytagval)
      if (this.houseinfoType === '1') {
        tagsArr = tagsArr.concat(this.ruleForm.housebaseservice, this.ruleForm.houseTag)
        param.telephone = this.ruleForm.fixedPhone
        param.tagsIds = tagsArr.join(',')
        // param.houseLabel = JSON.stringify(label)
        param.prSignDate = this.ruleForm.prSignDate instanceof Date ? this.ruleForm.prSignDate.getFullYear() : this.ruleForm.prSignDate
        param.prAgeLimit = this.ruleForm.propertyRightYearval.split('/val/')[0]
        param.prAgeLimitDesc = this.ruleForm.propertyRightYearval.split(
          '/val/'
        )[1]
        updateMethod = 'homeworkstation.base.housesource.updateById'
      }
      if (this.houseinfoType === '2') {
        tagsArr = tagsArr.concat(this.ruleForm.housebaseservice, this.ruleForm.featureTag)
        updateMethod = 'homeworkstation.base.houserent.updateById'
        param.tel = this.ruleForm.fixedPhone
        param.tagsIds = tagsArr.join(',')
        // param.supportingLabel = JSON.stringify(label)
        param.rentType = this.rentType
        param.isLiftHouse = this.ruleForm.elevator
        if (this.rentType == 1) {
          param.rentTypeDesc = '整租'
        } else if (this.rentType == 2) {
          param.rentTypeDesc = '合租'
        } else {
          param.rentTypeDesc = '品牌公寓'
        }
        param.payType = this.ruleForm.rentPayType.split('/val/')[0]
        param.payTypeDesc = this.ruleForm.rentPayType.split('/val/')[1]
        param.price = this.ruleForm.rentPrice
        if (this.rentType == 2) {
          if (this.ruleForm.rentRoomType) {
            param.roomType = this.ruleForm.rentRoomType.split('/val/')[0]
            param.roomTypeDesc = this.ruleForm.rentRoomType.split('/val/')[1]
          }
          if (this.ruleForm.rentSex) {
            param.rentSex = this.ruleForm.rentSex.split('/val/')[0]
            param.rentSexDesc = this.ruleForm.rentSex.split('/val/')[1]
          }
          param.buildingArea = this.ruleForm.buildingArea
        } else if (this.rentType == 3) {
          param.apartmentAgent = this.ruleForm.apartmentAgent
          let label = []
          // this.ruleForm.housebaseserviceval = []
          this.ruleForm.ptfw.forEach(val => {
            label.push({
              id: val.split('/val/')[0],
              labelDesc: val.split('/val/')[1],
              labelType: 'ptfw'
            })
          })
          param.apartmentAgentService = JSON.stringify(label)
        }
      }
      // console.log(param)
      fdcHttp
        .post(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          updateMethod,
          param
        )
        .then(response => {
          // this.gethouseinfo()
          if (response.data === 1) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
          this.$emit('reset')
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 使用关联数据
    useAssociate() {
      let param = {
        buildingId: this.houseInfoData.buildingId,
        houseSourceId: this.houseInfoData.bindHouseId,
        unitId: this.houseInfoData.unitId
      }
      fdcHttp
        .get(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          'homeworkstation.base.house.autoform',
          param
        )
        .then(res => {
          res.data.propertyParent && (this.ruleForm.propertyval = res.data.propertyParent)
          setTimeout(() => {
            res.data.propertyType && (this.ruleForm.propertySubval = res.data.propertyType)
          }, 0)
          res.data.propertyRightYear && (this.ruleForm.propertyRightYearval = res.data.propertyRightYear)
          if (this.rentType === '2') {
            res.data.coveredArea && (this.ruleForm.buildingArea = res.data.coveredArea)
          } else {
            res.data.coveredArea && (this.ruleForm.acreage = res.data.coveredArea)
          }
          res.data.floor && (this.ruleForm.currentFloorNum = res.data.floor)
          res.data.totalFloor && (this.ruleForm.totalFloorNum = res.data.totalFloor)
          this.ruleForm.elevator = res.data.hasLift
          if (res.data.orientation) {
            this.houseOrientationData.forEach(val => {
              if (res.data.orientation === val.dictItemCode) {
                this.ruleForm.houseOrientationval =
                  val.dictItemCode + '/val/' + val.dictItemValue
              }
            })
          }
          if (res.data.propertyRightYear) {
            let propertyRightYear = JSON.parse(res.data.propertyRightYear)
            this.ruleForm.propertyRightYearval = propertyRightYear.id + '/val/' + propertyRightYear.value
          }
          if (res.data.houseStyleName) {
            let houseArr = res.data.houseStyleName.split(/[^\d]/)
            this.ruleForm.roomnum = houseArr[0]
            this.ruleForm.hallnum = houseArr[1]
            this.ruleForm.toiletnum = houseArr[2]
          }
        })
    },
    submit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.saveChange()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关联楼栋保存修改
    saveChangeBuild() {
      let param = {}
      param.residentialSubId = this.ruleForm.periodval
      param.buildingId = this.ruleForm.buildingval
      param.unitId = this.ruleForm.cellval
      param.id = this.houseId
      if (this.ruleForm.roomNum) {
        param.roomNum = this.ruleForm.roomNum.split('/val/')[0]
        param.floor = this.ruleForm.roomNum.split('/val/')[1].split('//')[0]
        param.bindHouseId = this.ruleForm.roomNum.split('/val/')[1].split('//')[1]
      }
      var updateMethod = 'homeworkstation.base.housesource.updateById'
      if (this.houseinfoType === '2') {
        updateMethod = 'homeworkstation.base.houserent.updateById'
        param.roomNumber = param.roomNum
        delete param.roomNum
      }
      fdcHttp
        .post(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          updateMethod,
          param
        )
        .then(response => {
          if (response.data == 1) {
            // this.gethouseinfo()
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$emit('reset')
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    reset(flag) {
      if (flag === 'success') {
        this.gethouseinfo()
      } else if (flag === 'deleteSuccess') {
        this.getPublishedByPhone()
      }
    },
    // 调用上传组件
    showUploadDialog() {
      this.$refs.picUpload.dialogVisible = true
      this.$refs.picUpload.imgList = []
    },
    // 设封面
    setCoverImg(id) {
      fdcHttp
        .get(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          'homeworkstation.base.housesourceimg.changeCoverById', {
            id: id
          }
        )
        .then(response => {
          if (response.data == 1) {
            this.$message({
              message: '设置封面成功',
              type: 'success'
            })
            this.gethouseinfo()
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    deleteDialog(id) {
      this.deleteImgId = id
      this.imgDeleteDialog = true
    },
    // 删除图片
    deleteImg(id) {
      this.imgDeleteDialog = false
      fdcHttp
        .get(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          'homeworkstation.base.housesourceimg.deleteById', {
            id: this.deleteImgId
          }
        )
        .then(response => {
          if (response.data === '1') {
            this.$message({
              message: '删除图片成功',
              type: 'success'
            })
            this.gethouseinfo()
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 获取手机用户发布房源信息
    getPublishedByPhone() {
      let param = {
        pagesize: this.listPagesize,
        contactPhone: this.houseInfoData.contactPhone,
        pages: this.listCurpage
      }
      fdcHttp
        .get(
          process.env.API_ROOT_HOMEWORK + '/homeworkstation',
          'homeworkstation.base.housesource.unionpage',
          param
        )
        .then(response => {
          this.publishedNum = response.resdto.totaldatas
          if (response.data) {
            this.publishedList = response.data
          }
          this.listPageTotalnum = response.resdto.totaldatas
        })
    },
    getPublishList() {
      this.getPublishedByPhone()
      this.linkHouseDialog = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    deletebtn() {
      if (this.multipleSelection.length > 0) {
        this.$refs.deletedialog.deleteDialogshow = true
      } else {
        this.$message({
          message: '请至少选择一条房源',
          type: 'warning'
        })
      }
    },
    singleDelete(data) {
      this.multipleSelection[0] = data
      this.$refs.deletedialog.deleteDialogshow = true
    },
    republic(data) {
      let param = {
        id: data.id
      }
      let method = 'homeworkstation.base.housesource.rePublicById'
      if (this.houseinfoType === '2') {
        method = 'homeworkstation.base.houserent.rePublicById'
      }
      fdcHttp
        .get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', method, param)
        .then(response => {
          if (response.data === 1) {
            this.getPublishedByPhone()
            this.$message({
              message: '重发成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 上架操作
    changeDeleteState(row) {
      let method = 'homeworkstation.base.housesource.recoverById'
      if (this.houseinfoType === '2') {
        method = 'homeworkstation.base.houserent.recoverById'
      }
      this.$confirm('是否恢复该房源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return recoverHouse(method, {
          id: row.id
        })
      }).then(res => {
        if (res.data === 1) {
          this.getPublishedByPhone()
          this.$message.success('恢复房源成功')
        }
      }).catch(err => {
        if (err === 'cancel') {} else {
          this.$message.error(err)
        }
      })
    },
    handleSizeChange(val) {
      this.listPagesize = val
      this.getPublishedByPhone()
    },
    handleCurrentChange(val) {
      this.listCurpage = val
      this.getPublishedByPhone()
    }
  },
  props: ['houseId', 'houseinfoType', 'rentType'],
  mounted() {
    getTimeFromInter().then(res => {
      this.millisecond = res.millisecond
    })
    this.getBaseData()
    this.gethouseinfo()
  }
}
