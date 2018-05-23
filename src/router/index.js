import Vue from 'vue'
import Router from 'vue-router'
import adminShell from '@/modules/admin-shell/admin-shell'

import homeworkstationRoutes from '@/pages/homeworkstation/homeworkstation.routes'
import commentRoutes from '@/pages/comment/comment.routes'
import Cookie from 'js-cookie'
import store from '@/store'

Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/',
    component: adminShell,
    children: [
      ...homeworkstationRoutes,
      ...commentRoutes
    ]
  }]
})
// 手动调用获取数据方法
store.dispatch('getUserInfo')
let loginName = Cookie.get('adminNo')
if (process.env.NODE_ENV === 'development') {
  Cookie.set('adminNo', 'admin')
  router.beforeEach((to, from, next) => {
    if (to.matched[1] && from.matched[1] && to.matched[1].path !== from.matched[1].path) {
      history.go(0)
    }
    next()
  })
} else {
  router.beforeEach((to, from, next) => {
    if (!loginName) {
      next({
        path: process.env.API_ROOT_UC + '/cas/login',
        query: {
          service: from.fullPath
        }
      })
    } else {
      let href = window.location.href
      if (href.indexOf('jsessionid') > 0) {
        window.location.href = href.replace(/;[\s\S]*#/, '#')
      }
      if (to.matched[1] && from.matched[1] && to.matched[1].path !== from.matched[1].path) {
        history.go(0)
      }
      next()
    }
  })
}

export default router
