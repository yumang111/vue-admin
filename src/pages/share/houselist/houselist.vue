<style src="./houselist.scss" lang="scss" scoped></style>
<style lang="scss" src="@/assets/style/transversetab.scss" scoped>

</style>
<template>
  <div class="houselist-container" >
    <h1 class="header--title">房源</h1>
    <searchbox searchtype="1"></searchbox>
    <div class="hl-tab">
      <el-menu class="el-menu-demo" mode="horizontal" >
        <el-menu-item index="1"><router-link to="/homeworkstation/housemanage/nhlist">新房</router-link></el-menu-item>
        <el-menu-item index="2"><router-link to="/homeworkstation/housemanage/oldlist">二手房</router-link></el-menu-item>
        <el-menu-item index="3"><router-link to="/homeworkstation/housemanage/rentlist">出租</router-link></el-menu-item>
      </el-menu>
    </div>
    <div class="hl-container">
      <div v-if="listtype==1">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="房源编号"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="小区名称"
            >
          </el-table-column>
          <el-table-column
            prop="address"
            label="区域">
          </el-table-column>
          <el-table-column
            prop="address"
            label="第几期">
          </el-table-column>
          <el-table-column
            prop="date"
            label="栋"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="户型"
            >
          </el-table-column>
          <el-table-column
            prop="address"
            label="房型">
          </el-table-column>
          <el-table-column
            prop="address"
            label="建筑面积㎡">
          </el-table-column>
          <el-table-column
            prop="date"
            label="总套数"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="已售套"
            >
          </el-table-column>
          <el-table-column
            prop="address"
            label="在售套">
          </el-table-column>
          <el-table-column
            prop="address"
            label="待售套">
          </el-table-column>
          <el-table-column
            prop="name"
            label="价格元/㎡"
            >
          </el-table-column>
          <el-table-column
            prop="address"
            label="一房一价">
          </el-table-column>
          <el-table-column
            prop="address"
            label="状态">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            >
            <template slot-scope="scope">
              <el-button  type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else-if="listtype==2">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="房源编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="小区名称2"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="区域">
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="房源编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="小区名称3"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="区域">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script src="./houselist"></script>
