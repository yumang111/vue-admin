import {
  fdcHttp,
  fdcJsonp
} from 'fdc-common/http'
let plotid = sessionStorage.getItem('plotid')

// 获取小区已存站点列表
export function getTrafficInfo(param) {
  return fdcHttp.get('/homeworkstation', 'homeworkstation.base.residentialsubway.listresidentialsubway', param)
}

// 获取地铁线路 + 查询地铁站所在线路(subwayName)
export function getSubwaylinesInfo(param) {
  let method = 'homebaseaction.base.line.getSubwaylines'
  return fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/' + method, method, param)
}

// 获取满足条件站点信息
export function getSubwaybylineidsInfo(param) {
  let method = 'homebaseaction.base.line.getSubwaylinesbylineids'
  return fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/homebaseaction/' + method, method, param)
}

// 添加站点
export function addstationInfo(param) {
  return fdcHttp.post('/homeworkstation', 'homeworkstation.base.residentialsubway.addstation', { ...param,
    residentialInfoId: plotid
  })
}

// 删除站点
export function deletestationInfo(param) {
  return fdcHttp.get('/homeworkstation', 'homeworkstation.base.residentialsubway.delete', { ...param,
    residentialInfoId: plotid
  })
}
