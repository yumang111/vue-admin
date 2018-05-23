<style src="./addcmname.component.scss" lang="scss" scoped></style>
<template>
    <div>
      <h1 class="header--title">创建小区</h1>
  <div class="page-container">
    <div class="newName-container" >
      <el-form :inline="true"  class="demo-form-inline cmname-search">
        <el-form-item class="name-input">
          <el-input v-model="cmname"  class="cmname-input" placeholder="小区名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryname" :loading="loadFlag" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <template v-if="checkCMname">
        <el-card class="box-card" v-if="totalNum>0">
          <div v-for="item in cmnameArr" :key="item.residentialName"  class="text">
            {{item.residentialName}}
          </div>
          <a class="load-more" v-if="loadmore" @click="btnloadmore">更多</a>
        </el-card>
        <div class="empty-tips" v-else ><i  class="el-icon-information warning"></i>没有搜到相似小区</div>
        <div class="btn-type">
          <el-button type="primary" @click="nextStep">下一步</el-button>
          <el-button @click="cancleBtn">取消</el-button>
        </div>

      </template>

    </div>

  </div>
    </div>
</template>
<script src="./addcmname.component"></script>

