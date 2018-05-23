import { fdcHttp } from 'fdc-common/http'
// 添加公司
export function sendOtherCompany(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.othercompanyinfo.add', param)
}
// 公司联想
export function thinkOtherCompany(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.othercompanyinfo.limitpage', param)
}
// 搜索公司
export function searchOtherCompany(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.othercompanyinfo.page', param)
}
// 更新公司
export function updateOtherCompany(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.othercompanyinfo.update', param)
}
