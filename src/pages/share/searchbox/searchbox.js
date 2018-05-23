// import useApi from '@/api/api'

import { fdcJsonp } from 'fdc-common/http'
import checkTag from '@/pages/share/checktag/checktag.vue'
import { getRegionData, getsubRegion, getLooplineDate } from '@/api/api'
import newHouseSale from '@/store/dict.store'
import getDict from '@/pages/share/get-dict/get-dict.vue'
import dict from '@/directives/dict.directive'
export default {
  data() {
    return {
      delState: '',
      tagsId: '',
      // 物业类型
      PropertyType: [],
      Propertyvalue: '',
      // 区域数据
      getRegionData: [],
      regionvalue: '',
      // 片区数据
      districtData: [],
      districtvalue: '',
      // 小区列表状态数据
      statusData: [
        { name: '未通过', value: -2 },
        { name: '未提交', value: -1 },
        { name: '已提交', value: 0 },
        { name: '已审核', value: 1 },
        { name: '已下架', value: 2 },
        { name: '推荐', value: 21 }
        // { name: '取消推荐', value: 20 },

      ],
      statusvalue: '',
      // 二手房列表状态数据
      statusData2: [
        { name: '未发布', value: 0 },
        // { name: '已发布待确认', value: 1 },
        { name: '已发布', value: 2 },
        { name: '已下架', value: 3 }
        // { name: '已发布—自营', value: 4 },
      ],
      // 租房列表状态数据
      statusData3: [
        { name: '未发布', value: 0 },
        { name: '已发布待确认', value: 1 },
        { name: '已发布', value: 2 },
        { name: '已下架', value: 3 }
      ],
      statusvalue2: '',
      // 来源
      origionData: [
        { origionKey: 1, origionName: '个人' },
        { origionKey: 2, origionName: '中介' }
      ],
      origionvalue: '',
      cmTagData: [],
      housekeyword: '',
      lableArr: [
        {
          value: '1',
          name: '高层'
        },
        {
          value: '2',
          name: '电梯房'
        }],
      rootId: '', // 标签分类
      lableValue: '1/val/高层',
      lableSubArr: [],
      lableSubValue: ['1/val/高层'],
      queryCondition: {},
      PriceRangeData: [], // 二手房价格区间
      PriceRangeval: '',
      cmMatched: '',
      cmMatchedData: [
        // 小区名是否匹配
        { value: '0', name: '否' },
        { value: '1', name: '是' }
      ],
      widthNum: 20,
      newHouseSale: newHouseSale.newHouseSaleStatusList,
      newHouseSearch: {
        // saleStatus: '', // 销售状态
        isLimit: '', //  是否限购
        isShield: '', // 上下架状态
        newHouseKeyWord: '', // 新房列表搜索关键字
        saleStatusShow: '', // 销售状态
        loopLineId: '',
        areaValue: '',
        priceValue: ''
      },
      listloopData: []
    }
  },
  props: ['listtype', 'searchtype', 'rentType'],
  directives: {
    dict
  },
  methods: {
    getData() {
      console.log('请求房源')
    },
    getvalue(val, param) {
      val = val.split(param)
      console.log(val)
    },
    splitValue(val) {
      if (val) {
        let arr = val.split('-')
        // if(arr.length ==)
        return arr
      }
    },
    // changeArea(val){
    // },
    // 点击搜索
    // 0-新房 1-小区 2-二手房 3-租房
    querylist() {
      if (this.searchtype === '0') {
        this.$parent.districtId = this.regionvalue // 行政区
        this.$parent.districtSubId = this.districtvalue // 版块
        this.$parent.loopLineId = this.newHouseSearch.loopLineId // 环线
        this.$parent.propertySubType = this.Propertyvalue // 物业类型
        this.$parent.isLimit = this.newHouseSearch.isLimit // 限购
        this.$parent.saleStatusShow = this.newHouseSearch.saleStatusShow // 销售状态
        this.$parent.isShield = this.newHouseSearch.isShield // 是否上架
        this.$parent.keyWord = this.housekeyword // 搜索关键字
        this.$parent.tagIds = this.tagsId
        let areaData = this.splitValue(this.newHouseSearch.areaValue)
        let priceData = this.splitValue(this.newHouseSearch.priceValue)

        if (areaData && areaData.length === 2) {
          this.$parent.acreagemin = areaData[0]
          this.$parent.acreagemax = areaData[1]
        } else if (areaData && areaData.length === 1) {
          if (areaData[0].indexOf('下') !== -1) {
            this.$parent.acreagemax = areaData[0]
            this.$parent.acreagemin = ''
          } else {
            this.$parent.acreagemin = areaData[0]
            this.$parent.acreagemax = ''
          }
        } else {
          this.$parent.acreagemin = ''
          this.$parent.acreagemax = ''
        }
        if (priceData && priceData.length === 2) {
          this.$parent.pricemin = priceData[0]
          this.$parent.pricemax = priceData[1]
        } else if (priceData && priceData.length === 1) {
          if (priceData[0].indexOf('下') !== -1) {
            this.$parent.pricemax = priceData[0]
            this.$parent.pricemin = ''
          } else {
            this.$parent.pricemin = priceData[0]
            this.$parent.pricemax = ''
          }
        } else {
          this.$parent.pricemin = ''
          this.$parent.pricemax = ''
        }
        console.log(this.$parent.pricemin)
        this.$emit('reset')
      } else {
        this.$parent.searchparam.keyWord = this.housekeyword

        if (this.searchtype === '1') {
          // 状态
          this.$parent.searchparam.tagIds = this.tagsId
          this.$parent.searchparam.districtId = this.regionvalue
          this.$parent.searchparam.districtSubId = this.districtvalue
          this.$parent.searchparam.auditStatus = this.statusvalue
          this.$parent.searchparam.property = this.Propertyvalue
          if (this.statusvalue > 10) {
            this.$parent.searchparam.isRecommend = this.statusvalue - 20
            this.$parent.searchparam.auditStatus = ''
          } else {
            this.$parent.searchparam.auditStatus = this.statusvalue
            this.$parent.searchparam.isRecommend = ''
          }
          this.$parent.getCmlistData()
        } else {
          this.$parent.searchparam.tagsIds = this.tagsId
          this.$parent.searchparam.district = this.regionvalue
          this.$parent.searchparam.districtSub = this.districtvalue
          this.$parent.searchparam.infoFromType = this.origionvalue
          this.$parent.searchparam.isRes = this.cmMatched
          this.$parent.searchparam.sqlOrderBy = ''
          this.$parent.searchparam.orderType = ''
          if (this.PriceRangeval) {
            this.$parent.searchparam.pricemin = this.PriceRangeval
              .split('-')[0]
              .substring(2)
            if (this.PriceRangeval.indexOf('-n2') > 0) {
              this.$parent.searchparam.pricemax = this.PriceRangeval
                .split('-')[1]
                .substring(2)
            } else {
              this.$parent.searchparam.pricemax = ''
            }
          } else {
            this.$parent.searchparam.pricemin = ''
            this.$parent.searchparam.pricemax = ''
          }
          if (this.searchtype === '2' || this.searchtype === '3') {
            this.$parent.searchparam.delState = this.delState
            switch (this.statusvalue2) {
              case 0: // 未发布
                this.$parent.searchparam.publishState = 1
                this.$parent.searchparam.auditState = 1
                break
              case 1: // 已发布-待确认
                this.$parent.searchparam.publishState = 2
                this.$parent.searchparam.auditState = 1
                break
              case 2: // 已发布
                this.$parent.searchparam.publishState = 2
                this.$parent.searchparam.auditState = 3
                break
              case 3: // 已下架
                this.$parent.searchparam.publishState = 1
                this.$parent.searchparam.auditState = 3
                break
              default: // 未选择状态时
                this.$parent.searchparam.publishState = ''
                this.$parent.searchparam.auditState = ''
                break
            }
            this.$emit('reset')
          }
        }
      }
    },
    getbaseData() {
      // 获取物业类型数据
      fdcJsonp(
          process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.propertytype.listdecorate',
          'homebaseaction.base.propertytype.listdecorate', { rowsPerPage: 50 }
        )
        .then(response => {
          this.PropertyType = response.data
        })
      var param = {
        dictItemCode: '42_01',
        rank: '3'
      }
      // 获取区域数据
      getRegionData(param).then(response => {
        this.getRegionData = response.data
      })
      let priceMethod = ''
      if (this.searchtype == '2') {
        priceMethod = 'homebaseaction.base.housePriceRange.getlist'
      } else {
        priceMethod = 'homebaseaction.base.rentPriceRange.getlist'
      }

      // 获取二手房价格区间条件
      fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/' + priceMethod, priceMethod, {})
        .then(response => {
          this.PriceRangeData =
            response.housePriceRangeList || response.rentPriceRangeList
          // this.cmTagData = response.list
        })
    },
    getDistrict() {
      this.districtvalue = ''
      // 获得片区数据
      if (!this.regionvalue) {
        this.districtData = []
        return false
      }
      getsubRegion({ shortKey: this.regionvalue }).then(response => {
        this.districtData = response.data
      })
    },
    dealData(arr) {
      let dataArr = []
      arr.forEach(function (v) {
        dataArr.push(v.id)
      })
      return dataArr.join(',')
    },
    getloopLineData() {
      getLooplineDate()
        .then(response => {
          console.log(response)
          this.listloopData = response.data
        })
    }
  },
  components: {
    getDict,
    checkTag
  },
  mounted() {
    this.getbaseData()
    if (
      this.searchtype === '2' ||
      this.searchtype === '3' ||
      this.searchtype === 0
    ) {
      this.widthNum = 24
    }
    if (this.searchtype == '3') {
      this.origionData = [
        { origionKey: 1, origionName: '个人' },
        { origionKey: 2, origionName: '中介' }
        // { origionKey: 3, origionName: '经纪人' }

      ]
      this.statusData2 = [
        { name: '未发布', value: 0 },
        { name: '已发布待确认', value: 1 },
        { name: '已发布', value: 2 },
        { name: '已下架', value: 3 }

      ]
    }
  },
  created() {
    this.getloopLineData()
    switch (this.searchtype) {
      case '0':
        this.rootId = '4'
        break
      case '1':
        this.rootId = '1'
        break
      case '2':
        this.rootId = '5'
        break
      case '3':
        this.rootId = '6'
        break
    }
  }
}
