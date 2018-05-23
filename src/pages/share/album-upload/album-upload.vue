
<template>
  <el-dialog title="图片上传" v-model="dialogVisible" size="large" v-if="dialogVisible">
    <el-row>
      <ul class="album__ready-photo-list">
        <el-col :md="5" v-for="(pic,index) in imgList" :key="pic.imgSrc">
          <li>
            <i class="iconfont icon-delete album__delete-icon" @click="deleteImg(index)"></i>
            <img :src="pic.imgSrc" alt="">
          </li>
        </el-col>
        <el-col :md="5">
          <li v-if="!imgList.length">
            <div class="album__uploadWrap" role="button">
              <el-upload :file-list="imgList" :show-file-list='false' action="homebaseaction/homebaseaction.base.homeimg.upload.v1" class="upload-demo" name='file' ref="upload" :auto-upload="false" :on-change="setImagePreview">
                <input slot="trigger" id="doc" class="album__uploadInput" accept="image/png,image/gif,image/jpeg,image/x-ms-bmp,image/bmp">
              </el-upload>
              <div class="album__uploadIcon">
                <p>
                  <i class="el-icon-plus"></i>
                </p>
                <p>选择图片</p>
              </div>
            </div>
          </li>
        </el-col>
      </ul>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitUpload">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import axios from 'axios'

import mixins from '@/mixins/mixins'
export default {
  props: ['houseId'],
  data() {
    return {
      plotid: '',
      signKey: '',
      imgList: [],
      form: {
        name: '',
        region: '',
        desc: ''
      },
      dialogVisible: false
    }
  },
  mixins: [mixins],
  methods: {
    // 图片预览数据处理
    setImagePreview(file, fileList) {
      let filterArr = []
      // 同一张图片单次只能传一次，自动过滤掉重复的
      fileList.forEach(v => {
        if (filterArr.length > 0) {
          let flag = true
          filterArr.find(val => {
            if (val.name === v.name) {
              this.showInfoMsg('info', '同一张图片只能同时上传一张')
              flag = false
            }
          })
          if (flag) {
            filterArr.push(v)
          }
        } else {
          filterArr.push(v)
        }
      })
      let temp = []
      filterArr.forEach((item) => {
        temp.push({
          imgSrc: item.url,
          // residentialId: residentialInfoId, //小区ID
          imgType: this.activeType,
          imgTypeDesc: this.activeTypeName,
          file: item.raw
        })
      })
      this.imgList = temp
    },
    submitUpload(formName) {
      if (this.imgType === '11' && this.imgList.length > 1) {
        this.showInfoMsg('info', '只能上传一张图片！')
        return false
      }
      let formData = new FormData()
      let larger = false
      // 限制上传图片大小 有一张不满足则不能上传
      this.imgList.forEach(v => {
        if (v.file.size / 1024 / 1024 > 5) {
          larger = true
        }
      })
      if (larger) {
        this.showInfoMsg('info', '上传图片不得大于5M')
        return false
      }
      console.log(this.imgList, 'this.imgList')
      formData.append('method', 'homeworkstation.base.housesourceimg.batchupload')
      formData.append('imgType', '8')
      formData.append('imgTyepDesc', '房源图')
      formData.append('relateId', this.houseId)
      this.imgList.forEach(ele => {
        formData.append('file', ele.file)
        axios.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation/homeworkstation.base.housesourceimg.batchupload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          this.showInfoMsg('success', '图片上传成功')
          this.dialogVisible = false
          this.$parent.imgInfoArr.push({
            id: res.data.base_housesourceimg_batchupload_response.data.id,
            src: res.data.base_housesourceimg_batchupload_response.data.imgSrc
          })
          this.$emit('reset', 'success')
        }).catch(res => {
          console.log(res, 'catch')
          this.showInfoMsg('error', '上传失败!')
        })
      })
    },
    deleteImg(index) {
      this.imgList.splice(index, 1)
    }
  },
  created() {
    this.imgList = []
    this.plotid = sessionStorage.getItem('plotid')
  }
}
</script>
<style lang='scss' scoped>
.album {
  &__uploadInput {
    opacity: 0;
    width: 1px;
    height: 1px;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99;
    cursor: pointer;
  }
  &__uploadWrap {
    width: 152px;
    height: 152px;
    position: relative;
    text-align: center;
    background: #f7f7f7;
    border: 1px dashed #bbb;
    &:hover {
      background: #e7e7e7;
    }
  }
  &__uploadIcon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__ready-photo-list {
    li {
      width: 90%;
      float: left;
      position: relative; // text-align: center;
      img {
        width: 150px;
        height: 150px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
