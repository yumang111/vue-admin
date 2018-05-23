import { fdcHttp } from 'fdc-common/http'
import { getLooplineDate } from '@/api/api'
export default {
  getNewHouseList(params) {
    return fdcHttp.get(
      process.env.API_ROOT_HOMEWORK + '/homeworkstation',
      'homeworkstation.base.housepriceresult.getlist',
      params
    )
  },
  getHouseDetailById(params) {
    return fdcHttp.get(
      process.env.API_ROOT_HOMEWORK + '/homeworkstation',
      'homeworkstation.base.housepriceresult.getByid',
      params
    )
  },
  getHouseSourceInfo(id) {
    return fdcHttp.get(
      process.env.API_ROOT_HOMEWORK + '/homeworkstation',
      'homeworkstation.base.housesource.getByid', { id: id }
    )
  },
  // 获取小区详情(关联小区) homeworkstation.base.residentialinfo.getResidentialInfo
  getResidentialInfo(residentialId) {
    return fdcHttp.get(
      process.env.API_ROOT_HOMEWORK + '/homeworkstation',
      'homeworkstation.base.residentialinfo.getResidentialInfo', { id: residentialId }
    )
  },
  // 根据标签id获取标签
  getTagInfo(param) {
    return fdcHttp.get(
      process.env.API_ROOT_HOMEWORK + '/homeworkstation',
      'homeworkstation.base.tag.getbyid',
      param
    )
  },
  getHouseTypeData(param) {
    return fdcHttp.get(
      process.env.API_ROOT_HOMEWORK + '/homeworkstation',
      'homeworkstation.base.housingtypeinfo.get',
      param
    )
  },
  editHouseSourceInfo(param) {
    return fdcHttp.post(
      process.env.API_ROOT_HOMEWORK + '/homeworkstation',
      'homeworkstation.base.housepriceresult.updatebyid',
      param
    )
  },
  getHouseUporDownStatus(param) {
    return fdcHttp.get(
      process.env.API_ROOT_HOMEWORK + '/homeworkstation',
      'homeworkstation.base.housepriceresult.upordownstatus',
      param
    )
  },
  getLoopLine() {
    return getLooplineDate()
  }
}
