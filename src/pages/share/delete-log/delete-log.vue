<template>
  <div>
    <h2 class="header--titleH2">处理记录</h2>
    <el-form label-position="left" label-width="100px" :model="delRecordForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="处理人">
            <el-input class="deletelog__input" disabled v-model="delRecordForm.processBy"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下架原因">
            <el-input class="deletelog__input" disabled v-model="delRecordForm.processReasonDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="下架时间">
            <el-input v-if="delRecordForm.processTime" class="deletelog__input" disabled :value='delRecordForm.processTime|timeFormat'></el-input>
            <el-input v-else class="deletelog__input" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getDeleteRecord } from '@/api/api'
export default {
  data() {
    return {
      delRecordForm: {
        processReasonDesc: '',
        processBy: '',
        processTime: ''
      }
    }
  },
  props: ['value'],
  watch: {
    value(n) {
      if (n) {
        this.getDeleteLog(n)
      }
    }
  },
  methods: {
    getDeleteLog(id) {
      getDeleteRecord({
        hsId: id,
        source: '1'
      }).then(res => {
        if (res.data) {
          this.delRecordForm = res.data
          this.delRecordForm.processBy = this.delRecordForm.processBy || ''
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.deletelog {
  &__input {
    width: 250px;
  }
}
</style>