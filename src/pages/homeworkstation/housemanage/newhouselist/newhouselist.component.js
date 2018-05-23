import searchbox from '@/pages/share/searchbox/searchbox.vue'
import houseSouceInfo from './components/house-souce-info/house-souce-info.vue'
import relateHouse from './components/relate-house/relate-house.vue'
import relateBuilding from './components/relate-building/relate-building.vue'
import relateHouseType from './components/relate-house-type/relate-house-type.vue'
import newApi from './newhouselist.api'
import deletedialog from '@/pages/share/deletedialog/deletedialog.vue'
import deleteLog from '@/pages/share/delete-log/delete-log.vue'

export default {
  data() {
    return {
      throttle: true,
      loading: false,
      multipleSelection: [], // 下架房源数组
      newHouseList: [],
      keyWord: '', // 关键字
      districtId: '', // 行政区
      districtSubId: '', // 板块
      tagIds: '', // 标签id
      pricemin: '',
      pricemax: '',
      pages: 1,
      curpage: 1,
      pagesize: 10,
      totalDataNum: 0,
      fullscreenLoading: false,
      houseSourceId: '', // 房源id
      unitId: '',
      residentialId: '', // 小区ID
      houseSource: {},
      isBind: '',
      checkedNum: 0,
      checkedHouseId: '',
      houseTypeId: '',
      saleStatusShow: '',
      isShield: '',
      isShowDetail: false, // 是否显示具体房源信息
      loopLineId: '',
      isLimit: '', // 限购
      propertySubType: '',
      acreagemin: '',
      acreagemax: '',
      curRowData: {}
    }
  },
  methods: {
    // 获取新房列表表格数据
    getNewHouseDataList() {
      this.loading = true
      this.$refs.relateHouseType.labels = []
      this.$refs.relateHouseType.imgList = []
      this.$refs.relateHouse.relatedResInfo = {}
      newApi
        .getNewHouseList({
          keyWord: this.keyWord,
          districtId: this.districtId,
          districtSubId: this.districtSubId,
          tagIds: this.tagIds,
          pricemin: this.pricemin || '',
          pricemax: this.pricemax || '',
          acreagemin: this.acreagemin || '',
          acreagemax: this.acreagemax || '',
          pages: this.curpage,
          pagesize: this.pagesize,
          saleStatusShow: this.saleStatusShow,
          isShield: this.isShield,
          loopLineId: this.loopLineId,
          isLimit: this.isLimit,
          propertySubType: this.propertySubType
        })
        .then(res => {
          this.loading = false
          if (res && res.data) {
            this.newHouseList = res.data
            this.totalDataNum = res.resdto.totaldatas
            if (res.data.length) {
              this.checkedHouseId = res.data[0].id
              this.houseTypeId = res.data[0].residentialInfoUnitId
              this.residentialId = res.data[0].residentialInfoUnitId
              this.curRowData = res.data[0]
              this.getHouseDetailData(res.data[0].id, res.data[0].unitId)
              if (this.$refs.relateHouse) {
                this.$refs.relateHouse.getRelatedResInfo(
                  res.data[0].residentialInfoFrontId
                )
              }
              this.isShowDetail = true
            }
          }
        }).catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    tableRowClassName(row, index) {
      if (index === this.checkedNum) {
        return 'cur-row'
      }
    },
    handleCurrentChange(val) {
      this.curpage = val
      this.getNewHouseDataList()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getNewHouseDataList()
    },
    getHouseDetailData(id, unitId) {
      newApi
        .getHouseDetailById({
          id: id,
          unitId: unitId
        })
        .then(res => {
          if (res && res.data) {
            this.isBind = res.isBind
            console.log(res.data, '房源信息')
            this.houseSource = res.data
            if (!this.houseSource.houseTitle) {
              // 房源标题默认值
              this.houseSource.houseTitle = `${this.curRowData
                .residentialName || ''} ${this.curRowData.houseStyleName ||
                ''}${this.curRowData.buildingShow
                ? this.curRowData.buildingShow + '栋'
                : ''}${this.curRowData.unitShow
                ? this.curRowData.unitShow + '单元'
                : ''}${this.curRowData.floor
                ? this.curRowData.floor + '层'
                : ''}${this.curRowData.roomShow
                ? this.curRowData.roomShow + '号'
                : ''}`
            }
            if (!this.houseSource.preOrderCount) {
              this.houseSource.preOrderCount = ''
            }
          }
        })
        .catch(() => {})
    },
    // 点击表格行 获取详情
    rowClick(row, event, column) {
      // this.fullscreenLoading = true
      this.checkedHouseId = row.id
      this.curRowData = row
      // this.houseSourceId = row.id
      // this.unitId = row.unitId
      this.residentialId = row.residentialInfoFrontId || ''
      this.houseTypeId = row.residentialInfoUnitId || ''
      this.$refs.relateHouseType.labels = []
      this.$refs.relateHouseType.imgList = []
      this.newHouseList.forEach((val, index) => {
        if (this.checkedHouseId === val.id) {
          this.checkedNum = index
        }
      })
      // if (row.residentialInfoUnitId) {
      //   this.$refs.relateHouseType.houseTypeData = {}
      // }
      this.getHouseDetailData(row.id, row.unitId)
    },
    // 上架
    uporUp(rowData) {
      if (this.throttle) {
        this.throttle = false
        newApi
          .getHouseUporDownStatus({
            id: rowData.id,
            unitId: rowData.unitId,
            flag: 'up'
          })
          .then(res => {
            this.throttle = true
            if (res && res.data === 1) {
              this.$message({
                message: '已上架',
                type: 'success'
              })
              this.getNewHouseDataList()
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
    // 下架
    uporDown(rowData) {
      this.multipleSelection[0] = rowData
      this.$refs.deletedialog.deleteDialogshow = true
    },
    reset() {
      this.checkedHouseId = ''
      this.checkedNum = 0
      this.isShowDetail = false
      this.newHouseList = []
      this.totalDataNum = 0
      this.getNewHouseDataList()
    }
  },
  mounted() {
    this.getNewHouseDataList()
  },
  created() {},
  components: {
    searchbox,
    houseSouceInfo,
    relateHouse,
    relateBuilding,
    relateHouseType,
    deletedialog,
    deleteLog
  }
}
