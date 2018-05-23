<style lang="scss">
.plot-wrap {
  padding-left: 20px;
}
</style>
<template>
  <div>
    <plot-navs></plot-navs>
    <div class="plot-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>

import plotNavs from '../shared/plotNavs/plotNavs.component'
export default {
  data() {
    return {
      plotname: ''
    }
  },
  components: {
    plotNavs
  },
  mounted() {
    this.plotname = sessionStorage.getItem('plotname')
  }
}
</script>
