import { fdcHttp } from 'fdc-common/http'
export function getTagInfo(param) {
  return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.tag.getbyid', param)
}
