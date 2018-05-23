import router from '@/router/index'
import { fdcHttp } from 'fdc-common/http'
export default {
  data() {
    return {
      cmname: '',
      cmnameArr: [],
      checkCMname: false,
      curpage: 1,
      loadmore: false,
      totalNum: 0,
      cmnameLast: '',
      loadFlag: false
    }
  },
  methods: {
    // 核名按钮
    onSubmit() {
      if (this.cmname.trim() && this.cmname.trim().length < 26) {
        this.loadFlag = true
        this.cmnameArr = []
        this.curpage = 1
        this.cmnameLast = this.cmname
        this.getCmAssociateData()
      } else if (this.cmname.trim().length >= 26) {
        this.$message({
          message: '小区名字不能超过25位',
          type: 'warning'
        })
      } else {
        this.$message({
          message: '小区名字不能为空',
          type: 'warning'
        })
      }
    },
    // 下一步按钮
    nextStep() {
      let checkSame = false
      if (this.cmnameArr.length > 0) {
        console.log(this.cmnameLast)
        this.cmnameArr.forEach(e => {
          if (this.cmnameLast === e.residentialName) {
            checkSame = true
          }
        })
      } else {
        checkSame = false
      }
      if (!checkSame) {
        router.push({ path: '/homeworkstation/plot/cmlocate', query: { 'keyname': this.cmnameLast } })
      } else {
        this.$message({
          message: '不能创建同名小区',
          type: 'error'
        })
      }
    },
    // 取消按钮
    cancleBtn() {
      this.checkCMname = false
      this.cmnameArr = []
      this.curpage = 1
      this.cmname = ''
    },
    // 更多
    btnloadmore() {
      this.curpage++
      this.getCmAssociateData()
    },
    // 获取小区名称联系查询数据
    getCmAssociateData() {
      var params = {
        residentialName: this.cmnameLast,
        currentPage: this.curpage,
        rowsPerPage: 20
      }
      fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialinfo.getlist', params)
        .then(res => {
          this.cmnameArr = this.cmnameArr.concat(res.data)
          if (res.totalCount > this.curpage) {
            this.loadmore = true
          } else {
            this.loadmore = false
          }
          this.checkCMname = true
          this.totalNum = res.totalCount
          this.loadFlag = false
        })
    }
  },
  mounted() {

  }
}
