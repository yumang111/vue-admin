import {
  recommendHousingType,
  getHousingTypeListInfo
} from './houseType.api'
import {
  getoldhouseBasedata
} from '@/api/api'
import addForm from '../addHouseType/addForm/addForm.vue'
import mixins from '@/mixins/mixins'
export default {
  data() {
    return {
      saleStatus: null,
      orientation: null,
      shortkey: null,
      sellinfoList: [],
      houseOrientationList: [],
      houseStyleList: [],
      value: '',
      tableData: [],
      currentRow: null,
      plotid: '',
      title: '户型信息',
      formInfo: {}, // 单个户型信息
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      loading: false,
      formId: ''
    }
  },
  mixins: [mixins],
  methods: {
    dictTransform(value, dictName) {
      let res = this[dictName].find(v => v.dictItemCode === value)
      return res ? res.dictItemValue : ''
    },
    search() {
      this.currentPage = 1
      this.getHousingList()
    },
    // 处理每页显示条数
    handleSizeChange(size) {
      this.pageSize = size
      this.getHousingList()
    },
    // 更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getHousingList()
    },
    // 关联
    relevance() {
      this.$router.push('/homeworkstation/plot/plotPortal/buildingInfo')
    },
    // 推荐
    recommend(row, status) {
      this.loading = true
      recommendHousingType({
        id: row.id,
        status: status
      }).then(res => {
        if (res.data === '1') {
          if (!status) {
            this.showInfoMsg('success', '取消推荐成功')
          } else {
            this.showInfoMsg('success', '推荐户型成功')
          }
          this.getHousingList()
        }
      })
    },
    // 重置表格数据
    resetTable() {
      this.getHousingList()
    },
    // 获取单个户型信息
    getAHousingTypeInfo(row) {
      this.formId = row.id
    },
    // 添加新户型
    addHouseType() {
      this.$router.push('/homeworkstation/plot/plotPortal/addHouseType')
    },
    // 获取户型列表信息
    getHousingList() {
      this.loading = true
      getHousingTypeListInfo({
        pages: this.currentPage,
        curpage: this.currentPage,
        pagesize: this.pageSize,
        residentialInfoId: this.plotid,
        sellStatus: this.saleStatus,
        orientation: this.orientation,
        shortkey: this.shortkey
      }).then(res => {
        this.tableData = res.data
        this.loading = false
        this.totalCount = res.totalDatas
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
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
    init() {
      this.getHousingList()
      this.getDropDown()
    }
  },
  components: {
    addForm
  },
  created() {
    this.plotid = sessionStorage.getItem('plotid')
    this.init()
  }
}
