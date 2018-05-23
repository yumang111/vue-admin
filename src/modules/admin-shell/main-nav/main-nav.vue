<style lang="scss" scoped>
.main-nav {
  width: 230px;
  overflow-y: auto;
  background: rgb(238, 242, 246);
}
</style>

<template>
  <div class="main-nav">
    <nav-platform></nav-platform>
    <nav-menu></nav-menu>
  </div>
</template>

<script>
import navPlatform from './nav-platform/nav-platform'
import navMenu from './nav-menu/nav-menu'
export default {
  data: () => ({
  }),
  components: {
    navPlatform,
    navMenu
  }
}
</script>
