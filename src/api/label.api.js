// 基础数据标签管理 及分类管理api
import {
  fdcHttp
} from 'fdc-common/http'
// 'http://esf.basedev.fdc.com.cn/homeworkstation'
// 获取一级标签分类
export function getTypeByRootId() {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.getroot', {})
}
// 新增标签
export function addTagCategory(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.add', param)
}
// 获取标签信息
export function fetchCategoryList(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.getlist', param)
}
// 获取同级标签分类
export function getTypeSortData(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.getsameleveltag', param)
}
export function modifyTagCategory(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.modify', param)
}
// 修改标签
export function modifyTag(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.modify', param)
}
export function forbiddenTag(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.disabled', param)
    .then((data) => {
      if (data && data.data === 1) {
        return Promise.resolve()
      }
    })
}
