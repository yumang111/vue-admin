<style lang="scss">

</style>
<template>
  <div class="housebase-container">
    <!--<div class="tips-head">房源信息</div>-->
    <h2 class="header--titleH2">
      房源信息
      <div class="f-r">
        <el-button type="primary" @click="editHouse('houseSourceForm')">保存修改</el-button>
      </div>
    </h2>
    <el-form label-position="left" :model="houseSource" :rules="rules" ref="houseSourceForm" label-width="100px">
      <el-row>
        <el-col :md="9">
          <el-form-item label="房源标题" required prop="houseTitle">
            <el-input placeholder="默认：小区名 房型 几栋几单元几层几号" v-model="houseSource.houseTitle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :offset='3' :md="6">
          <el-form-item label="预售证号">
            <el-input disabled placeholder="预售证号" v-model="houseSource.preSalePermit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="备案价" required prop="price">
            <el-input placeholder="整数" :disabled="isBind==='1'" v-model="houseSource.price">
              <template slot="append">元/㎡</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :offset='6' :md="6">
          <el-form-item label="销售状态" required>
            <el-select clearable v-model="houseSource.saleStatusShow" disabled v-dict="{name:'sellinfo',data:'sellinfo'}" placeholder="销售状态">
              <el-option v-for="item in dictData.sellinfo" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="备案价说明">
            <el-input v-model="houseSource.recordInstruction"></el-input>
          </el-form-item>
        </el-col>
        <el-col :offset='6' :md="6">
          <el-form-item label="建筑面积">
            <el-input disabled v-model="houseSource.predictedArea">
              <template slot="append">㎡</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="服务">
            <el-input v-model="houseSource.service"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="预定数">
            <el-input v-model="houseSource.preOrderCount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :offset='6' :md="6">
          <el-form-item label="收藏数">
            <el-input v-model="houseSource.collectionCount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="22">
          <el-form-item label="标签：">
            <check-tag :rootId='4' v-model="houseSource.labelIds"></check-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="22">
          <el-form-item label="简介描述：">
            <el-input type="textarea" placeholder="400字以内" v-model="houseSource.houseSummary"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import newApi from '../../newhouselist.api'
import checkTag from '@/pages/share/checktag/checktag.vue'
import dict from '@/directives/dict.directive'
import {
  validateInt1
} from '@/validate/validate'
export default {
  props: ['houseSource', 'isBind'],
  data() {
    return {
      tagsId: [],
      rules: {
        houseTitle: [
          { required: true, message: '请输入房源标题', trigger: 'blur&&change' }
        ],
        price: [{
          validator: validateInt1,
          trigger: 'change&blur'
        }]
      }
    }
  },
  directives: {
    dict
  },
  methods: {
    editHouse(formName) {
      let params = JSON.parse(JSON.stringify(this.houseSource))
      if (params.updateTime) {
        delete params.updateTime
      }
      if (params.createTime) {
        delete params.createTime
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          newApi
            .editHouseSourceInfo(params)
            .then((res) => {
              if (res && res.data > 0) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$emit('reset')
              }
            })
        }
      })
    }
  },
  components: {
    checkTag
  }
}
</script>