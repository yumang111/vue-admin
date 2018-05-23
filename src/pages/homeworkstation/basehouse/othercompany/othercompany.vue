<template>
  <div>
    <h1 class="header--title">
      其他公司
      <div class="f-r">
        <el-button type="danger" @click="addCompany">添加公司</el-button>
      </div>
    </h1>
    <div class="othercompany_wrap">
      <el-row :gutter="10" class="othercompany_search" style="marginRight:0px">
        <el-col :md="3">
          <el-select clearable v-model="companyType" placeholder="不限公司类">
            <el-option label="代理商" value="1"></el-option>
            <el-option label="投资商" value="2"></el-option>
            <el-option label="景观设计" value="3"></el-option>
            <el-option label="施工单位" value="4"></el-option>
            <el-option label="建筑设计" value="5"></el-option>
            <el-option label="品牌公寓代理商" value="6"></el-option>
          </el-select>
        </el-col>
        <el-col :md="3">
          <el-autocomplete :trigger-on-focus='false' v-model="companyName" :props='props' :fetch-suggestions="querySearchAsync" placeholder="请输入关键词搜索"></el-autocomplete>
        </el-col>
        <el-col :md="2" style="marginLeft:10px">
          <el-button @click="searchCompany" type="primary">查询</el-button>
        </el-col>
      </el-row>
      <el-table @header-click='sort' :data='tableData' :border='false' style="width: 100%">
        <el-table-column prop='companyTypeName' label="公司类型" width="160"></el-table-column>
        <el-table-column class="cursor" prop='companyName' label="公司名称" width="200"></el-table-column>
        <el-table-column prop='descInfo' label="简介描述"></el-table-column>
        <el-table-column label-class-name='sortable__companyUse' prop='usedCount' label="使用次数↓" width="100"></el-table-column>
        <el-table-column label-class-name='sortable__companyClick' prop='clickedCount' label="点击次数↓" width="100">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <div @click="editCompany(scope.row)" title='编辑' class="othercompany_table_iconBtn">
              <i class="iconfont icon-bianji icon-btn"></i>
            </div>
            <template v-if='scope.row.disabled == "1"'>
              <div @click="disableCompany(scope.row)" title='禁用' class="othercompany_table_iconBtn">
                <i class="iconfont icon-jinzhi icon-btn"></i>
              </div>
            </template>
            <template v-else>
              <div @click="disableCompany(scope.row)" title='启用' class="othercompany_table_iconBtn">
                <i class="icon-chongxinqiyong icon-btn iconfont"></i>
              </div>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="block paginationStyle">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog v-if="dialogFormVisible" size="tiny" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref='form'>
        <el-row>
          <el-col :md="16">
            <el-form-item prop="companyType" required label="公司类型：" :label-width="formLabelWidth">
              <el-select clearable :value="form.companyType" v-model="form.companyType" placeholder="公司类型">
                <el-option label="代理商" value="1"></el-option>
                <el-option label="投资商" value="2"></el-option>
                <el-option label="景观设计" value="3"></el-option>
                <el-option label="施工单位" value="4"></el-option>
                <el-option label="建筑设计" value="5"></el-option>
                <el-option label="品牌公寓代理商" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="companyName" required label-position='left' label="公司名称：" :label-width="formLabelWidth">
          <el-input v-model="form.companyName" placeholder="50字以内"></el-input>
        </el-form-item>
        <el-form-item prop="url" label-position='left' label="文章链接：" :label-width="formLabelWidth">
          <el-input v-model="form.url" placeholder="http://"></el-input>
        </el-form-item>
        <el-form-item prop="descInfo" label-position='left' label="公司简介：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.descInfo" placeholder="400字以内"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width:120px" type="primary" @click="confirm('form')">保存</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>
<script src='./othercompany.js'></script>
<style lang='scss' src="./othercompany.scss" scoped></style>