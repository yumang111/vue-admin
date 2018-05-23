import {
  fdcHttp,
  fdcJsonp
} from 'fdc-common/http'
export default {
  data() {
    return {
      curRow: {},
      dialogshow: false, // 关联小区弹窗是否展示
      linkwords: '', // 关联小区关键词
      linkData: [],
      houseId: '', // 房源id
      cmId: '', // 小区id
      cmname: '', // 小区名
      checkedNum: '',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.queryCm()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryCm()
    },
    clearData() {
      this.linkData = []
      this.linkwords = ''
    },
    // 获取小区名称联系查询数据
    queryCm() {
      this.curRow = {}
      this.cmId = ''
      this.cmname = ''
      this.checkedNum = ''
      // 使用二手房发布联想接口
      var params = {
        name: this.linkwords,
        from: 12,
        rowsPerPage: 30,
        propertyKey: 'w401'
      }
      fdcJsonp(process.env.API_ROOT_HOME, 'homeoldapi.restful.inter.keyword.getResidential', params)
        .then(res => {
          // this.totalCount = res.totalDatas
          this.linkData = res.data
        })
      // var params = {
      //   residentialName: this.linkwords,
      //   currentPage: this.currentPage,
      //   rowsPerPage: this.pageSize
      // }
      // fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialinfo.getlist', params)
      //   .then(res => {
      //     this.totalCount = res.totalDatas
      //     this.linkData = res.data
      //   })
    },
    linkcm() {
      let params = {
        id: this.houseId,
        residentialId: this.cmId,
        residentialName: this.cmname,
        district: this.curRow.districtId,
        districtDesc: this.curRow.districtName,
        districtSub: this.curRow.districtSubId,
        districtSubDesc: this.curRow.districtSubName
      }
      let method = 'homeworkstation.base.housesource.updateById'
      if (this.houseType === '2') {
        method = 'homeworkstation.base.houserent.relateResidential'
      }
      fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', method, params)
        .then(res => {
          if (res.data == 1) {
            this.dialogshow = false
            this.$message({
              message: '关联成功',
              type: 'success'
            })
            if (this.houseType === '1') {
              this.$emit('reset')
            } else {
              this.$emit('reset')
            }
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    clickRow(row, event, column) {
      this.curRow = Object.assign({}, row)
      this.cmId = row.id
      this.cmname = row.residentialName
      this.linkData.forEach((val, index) => {
        if (val.id === this.cmId) {
          this.checkedNum = index
        }
      })
    },
    tableRowClassName(row, index) {
      if (index === this.checkedNum) {
        return 'cur-row'
      }
    }
  },

  props: {
    houseType: {
      type: String
    }
  },
  // props: ['dialogshow'],
  mounted() {
    // console.log(this.dialogshow)
  }
}
