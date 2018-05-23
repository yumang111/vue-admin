<style lang='scss' scoped>

</style>
<template>
  <div>
    <div class="header--titleH2 near">
      <div class="checkAlbum__breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/homeworkstation/plot/plotPortal/album?activeType='+imgType }">{{imgTypeName}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="albumName&&albumName!=='undefined'">- {{albumName}}相册</el-breadcrumb-item>
          <el-breadcrumb-item v-if="albumName&&albumName==='undefined'">- **</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="f-r">
        <template v-if="action ==='添加图片'">
          <el-button type="danger" @click="addPic">{{action}}</el-button>
          <el-button type="primary" @click="sortAlbum">更新排序</el-button>
        </template>
        <template v-if="action ==='保存修改'">
          <el-button type="primary" @click="save">{{action}}</el-button>
        </template>
      </div>
    </div>
    <ul v-if="action ==='添加图片'" class="album__photoList">
      <draggable v-model='showImgList' :options="{draggable:'.imgItem'}" @start="drag=true" @end="drag=false">
        <li :class="['imgItem','album__picList','album__type'+imgType]" :key="pic.id" v-for="(pic,index) in showImgList">
          <img class="preview-img" :src="pic.imgSrc" height="100" @click="$preview.open(index, showImgList)">
          <div class="album__imgdec-wrap">
            <p class="album__imgdec">
              <span :title="pic.imgName">{{pic.imgName}}</span>
            </p>
            <p v-if="imgType==='7'" class="album__imgdec">
              <span>{{pic.residentialSubName?(pic.residentialSubName+'期'):''}}{{pic.buildingName?(pic.buildingName+'栋'):''}}</span>
            </p>
            <p class="album__imgdec">
              <span>{{pic.imgDesc}}</span>
            </p>
            <p v-if="imgType !== '1' ">
              <el-button-group>
                <el-button class="btn--group" @click="deleteImg(pic)" title="删除">
                  <i class="iconfont icon-shanchu"></i>
                </el-button>
                <el-button class="btn--group" @click="editImgInfo(pic)" title="编辑">
                  <i class="iconfont icon-bianji"></i>
                </el-button>
              </el-button-group>
            </p>
          </div>
        </li>
      </draggable>
    </ul>
    <ul v-if="action ==='保存修改'" class="album__photoList">
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
    <edit-img @reset='reset' :form-data='formData' ref='editImg'></edit-img>
  </div>
</template>
<script>
  import { // 获取指定类型的图片（不含相册）
    getAlbumPic,
    deleteAlbumPic,
    getPic,
    addPicInfo,
    sortAlbumInfo
  } from '../album/album.api'
  import editImg from '../album/editImg/editImg'
  import draggable from 'vuedraggable'

  import mixins from '@/mixins/mixins'
  export default {
    data() {
      return {
        checkList: [],
        showImgList: [],
        imgType: '',
        imgTypeName: '',
        albumId: '',
        albumName: '',
        plotid: '',
        formData: {
          imgName: '',
          imgDesc: '',
          id: ''
        },
        action: '添加图片'
      }
    },
    mixins: [mixins],
    methods: {
      reset() {
        this.getImgListData(this.albumId)
      },
      addPic() {
        // 获取除相册内含有外的剩余图片
        getPic({
          imgType: this.imgType,
          residentialId: this.plotid,
          albumId: this.albumId
        }).then(res => {
          this.action = '保存修改'
          this.showImgList = res
        })
      },
      // 保存添加图片
      save() {
        if (this.checkList.length === 0) {
          this.showInfoMsg('info', '请选择至少一张图片！')
          return false
        }
        let params = {
          albumId: this.albumId,
          residentialId: this.plotid,
          jsonArray: ''
        }
        params.jsonArray = this.checkList.map(v => {
          return {
            imgId: v
          }
        })
        params.jsonArray = JSON.stringify(params.jsonArray)
        addPicInfo(params).then(res => {
          if (res.data) {
            this.showInfoMsg('success', '创建成功！')
            this.action = '添加图片'
            this.getImgListData(this.albumId)
            this.checkList = []
          } else {
            this.showInfoMsg('error', '创建失败！')
          }
        })
      },
      // 获取相册内图片
      getImgListData(id) {
        getAlbumPic({
          id: id
        })
          .then(res => {
            console.log(res.data, '请求图片列表')
            this.showImgList = res.data
            this.showImgList.forEach(v => {
              let img = new Image()
              img.addEventListener('load', () => {
                v.id = v.id
                v.src = v.imgSrc
                v.isCover = v.isCover
                v.w = img.width
                v.h = img.height
              })
              img.src = v.imgSrc
            })
          })
          .catch((err) => {
            console.log(err, 'err')
          })
      },
      // 编辑图片
      editImgInfo(pic) {
        this.$refs.editImg.isShowEditDialog = true
        this.formData.imgName = pic.imgName
        this.formData.imgDesc = pic.imgDesc
        this.formData.id = pic.id
      },
      // 删除图片
      deleteImg(pic) {
        this.$confirm('是否删除该图片', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            return deleteAlbumPic({
              albumId: this.albumId,
              imgId: pic.id
            })
          })
          .then(res => {
            if (res.data) {
              this.showInfoMsg('success', '删除成功！')
              this.getImgListData(this.albumId)
            }
          })
          .catch(() => {
            this.showInfoMsg('info', '取消删除！')
          })
      },
      sortAlbum() {
        let arr = []
        this.showImgList.filter((v, i) => {
          arr.push({
            imgId: v.id,
            imgOrder: i
          })
        })
        console.log(this.showImgList, '444')
        console.log(arr, 'arr')
        sortAlbumInfo({
          jsonArray: JSON.stringify(arr),
          albumId: this.albumId
        }).then(res => {
          if (res.data) {
            this.getImgListData(this.albumId)
            this.showInfoMsg('success', '图片排序更改成功！')
          } else {
            this.showInfoMsg('error', '图片排序更改失败！')
          }
        })
      }
    },
    components: {
      draggable,
      editImg
    },
    created() {
      this.albumId = sessionStorage.getItem('albumId')
      this.albumName = sessionStorage.getItem('albumName')
      this.imgType = sessionStorage.getItem('imgType')
      this.imgTypeName = sessionStorage.getItem('imgTypeName')
      this.plotid = sessionStorage.getItem('plotid')
      this.getImgListData(this.albumId)
    }
  }

</script>
