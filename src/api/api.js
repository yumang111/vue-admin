import {
  fdcJsonp,
  fdcHttp
} from 'fdc-common/http'
import yfhttp from '@/tools/http'
import Jsonp from './uc-jsonp'
// 获取用户信息 + 菜单列表
export function getuserInfo(method, param) {
  return Jsonp(process.env.API_ROOT_UC + '/auth/' + method, method, param)
}
// // 获取菜单列表
// export function getMeauList(param) {
//   return fdcJsonp('http://test.uc.fdc.com.cn/auth/auth.login.projectlist', 'auth.login.projectlist', param, {
//     param: 'uccallback'
//   })
// }
// 获取区域数据
export function getRegionData(param) {
  return yfhttp.jsonp('API_ROOT_HOMEBASE', 'homeoldapi.restful.inter.getdisticts', param)
}
// 获取片区
export function getsubRegion(param) {
  // return yfhttp.jsonp('API_ROOT_HOMEBASE', 'homeoldapi.restful.inter.getdistictsubs', param)
  return yfhttp.jsonp('API_ROOT_HOMEBASE', 'homeoldapi.restful.inter.getbasedistictsubs', param)
}
// 获取不限购区
export function getUnlimitedpurchasearea(param) {
  return fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.unlimitedpurchasearea.getlist', 'homebaseaction.base.unlimitedpurchasearea.getlist', param)
}
// 获取二手房基础数据类型
export function getoldhouseBasedata(param) {
  return yfhttp.jsonp('API_ROOT_DICT', 'usmaction.inter.dict.getDictItemByDictCatCode', param)
}
// 自主经营联系人
export function getOwnContact(param) {
  return yfhttp.jsonp('API_ROOT_DICT', 'usmaction.inter.department.getUsmEmpByDepartNo', param)
}
// 获取环线数据
export function getLooplineDate() {
  return fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.loopline.listloop', 'homebaseaction.base.loopline.listloop', {
    state: 1
  })
}
// 获取下架记录
export function getDeleteRecord(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.hsprocessrecord.getByhsid', param)
}

// 二手房 恢复有效
export function recoverOldHouse(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housesource.recoverById', params)
}
// 租房 恢复有效
export function recoverRentHouse(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.houserent.recoverById', params)
}
