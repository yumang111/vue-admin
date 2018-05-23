<style lang="scss">
.houseTypeImgWrapper {
  display: inline-block;
  margin-right: 10px;
  img {
    width: 100px;
    height: 100px;
  }
}
</style>

<template>
  <div class="housebase-container">
    <h2 class="header--titleH2">
      关联户型信息
      <span class='subtitle'>(当前信息不可修改。如果信息不符，请前往小区进行修改维护)</span>
    </h2>

    <el-form label-position="left" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :md="6">
          <el-form-item label="户型名称" required>
            <el-input placeholder="输入户型名称" disabled v-model="houseTypeData.housingTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="6" :offset="6">
          <el-form-item label="销售状态" required>
            <!-- <el-select clearable placeholder="销售状态" disabled v-model="houseTypeData.status">
                  </el-select> -->
            <el-select clearable v-model="houseTypeData.sellStatus" v-dict="{name:'sellinfo',data:'sell'}" placeholder="销售状态" disabled="">
              <el-option v-for="item in dictData.sell" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="户型均价">
            <el-input placeholder="整数" disabled v-model="houseTypeData.avagPrice">
              <template slot="append">元/平</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :offset='6' :md="6">
          <el-form-item label="朝向">
            <el-select clearable v-model="houseTypeData.orientation" disabled v-dict="{name:'houseOrientation',data:'dict'}" placeholder="朝向">
              <el-option v-for="item in dictData.dict" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="几居室" required>
            <el-select clearable v-model="houseTypeData.shortkey" disabled v-dict="{name:'houseStyle',data:'bedRooms'}" placeholder="几居室">
              <el-option v-for="item in dictData.bedRooms" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :offset='6' :md="6">
          <el-form-item label="房型" required>
            <!-- <el-select clearable  disabled v-model="houseTypeData.houseStyleName">
                  </el-select> -->
            <el-select clearable v-model="houseTypeData.roomTypeId" disabled placeholder="房型">
              <el-option v-for="item in roomTypeData" :key="item.id" :label="item.houseStyleName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="建筑面积">
            <el-input placeholder="小数点2位" disabled v-model="houseTypeData.coveredArea">
              <template slot="append">㎡</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :offset='6' :md="6">
          <el-form-item label="套内面积">
            <el-input placeholder="小数点2位" disabled v-model="houseTypeData.insideSpace">
              <template slot="append">㎡</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :md="20">
          <el-form-item required label="户型图：">
            <div class="houseTypeImgWrapper" v-for="item in imgList" :key="item.id">
              <img :src="item.imgSrc" alt="">
            </div>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>

        <el-col :md="20">
          <el-form-item label="简介描述" required>
            <el-input type="textarea" placeholder="输入户型名称" disabled v-model="houseTypeData.housingDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="lable-wraper">
        <el-col :span="2">
          <span class="lable-name">标签:</span>
        </el-col>
        <el-col :span="22">

          <span class="el-tag el-tag--gray" v-for="item in labels" :key="item.id" style="margin-right:10px;">{{item.labelName}}</span>


        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import newApi from '../../newhouselist.api'
import { getAllhouseTypeInfo } from '@/pages/homeworkstation/plot/plotPortal/houseType/houseType.api'
import dict from '@/directives/dict.directive'
export default {
  props: ['houseTypeId'],
  data() {
    return {
      houseTypeData: {},
      labels: [],
      imgList: [],
      roomTypeData: []
    }
  },
  directives: {
    dict
  },
  watch: {
    houseTypeId(n) {
      console.log(n)
      this.getHouseTypeData()
    }
  },
  methods: {
    getHouseTypeData() {
      newApi.getHouseTypeData({ id: this.houseTypeId || '' })
        .then((res) => {
          console.log(res, '户型信息')
          if (res && res.data) {
            this.houseTypeData = res.data
            if (res.data.tagsIds) {
              this.getLabels(this.houseTypeData.tagsIds)
            }
          }
          if (res && res.imglist) {
            this.imgList = res.imglist
          } else {
            this.imgList = []
          }
        })
        .catch(() => {
          this.houseTypeData = {}
        })
    },
    getLabels(tagsIds) {
      newApi
        .getTagInfo({ id: tagsIds || '' }).then(result => {
          this.labels = result.data
          console.log(this.labels, 'this.labels')
        })
        .catch(() => {
          this.labels = []
        })
    },
    getRoomType() {
      getAllhouseTypeInfo({ rowsPerPage: 100 })
        .then((res) => {
          this.roomTypeData = res.data
        })
    }
  },
  created() {
    this.getRoomType()
  }
}
</script>