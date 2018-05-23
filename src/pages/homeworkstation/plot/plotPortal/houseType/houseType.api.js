import { fdcHttp, fdcJsonp } from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')
// 添加户型
export function addHousingType(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingtypeinfo.add', { ...param,
    residentialInfoId: plotid
  })
}
// 户型推荐
export function recommendHousingType(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingtypeinfo.change.recommendstatus', { ...param,
    residentialInfoId: plotid
  })
}
// 查看户型列表（含条件查询）
export function getHousingTypeListInfo(param) {
  let temp = {}
  for (let key in param) {
    if (param[key] && param[key] !== '0') {
      temp[key] = param[key]
    }
  }
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingtypeinfo.limitpage', temp)
}
// 户型更新
export function modifyHousingTypeInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingtypeinfo.modify', { ...param,
    residentialInfoId: plotid
  })
}
// 单个户型查看
export function getHousingTypeInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingtypeinfo.get', param)
}
// 根据小区id获取所有户型
export function getAllHousingTypeInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housingtypeinfo.getall', param)
}
// 获取所有房型
export function getAllhouseTypeInfo(param) {
  return fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/homebaseaction.base.housetype.limitpage', 'homebaseaction.base.housetype.limitpage', param)
}
