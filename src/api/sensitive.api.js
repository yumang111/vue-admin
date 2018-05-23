// 敏感词管理
import {
  fdcHttp
} from 'fdc-common/http'
// 获取敏感词列表
export function getsensitivelist(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.restful.inter.sensitiveword.getlist', param)
}
// 增加敏感词
export function addsensitiveword(param) {
  return fdcHttp.get('/homeworkstation', 'homeworkstation.base.restful.inter.sensitiveword.add', param)
}
// 修改敏感词
export function updatesensitiveword(param) {
  return fdcHttp.get('/homeworkstation', 'homeworkstation.base.restful.inter.sensitiveword.update', param)
}
// 删除敏感词
export function deletesensitiveword(param) {
  return fdcHttp.get('/homeworkstation', 'homeworkstation.base.restful.inter.sensitiveword.delete', param)
}
