import {
  fdcJsonp
} from 'fdc-common/http'
import tool from './tool'
// import axios from 'axios'
const ajaxMethod = {
  ajaxjsonp: function (url, method, param) {
    var params = Object.assign(param, {
      v: 1000,
      timestamp: tool.getDate(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
    })
    return fdcJsonp(process.env[url], method, params)
  }
  // ajax: function(url, method, param) {
  //   var params = Object.assign(param, {
  //     v: 1000,
  //     method: method,
  //     timestamp: tool.getDate(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
  //   })
  //   return http.get(url + '/' + method, {params: params})
  //     .then((response) => {
  //       return response.data[tool.getSuccessMethod(method)]
  //     }, (response) => {
  //       console.log('请求失败')
  //     })
  // },
  // post: function(url, method, param) {
  //   var params = Object.assign(param, {
  //     v: 1000,
  //     method: method,
  //     timestamp: tool.getDate(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
  //   })
  //   return http.post(url + '/' + method, params)
  //     .then((response) => {
  //       return response.data[tool.getSuccessMethod(method)]
  //     }, (response) => {
  //       console.log('请求失败')
  //     })
  // }
}
export default {
  jsonp: function (url, method, param) {
    return ajaxMethod.ajaxjsonp(url, method, param)
  },
  ajax: function (url, method, param) {
    return ajaxMethod.ajax(url, method, param)
  },
  post: function (url, method, param) {
    return ajaxMethod.post(url, method, param)
  }
}
