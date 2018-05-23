var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  BUILD_TYPE: '"pre"',
  API_ROOT_DICT: '"http://pregw.fdc.com.cn/router/rest"',
  API_ROOT_DICTLINE: '"http://gw.fdc.com.cn/router/rest"',
  API_ROOT_HOME: '"http://pregw.fdc.com.cn/router/rest"',
  API_ROOT_HOMEBASE: '"http://pregw.fdc.com.cn/router/rest"',
  API_ROOT_UC: '"http://nsop.fdc.com.cn"',
  API_ROOT_HOMEWORK: '""',
  API_ROOT_HOMEWORKBASE: '"http://nsop.fdc.com.cn"',
  OLD_HOUSE_URL:'"http://oldhouse.wh.pre.fdc.com.cn/chushou/detail/"',
  RENT_HOUSE_URL:'"http://zufang.wh.pre.fdc.com.cn/zufang/"'
})
