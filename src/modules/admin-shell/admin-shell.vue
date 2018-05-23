<style lang="scss" scoped>
.admin-shell {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.admin-container {
  flex: 1;
  display: flex;
}
.main-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 20px;
  padding-bottom: 80px;
}
</style>

<template>
  <div class="admin-shell">
    <main-header></main-header>
    <div class="admin-container">
      <main-nav></main-nav>
      <div class="main-content">
        <router-view>

        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import mainHeader from './main-header/main-header'
import mainNav from './main-nav/main-nav'
export default {
  components: {
    mainHeader,
    mainNav
  }
}
</script>
