<template>
  <div class="housebase-container">
    <h2 class="header--titleH2">
      关联楼栋/分期信息
      <span class='subtitle'>(当前信息不可修改。如果信息不符，请前往小区进行修改维护)</span>
    </h2>

    <el-form label-position="left" ref="ruleForm" label-width="100px" class="demo-ruleForm">


      <el-row>
        <el-col :md="6">

          <el-form-item label="楼栋" required>

            <el-input placeholder="" disabled v-model="houseSource.buildingShow"></el-input>



          </el-form-item>
        </el-col>
        <el-col :md="6">
          <el-button class="tab__add" type="text" @click="viewInstallment">查看房源对应的分期信息</el-button>
        </el-col>
        <el-col :offset='0' :md="6">
          <el-form-item label="单元" required>
            <el-select clearable disabled v-model="houseSource.unitShow">
              <el-option value="0" label=""></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="房号" required>
            <el-input placeholder="" disabled v-model="houseSource.roomShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>

export default {
  props: ['houseSource'],
  methods: {
    viewInstallment() {
      sessionStorage.setItem('plotid', this.houseSource.residentialInfoFrontId)
      sessionStorage.setItem('plotname', this.houseSource.houseTitle)
      this.$router.push({ path: '/homeworkstation/plot/plotPortal/installment', query: { installmentId: this.houseSource.residentialSubId } })
    }
  }
}
</script>