<template>
  <div>
    <div class="trafficAdd">
      <el-row>
        <el-col :span='4'>
          <el-input @keyup.enter.native='searchSubways' placeholder="请输入内容" v-model="subwayName"></el-input>
        </el-col>
        <el-col class="trafficAdd__search" :span='2'>
          <el-button @click="searchSubways" type="primary">查询</el-button>
        </el-col>
        <div class="f-r">
          <el-button :loading="!throttle" @click='addSubways' type="primary">添加</el-button>
        </div>
      </el-row>
    </div>
    <el-table @selection-change="handleSelectionChange" border ref="multipleTable" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="48"></el-table-column>
      <el-table-column property="subwayLinename" label="线路名称" width="108"></el-table-column>
      <el-table-column property="subwayName" label="途径站点"></el-table-column>
    </el-table>
    <el-pagination class='paginationStyle' @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage" :page-sizes="[10, 15, 20, 25]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
  </div>
</template>
<script>
import {
  getSubwaylinesInfo,
  getSubwaybylineidsInfo,
  addstationInfo
} from '../traffic/traffic.api.js'
import mixins from '@/mixins/mixins'
export default {
  data() {
    return {
      throttle: true,
      tableData: [],
      plotid: '',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      subwayName: '',
      multipleSelection: []
    }
  },
  methods: {
    addSubways() {
      this.throttle = false
      if (!this.multipleSelection.length) {
        this.showInfoMsg('info', '至少选择一个地铁线')
        this.throttle = true
        return false
      }
      let filter = []
      this.multipleSelection.forEach(v => {
        filter.push(v.lineId)
      })
      getSubwaybylineidsInfo({
        subwayName: this.subwayName,
        lineids: filter.join(',')
      }).then(res => {
        let stations = {
          stations: res.data
        }
        addstationInfo({
          stations: JSON.stringify(stations),
          residentialInfoId: this.plotid
        }).then(res => {
          this.throttle = true
          if (res.data === 1) {
            this.showInfoMsg('success', '添加站点成功')
            this.$router.push('/homeworkstation/plot/plotPortal/traffic')
          }
        }).catch(err => {
          this.throttle = true
          console.log(err)
        })
      }).catch(err => {
        this.throttle = true
        console.log(err)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    searchSubways() {
      this.getSubwaylinesList(this.subwayName)
    },
    getSubwaylinesList(subwayName) {
      let param = {
        subwayName: subwayName,
        residentialInfoId: this.plotid,
        currentPage: this.currentPage,
        rowsPerPage: this.pageSize
      }
      getSubwaylinesInfo(param).then(res => {
        this.totalCount = res.totalDatas
        this.tableData = res.data
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSubwaylinesList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSubwaylinesList()
    },
    toTrafficAdd() {
      this.$router.push('/homeworkstation/plot/plotPortal/trafficAdd')
    }
  },
  mixins: [mixins],
  created() {
    this.plotid = sessionStorage.getItem('plotid')
    this.getSubwaylinesList()
  }
}

</script>
<style lang='scss' src='./traffic-add.scss'></style>
