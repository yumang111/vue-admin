<template>
  <div id="plotTabs">
    <ul class="houseType cf">
      <li>住宅</li>
      <li>公寓</li>
      <li>别墅</li>
      <li>经济适用房</li>
      <li>双限房</li>
      <li>商铺</li>
      <li>写字楼</li>
    </ul>

  </div>
</template>
<script>
export default {
  mode: 'horizontal',
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style src="./plotTabs.component.scss" lang='scss'></style>
