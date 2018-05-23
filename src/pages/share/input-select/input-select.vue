<template>
  <div>
    <el-select clearable ref="dict" @change="change" clearable v-model="dictValue" v-dict="{name:dictName,data:dictName}" :placeholder="placehold">
      <el-option
        v-for="item in dictData[dictName]"
        :key="item.dictItemCode"
        :label="item.dictItemValue"
        :value="item.dictItemCode">
      </el-option>
    </el-select>
  </div>
</template>
<script>
// ! 复显有问题
import dict from '@/directives/dict.directive'
export default {
  props: ['dictName', 'value', 'placehold'],
  data: () => ({
    dictValue: null
  }),
  methods: {
    change() {
      this.$emit('input', this.dictValue)
    }
  },
  directives: {
    dict
  },
  created() {
    this.dictValue = this.value
  }
}
</script>
