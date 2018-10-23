import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index.vue'

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
      },
      {
        path: 'addCourse',
        component: _import('course/addCourse'),
        name: '课程编辑'
      }
    ]
  },
  {
    path:'/school',
    component:Layout,
    name:'校管中心',
    redirect:'/school/student',
    meta:{
      address:'school'
    },
    children:[
      {path:'student',component:_import('school/student'),name:'学生管理'},
      {path:'teacher',component:_import('school/teacher'),name:'教师管理'},
      {path:'controller',component:_import('school/controller'),name:'管理员'},
      {path:'portal',component:_import('school/portal'),name:'门户配置'},
      {path:'course',component:_import('school/course'),name:'课程管理'},
      {path:'certificate',component:_import('school/certificate'),name:'证书审核'},
      {path:'department',component:_import('school/department'),name:'院系管理'},
      {path:'specialty',component:_import('school/specialty'),name:'专业管理'},
      {path:'class',component:_import('school/class'),name:'班级管理'},
    ]
  }
]

export default new Router({
  routes:constantRouterMap
})
