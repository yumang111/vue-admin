import '@/assets/js/bmaplib.css'
import supportrafic from '@/pages/share/support-trafic/supportrafic.vue'
import {
  getRegionData,
  getsubRegion,
  getUnlimitedpurchasearea,
  getLooplineDate
} from '@/api/api'
import {
  getProvinceInfo,
  getCityInfo
} from '@/api/plot.api'
import {
  fdcDict,
  fdcHttp,
  fdcJsonp
} from 'fdc-common/http'
import router from '@/router/index'
import {
  validatePoint2
} from '@/validate/validate'
export default {
  data() {
    const validateNickname = (rule, value, callback) => {
      let i = 0
      value.forEach((val) => {
        if (val.name.trim().length > 25) {
          i++
        }
      })
      if (i > 0) {
        callback(new Error('请输入1-25个汉字'))
      } else {
        callback()
      }
    }
    return {
      sourceList: [], // 来源列表
      isFirst: 0,
      unLimitArea: [], // 不限购区
      ruleForm: {
        province: '',
        city: '',
        region: '',
        address: ''
      },
      rules: {
        region: [{
          required: true,
          message: '区域不能为空',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '详细地址不能为空',
          trigger: 'blur'
        }]
      },
      ruleForm2: {
        tradeCircle: '',
        tradeCircleSub: '',
        district: '',
        newArea: '',
        nolimitAreaId: '',
        nolimitAreaName: ''
      },
      rules2: {
        district: [{
          required: true,
          message: '板块不能为空',
          trigger: 'blur'
        }],
        newArea: [{
          required: true,
          message: '居住新区不能为空',
          trigger: 'change'
        }]
      },
      ruleForm3: {
        residentialInfocol: ['11'], // 小区来源
        spell: '',
        areanum: '', // 占地面积
        buildingArea: '' // 建筑面积
      },
      rules3: {
        residentialInfocol: [{
          type: 'array',
          required: true,
          message: '来源不能为空',
          trigger: 'change'
        }],
        spell: [{
          required: true,
          message: '拼音不能为空',
          trigger: 'change'
        }],
        areanum: [{
          validator: validatePoint2,
          trigger: 'blur'
        }],
        buildingArea: [{
          validator: validatePoint2,
          trigger: 'blur'
        }]
      },
      ruleForm4: {
        cmname: '',
        residentialNickName: [{
          name: ''
        }]
      },
      rules4: {
        cmname: [{
          required: true,
          message: '小区名称不能为空',
          trigger: 'change'
        },
        {
          max: 25,
          message: '小区名称在25个汉字以内',
          trigger: 'change'
        }
        ],
        residentialNickName: [{
          validator: validateNickname,
          trigger: 'change'
        }]
      },
      districtData: [], // 片区数据
      province: '',
      provinceArr: [],
      city: '',
      cityArr: [],
      getRegionData: [],
      input: '',
      value: '',
      drawImgFlag: false,
      drawImgStatus: 0, // 0未操作地图 1处于画图状态 2处于编辑修改状态 3清空状态
      drawImgArr: [],
      index: 0,
      map: {},
      polygon: {},
      drawingManager: {},
      overlays: [],
      marker: {},
      haveCenterPoint: true,
      loactePoint: {},
      cmname: '', // 定位的小区名称
      keywrods: '交通',
      listloopData: [], // 环线数据
      listloop: '', // 环线值
      newAreaData: [], // 居住新区数据
      newArea: '', // 居住新区值
      tradeAreaData: [], // 商圈父级数据
      tradeArea: '',
      tradeAreaSubData: [], // 商圈子级数据
      path: [], // 小区折线路径

      lngvalue: '', // 小区经度
      latvalue: '', // 小区纬度
      cmNicknames: '', // 小区别名
      cmInfoById: {}, // 通过id获得的小区基本信息
      sameVerify: false, // 小区名是否重复
      // STstatename: '提交', // 交通配套提交状态  已弃用
      subSelectEmpty: 0 // 是否清空联动二级数据值
    }
  },
  methods: {
    onSubmit() {
      console.log(this.cmname)
    },
    resetPoint() {
      this.haveCenterPoint = false
      this.lngvalue = ''
      this.latvalue = ''
      this.map.removeOverlay(this.marker)
      var _this = this
      var listenClick = function (e) {
        _this.map.removeOverlay(_this.marker)
        _this.marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
        _this.map.addOverlay(_this.marker)
        _this.lngvalue = e.point.lng
        _this.latvalue = e.point.lat
        _this.map.removeEventListener('click', listenClick, false)
        _this.map.removeEventListener('mousemove', listenMousemove, false)
        _this.haveCenterPoint = true
      }
      this.map.addEventListener('click', listenClick, false)
      var listenMousemove = function (e) {
        _this.map.removeOverlay(_this.marker)
        _this.lngvalue = e.point.lng
        _this.latvalue = e.point.lat
        _this.marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))

        _this.map.addOverlay(_this.marker)
      }
      this.map.addEventListener('mousemove', listenMousemove, false)
    },
    drawImg() {
      if (!this.haveCenterPoint) {
        this.$message.error('请先完成标注')
        return
      }
      this.drawImgFlag = true
      this.drawImgStatus = 1
      this.clearImg()
      this.drawingManager.open()
      this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON)
    },
    editeImg() {
      if (!this.haveCenterPoint) {
        this.$message.error('请先完成标注')
        return
      }
      if (this.overlays.length < 1) return
      this.drawImgStatus = 2
      if (this.overlays.length > 0) {
        this.clearOverlay()
        this.drawImgArr = this.overlays[0].getPath()
        this.pointToImg()
      }
      this.polygon.enableEditing()
      this.drawImgFlag = false
    },
    // 清除按钮
    clearImg() {
      if (!this.haveCenterPoint) {
        this.$message.error('请先完成标注')
        return
      }
      if (this.overlays.length < 1) return
      this.drawImgStatus = 3
      if (this.overlays.length > 0) {
        for (var i = 0; i < this.overlays.length; i++) {
          this.map.removeOverlay(this.overlays[i])
        }
        this.overlays.length = 0
      } else {
        this.drawImgArr = []
      }
      this.drawImgArr = []
      this.clearOverlay()
      console.log(this.polygon.getPath())
    },
    // 清除除了目标点外的所有覆盖物
    clearOverlay() {
      this.map.clearOverlays()
      var points = new BMap.Point(this.lngvalue, this.latvalue)
      // var points = new BMap.Point(this.loactePoint.lng, this.loactePoint.lat)
      this.marker = new BMap.Marker(points)
      this.map.addOverlay(this.marker)
    },
    // 提交按钮
    submitcm(type) {
      if (!this.haveCenterPoint) {
        this.$message.error('请先完成标注')
        return
      }
      if (!this.lngvalue) {
        this.$message.error('未自动定位到小区地址，请手动完成标注')
        return false
      }
      if (this.drawImgFlag && this.overlays.length === 0 && this.drawImgStatus !== 3) {
        this.$message({
          message: '警告哦，这是一条警告消息',
          type: 'warning'
        })
        return
      }
      if (this.drawImgStatus === 0) {
        this.path = this.drawImgArr
      } else if (this.drawImgStatus === 1) {
        this.path = this.overlays[0].getPath() || []
      } else if (this.drawImgStatus === 2) {
        this.path = this.polygon.getPath()
      } else {
        this.path = []
      }
      let checkFlag = 0
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          checkFlag++
          // alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.$refs['ruleForm2'].validate((valid) => {
        if (valid) {
          checkFlag++
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.$refs['ruleForm3'].validate((valid) => {
        if (valid) {
          checkFlag++
        } else {
          console.log('error submit!!')
          return false
        }
      })
      if (checkFlag === 3) {
        console.log('校验正确')
        this.createPost(type)
        console.log(this.path)
      }

      // console.log(path)
    },
    // 由点生成折线图
    pointToImg() {
      var _this = this
      var drawImgPointArr = []
      this.drawImgArr.forEach(function (ele, index) {
        drawImgPointArr.push(new BMap.Point(_this.drawImgArr[index].lng, _this.drawImgArr[index].lat))
      })
      this.polygon = new BMap.Polygon(drawImgPointArr, {
        strokeColor: 'red', // 边线颜色。
        fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }) // 创建多边形
      this.polygon.enableMassClear()
      this.map.addOverlay(this.polygon) // 增加多边形
    },
    // 配套设施搜索
    searchArrounding(myKeys) {
      this.keywrods = myKeys
      var local = new BMap.LocalSearch(this.map, {
        renderOptions: {
          panel: 'r-result'
        },
        pageCapacity: 5
      })
      local.searchInBounds(myKeys, this.map.getBounds())
    },
    // 地图初始化
    mapInit() {
      var _this = this
      this.map = new BMap.Map('map')
      let points
      if (this.lngvalue) {
        points = new BMap.Point(this.lngvalue, this.latvalue)
      } else {
        points = new BMap.Point(114.357946, 30.638706)
      }
      this.map.centerAndZoom(points, 12)
      this.map.enableScrollWheelZoom()
      // status 1创建小区 非1查看小区信息
      // 创建小区通过小区名定位
      // 查看小区通过经纬度定位
      if (this.status == '1') {
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder()
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(this.cmname, function (point) {
          if (point) {
            _this.map.centerAndZoom(point, 16)
            _this.marker = new BMap.Marker(point)
            // _this.loactePoint = { lng: point.lng, lat: point.lat }
            _this.lngvalue = point.lng
            _this.latvalue = point.lat
            _this.map.addOverlay(_this.marker)
          } else {
            // _this.$message({
            //   message: '没有找到该小区',
            //   type: 'warning'
            // })
          }
        }, '武汉市')
      } else {
        var point = new BMap.Point(this.lngvalue, this.latvalue)
        // var points = new BMap.Point(this.loactePoint.lng, this.loactePoint.lat)
        this.marker = new BMap.Marker(point)
        this.map.centerAndZoom(point, 16)
        this.map.addOverlay(this.marker)
      }
      this.pointToImg()

      this.overlays = []
      var overlaycomplete = function (e) {
        _this.overlays.push(e.overlay)
      }
      var styleOptions = {
        strokeColor: 'red', // 边线颜色。
        fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }
      // 实例化鼠标绘制工具
      this.drawingManager = new BMapLib.DrawingManager(_this.map, {
        isOpen: false, // 是否开启绘制模式
        // enableDrawingTool: true, // 是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
          offset: new BMap.Size(5, 5) // 偏离值
        },
        polygonOptions: styleOptions // 多边形的样式
      })
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      this.drawingManager.addEventListener('overlaycomplete', overlaycomplete)
      this.searchArrounding('交通')
    },
    // 改变省
    changeProvince(id) {
      if (this.isFirst) {
        this.ruleForm.city = ''
      }
      if (id) {
        getCityInfo({
          provinceid: id
        }).then(res => {
          this.cityArr = res.data
          if (!this.isFirst && !this.ruleForm.city) {
            this.isFirst++
          }
        })
      }
    },
    // 改变市
    changeCity(value) {
      if (this.isFirst) {
        this.ruleForm.region = ''
        this.$nextTick(() => {
          // 百度地图API功能
          this.map.centerAndZoom(value.split('/')[1], 14) // 用城市名设置地图中心点
        })
      }
      if (!value) {
        this.ruleForm.region = ''
      } else {
        if (value.split('/')[0] !== '420100') {
          this.ruleForm.region = 'a099/val/其他'
        }
        if (!this.isFirst && !this.ruleForm.region) {
          this.isFirst++
        }
      }
    },
    // 区域修改获取片区数据
    changeRegion(value) {
      if (this.isFirst) {
        this.ruleForm2.district = ''
        this.districtData = []
      }
      if (!this.ruleForm.region) {
        this.ruleForm2.district = ''
        this.districtData = []
        return false
      }
      getsubRegion({
        shortKey: this.ruleForm.region.split('/val/')[0]
      })
        .then((response) => {
          this.districtData = response.data
          if (this.status !== '1' && this.subSelectEmpty >= 2) {
            this.ruleForm2.district = ''
          }
          this.subSelectEmpty++
          this.isFirst++
        })
    },
    // 获取页面各种选项基础数据
    getData() {
      // 获取环线数据
      getLooplineDate()
        .then((response) => {
          this.listloopData = response.data
        })
      // 获取环线数据
      fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.functionalarea.getalllist', 'homebaseaction.base.functionalarea.getalllist', {})
        .then((response) => {
          this.newAreaData = response.list
        })
      // 获取父级商圈数据
      fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.tradingareaparent.getalllist', 'homebaseaction.base.tradingareaparent.getalllist', {})
        .then((response) => {
          this.tradeAreaData = response.data
        })
      getUnlimitedpurchasearea({
        disabled: 1,
        pages: 1,
        pagesize: 2000
      }).then(res => {
        if (res.data) {
          this.unLimitArea = res.data
        }
      })
    },
    // 获得商圈子圈数据
    changTradeArea(val) {
      if (this.isFirst) {
        this.tradeAreaSubData = []
        console.log(this.ruleForm2.tradeCircleSub)
        this.ruleForm2.tradeCircleSub = ''
      }
      if (!val) return false
      fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.tradingareaparent.gettradingbyparent', 'homebaseaction.base.tradingareaparent.gettradingbyparent', {
        shortKey: this.ruleForm2.tradeCircle.split('/val/')[0]
      })
        .then((response) => {
          this.tradeAreaSubData = response.data
          if (this.status !== '1' && this.subSelectEmpty >= 2) {
            this.ruleForm2.tradeCircleSub = ''
          }
          this.subSelectEmpty++
        })
    },
    // 创建小区点击上一步
    returnCheck() {
      this.$confirm('已填写信息将全部被清除，是否确认退回上一步？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        router.push({
          path: '/homeworkstation/plot/addcmname'
        })
      }).catch(() => {})
    },
    // 0 创建小区 1修改小区名称及别名 2修改其它基本小区信息
    createPost(editeState) {
      var param, method
      param = JSON.parse(JSON.stringify(this.cmInfoById))
      delete param.tradingArea
      let filterNull = (val) => {
        if (!val) {
          return ''
        } else {
          return val
        }
      }
      this.ruleForm2.tradeCircle = filterNull(this.ruleForm2.tradeCircle)
      this.ruleForm2.tradeCircleSub = filterNull(this.ruleForm2.tradeCircleSub)
      let cityArr = this.ruleForm.city.split('/')
      let params = {
        residentialName: sessionStorage.getItem('plotname'),
        address: this.ruleForm.address,
        provinceName: this.$refs.province.selectedLabel,
        provinceId: this.ruleForm.province,
        cityId: cityArr[0],
        cityName: cityArr[1],
        districtId: this.ruleForm.region.split('/val/')[0],
        districtName: this.ruleForm.region.split('/val/')[1],
        baseDistrictSubId: this.ruleForm2.district.split('/val/')[0],
        baseDistrictSubName: this.ruleForm2.district.split('/val/')[1],
        tradingAreaParentId: this.ruleForm2.tradeCircle.split('/val/')[0] || '',
        tradingAreaParentName: this.ruleForm2.tradeCircle.split('/val/')[1] || '',
        tradingAreaId: this.ruleForm2.tradeCircleSub.split('/val/')[0] || '',
        tradingAreaName: this.ruleForm2.tradeCircleSub.split('/val/')[1] || '',
        businessZoneId: this.ruleForm2.newArea.split('/val/')[0],
        businessZoneName: this.ruleForm2.newArea.split('/val/')[1],
        xSite: this.lngvalue,
        ySite: this.latvalue,
        points: JSON.stringify(this.path),
        loopLineId: this.listloop,
        pinyin: this.ruleForm3.spell,
        usedLandArea: this.ruleForm3.areanum,
        totalFloorArea: this.ruleForm3.buildingArea,
        residentialInfocol: JSON.stringify(this.residentialInfocolFilter(this.ruleForm3.residentialInfocol)),
        nolimitAreaId: this.ruleForm2.nolimitAreaId,
        nolimitAreaName: this.$refs.nolimit.$children[0].selectedLabel
      }
      if (editeState === 1) {
        params.residentialName = this.ruleForm4.cmname
        params.residentialNickName = this.cmNicknames
        params.address = this.cmInfoById.address
        params.pinyin = this.cmInfoById.pinyin
        params.districtId = this.cmInfoById.districtId
        params.districtName = this.cmInfoById.districtName
        params.id = this.cmInfoById.id
        params.auditStatus = '-1'
      }
      param = Object.assign(param, params)
      if (editeState === 0) {
        param.residentialName = this.cmname
      } else {
        param.auditStatus = '-1'
      }

      if (this.status == '1') { // status 1创建小区
        method = 'homeworkstation.base.residentialinfo.add'
      } else {
        method = 'homeworkstation.base.residentialinfo.modify'
        param.id = sessionStorage.getItem('plotid')
      }
      console.log(param)
      var _this = this
      fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', method, param)
        .then((response) => {
          if (response.data === 1) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            // 创建
            if (this.status == '1') {
              router.push({
                path: '/homeworkstation/plot/plotlist'
              })
            }
            if (editeState === 1) {
              this.getcmDatabyid()
              this.$parent.$parent.$children[0].plotName = this.ruleForm4.cmname
              sessionStorage.setItem('plotname', this.ruleForm4.cmname)
            } else if (editeState === 2) {
              this.getcmDatabyid()
            }
          }
        })
        .catch(function (err) {
          _this.$message.error(err)
        })
    },
    // 处理小区来源多选框数据
    residentialInfocolFilter(value) {
      let filterSource = []
      if (Object.prototype.toString.call(value) === '[object String]') {
        if (value) {
          JSON.parse(value).forEach(v => {
            filterSource.push(v.id)
          })
        }
      } else if (Object.prototype.toString.call(value) === '[object Array]') {
        let sourceString = value.join(',')
        this.sourceList.forEach(v => {
          if (sourceString.indexOf(v.dictItemCode) !== -1) {
            filterSource.push({
              id: v.dictItemCode,
              value: v.dictItemValue
            })
          }
        })
      }
      return filterSource
    },
    conss() {
      console.log(this.ruleForm2.tradeCircleSub)
    },
    // 获取小区基本信息
    getcmDatabyid() {
      fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialinfo.getResidentialInfo', {
        id: sessionStorage.getItem('plotid')
      })
        .then((response) => {
          if (response.data) {
            var data = response.data
            this.cmInfoById = data
            if (data.residentialNickName && data.residentialNickName.split(',').length > 0) {
              this.ruleForm4.residentialNickName = []
              data.residentialNickName.split(',').forEach((e) => {
                this.ruleForm4.residentialNickName.push({
                  name: e
                })
              })
            }
            this.lngvalue = data.xSite || ''
            this.latvalue = data.ySite || ''
            this.ruleForm.province = data.provinceId
            this.ruleForm.city = data.cityId + '/' + data.cityName
            this.ruleForm.address = data.address
            this.ruleForm.region = data.districtId + '/val/' + data.districtName
            this.ruleForm4.cmname = data.residentialName
            this.ruleForm3.buildingArea = data.totalFloorArea
            this.ruleForm3.areanum = data.usedLandArea
            this.ruleForm3.spell = data.pinyin
            this.ruleForm3.residentialInfocol = this.residentialInfocolFilter(data.residentialInfocol)
            if (data.tradingArea) {
              data.tradingArea = JSON.parse(data.tradingArea)
              if (data.tradingArea.areaShortKey) {
                this.ruleForm2.tradeCircle = data.tradingArea.areaShortKey + '/val/' + data.tradingArea.areaName
              }
              if (data.tradingArea.areaSubShortKey) {
                this.ruleForm2.tradeCircleSub = data.tradingArea.areaSubShortKey + '/val/' + data.tradingArea.areaSubName
              }
            }
            if (data.businessZone) {
              data.businessZone = JSON.parse(data.businessZone)
              this.ruleForm2.newArea = data.businessZone.shortKey + '/val/' + data.businessZone.businessZoneName
            }
            if (data.noLimitArea) {
              this.ruleForm2.nolimitAreaId = JSON.parse(data.noLimitArea).shortKey
              this.ruleForm2.nolimitAreaName = JSON.parse(data.noLimitArea).nolimitAreaName
            }
            this.ruleForm2.district = data.baseDistrictSubId + '/val/' + data.baseDistrictSubName
            this.listloop = data.loopLineId
            if (data.points) {
              this.drawImgArr = JSON.parse(data.points)
            }
          }
        })
        .then(() => {
          this.mapInit()
        })
    },
    // 添加小区别名
    addcmNickname() {
      this.ruleForm4.residentialNickName.push({
        name: ''
      })
    },
    // 小区名称的修改
    editecmName() {
      this.$refs['ruleForm4'].validate((valid) => {
        if (valid) {
          var nicknameArr = []
          this.ruleForm4.residentialNickName.forEach((val) => {
            if (val.name) {
              nicknameArr.push(val.name)
            }
          })
          this.cmNicknames = nicknameArr.join(',')

          if (this.sameVerify) {
            this.$message.error('小区名称已存在')
          } else {
            if (this.ruleForm4.cmname === sessionStorage.getItem('plotname')) {
              this.createPost(1)
            } else {
              this.$confirm('是否确认修改小区名称?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.createPost(1)
              })
            }
          }
        }
      })
    },
    // 精确校验小区名是否存在
    verifyCmname() {
      if (this.ruleForm4.cmname && this.ruleForm4.cmname != sessionStorage.getItem('plotname')) {
        fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialinfo.getByName', {
          name: this.ruleForm4.cmname
        })
          .then((response) => {
            if (response.data === 1) {
              this.sameVerify = false
            }
          })
          .catch((res) => {
            this.$message.error(res)
            if (res === '该名称已存在') {
              this.sameVerify = true
            }
          })
      }
    },
    editeST() {
      this.$refs.support.editeSupportrafic()
    }
  },
  components: {
    supportrafic
  },
  props: ['status'],
  mounted() {
    if (this.status == '1') {
      this.$nextTick(function () {
        this.cmname = this.$route.query.keyname
        this.mapInit()
      })
      this.ruleForm.province = '420000'
      this.ruleForm.city = '420100/武汉市'
    } else {
      this.getcmDatabyid()
    }
  },
  created() {
    getRegionData({
      dictItemCode: '42_01',
      rank: '3'
    }).then((response) => {
      this.getRegionData = response.data
    })
    fdcDict(process.env.API_ROOT_DICT, 'residentialfrom').then(data => {
      this.sourceList = data
    })
    getProvinceInfo().then(res => {
      this.provinceArr = res.data
    })
    this.getData()
  }
}
