import './style.scss'
import ElementUI from 'element-ui'
import Vue from 'vue'
import router from './router'
import * as filter from './filters/filters'
import App from './App'
import VuePreview from 'vue-preview'
import store from '@/store/index'
Vue.use(VuePreview)
Vue.use(ElementUI)
Vue.config.productionTip = false

// import Cookie from 'js-cookie'
// ? 临时注释(未登录设置cookie)
// if (process.env.NODE_ENV === 'development') {
// Cookie.set('JSESSIONID', 'C61D1874FDD4E1C4931BDFE513CA57EB')
// Cookie.set('adminNo', 'admin')
// }

Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
