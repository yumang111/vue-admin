<template>
  <div>
    <el-select clearable v-model="selectDictValue"  :placeholder="placeholder" @change="change">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.dictItemValue"
              :value="item.dictItemCode">
            </el-option>
      </el-select>
  </div>
</template>
<script>
import { getoldhouseBasedata } from '@/api/api.js'
export default {
  props: ['value', 'dictCatCode', 'placeholder'],
  data() {
    return {
      dictData: [],
      selectDictValue: ''
    }
  },
  methods: {
    getDictData() {
      getoldhouseBasedata({
        dictCatCode: this.dictCatCode
      })
        .then((res) => {
          if (res && res.data) {
            this.dictData = res.data
            console.log(this.dictData, 'this.dictData')
          }
        })
    },
    change(val) {
      console.log(val)
      this.$emit('input', val)
    }

  },
  created() {
    this.getDictData()
    this.selectDictValue = this.value
  }
}
</script>

