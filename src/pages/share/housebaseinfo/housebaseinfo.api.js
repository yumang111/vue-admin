import {
  fdcHttp
} from 'fdc-common/http'
export function getDeleteRecord(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.hsprocessrecord.getByhsid', param)
}
export function recoverHouse(method, param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', method, param)
}
