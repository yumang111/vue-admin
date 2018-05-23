<template>
  <div>
    <el-row :gutter="10" style="marginRight:0">
      <el-col :md="3">
        <el-select clearable v-model="saleStatus" placeholder="销售状态">
          <el-option v-for="item in sellinfoList" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="3">
        <el-select clearable v-model="orientation" placeholder="朝向">
          <el-option v-for="item in houseOrientationList" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="3">
        <el-select clearable v-model="shortkey" placeholder="几居室">
          <el-option v-for="item in houseStyleList" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="3" style="marginLeft:10px;">
        <el-button @click="search" type="primary">查询</el-button>
      </el-col>
      <div class="f-r">
        <el-button type="danger" @click="addHouseType">添加户型</el-button>
      </div>
    </el-row>
    <div class="houseType__tableTit">
      <div class="houseType__tableTit--handle">
        <span class="icon-btn-item">
          <i class="iconfont icon-guanlian"></i>关联</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-zhiding"></i>推荐</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-quxiaozhiding"></i>取消推荐</span>
      </div>
    </div>
    <div class="houseType__table">
      <el-table v-loading="loading" @row-click='getAHousingTypeInfo' :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column property="housingImgId" label="户型图" width="140">
          <template slot-scope="scope">
            <img class="houseType__img" :src="scope.row.housingImgSrc" alt="">
          </template>
        </el-table-column>
        <el-table-column property="housingTypeName" label="户型名称" width="120"></el-table-column>
        <el-table-column property="sellStatus" label="销售状态" width="100">
          <template slot-scope="scope">
            <div v-html="dictTransform(scope.row.sellStatus,'sellinfoList')"></div>
          </template>
        </el-table-column>
        <el-table-column property="avagPrice" label="户型均价" width="100"></el-table-column>
        <el-table-column property="orientation" label="朝向" width="80">
          <template slot-scope="scope">
            <div v-html="dictTransform(scope.row.orientation,'houseOrientationList')"></div>
          </template>
        </el-table-column>
        <el-table-column property="shortkey" label="几居室" width="80">
          <template slot-scope="scope">
            <div v-html="dictTransform(scope.row.shortkey,'houseStyleList')"></div>
          </template>
        </el-table-column>
        <el-table-column property="roomTypeName" label="房型" width="100"></el-table-column>
        <el-table-column property="coveredArea" label="建筑面积" width="100"></el-table-column>
        <el-table-column property="insideSpace" label="套内面积" width="100"></el-table-column>
        <!-- <el-table-column property="houseNum" label="楼栋/单元/房号" width="160">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.houseAddress" :key="index">{{item}}</div>
          </template>
        </el-table-column> -->
        <el-table-column property="status" label="状态" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.recommend === '1'">已推荐</div>
            <div v-else>正常</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.recommend === '0'" class="houseType__nowrap">
              <i title='关联' @click.stop.prevent="relevance" class="icon-btn iconfont icon-guanlian"></i>
              <i title='推荐' @click.stop.prevent="recommend(scope.row,1)" class="icon-btn iconfont icon-zhiding"></i>
            </div>
            <div v-else class="houseType__nowrap">
              <i title='关联' @click.stop.prevent="relevance" class="icon-btn iconfont icon-guanlian"></i>
              <i title='取消推荐' @click.stop.prevent="recommend(scope.row,0)" class="icon-btn iconfont icon-quxiaozhiding"></i>
            </div>
          </template>
          
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <div style="marginTop:30px;" v-if="formId">
      <add-form @reset='resetTable' :title="title" :sub='1' :form-id='formId'></add-form>
    </div>
  </div>
</template>
<script src='./houseType.js'></script>
<style src="./houseType.component.scss" lang='scss'></style>
