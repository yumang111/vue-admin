import {
  updateImgInfo,
  getResidentialsubPlot,
  getBuildingSub
} from '@/api/plot.api'
import mixins from '@/mixins/mixins'

import picUpload from '../album/album-upload/album-upload.vue'
import editImg from '../album/editImg/editImg.vue'
import {
  deleteImg,
  getPinInfo,
  getImgByInstallment,
  updateImg
} from './sandTableFigure.api'
export default {
  data() {
    // function point($event, item) {
    //   this.createpoint($event, item)
    // }
    return {
      loading: false,
      iconZIndex: 1,
      form: {
        imgDesc: ''
      },
      iconList: [],
      iconType: '',
      iconTypeName: '',
      isInstallment: 0, // 当前高亮分期index
      plotid: '',
      installmentList: [], // 分期数组
      buildings: [], // 楼栋数组
      choseBuildingArrow: '',
      sandImg: {
        imgDesc: ''
      },
      imgSigns: [], // 图片描点
      drawOnce: false, // 楼栋描点只允许描一次
      buildingsInfo: {}, // 标注信息
      currentInstallmentId: '', // 当前分期id
      activeType: 'tiny', // 图标图片类型
      formData: '', // 图标图片信息
      isBuilding: '', // 是否标注的是楼栋
      lastImgId: '' // 上一张沙盘图id
    }
  },
  mixins: [mixins],
  methods: {
    formatSaleState(value) {
      switch (value) {
        case 'xs101':
          value = '待售'
          break
        case 'xs102':
          value = '在售'
          break
        case 'xs103':
          value = '售罄'
          break
      }
      return value
    },
    changeZIndex(e) {
      e.currentTarget.style.zIndex = ++this.iconZIndex
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let signs = JSON.parse(JSON.stringify(this.imgSigns))
          signs.forEach(v => {
            if (v.idType === '9') {
              v.bulidingNum += '栋'
            }
          })
          let params = {
            id: this.sandImg.id,
            imgDesc: this.sandImg.imgDesc,
            imgSigns: JSON.stringify(signs)
          }
          updateImg(params).then(res => {
            if (res.data === 1) {
              this.showInfoMsg('success', '修改沙盘图信息成功')
              this.selectInstallment(this.currentInstallmentId)
            }
          })
        }
      })
    },
    forbadeIcon(icon, flag) {
      icon.delFlag = flag
      updateImgInfo(icon).then(res => {
        if (res.data === 1) {
          if (flag === '1') {
            this.showInfoMsg('success', '禁用图标成功')
          } else {
            this.showInfoMsg('success', '启用图标成功')
          }
        }
      })
    },
    editImgInfo(icon) {
      this.$refs.editImg.isShowEditDialog = true
      this.$refs.editImg.casArr = []
      this.formData = JSON.parse(JSON.stringify(icon))
    },
    reset(id) {
      if (id === '9') {
        this.selectInstallment(this.currentInstallmentId)
      } else if (id === 'tiny') {
        // 获取图钉图
        this.getPinList()
      } else {
        if (this.iconType === '9') {
          if (this.lastImgId) {
            deleteImg({
              id: this.lastImgId
            }).then(res => {}).then(() => {
              this.selectInstallment(this.currentInstallmentId)
            })
          } else {
            this.selectInstallment(this.currentInstallmentId)
          }
        } else {
          this.getPinList()
        }
      }
    },
    showUploadDialog(iconType, iconTypeName, refName) {
      this.iconType = iconType
      this.iconTypeName = iconTypeName
      this.$refs[refName].form.imgList = []
      this.$refs[refName].dialogVisible = true
    },
    // 获取图钉list
    getPinList() {
      getPinInfo({
        imgType: 'tiny'
      }).then(res => {
        this.iconList = res.data
      })
    },
    choseBuilding($event, item, isBuilding) {
      if (this.choseBuildingArrow === item.id) {
        this.drawOnce = true
        this.choseBuildingArrow = ''
        return false
      }
      this.isBuilding = isBuilding
      this.drawOnce = false
      this.choseBuildingArrow = item.id
      this.buildingsInfo = item
    },
    point(e) {
      if (!this.buildingsInfo) return
      this.createpoint(e, this.buildingsInfo)
    },
    createpoint: function (e, list) {
      if (!list.id) return
      let imgBox = this.$refs.houseImg
      let w = imgBox.clientWidth // 图片容器宽
      let h = imgBox.clientHeight // 图片容器高
      let x = e.clientX - imgBox.getBoundingClientRect().left
      let y = e.clientY - imgBox.getBoundingClientRect().top
      let posL = ''
      let posT = ''
      // 判断原数组中有没有改楼栋
      let isExisted = this.imgSigns.find(function (point) {
        if (point.id === list.id) {
          return point
        }
      })
      // 坐标位置边界判断
      if (!this.drawOnce) {
        if (e.layerX > w - 70) {
          posL = x - 70 + 'px'
        } else {
          posL = x + 'px'
        }
        if (e.layerY > h - 30) {
          posT = y - 30 + 'px'
        } else {
          posT = y + 'px'
        }
        // 如果标记数组中存在该项 记住点击的位置 赋值 不存在则push
        if (isExisted && this.isBuilding) {
          isExisted.posT = posT
          isExisted.posL = posL
          isExisted.saleStatus = list.saleState
        } else {
          if (list.imgName) {
            this.imgSigns.push({
              iconType: list.iconType || '',
              bulidingNum: list.imgName,
              idType: 'tiny',
              id: 'mark_' + list.id,
              posL: posL,
              posT: posT,
              url: list.imgSrc
            })
          } else {
            this.imgSigns.push({
              id: list.id,
              bulidingNum: list.bulidingNum,
              idType: '9',
              posL: posL,
              posT: posT,
              saleStatus: list.saleState
            })
          }
        }
        this.showInfoMsg('success', '标注成功')
        this.buildingsInfo = {}
        this.choseBuildingArrow = ''
        this.drawOnce = true
      }
    },
    // 移除标注
    removePoint(item) {
      this.imgSigns = this.imgSigns.filter(function (ele) {
        // ! 通过位置来删除（可能删除多个）
        return !(ele.posL === item.posL && ele.posT === item.posT)
      })
    },
    // 选择分期
    selectInstallment(val) {
      this.currentInstallmentId = val
      this.imgSigns = []
      this.sandImg = {
        imgDesc: ''
      }
      // 获取沙盘图
      getImgByInstallment({
        residentialSubId: val
      }).then(res => {
        this.loading = true
        if (res.data && res.data.length) {
          this.sandImg = res.data[0]
          this.lastImgId = this.sandImg.id
          if (this.sandImg.imgSigns) {
            this.imgSigns = JSON.parse(this.sandImg.imgSigns)
          } else {
            this.imgSigns = []
          }
          this.$nextTick(() => {
            document.getElementById('imgView').onload = () => {
              this.loading = false
            }
          })
        } else {
          this.lastImgId = ''
        }
      })
      // 获取楼栋信息
      getBuildingSub({
        residentialSubId: val
      }).then(res => {
        this.buildings = res.data
        // console.log(res.data, 'buildingList')
      })
      this.$router.push({
        path: '/homeworkstation/plot/plotPortal/sandTableFigure',
        query: {
          installmentId: val
        }
      })
    },
    init(id) {
      this.getPinList()
      getResidentialsubPlot({
        residentialInfoId: this.plotid,
        getType: 'vo'
      }).then(res => {
        if (res.data) {
          this.installmentList = res.data.simpleInfoVOList
          let len = this.installmentList.length
          if (this.installmentList && len !== 0) {
            this.isInstallment = len - 1
            this.currentInstallmentId = id || this.installmentList[len - 1].id
          }
        }
      })
    }
  },
  components: {
    picUpload,
    editImg
  },
  created() {
    let queryId = window.location.href.split('=')[1]
    this.plotid = sessionStorage.getItem('plotid')
    this.init(queryId)
  }
}
