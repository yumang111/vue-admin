<template>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-select clearable ref='province' @change="changeProvince" v-model="value.provinceId" placeholder="省">
        <el-option v-for="item in provinceList" :key="item.provinceid" :label="item.province" :value="item.provinceid">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select clearable ref='city' @change="changeCity" v-model="value.cityId" placeholder="市">
        <template v-if='cityList.length != 0'>
          <el-option v-for="item in cityList" :key="item.cityid" :label="item.city" :value="item.cityid">
          </el-option>
        </template>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select clearable ref='area' @change="changeCounty" v-model="value.areaId" placeholder="县">
        <el-option v-for="item in areaList" :key="item.areaid" :label="item.area" :value="item.areaid">
        </el-option>
      </el-select>
    </el-col>
  </el-row>
</template>
<script>
import {
  getProvinceInfo,
  getCityInfo,
  getCountyInfo
} from '@/api/plot.api'
export default {
  data() {
    return {
      provinceList: [],
      cityList: [],
      areaList: [],
      address: {},
      isFirst: 0
    }
  },
  props: ['value'],
  // watch: {
  //   value(n) {
  //     this.address = n
  //   }
  // },
  methods: {
    getProvince() {
      getProvinceInfo().then(res => {
        this.provinceList = res.data
        console.log(this.provinceList)
      })
    },
    getCity(id) {
      if (id) {
        getCityInfo({
          provinceid: id
        }).then(res => {
          this.cityList = res.data
        })
      } else {
        this.cityList = []
      }
      if (!this.isFirst && !this.value.areaId) {
        this.isFirst++
      }
    },
    getArea(id) {
      if (id) {
        getCountyInfo({ cityid: id }).then(res => {
          this.areaList = res.data
        })
      } else {
        this.areaList = []
      }
      this.isFirst++
    },
    changeProvince(val) {
      if (this.isFirst) {
        this.value.cityName = ''
        this.value.cityId = ''
        this.value.areaName = ''
        this.value.areaId = ''
      }
      this.value.provinceName = this.$refs.province.selectedLabel
      this.getCity(val)
      // console.log(this.value, 'province')
    },
    changeCity(val) {
      if (this.isFirst) {
        this.value.areaName = ''
        this.value.areaId = ''
      }
      this.value.cityName = this.$refs.city.selectedLabel
      this.getArea(val)
      // console.log(this.value, 'city')
    },
    changeCounty(val) {
      this.value.areaName = this.$refs.area.selectedLabel
      // console.log(this.value, 'area')
    }
  },
  created() {
    this.getProvince()
  }
}

</script>
<style>

</style>
