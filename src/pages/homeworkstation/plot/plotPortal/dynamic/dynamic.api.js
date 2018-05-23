import {
  fdcHttp
} from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')
// 新增动态
export function addDynamicInfo(param) {
  return fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.dynamicStateInfo.add', { ...param,
    residentialInfoId: plotid
  })
}
// 查询动态列表
export function getDynamicInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.dynamicStateInfo.getByPage', param)
}
// 删除动态
export function deleteDynamicInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.dynamicStateInfo.delOne', { ...param,
    residentialInfoId: plotid
  })
}
// 删除动态
export function editDynamicInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.dynamicStateInfo.editOne', { ...param,
    residentialInfoId: plotid
  })
}
