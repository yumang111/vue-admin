<template>
  <div>
    <div class="traffice__handle">
      <el-button type="primary" @click="deleteSubway('这些')">删除</el-button>
    <el-button type="primary" @click="toTrafficAdd">添加</el-button>
    </div>
    <el-table class="traffice__table" @selection-change="handleSelectionChange" align='center' border ref="multipleTable" :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="48"></el-table-column>
        <el-table-column property="residentialName" label="小区名称"></el-table-column>
        <el-table-column property="lineName" label="轨道线路"></el-table-column>
        <el-table-column property="stationName" label="轨道站点"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <i @click.prevent.stop="deleteSubway('该',scope.row)" title="删除" class="icon-btn iconfont icon-shanchu"></i>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="paginationStyle" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
  </div>
</template>
<script>
import {
  getTrafficInfo,
  deletestationInfo
} from './traffic.api.js'
import mixins from '@/mixins/mixins'
export default {
  data() {
    return {
      tableData: [],
      plotid: '',
      plotname: '',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteSubway(msg, row) {
      let idArr = []
      if (row) {
        idArr.push(row.id)
      } else {
        if (!this.multipleSelection.length) {
          this.showInfoMsg('info', '至少选择一个站点')
          return false
        }
        this.multipleSelection.forEach(v => {
          idArr.push(v.id)
        })
      }
      this.$confirm('是否删除' + msg + '站点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deletestationInfo({
          residentialInfoId: this.plotid,
          id: idArr.join(',')
        })
      }).then(res => {
        if (res.data === '1') {
          this.showInfoMsg('success', '删除站点成功')
          this.getTrafficList()
        }
      }).catch(err => {
        if (err === 'cancel') {
        } else {
          this.showInfoMsg('error', err)
        }
      })
    },
    getTrafficList() {
      let param = {
        residentialInfoId: this.plotid,
        currentPage: this.currentPage,
        rowsPerPage: this.pageSize
      }
      getTrafficInfo(param).then(res => {
        this.totalCount = res.totalDatas
        this.tableData = res.data
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTrafficList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTrafficList()
    },
    toTrafficAdd() {
      this.$router.push('/homeworkstation/plot/plotPortal/trafficAdd')
    }
  },
  mixins: [mixins],
  created() {
    this.plotid = sessionStorage.getItem('plotid')
    this.plotname = sessionStorage.getItem('plotname')
    this.getTrafficList()
  }
}
</script>
<style lang='scss' scoped>
.traffice {
  &__handle {
    margin-bottom: 20px;
    float: right;
  }
}
</style>