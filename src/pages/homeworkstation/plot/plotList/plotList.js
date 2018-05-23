import searchbox from '@/pages/share/searchbox/searchbox.vue'
import { fdcHttp } from 'fdc-common/http'

export default {
  data() {
    return {
      loading: false,
      cmlistData: [],
      housekeyword: '',
      curpage: 1,
      pagesize: 10,
      searchparam: {},
      totalDataNum: 0
    }
  },
  components: {
    searchbox
  },
  // props: ['listtype'],
  methods: {
    // 获取小区列表数据
    getCmlistData(condition) {
      this.loading = true
      this.searchparam.currentPage = this.curpage
      this.searchparam.rowsPerPage = this.pagesize
      fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialinfo.getlist', this.searchparam)
        .then(res => {
          this.loading = false
          this.cmlistData = res.data
          this.totalDataNum = res.totalDatas
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res)
        })
    },
    // 审核操作 审核状态:-2:被驳回,-1:未提交，0已提交，1已审核,2已下架
    auditStatusAct(id, statusnum) {
      var param = {
        id: id,
        auditStatus: statusnum
      }
      this.loading = true
      fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialinfo.isAudited', param)
        .then(res => {
          if (res.data === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getCmlistData()
          } else {
            this.$message.error('操作失败')
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 是否推荐:0否1是
    isRecommendAct(id, recommendnum) {
      var param = {
        id: id,
        isRecommend: recommendnum
      }
      this.loading = true
      fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialinfo.isRecommend', param)
        .then(res => {
          this.getCmlistData()
        }).catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getCmlistData()
    },
    handleCurrentChange(val) {
      this.curpage = val
      this.getCmlistData()
    },
    setcmbase(id, name) {
      sessionStorage.setItem('plotid', id)
      sessionStorage.setItem('plotname', name)
      window.open('#/homeworkstation/plot/plotPortal/baseInfo')
    }
  },
  mounted() {
    this.getCmlistData()
  }
}
