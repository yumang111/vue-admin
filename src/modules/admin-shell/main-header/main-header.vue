<style lang="scss" scoped>
.mainHeader {
  display: flex;
  height: 60px;
  background: #108ee9;
  &__title {
    color: #fff;
    line-height: 60px;
    padding-left: 20px;
    font-size: 22px;
    flex: 1;
  }
  &__user {
    margin-right: 20px;
    height: 60px;
    line-height: 60px;
    img {
      vertical-align: middle;
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
  }
  &__name {
    color: #fff;
    font-size: 16px;
    display: inline-block;
    padding: 0 10px;
  }
}

.help {
  cursor: pointer;
  float: right;
  &__icon {
    float: left;
    font-size: 24px;
    color: #fff;
  }
  &__desc {
    float: left;
    font-size: 14px;
    margin-left: 5px;
    color: #fff;
  }
}

.quit {
  cursor: pointer;
  float: right;
  padding: 0 10px;
  font-size: 14px;
  color: #fff;
}
</style>

<template>
  <header class="mainHeader">
    <h1 class="mainHeader__title">亿房管理后台</h1>
    <div class="mainHeader__user">
      <img src="../../../assets/userimg.jpg" alt="">
      <span class="mainHeader__name">{{userInfo.adminName}}</span>
      <div class="quit" @click="quit">
          <span>退出</span>
        </div>
      <div @click="$refs.description.dialog=true" class="help">
        <i class="iconfont icon-bangzhu help__icon"></i>
        <span class="help__desc">帮助</span>
      </div>
    </div>
    <description ref="description"></description>
  </header>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import description from '@/pages/share/description/description.vue'

export default {
  data: () => ({
    helpDialog: false
  }),
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    quit() {
      window.location.href = process.env.API_ROOT_UC + '/cas/logout?service=' + process.env.API_ROOT_UC + '/cas/login?service=' + window.location.href
    }
  },
  components: {
    description
  }
}

</script>
