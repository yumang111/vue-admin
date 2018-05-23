<style lang="scss" scoped>
.platform-select-wrap {
  margin: 10px;
}
</style>

<template>
  <div class="platform-select-wrap">
    <el-select @change="selectLine" clearable v-model="selectPlatform" placeholder="请选择">
      <el-option v-for="item in userInfo.project" :key="item.aid" :label="item.proname" :value="item.key">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hub from '../hub'
export default {
  data: () => ({
    first: true,
    router: '',
    selectPlatform: '',
    businessOption: []
  }),
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    selectLine(val) {
      Hub.$emit('changeLimits', val)
      // 刚进入触发change
      // if (this.first) {
      //   this.first = false
      //   if (!this.router) { this.$router.push('/' + this.selectPlatform) }
      // } else {
      //   this.$router.push({ name: val })
      // }
      if (!this.router) {
        this.$router.push('/' + this.selectPlatform)
      } else {
        this.$router.push({ name: val })
      }
    }
  },
  created() {
    this.router = window.location.href.split('#/')[1].split('/')[0]
  }
}
</script>
