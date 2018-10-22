import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/index.vue'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('errorPage/404'),
    hidden: true
  },
  {
    path: '/course',
    component: Layout,
    name: '课程中心',
    redirect: '/course/list',
    meta: {
      address: 'course'
    },
    children: [
      {
        path: 'list',
        component: _import('course/list'),
        name: '课程列表'
      },
      {
        path: 'appraisal',
        component: _import('course/appraisal'),
        name: '课程评价'
      },
      {
        path: 'activity',
        component: _import('course/activity'),
        name: '活动管理'
      },
      {
        path: 'resource',
        component: _import('course/resource'),
        name: '资源管理'
      },
      {
        path: 'test',
        component: _import('course/test'),
        name: '试题管理'
      }
    ]
  }
]

export default new Router({
  routes:constantRouterMap
})
