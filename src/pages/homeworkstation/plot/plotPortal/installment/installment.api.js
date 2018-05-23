import { fdcHttp, fdcJsonp } from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')

// 保存物业类型表
export function saveTypeForm(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.property.add', { ...param,
    residentialInfoId: plotid
  })
}
// 查看物业类型表
export function getTypeForm(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.property.get', param)
}
// 分期物业类型信息更新
export function updateTypeForm(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.property.update', { ...param,
    residentialInfoId: plotid
  })
}
// 新增分期
export function addInstallmentInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.add', { ...param,
    residentialInfoId: plotid
  })
}
// 获取分期信息
export function getInstallmentInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.getbyid', param)
}
// 修改分期信息
export function changeInstallmentInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.modify', { ...param,
    residentialInfoId: plotid
  })
}
// 获取400
export function getPhone400(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.property.phoneget', param)
}
// 获取首付比例
export function getDownPaymentFor(param) {
  let method = 'homebaseaction.base.propertytype.getPropertyTypeByParentAndName'
  return fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/' + method, method, param)
}

