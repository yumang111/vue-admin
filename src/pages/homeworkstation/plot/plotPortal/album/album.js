import {
  getHousePhotoTypeList,
  getImgListByType,
  deleteImg,
  updateImgSort,
  deleteAlbumInfo,
  getHouseTypePic
} from './album.api'

import draggable from 'vuedraggable'
import mixins from '@/mixins/mixins'
import picUpload from './album-upload/album-upload'
import editImg from './editImg/editImg.vue'
import editAlbum from './editAlbum/editAlbum.vue'
// import picList from './album-piclist/album-piclist'
export default {
  data() {
    return {
      activeType: '',
      activeTypeName: '',
      photoTypeListData: [],
      imgListParams: {
        currentPage: 1,
        rowsPerPage: 1000,
        imgType: '',
        residentialId: ''
      },
      residentialInfoId: '',
      showImgList: [],
      showAlbumList: [],
      houseType: [], // 户型
      albumList: [], // 相册
      tplType: 0,
      albumFormData: {
        id: '',
        albumName: '',
        albumDesc: ''
      },
      formData: {
        imgName: '',
        urlLink: '',
        imgDesc: '',
        id: ''
      }
    }
  },
  mixins: [mixins],
  methods: {
    // 分类导航切换
    fetchPhotosByList(code) {
      this.activeType = code
      this.activeTypeName = this.photoTypeListData.find(v => {
        return v.dictItemCode === code
      }).dictItemValue
      console.log(this.activeType)
      this.tplType = code
      this.imgListParams.imgType = code
      this.getImgListData(this.imgListParams)
      this.$router.push({
        path: '/homeworkstation/plot/plotPortal/album',
        query: {
          activeType: code
        }
      })
    },
    // 调用上传组件
    showUploadDialog() {
      this.$refs.picUpload.dialogVisible = true
      this.$refs.picUpload.form.imgList = []
    },
    // 重置页面
    reset() {
      this.getImgListData(this.imgListParams)
    },
    // 请求图片数据
    getImgListData(params) {
      if (this.activeType === '1') {
        getHouseTypePic({
          residentialInfoId: this.residentialInfoId
        }).then(res => {
          let data = res.data
          data.forEach(v => {
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
          this.showImgList = data
        })
      } else {
        getImgListByType(params)
          .then((data) => {
            console.log(data, '请求图片列表')
            this.showImgList = data.filter(v => {
              if (v.isAlbum !== 1) {
                let img = new Image()
                img.addEventListener('load', () => {
                  v.id = v.id
                  v.src = v.imgSrc
                  v.isCover = v.isCover
                  v.w = img.width
                  v.h = img.height
                })
                img.src = v.imgSrc
                return true
              } else {
                return false
              }
            })
            this.showAlbumList = data.filter(v => {
              return v.isAlbum === 1
            })
          })
          .catch((err) => {
            console.log(err, 'err')
          })
      }
    },
    // 添加相册
    addAlbum() {
      sessionStorage.setItem('imgType', this.activeType)
      sessionStorage.setItem('imgTypeName', this.activeTypeName)
      this.$router.push({
        path: '/homeworkstation/plot/plotPortal/addAlbum'
      })
    },
    // 编辑相册
    editAlbumInfo(pic) {
      this.$refs.editAlbum.albumEditDialog = true
      this.albumFormData.id = pic.id
      this.albumFormData.albumName = pic.imgName
      this.albumFormData.albumDesc = pic.imgDesc
    },
    // 查看相册
    lookAlbum(pic) {
      sessionStorage.setItem('albumId', pic.id)
      sessionStorage.setItem('albumName', pic.imgName)
      sessionStorage.setItem('imgType', this.activeType)
      sessionStorage.setItem('imgTypeName', this.activeTypeName)
      this.$router.push({
        path: '/homeworkstation/plot/plotPortal/checkAlbum'
      })
    },
    // 删除相册
    deleteAlbum(id) {
      this.$confirm('是否删除该相册', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return deleteAlbumInfo({
            id: id
          })
        })
        .then(res => {
          if (res.data) {
            this.showInfoMsg('success', '删除成功！')
            this.getImgListData(this.imgListParams)
          }
        })
        .catch(() => {
          this.showInfoMsg('info', '取消删除！')
        })
    },
    // 图片排序
    imgSort() {
      let arr = this.showImgList.filter((v, i) => {
        v.imgOrder = i
        return v
      })
      updateImgSort({
        jsonArray: JSON.stringify(arr)
      }).then(res => {
        if (res.data === 1) {
          this.getImgListData(this.imgListParams)
          this.showInfoMsg('success', '图片排序更改成功！')
        } else {
          this.showInfoMsg('error', '图片排序更改失败！')
        }
      })
    },
    // 删除图片
    deletePic(pic) {
      console.log(pic, 'del')
      pic.residentialInfoId = this.residentialInfoId
      this.$confirm('是否删除该图片', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return deleteImg({
            id: pic.id
          })
        })
        .then(() => {
          this.getImgListData(this.imgListParams)
          this.showInfoMsg('success', '删除成功!')
        })
        .catch(() => {
          this.showInfoMsg('info', '取消删除!')
        })
    },
    // 编辑图片信息
    editImgInfo(pic) {
      this.$refs.editImg.isShowEditDialog = true
      this.$refs.editImg.casArr = []
      this.formData = JSON.parse(JSON.stringify(pic))
    }
  },
  created() {
    let queryId = window.location.href.split('=')[1]
    this.residentialInfoId = sessionStorage.getItem('plotid')
    this.imgListParams.residentialId = this.residentialInfoId
    getHousePhotoTypeList()
      .then((data) => {
        this.photoTypeListData = data
        let dictItemCode = data[0].dictItemCode
        let dictItemValue = data[0].dictItemValue
        if (queryId) {
          let albumObj = data.find(v => v.dictItemCode === queryId)
          dictItemCode = albumObj.dictItemCode
          dictItemValue = albumObj.dictItemValue
        }
        this.activeType = dictItemCode
        this.tplType = dictItemCode
        this.activeTypeName = dictItemValue
        this.imgListParams.imgType = dictItemCode
        console.log(this.photoTypeListData)
        this.getImgListData(this.imgListParams)
      })
  },
  components: {
    editAlbum,
    editImg, // 编辑图片信息
    picUpload, // 上传
    draggable // 拖拽排序
  }
}
