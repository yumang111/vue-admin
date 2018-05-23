<template>
  <router-view>
  </router-view>
</template>
<script>
export default {
}
</script>
<style lang='scss'>
.sortable {
  cursor: pointer !important;
  font-family: 'element-icons' !important;
  font-style: normal;
  font-weight: bold;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  &:hover {
    color: #108ee9;
  }
}

@each $name in 'companyUse',
'companyClick',
'tagUse',
'tagClick' {
  div.sortable__#{$name} {
    @extend .sortable;
  }
}

.othercompany_table_iconBtn {
  display: inline-block;
  padding: 6px;
  margin-right: 10px;
  cursor: pointer;
}
</style>