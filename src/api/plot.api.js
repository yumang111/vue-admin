import {
  fdcJsonp,
  fdcHttp
} from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')
// 根据小区获取所有户型
export function getHousingTypePlot(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingtypeinfo.getall', param)
}
// 获取小区所有分期信息
export function getResidentialsubPlot(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.getlist', param)
}
// 根据分期获取所有楼栋
export function getBuildingSub(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.building.limitpage', param)
}
// 查看当前分期
export function getCurrentSub(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.getbyid', param)
}
// 根据标签id获取标签
export function getTagInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.getbyid', param)
}
// 其他公司使用统计
export function othercompanyUse(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.othercompanyinfo.oneuse', param)
}
// 标签使用统计
export function tagUseCount(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.changeusedcount', param)
}
// 省
export function getProvinceInfo() {
  return fdcJsonp(process.env.API_ROOT_DICTLINE, 'ucaction.user.getprovinces', {})
}
// 省 -- 市
export function getCityInfo(param) {
  return fdcJsonp(process.env.API_ROOT_DICTLINE, 'ucaction.user.getcitiesid', param)
}
// 市 -- 县
export function getCountyInfo(param) {
  return fdcJsonp(process.env.API_ROOT_DICTLINE, 'ucaction.user.getareabyid', param)
}
// 一级物业类型
export function getFirstType(param) {
  return fdcJsonp(process.env.API_ROOT_DICT, 'usmaction.inter.dict.getDictItemByDictCatCode', param)
}
// 二级物业类型
export function getSecondType(param) {
  return fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.propertytype.parent', 'homebaseaction.base.propertytype.parent', param)
}
// 获取服务端时间
export function getTimeFromInter(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.timenow', param)
}
// 根据ids获取图片list
export function getImgList(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.byid', param)
}
// 更新图片信息
export function updateImgInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.update', { ...param,
    residentialInfoId: plotid
  })
}
// 根据图片id删除图片
export function deleteImgInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.delete', { ...param,
    residentialInfoId: plotid
  })
}
// 根据分期 + 物业类型 -- 商业数据
export function getShopsInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialbusinessinfo.getbyPropertyPair', param)
}
// 新增 商业数据
export function addShopsInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialbusinessinfo.add', { ...param,
    residentialInfoId: plotid
  })
}
// 更新 商业数据
export function updateShopsInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialbusinessinfo.updateById', { ...param,
    residentialInfoId: plotid
  })
}
