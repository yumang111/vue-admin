var merge = require('webpack-merge')
var testEnv = require('./test.env')

module.exports = merge(testEnv, {
  NODE_ENV: '"production"',
  BUILD_TYPE: '"backtest"',
  API_ROOT_DICT: '"http://test.gw.fdc.com.cn/router/rest"',
  API_ROOT_DICTLINE: '"http://gw.fdc.com.cn/router/rest"',
  API_ROOT_HOME: '"http://test.homeapi.fdc.com.cn/router/rest"',
  API_ROOT_HOMEBASE: '"http://test.homebase.fdc.com.cn/router/rest"',
  API_ROOT_UC: '"http://test.uc.fdc.com.cn"',
  API_ROOT_HOMEWORK: '""',
  API_ROOT_HOMEWORKBASE: '"http://test.homebase.fdc.com.cn"',
  OLD_HOUSE_URL:'"http://oldhouse.wh.test.fdc.com.cn/chushou/detail/"',
  RENT_HOUSE_URL:'"http://zufang.wh.test.fdc.com.cn/zufang/"'
})
