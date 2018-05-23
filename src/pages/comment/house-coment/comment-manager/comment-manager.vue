<style lang="scss" scoped>
.text-center {
  text-align: center;
}
.form{
  margin-top: 20px;
}
.operate{
  vertical-align: super;
  margin-right: 15px;
}
</style>

<template>
  <div class="page-container">
    <el-row>
      <el-form :inline="true" :model="formInline" class="form">
      <el-form-item label="楼盘名：">
        <el-input v-model="formInline.houseName" placeholder="楼盘名："></el-input>
      </el-form-item>
      <el-form-item label="点评时间：">
        <el-date-picker
          v-model="value6"
          type="daterange"
          placeholder="选择日期范围">
        </el-date-picker>
      </el-form-item>
       <el-form-item label="关键字：">
        <el-input v-model="formInline.keyWords" placeholder="关键字："></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      </el-form>
    </el-row>
    <el-row>
       <el-col :span="10">
          <el-radio-group class="tab__box" size='large' v-model="tabelTabIndex">
            <el-radio-button label="0">待审核</el-radio-button>
            <el-radio-button label="1">已通过</el-radio-button>
            <el-radio-button label="2">已删除</el-radio-button>
            <el-radio-button label="3">被举报</el-radio-button>
          </el-radio-group>
       </el-col>
      <el-col :span="10">
        <span class="operate">批量操作</span>
         <el-radio-group class="tab__box" size='large' v-model="tabelTabIndex2">
            <el-radio-button label="0">置顶</el-radio-button>
            <el-radio-button label="1">加精</el-radio-button>
            <el-radio-button label="2">删除</el-radio-button>
          </el-radio-group>
      </el-col>
    </el-row>
    <el-row>
    <el-table
        ref="multipleTable"
        :data="tableData3"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="评论对象(楼盘)"
          width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="评分"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="评价"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="address"
          label="配图"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="用户功能"
        >
        <template slot-scope="scope">
          <p class="text-center" @click="viewSpondDialog">
            回复<el-button type="text">（4）</el-button>
          </p>
          <p class="text-center" @click="viewPrasizeDialog">点赞<el-button type="text">（4）</el-button></p>
          <p class="text-center" @click="viewWalkDialog">点踩<el-button type="text">（4）</el-button></p>
          <p class="text-center" @click="viewVoteDialog">举报<el-button type="text">（4）</el-button></p>
        </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="点评人(用户名/昵称)"
          >
        </el-table-column>
        <el-table-column
          prop="address"
          label="点评时间"
          >
        </el-table-column>
        <el-table-column
          prop="address"
          label="状态"
          >
        </el-table-column>
         <el-table-column
          prop="address"
          label="操作"
          >
          <template slot-scope="scope">
            <p class="text-center"><el-button type="text">编辑</el-button></p>
            <p class="text-center"><el-button type="text">删除</el-button></p>
            <p class="text-center"><el-button type="text">取消置顶</el-button></p>
            <p class="text-center"><el-button type="text">取消加精</el-button></p>
          </template>
        </el-table-column>
      </el-table>
      <div class="block f-r">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </el-row> 

    <!-- <comment-dialog :is-show-dialog="isShow" :row-data="rowData"></comment-dialog> -->
     <!-- 回复弹窗start -->
     <el-dialog title="全部回复" :visible.sync="resopndDialog">
        <el-table :data="gridData">
          <el-table-column property="date" label="用户昵称" ></el-table-column>
          <el-table-column property="name" label="点赞时间" ></el-table-column>
          <el-table-column property="name" label="回复对象"></el-table-column>
          <el-table-column property="name" label="回复时间" ></el-table-column>
          <el-table-column property="name" label="操作" ></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 回复弹窗end -->

      <!-- 点赞弹窗start -->
      <el-dialog title="点赞用户" :visible.sync="prasizeDialog">
        <el-table :data="gridData">
          <el-table-column property="date" label="用户名/昵称" ></el-table-column>
          <el-table-column property="name" label="点赞时间" ></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 点赞弹窗end -->

      <!-- 点踩弹窗start -->
      <el-dialog title="点踩用户" :visible.sync="walkDialog">
        <el-table :data="gridData">
          <el-table-column property="date" label="用户名/昵称" ></el-table-column>
          <el-table-column property="name" label="点踩时间" ></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 点踩弹窗end -->

      <!-- 举报弹窗start -->
      <el-dialog title="全部用户" :visible.sync="voteDialog">
        <el-table :data="gridData">
          <el-table-column property="date" label="用户名/昵称" ></el-table-column>
          <el-table-column property="name" label="问题类型" ></el-table-column>
          <el-table-column property="name" label="举报时间" ></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 举报弹窗end -->
  </div>
</template>


<script>
// import commentDialog from './components/comment-dialog.vue'
export default {
  data() {
    return {
      formInline: {
        houseName: '',
        keyWords: ''
      },
      value6: '',
      tabelTabIndex: 0,
      tabelTabIndex2: -1,
      isShow: false,
      rowData: {},
      resopndDialog: false, // 回复弹窗
      prasizeDialog: false, // 点赞弹窗
      walkDialog: false, // 点踩弹窗
      voteDialog: false, // 举报弹窗
      currentPage: 1,
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    viewSpondDialog() {
      this.resopndDialog = true
    },
    viewPrasizeDialog() {
      this.prasizeDialog = true
    },
    viewWalkDialog() {
      this.walkDialog = true
    },
    viewVoteDialog() {
      this.voteDialog = true
    }
  },
  components: {
    // commentDialog
  }
}
</script>
