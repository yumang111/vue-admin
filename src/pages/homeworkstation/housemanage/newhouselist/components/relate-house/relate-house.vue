<template>
  <div class="housebase-container">
    <h2 class="header--titleH2">
      关联小区
      <span class='subtitle'>(当前信息不可修改。如果信息不符，请前往小区进行修改维护)</span>
    </h2>

    <el-form label-position="left" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :md="9">
          <el-form-item label="小区名称" required>
            <el-input placeholder="小区名称" disabled v-model="relatedResInfo.residentialName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="小区地址：" prop="salesDepartmentAddress" size='mini'>
          <el-col :md="3">
            <el-select clearable v-model="relatedResInfo.provinceName" placeholder="省" disabled>
            </el-select>
          </el-col>
          <el-col style='marginLeft:10px' :md="3">
            <el-select clearable disabled v-model="relatedResInfo.cityName" placeholder="市">
            </el-select>
          </el-col>
          <el-col style='marginLeft:10px' :md="3">
            <el-select clearable disabled v-model="relatedResInfo.districtName" placeholder="区">
            </el-select>
          </el-col>
          <el-col style='marginLeft:10px' :md="6">
            <el-input placeholder="请输入街道地址" disabled v-model="relatedResInfo.address"></el-input>
          </el-col>
        </el-form-item>

      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="商圈" required>
            <el-select clearable v-model="tradingAreaName" placeholder="请选择商圈" disabled>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :offset='6' :md="6">
          <el-form-item label="版块">
            <el-select clearable v-model="relatedResInfo.districtSubName" placeholder="版块" disabled>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="居住新区" required>
            <el-input placeholder="居住新区" disabled v-model="businessZone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :offset='6' :md="6">
          <el-form-item label="环线">
            <!-- <el-select clearable v-model="relatedResInfo.propertyvalue" placeholder="请选择环线" disabled>
                 </el-select> -->
            <el-select clearable v-model="relatedResInfo.loopLineId" placeholder="环线" disabled>
              <el-option v-for="item in listloopData" :key="item.id" :label="item.loopLineName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import newApi from '../../newhouselist.api'
export default {
  props: ['residentialId'],
  data() {
    return {
      relatedResInfo: {},
      businessZone: '',
      listloopData: [],
      tradingAreaName: ''
    }
  },
  watch: {
    residentialId(n) {
      if (n) {
        this.getRelatedResInfo(n)
      }
    }
  },
  methods: {
    getRelatedResInfo(residentialId) {
      newApi
        .getResidentialInfo(residentialId)
        .then((res) => {
          if (res && res.data) {
            this.relatedResInfo = res.data
            if (res.data.businessZone) {
              this.businessZone = JSON.parse(res.data.businessZone).businessZoneName
            }
            if (res.data.tradingArea) {
              this.tradingAreaName = JSON.parse(res.data.tradingArea).areaName
            }
            if (!res.data.provinceName) {
              res.data.provinceName = '湖北省'
            }
            if (!res.data.cityName) {
              res.data.cityName = '武汉市'
            }
          }
        })
    },
    getLoopLineData() {
      newApi
        .getLoopLine()
        .then((res) => {
          this.listloopData = res.data
        })
    }
  },
  created() {
    this.getLoopLineData()
  }
}
</script>