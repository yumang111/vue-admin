import { fdcHttp, fdcJsonp } from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')

// 添加单元 'http://esf.basedev.fdc.com.cn/homeworkstation' process.env.API_ROOT_HOMEWORK + '/homeworkstation'
export function addUnitInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.unit.add', { ...param,
    residentialInfoId: plotid
  })
}
// 修改单元
export function modifyUnitInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.unit.modify', { ...param,
    residentialInfoId: plotid
  })
}

// 获取可视化楼栋信息
export function getVisibleList(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.getvisiblelist', param)
}
// 单元加列
export function addColRoomInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.batchAddByRoom', { ...param,
    residentialInfoId: plotid
  })
}
// 单元删列
export function delColRoomInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.batchDeleteByRoom', { ...param,
    residentialInfoId: plotid
  })
}
// 批量加层
export function addFloorInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.batchAddByFloor', { ...param,
    residentialInfoId: plotid
  })
}
// 批量删层
export function delFloorInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.batchDeleteByFloor', { ...param,
    residentialInfoId: plotid
  })
}
// 添加单个房源
export function addHouseInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.add', { ...param,
    residentialInfoId: plotid
  })
}
// 删除单个房源
export function deleteHouseInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.delete', { ...param,
    residentialInfoId: plotid
  })
}
// 获取一房一价单元信息
export function getUnitYFYJ(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresources.getunitsbyid', param)
}
// 绑定一房一价单元
export function bindUnitYFYJ(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.unit.relationHousePriceResources', { ...param,
    residentialInfoId: plotid
  })
}
// 解绑一房一价单元
export function unbindUnitYFYJ(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.unit.unBind', { ...param,
    residentialInfoId: plotid
  })
}
// 小批量修改二级物业类型
export function batchUpdateProType(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.batchUpdate', { ...param,
    residentialInfoId: plotid
  })
}
// 批量修改所有房源二级物业类型
export function batchUpdateAllProType(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.batchUpdateProperty', { ...param,
    residentialInfoId: plotid
  })
}
// 批量修改所有房源销售状态
export function batchUpdateAllsaleStatus(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.batchUpdate.salestatus', { ...param,
    residentialInfoId: plotid
  })
}
// 删除单元
export function deleteUnitInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.unit.delete', { ...param,
    residentialInfoId: plotid
  })
}
// 批量修改列户型
export function batchUpdateHousingType(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresult.batchUpdateHousingTypeByRoom', { ...param,
    residentialInfoId: plotid
  })
}

// 获取二级物业类型
export function getProTypeInfo(param) {
  return fdcJsonp('http://test.homebase.fdc.com.cn/homebaseaction/homebaseaction.base.propertytype.listdecorate', 'homebaseaction.base.propertytype.listdecorate', param)
}
