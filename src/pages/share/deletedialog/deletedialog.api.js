import {
  fdcHttp
} from 'fdc-common/http'
// 新房下架
export function downNewHouse(param) {
  return fdcHttp.get(
    process.env.API_ROOT_HOMEWORK + '/homeworkstation',
    'homeworkstation.base.housepriceresult.upordownstatus',
    param
  )
}
// 二手房、租房下架
export function downHouse(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.house.downhouses', params)
}
// 二手房 删除
export function deleteOldHouse(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housesource.deleteById', params)
}
// 二手房 恢复有效
export function recoverOldHouse(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.housesource.recoverById', params)
}
// 租房 删除
export function deleteRentHouse(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.houserent.deleteById', params)
}
// 租房 恢复有效
export function recoverRentHouse(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.houserent.recoverById', params)
}
// 批量删除 二手房、租房
export function deleteHouse(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.house.delete', params)
}
// 下架日志
export function downLog(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.hsprocessrecord.batchinsert', params)
}
// 加入黑名单
export function toBlacklist(params) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.blacklist.insert', params)
}
