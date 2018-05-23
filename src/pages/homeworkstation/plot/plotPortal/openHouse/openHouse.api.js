import {
  fdcHttp
} from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')
// 新增开盘
export function addOpenHouseInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residential.openinfo.add', { ...param,
    residentialInfoId: plotid
  })
}
// 更新开盘
export function updateOpenHouseInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residential.openinfo.update', { ...param,
    residentialInfoId: plotid
  })
}
// 获取户型信息
export function getHousingTypeInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingtypeinfo.limitpage.bybuildingid', param)
}
// 获取当前分期下所有开盘
export function getOpenHouseListInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residential.openinfo.pagelist', param)
}
// 获取当前开盘信息
export function getOpenHouseInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residential.openinfo.getbyid', param)
}
// 根据楼栋ids 获取户型信息
export function getHousingTypeListInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.openinfo.gethouseresouce.bybuildingid', param)
}
// 根据户型ids 获取预售证信息列表
export function getPreSalePermitList(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.openinfo.getPreSalePermit.onHouseResourceIds', param)
}
// 根据开盘 + 二级物业类型 -- 获取价格表
export function getPriceListInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.openinfoPrice.page', param)
}
// 新增价格
export function addPriceInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.openinfoPrice.addOne', param)
}
// 价格id -- 修改价格信息(含删除 delState=1)
export function editPriceInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.openinfoPrice.updateOneRecord', param)
}
