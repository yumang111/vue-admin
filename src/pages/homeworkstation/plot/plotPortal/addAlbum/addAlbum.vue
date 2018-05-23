<template>
  <div>
    <div class="header--titleH2 near">
      <div class="checkAlbum__breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/homeworkstation/plot/plotPortal/album?activeType='+imgListParams.imgType }">{{imgListParams.imgTypeName}}</el-breadcrumb-item>
          <el-breadcrumb-item>创建相册</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="f-r">
        <el-button type="primary" @click="createAlbum">创建相册</el-button>
      </div>
    </div>
    <ul class="album__photoList">
      <el-checkbox-group v-model="checkList">
        <li v-for="pic in showImgList" :key="pic.id" class="imgItem">
          <img :src="pic.imgSrc" alt="">
          <div class="album__imgdec-wrap">
            <p class="album__imgdec">
              <el-checkbox :label="pic.id">{{pic.imgName}}</el-checkbox>
            </p>
          </div>
        </li>
      </el-checkbox-group>
    </ul>
    <div class="noPic" v-if="!showImgList.length">暂无图片</div>
  </div>
</template>
<script>
import {
  getPic, // 获取指定类型的图片（不含相册）
  addAlbum
} from '../album/album.api'

import mixins from '@/mixins/mixins'
export default {
  data() {
    return {
      checkList: [],
      showImgList: [],
      imgListParams: {
        currentPage: 1,
        rowsPerPage: 1000,
        imgType: '',
        residentialId: ''
      },
      imgType: '',
      imgTypeName: ''
    }
  },
  mixins: [mixins],
  methods: {
    getImgListData(params) {
      getPic(params)
        .then((data) => {
          console.log(data, '请求图片列表')
          this.showImgList = data
        })
        .catch((err) => {
          console.log(err, 'err')
        })
    },
    createAlbum() {
      if (this.checkList.length === 0) {
        this.showInfoMsg('info', '请选择至少一张图片！')
        return false
      }
      let params = {
        residentialId: this.imgListParams.residentialId,
        imgType: this.imgListParams.imgType,
        jsonArray: ''
      }
      params.jsonArray = this.checkList.map(v => {
        return { imgId: v }
      })
      params.jsonArray = JSON.stringify(params.jsonArray)
      addAlbum(params).then(res => {
        if (res.data) {
          this.showInfoMsg('success', '创建成功！')
          this.$router.push({ path: '/homeworkstation/plot/plotPortal/album?activeType=' + this.imgListParams.imgType })
        } else {
          this.showInfoMsg('error', '创建失败！')
        }
      })
    }
  },
  created() {
    this.imgListParams.imgType = sessionStorage.getItem('imgType')
    this.imgListParams.residentialId = sessionStorage.getItem('plotid')
    this.imgListParams.imgTypeName = sessionStorage.getItem('imgTypeName')
    this.getImgListData(this.imgListParams)
  }
}
</script>
<style lang='scss' scoped>

</style>
