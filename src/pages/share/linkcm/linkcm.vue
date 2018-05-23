<template>
  <div class="linkcm-container">
    <el-dialog class="dialog-wraper-link" title="关联小区" :visible.sync="dialogshow" @close="clearData">
      <div class="link-wraper">
        <el-row>
          <el-col :span="18">
            <el-input @keyup.enter.native='queryCm' v-model="linkwords" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button class="f-r" type="primary" @click="queryCm">查询</el-button>
          </el-col>
        </el-row>
        <el-table height="260" :data="linkData" class="linkdata-table" :row-class-name="tableRowClassName" @row-click="clickRow"
          style="width: 100%">
          <el-table-column prop="residentialName" label="小区名称" width="160">
          </el-table-column>
          <el-table-column prop="districtName" label="区域" width="96">
          </el-table-column>
          <el-table-column prop="districtSubName" label="片区" width="96">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
        <!-- <el-pagination class="paginationStyle" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage"
          :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination> -->
      </div>

      <!--<span>这是一段信息</span>-->
      <span slot="footer" class="dialog-footer linkdata-footer">
        <el-button @click="dialogshow = false">取 消</el-button>
        <el-button :disabled="!cmId" type="primary" @click="linkcm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script src="./linkcm.js"></script>
<style src="./linkcm.scss" lang="scss"></style>
