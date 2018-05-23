import jsonp from 'jsonp'
import {
  stringify
} from 'query-string'

export default (url, method, data = {}, option) => {
  data.method = method
  url += (url.indexOf('?') < 0 ? '?' : '&') + stringify(data)
  return new Promise((resolve, reject) => {
    jsonp(url, option || {
      param: 'uccallback'
    }, (err, data) => {
      if (!err) {
        data ? resolve(data) : reject(data.error_response && data.error_response.msg)
      } else {
        reject(err)
      }
    })
  })
}
