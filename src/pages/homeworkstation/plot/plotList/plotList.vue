<style src="./plotList.scss" lang="scss" scoped></style>
<template>
  <div>
    <h1 class="header--title">
      小区列表
      <div class="f-r">
        <el-button type="danger">
          <router-link style="color:#fff;" to="/homeworkstation/plot/addcmname">新建小区</router-link>
        </el-button>
      </div>
    </h1>
    <div class="page-container">
      <searchbox searchtype='1'></searchbox>
      <div class="icon-panel">
        <span class="icon-btn-item">
          <i class="iconfont icon-tijiao"></i>提交</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-zhiding"></i>推荐</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-quxiaozhiding"></i>取消推荐</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-bianji"></i>编辑</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-shangjia"></i>上架</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-xiajia"></i>下架</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-tongguo"></i>通过</span>
        <span class="icon-btn-item">
          <i class="iconfont icon-bohui"></i>驳回</span>
      </div>
      <div>
        <el-table v-loading='loading' :data="cmlistData" style="width: 100%">
          <el-table-column label="小区名称" width="168">
            <template slot-scope="scope">
              <a class="linkword">{{scope.row.residentialName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="districtName" label="行政名" width="84">
          </el-table-column>
          <el-table-column prop="districtSubName" label="板块" width="96">
          </el-table-column>
          <el-table-column prop="address" label="详细地址">
          </el-table-column>
          <el-table-column label="创建时间" width="96">
            <template slot-scope="scope">
              <div>{{scope.row.createTime|timeFormat}}</div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="96">
            <template slot-scope="scope">
              <div>{{scope.row.updateTime|timeFormat}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" width="60">
            <template slot-scope="scope">
              <div v-if="scope.row.isRecommend==1">已推荐</div>
              <div v-else-if="scope.row.auditStatus=='-2'">未通过</div>
              <div v-else-if="scope.row.auditStatus=='-1'">未提交</div>
              <div v-else-if="scope.row.auditStatus=='0'">已提交</div>
              <div v-else-if="scope.row.auditStatus=='1'">通过</div>
              <div v-else-if="scope.row.auditStatus=='2'">已下架</div>
            </template>
          </el-table-column>
          <el-table-column label="审核" width="96">
            <template slot-scope="scope">
              <div v-if="scope.row.auditStatus=='0'">
                <i title='通过' class="icon-btn icon-btn iconfont icon-tongguo" @click="auditStatusAct(scope.row.id,1)"></i>
                <i title='驳回' class="icon-btn icon-btn iconfont icon-bohui" @click="auditStatusAct(scope.row.id,-2)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="144">
            <template slot-scope="scope">
              <div class="btn-wraper">
                <div v-if="scope.row.isRecommend==1">
                  <i title='取消推荐' class="icon-btn iconfont icon-quxiaozhiding" @click="isRecommendAct(scope.row.id,0)"></i>
                </div>
                <div v-else-if="scope.row.auditStatus=='-2'">
                  <i title='编辑' class="icon-btn iconfont icon-bianji" @click="setcmbase(scope.row.id,scope.row.residentialName)"></i>
                  <i title='提交' class="icon-btn iconfont icon-tijiao" @click="auditStatusAct(scope.row.id,0)"></i>
                </div>
                <div v-else-if="scope.row.auditStatus=='-1'">
                  <i title='编辑' class="icon-btn iconfont icon-bianji" @click="setcmbase(scope.row.id,scope.row.residentialName)"></i>
                  <i title='提交' class="icon-btn iconfont icon-tijiao" @click="auditStatusAct(scope.row.id,0)"></i>
                </div>
                <div v-else-if="scope.row.auditStatus=='0'">
                  <i title='编辑' class="icon-btn iconfont icon-bianji" @click="setcmbase(scope.row.id,scope.row.residentialName)"></i>
                </div>
                <div v-else-if="scope.row.auditStatus=='1'">
                  <i title='推荐' class="icon-btn iconfont icon-zhiding" @click="isRecommendAct(scope.row.id,1)"></i>
                  <i title='编辑' class="icon-btn iconfont icon-bianji" @click="setcmbase(scope.row.id,scope.row.residentialName)"></i>
                  <i title='下架' class="icon-btn iconfont icon-xiajia" @click="auditStatusAct(scope.row.id,2)"></i>
                </div>
                <div v-else-if="scope.row.auditStatus=='2'">
                  <!--<i class="icon-btn iconfont icon-bianji" @click="setcmbase(scope.row.id,scope.row.residentialName)"></i>-->
                  <i title='上架' class="icon-btn iconfont icon-shangjia" @click="auditStatusAct(scope.row.id,1)"></i>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wraper">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curpage" :page-sizes="[10, 20, 30, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalDataNum">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script src="./plotList.js"></script>