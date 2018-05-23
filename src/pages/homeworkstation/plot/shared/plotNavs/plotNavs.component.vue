<style lang="scss" scoped>
@import "~@/assets/style/minix";
.plotNavBox {
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.plotName {
  float: left;
  padding: 0 20px;
  text-align: center;
  font-size: 22px;
  height: 80px;
  line-height: 80px;
  background-color: #fff;
  color: #333;
  box-sizing: border-box;
  @include ellipsis(320);
  &:hover {
    color: #333;
  }
}
.plotNavItem.el-menu-item {
  line-height: 80px;
  height: 80px;
}

.plotNavList {
  background-color: #fff;
}

.plotNavItem:hover,
.router-link-active {
  color: #108ee9;
  background-color: #fff;
  box-sizing: border-box;
}

.router-link-active {
  border-bottom: 5px solid #108ee9;
}
</style>

<template>
  <div id="plotNavs">
    <el-row class="plotNavBox">
      <el-menu :default-active="activeIndex" class="plotNavList el-menu-demo" mode="horizontal" @select="handleSelect">
        <li class="plotName" v-text='plotName'></li>
        <router-link class="plotNavItem el-menu-item" tag="li" index="1" to='/homeworkstation/plot/plotPortal/baseInfo'>基本信息</router-link>
        <router-link class="plotNavItem el-menu-item" tag="li" index="2" to='/homeworkstation/plot/plotPortal/installment'>分期信息</router-link>
        <router-link class="plotNavItem el-menu-item" tag="li" index="3" to='/homeworkstation/plot/plotPortal/dynamic'>动态</router-link>
        <router-link class="plotNavItem el-menu-item" tag="li" index="4" to='/homeworkstation/plot/plotPortal/openHouse'>开盘信息</router-link>
        <router-link class="plotNavItem el-menu-item" tag="li" index="5" to='/homeworkstation/plot/plotPortal/buildingInfo'>楼栋信息</router-link>
        <router-link class="plotNavItem el-menu-item" tag="li" index="6" to='/homeworkstation/plot/plotPortal/houseType'>户型信息</router-link>
        <router-link class="plotNavItem el-menu-item" tag="li" index="7" to='/homeworkstation/plot/plotPortal/album'>相册</router-link>
        <router-link class="plotNavItem el-menu-item" tag="li" index="8" to='/homeworkstation/plot/plotPortal/sandTableFigure'>沙盘图</router-link>
        <router-link class="plotNavItem el-menu-item" tag="li" index="9" to='/homeworkstation/plot/plotPortal/traffic'>轨道交通</router-link>
      </el-menu>
    </el-row>
    <div class="line"></div>
  </div>
</template>
<script>

export default {
  name: 'plotNavs',
  data() {
    return {
      activeIndex: '1',
      plotName: ''
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  created() {
    this.plotName = sessionStorage.getItem('plotname')
  }
}
</script>
<style lang='scss' scoped>

</style>
