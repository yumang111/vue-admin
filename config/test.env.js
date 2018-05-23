var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  BUILD_TYPE: '"test"',
  API_ROOT_DICT: '"http://sandbox.gw.fdc.com.cn/router/rest"',
  API_ROOT_DICTLINE: '"http://gw.fdc.com.cn/router/rest"',
  API_ROOT_HOME: '"http://sandbox.gw.fdc.com.cn/router/rest"',
  API_ROOT_HOMEBASE: '"http://sandbox.gw.fdc.com.cn/router/rest"',
  API_ROOT_UC: '"http://test.uc.fdc.com.cn"',
  API_ROOT_HOMEWORK: '""',
  API_ROOT_HOMEWORKBASE: '"http://oldbase.test.fdc.com.cn"',
  OLD_HOUSE_URL:'"http://oldhouse.wh.test.fdc.com.cn/chushou/detail/"',
  RENT_HOUSE_URL:'"http://zufang.wh.test.fdc.com.cn/zufang/"'
})
