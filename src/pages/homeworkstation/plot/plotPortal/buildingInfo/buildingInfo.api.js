import { fdcHttp } from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')
// 添加楼栋
export function addBuildingInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.building.add', { ...param,
    residentialInfoId: plotid
  })
}
// 修改楼栋信息
export function modifyBuildingInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.building.modify', { ...param,
    residentialInfoId: plotid
  })
}
// 根据楼栋id获取楼栋信息
export function getBuildingInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.building.get', param)
}
// 根据分期获取楼栋信息
export function getAllBuildingInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.building.limitpage', param)
}
// 添加单元
export function addUnitInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.unit.add', { ...param,
    residentialInfoId: plotid
  })
}
// 获取一房一价楼栋信息
export function getBuildingYFYJ(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housepriceresources.getbuildingsbyid', param)
}
// 绑定一房一价楼栋
export function bindBuildingYFYJ(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.building.relationHousePriceResources', { ...param,
    residentialInfoId: plotid
  })
}
// 解绑一房一价楼栋
export function unbindBuildingYFYJ(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.building.unbind', { ...param,
    residentialInfoId: plotid
  })
}
// 复制楼栋
export function copyBuildingInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.building.copy', { ...param,
    residentialInfoId: plotid
  })
}

