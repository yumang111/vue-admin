<style lang="scss" src="@/assets/style/transversetab.scss">

</style>
<style lang="scss" src="./newhouselist.component.scss">

</style>
<template>
  <div class="houselist-container" v-loading.fullscreen.lock="fullscreenLoading">
    <searchbox @reset="reset" searchtype="0"></searchbox>
    <div class="hl-tab">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">
          <router-link to="/homeworkstation/housemanage/nhlist">新房</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/homeworkstation/housemanage/oldlist">二手房</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/homeworkstation/housemanage/rentlist">出租</router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <el-table v-loading='loading' :data="newHouseList" @row-click="rowClick" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column prop="residentialName" label="小区名称">
      </el-table-column>
      <el-table-column prop="districtName" label="行政区" width="84">
      </el-table-column>
      <el-table-column prop="districtSubName" label="版块" width="96">
      </el-table-column>
      <el-table-column label="物业类型" width="96">
        <template slot-scope="scope">
          {{scope.row.propertyType+''+(scope.row.propertySubName?'-'+ scope.row.propertySubName:'')}}
        </template>
      </el-table-column>
      <el-table-column prop="buildingShow" label="楼栋" width="48">
      </el-table-column>
      <el-table-column prop="unitShow" label="单元-层-号" width="96">
        <template slot-scope="scope">
          {{scope.row.unitShow+' - '+scope.row.floor+' - '+scope.row.roomShow}}
        </template>
      </el-table-column>
      <!-- todo 房型+户型暂时隐藏 -->
      <!-- <el-table-column prop="houseStyleName" label="房型" width="105">
      </el-table-column>
      <el-table-column prop="residentialInfoUnit" label="户型" width="70">
      </el-table-column> -->
      <el-table-column prop="predictedArea" label="建筑面积" width="84">
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价万元" width="84">
        <template slot-scope="scope">
          {{scope.row.totalPrice?Math.round(scope.row.totalPrice/10000):''}}
        </template>
      </el-table-column>
      <el-table-column prop="saleStatusShow" label="销售状态" width="84">
      </el-table-column>
      <el-table-column prop="price" label="备案价" width="84">
      </el-table-column>
      <el-table-column prop="preSalePermit" label="预售证号" width="96">
      </el-table-column>
      <el-table-column label="状态" width="60">
        <template slot-scope="scope">
          {{scope.row.isShield==1?'已下架':'上架'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="72">
        <template slot-scope="scope">
          <a class="icon-btn iconfont icon-shangjia" title="上架" @click.prevent.stop="uporUp(scope.row)" v-show="scope.row.isShield==1"></a>
          <a class="icon-btn iconfont icon-xiajia" title="下架" @click.prevent.stop="uporDown(scope.row)" v-show="scope.row.isShield==0"></a>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wraper">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curpage" :page-sizes="[10, 20, 30, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalDataNum">
      </el-pagination>
    </div>
    <div v-show="isShowDetail">
      <house-souce-info @reset="reset" :house-source="houseSource" :is-bind='isBind' ref="houseSouceInfo">
      </house-souce-info>
      <relate-house :residentialId="residentialId" ref="relateHouse"></relate-house>
      <relate-building :house-source="houseSource"></relate-building>
      <relate-house-type ref="relateHouseType" :house-type-id="houseTypeId"></relate-house-type>
    </div>
    <div v-show="houseSource.isShield==='1'">
      <delete-log v-model="checkedHouseId"></delete-log>
    </div>
    <deletedialog :multipleSelection="multipleSelection" type='newHouse' @reset="reset" ref="deletedialog"></deletedialog>
  </div>
</template>
<script src="./newhouselist.component"></script>