import mixins from '@/mixins/mixins'
import {
  modifyUnitInfo, // 修改单元
  batchUpdateHousingType, // 批量修改列户型
  deleteUnitInfo, // 删除单元
  batchUpdateAllProType, // 批量更改所有物业类型
  batchUpdateAllsaleStatus, // 批量更改所有销售状态
  batchUpdateProType, // 小批量修改物业类型
  getProTypeInfo, // 获取所有二级物业类型
  getUnitYFYJ, // 获取
  bindUnitYFYJ, // 绑定
  unbindUnitYFYJ, // 解绑
  addUnitInfo, // 添加单元楼
  getVisibleList, // 获取可视化数据
  addColRoomInfo, // 单元加列
  delColRoomInfo, // 单元删列
  addFloorInfo, // 批量加层
  delFloorInfo, // 批量删层
  addHouseInfo, // 添加单个房源
  deleteHouseInfo // 删除单个房源
} from './visualBuilding.api'
import {
  getHousingTypePlot
} from '@/api/plot.api'
export default {
  props: ['building', 'proType'], // 开放一个unit数据接口
  data: () => ({
    loading: false, // 加载锁屏
    colors: [], // 二级物业类型
    houseList: [], // 选中房源集合
    allHouseType: '', // 整个房源物业类型
    allsaleStatus: '', // 整个房源销售状态
    color: '', // 记录选中二级物业的颜色
    selectProType: {}, // 选中的二级物业对象
    isSale: '', // 销售状态
    delHouseStatus: '', // 1-删除房源 2-激活房源
    yfyjUnitList: [], // 一房一价单元列表
    dialogTableVisible: false,
    tableData: [],
    unit: {
      maxFloor: 1,
      minFloor: 1,
      floor: 0,
      unitList: []
    },
    // 销售状态信息列表
    saleStatusList: [{
      name: '在售',
      tit: 'sale'
    },
    {
      name: '已售',
      tit: 'sold'
    },
    {
      name: '未知',
      tit: 'unknown'
    }
    ],
    currentUnit: {}, // 当前单元 - 绑定一房一价
    yfyjUnit: '', // 选中一房一价单元
    bindUnitDialog: false,
    selectCol: {}, // 选中列信息
    housingTypeList: [],
    currentHousingType: '' // 当前选中的户型
  }),
  mixins: [mixins],
  methods: {
    beforeClose() {
      this.houseList = []
      this.dialogTableVisible = false
    },
    // 清空当前操作
    clearHouseList() {
      this.houseList = []
      this.resetConditions()
      this.getHouseList()
    },
    // 更改电梯数
    changeElevator(v, num) {
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      let params = {
        id: v.id
      }
      if (v.elevatorNum === 10 && num === 1) {
        this.showInfoMsg('warning', '电梯数不得大于10部')
        return false
      }
      if (!v.elevatorNum) {
        v.elevatorNum = 0
      }
      if (v.bind === '1') {
        params.elevator = v.elevatorNum + num
      } else {
        params.elevatorNum = v.elevatorNum + num
      }
      if (params.elevator < 0) return
      modifyUnitInfo(params).then(res => {
        if (res.data === 1) {
          this.getHouseList()
          this.showInfoMsg('success', '更改电梯数成功')
        }
      }).catch(err => {
        this.showInfoMsg('error', err)
      })
    },
    // 点击更改户型
    selectHouseType(item, v) {
      this.currentHousingType = ''
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      if (item.colHousingType) {
        // 解除捆绑
        this.$confirm('是否要解除户型绑定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchUpdateHousingType({
            unitId: v.id,
            residentialInfoUnitId: '',
            room: item.colNum
          }).then(res => {
            if (res.data > 0) {
              this.showInfoMsg('success', '绑定户型成功！')
              this.currentHousingType = ''
              this.getHouseList()
            }
          })
        })
      } else {
        this.dialogTableVisible = true
        this.selectCol.unitId = v.id
        this.selectCol.colNum = item.colNum
      }
    },
    // 设置选中的户型
    setHouseType() {
      if (!this.currentHousingType) {
        this.showInfoMsg('warning', '请选择户型')
        return false
      }
      this.dialogTableVisible = false
      if (this.houseList.length > 0) {
        this.saveChange(this.currentHousingType) // 修改单个户型
      } else {
        // 批量修改物业类型
        batchUpdateHousingType({
          unitId: this.selectCol.unitId,
          residentialInfoUnitId: this.currentHousingType,
          room: this.selectCol.colNum
        }).then(res => {
          if (res.data > 0) {
            this.showInfoMsg('success', '修改户型成功！')
            this.currentHousingType = ''
            this.getHouseList()
          }
        }).catch(err => {
          this.showInfoMsg('error', err)
        })
      }
    },
    // 解绑单元
    unbindUnit(v) {
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      this.$confirm('是否要解除该单元绑定的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        return unbindUnitYFYJ({
          id: v.id
        })
      }).then(res => {
        this.loading = false
        if (res.deleteResult && res.unitBindResult && res.housePriceResult) {
          this.yfyjUnit = ''
          this.showInfoMsg('success', '解除绑定成功！')
          this.getHouseList()
        } else {
          this.showInfoMsg('success', '解绑失败')
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 选择要绑定的一房一价单元
    changeyfyjUnitInfo(val) {
      this.yfyjUnit = val
    },
    // 绑定单元
    bindUnit() {
      if (!this.yfyjUnit) {
        this.showInfoMsg('warning', '请选择一房一价单元')
        return false
      }
      this.loading = true
      bindUnitYFYJ({
        buildingId: this.building.id,
        bindId: this.currentUnit.id,
        bindShow: this.currentUnit.unitNum,
        propertyType: this.proType,
        unit: this.yfyjUnit
      }).then(res => {
        this.loading = false
        if (res.housePriceResult && res.syncResult && res.unitBindResult) {
          this.bindUnitDialog = false
          this.yfyjUnit = ''
          this.getHouseList()
        } else {
          this.showInfoMsg('error', '绑定失败')
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 重置所有选择条件
    resetConditions() {
      this.color = ''
      this.selectProType = {}
      this.isSale = ''
      this.delHouseStatus = ''
      this.currentHousingType = ''
    },
    // 选择物业类型
    selectOneColor(item) {
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      if (this.color !== item.color) {
        this.resetConditions()
        this.color = item.color
        this.selectProType = item
      } else {
        this.color = ''
        this.selectProType = {}
      }
    },
    // 选择销售状态
    changeSale(item) {
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      if (this.isSale !== item.name) {
        this.resetConditions()
        this.isSale = item.name
        this.getHouseList()
      } else {
        this.isSale = ''
      }
    },
    // 选择删除或新增房源
    changeHouseStatus(val) {
      if (this.delHouseStatus === val) {
        this.delHouseStatus = ''
        return false
      }
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      this.resetConditions()
      this.delHouseStatus = val
    },
    // 选择要修改的房源
    changeThisColor(i, index, n, val, v) {
      let house = this.unit.unitList[i].unitRoom[index].colList[n]
      if (house) {
        if (this.color) { // 1.修改物业类型
          house.propertySubType = this.selectProType.shortKey
          this.houseList.push(val)
        } else if (this.isSale) { // 2.修改销售状态
          house.saleStatusShow = this.isSale
          this.houseList.push(val)
        } else if (this.delHouseStatus) {
          if (this.delHouseStatus === 1) { // 3.删除单个房源
            if (val.manual === '0') {
              this.showInfoMsg('error', '一房一价数据不能删除')
              return false
            }
            this.$confirm('是否删除该房源？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              return deleteHouseInfo({
                unitId: v.id, // 判断要处理的数据表
                id: val.id
              })
            }).then(res => {
              if (res.data === 1) {
                this.showInfoMsg('success', '删除房源成功！')
                this.getHouseList()
              }
            }).catch(res => {
              if (res === 'cancel') {} else {
                this.showInfoMsg('error', res)
              }
            })
          }
        } else {
          this.resetConditions()
          this.houseList.push(val)
          if (val.residentialInfoUnit) {
            this.$confirm('是否解除户型绑定？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.saveChange('')
            }).catch(err => {
              if (err === 'cancel') {
                this.houseList = []
              }
            })
          } else {
            this.dialogTableVisible = true
          }
        }
      }
      if (this.delHouseStatus === 2) { // 4.添加单个房源
        this.$confirm('是否激活该房源？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return addHouseInfo({
            unitId: v.id,
            floor: this.unit.maxFloor - n,
            roomShow: val.colNum // 此处的val -- 一列的对象
          })
        }).then(res => {
          if (res.data === 1) {
            this.showInfoMsg('success', '新增房源成功！')
            this.getHouseList()
          }
        }).catch(res => {
          if (res === 'cancel') {} else {
            this.showInfoMsg('error', res)
          }
        })
      }
    },
    // 小批量修改 -- 提交
    saveChange(value) {
      let filter = []
      this.houseList.forEach(v => {
        if (filter.length === 0) {
          let obj = {
            unitId: '',
            houseIds: []
          }
          obj.unitId = v.unitId
          obj.houseIds = v.id
          filter.push(obj)
        } else {
          let exist = filter.find(val => {
            if (val.unitId === v.unitId) {
              val.houseIds += ',' + v.id
              return true
            }
          })
          if (!exist) {
            let obj = {
              unitId: '',
              houseIds: []
            }
            obj.unitId = v.unitId
            obj.houseIds = v.id
            filter.push(obj)
          }
        }
      })
      if (typeof (value) === 'object') {
        value = null
      }
      if (!this.isSale) {
        this.isSale = null
      }
      if (!this.selectProType.shortKey) {
        this.selectProType.shortKey = null
        this.selectProType.propertyName = null
      }
      batchUpdateProType({
        houses: JSON.stringify(filter),
        propertySubType: this.selectProType.shortKey,
        propertySubName: this.selectProType.propertyName,
        saleStatusShow: this.isSale,
        residentialInfoUnitId: value
      }).then(res => {
        console.log(res, 'ejwylx')
        if (res.data > 0) {
          this.houseList = []
          this.color = ''
          this.showInfoMsg('success', '修改成功！')
          this.getHouseList()
        }
      })
    },
    // 批量修改所有房源物业类型
    changeAllProType(val) {
      if (!val) {
        return false
      }
      if (this.houseList.length > 0) {
        this.allHouseType = ''
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      this.resetConditions()
      this.$confirm('是否更改所有房源物业类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        return batchUpdateAllProType({
          buildingId: this.building.id,
          propertyType: this.proType,
          propertySubName: this.$refs.allHouseType.selected.label,
          propertySubType: val
        })
      }).then(res => {
        this.allHouseType = ''
        this.showInfoMsg('success', '修改物业类型成功！')
        this.getHouseList()
      }).catch(res => {
        if (res === 'cancel') {
          this.allHouseType = ''
        } else {
          this.showInfoMsg('error', res)
        }
      })
    },
    // 批量修改所有房源销售状态
    changeAllsaleStatusList(val) {
      if (!val) {
        return false
      }
      if (this.houseList.length > 0) {
        this.allHouseType = ''
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      this.resetConditions()
      this.$confirm('是否更改所有房源销售状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        return batchUpdateAllsaleStatus({
          buildingId: this.building.id,
          propertyType: this.proType,
          saleStatusShow: val
        })
      }).then(res => {
        this.allsaleStatus = ''
        this.showInfoMsg('success', '修改销售状态成功！')
        this.getHouseList()
      }).catch(res => {
        if (res === 'cancel') {
          this.allsaleStatus = ''
        } else {
          this.showInfoMsg('error', res)
        }
      })
    },
    // 获取一房一价数据
    getYFYJUnit(v) {
      this.yfyjUnit = ''
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      if (this.building.bind !== '1') {
        this.showInfoMsg('info', '请先绑定楼栋！')
        return false
      }
      this.bindUnitDialog = true
      this.currentUnit = v
      getUnitYFYJ({
        buildingId: this.building.id,
        propertyType: this.proType
      }).then(res => {
        this.yfyjUnitList = res.data
        console.log(res, 'unitYFYJ')
      })
    },
    // 将数字转化为数组
    numToArray(n) {
      var arr = []
      for (var i = 1; i <= n; i++) {
        arr.push(i)
      }
      return arr
    },
    // 删除单元楼
    reduceUnitFloor(v) {
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      deleteUnitInfo({
        id: v.id
      }).then(res => {
        if (res.data === 1) {
          this.getHouseList()
          this.showInfoMsg('success', '删除单元成功！')
        }
      }).catch(res => {
        this.showInfoMsg('error', '单元楼已经绑定')
      })
    },
    // 添加一个新单元楼
    addUnitFloor() {
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      let unitNum = this.unit.unitList.length + 1
      if (unitNum > 10) {
        this.showInfoMsg('warning', '单元最多10栋！')
        return false
      }
      addUnitInfo({
        buildingId: this.building.id,
        unitNum: unitNum,
        propertyType: this.proType
      }).then(res => {
        if (res.data) {
          this.getHouseList()
          this.showInfoMsg('success', '新建单元成功！')
        }
      }).catch(res => {
        this.showInfoMsg('error', res)
      })
    },
    // 单元删列
    reduceRoom(v) {
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      if (!v.maxRoom) {
        return false
      }
      this.$confirm('是否删除整列房源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delColRoomInfo({
          unitId: v.id,
          room: v.maxRoom
        })
      }).then(res => {
        if (res.data > 0) {
          this.showInfoMsg('success', '删除房源成功！')
          this.getHouseList()
        }
      }).catch(res => {
        if (res === 'cancel') {} else {
          this.showInfoMsg('error', res)
        }
      })
    },
    // 单元添加列
    addRoom(v) {
      if (this.houseList.length > 0) {
        this.showInfoMsg('warning', '有数据修改没有提交！')
        return false
      }
      this.$confirm('是否添加一列房源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return addColRoomInfo({
          unitId: v.id,
          maxRoom: v.maxRoom ? v.maxRoom + 1 : 1,
          maxFloor: this.unit.maxFloor,
          minFloor: this.unit.minFloor,
          residentialInfoFrontId: this.building.residentialInfoId,
          residentialSubId: this.building.residentialSubId
        })
      }).then(res => {
        if (res.data === 1) {
          this.showInfoMsg('success', '添加房源成功！')
          this.getHouseList()
        }
      }).catch(res => {
        if (res === 'cancel') {} else {
          this.showInfoMsg('error', res)
        }
      })
    },
    // 改变层数
    changeMaxFloor(e) {
      let newFloor = Number(e.target.value)
      if (newFloor === this.unit.maxFloor) { // 楼层与原楼层相同不处理
        return false
      }
      if (!/^-?[0-9]*[1-9][0-9]*$/.test(newFloor)) {
        this.showInfoMsg('warning', '楼层必须为整数！')
        this.getHouseList()
        return false
      }
      if (newFloor > 100) {
        this.showInfoMsg('warning', '最高层数不得高于100层')
        this.getHouseList()
        return false
      }
      if (newFloor < this.unit.minFloor) {
        this.showInfoMsg('warning', '最高层数不得低于最低层数！')
        this.getHouseList()
        return false
      }
      if (newFloor > this.unit.maxFloor) {
        this.$confirm('是否修改房源层数？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          return addFloorInfo({
            residentialInfoFrontId: this.building.residentialInfoId,
            residentialSubId: this.building.residentialSubId,
            buildingId: this.building.id,
            propertyType: this.proType,
            maxFloor: newFloor,
            minFloor: this.unit.maxFloor + 1
          })
        }).then(res => {
          if (res.data === 1) {
            this.showInfoMsg('success', '添加房源成功！')
            this.getHouseList()
          }
        }).catch(res => {
          if (res === 'cancel') {} else {
            this.showInfoMsg('error', res)
          }
        })
      } else if (newFloor < this.unit.maxFloor) {
        this.$confirm('是否修改房源层数？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          return delFloorInfo({
            buildingId: this.building.id,
            propertyType: this.proType,
            maxFloor: this.unit.maxFloor,
            minFloor: newFloor + 1
          })
        }).then(res => {
          if (res.data > 0) {
            this.showInfoMsg('success', '删除房源成功！')
            this.getHouseList()
          }
        }).catch(res => {
          if (res === 'cancel') {} else {
            this.showInfoMsg('error', res)
          }
        })
      }
    },
    changeMinFloor(e) {
      let newFloor = Number(e.target.value)
      if (newFloor === this.unit.minFloor) { // 楼层与原楼层相同不处理
        return false
      }
      if (!/^-?[0-9]*[1-9][0-9]*$/.test(newFloor)) {
        this.showInfoMsg('warning', '楼层必须为整数！')
        this.getHouseList()
        return false
      }
      if (newFloor < -10) {
        this.showInfoMsg('warning', '最高层数不得低于-10层')
        this.getHouseList()
        return false
      }
      if (newFloor > this.unit.maxFloor) {
        this.showInfoMsg('warning', '最低层数不得高于最高层数！')
        this.getHouseList()
        return false
      }
      if (newFloor < this.unit.minFloor) {
        this.$confirm('是否修改房源层数？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return addFloorInfo({
            residentialInfoFrontId: this.building.residentialInfoId,
            residentialSubId: this.building.residentialSubId,
            buildingId: this.building.id,
            propertyType: this.proType,
            maxFloor: this.unit.minFloor - 1,
            minFloor: newFloor
          })
        }).then(res => {
          if (res.data === 1) {
            this.showInfoMsg('success', '添加房源成功！')
            this.getHouseList()
          }
        }).catch(res => {
          if (res === 'cancel') {} else {
            this.showInfoMsg('error', res)
          }
        })
      } else if (newFloor > this.unit.minFloor) {
        this.$confirm('是否修改房源层数？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return delFloorInfo({
            buildingId: this.building.id,
            propertyType: this.proType,
            maxFloor: newFloor - 1,
            minFloor: this.unit.minFloor
          })
        }).then(res => {
          this.showInfoMsg('success', '删除房源成功！')
          this.getHouseList()
        }).catch(res => {
          if (res === 'cancel') {} else {
            this.showInfoMsg('error', res)
          }
        })
      }
    },
    // 获取房源信息
    getHouseList() {
      if (!this.building.id) return
      this.loading = true
      getVisibleList({
        buildingId: this.building.id,
        propertyType: this.proType
      }).then(res => {
        this.loading = false
        this.unit.unitList = res.data
        this.unit.maxFloor = res.maxFloor
        this.unit.minFloor = res.minFloor
        console.log(this.unit.unitList, 'unitList')
        this.unit.floor = res.maxFloor - res.minFloor + 1
        console.log(this.unit.unitList, 'unitList')
      })
    },
    closeDialog() {
      this.currentHousingType = ''
    }
  },
  created() {
    this.getHouseList()
    getHousingTypePlot({
      residentialInfoId: this.building.residentialInfoId
    }).then(res => {
      this.housingTypeList = res.data
    })
    getProTypeInfo({
      currentPage: 1,
      totalpages: 1,
      pages: 1,
      rowsPerPage: 15 // 1页显示的条数
    }).then(res => {
      let arr = ['F46060', 'FF8585', 'FFA450', 'F5CE56', 'E3E540', 'BADC57', '72CF65', '4EDD9A', '4EDDD8', '5FC7EF', '5F9EEF', '5C71E8', 'B47BF0', 'EC72D9', 'FF77AE']
      this.colors = res.data
      this.colors.forEach((v, i) => {
        v.color = arr[i]
      })
      console.log(this.colors, 'ddddddddddd')
    })
  }
}
