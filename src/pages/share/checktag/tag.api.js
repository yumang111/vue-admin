import { fdcHttp } from 'fdc-common/http'
// 获取标签
export function getTagList(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.getunionlist', param)
}

