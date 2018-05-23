import { fdcHttp } from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')
// 图钉展示接口
export function getPinInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.tinyimgs.show', param)
}
// 根据单个图片id获取图片
export function getImgById(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.byid', param)
}
// 根据分期id获取沙盘图
export function getImgByInstallment(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.get.sandtableimg', param)
}
// 更新沙盘图信息
export function updateImg(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.update', { ...param,
    residentialInfoId: plotid
  })
}
// 删除沙盘图
export function deleteImg(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.homeimg.delete', { ...param,
    residentialInfoId: plotid
  })
}
