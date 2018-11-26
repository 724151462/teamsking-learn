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
    path: '/school',
    component: Layout,
    name: '校管中心',
    redirect: '/school/student',
    children: [
      { path: 'student', component: _import('school/student'), name: 'school学生管理' },
      { path: 'teacher', component: _import('school/teacher'), name: 'school教师管理' },
      { path: 'teacher/addteacher', component: _import('school/addTeacher'), name: 'school添加教师' },
      { path: 'teacher/modifyteacher/:id', component: _import('school/modifyTeacher'), name: 'school修改教师' },
      { path: 'controller', component: _import('school/controller'), name: 'school管理员' },
      { path: 'portal', component: _import('school/portal'), name: 'school门户配置',
        redirect: '/school/portal/mould',
        children:[
          {
            path: 'mould', component: _import('school/portalMould'), name: 'school模板配置'
          },
          {
            path: 'platform', component: _import('school/portalPlatform'), name: 'school平台信息'
          },
          {
            path: 'banner', component: _import('school/portalBanner'), name: 'school轮播图'
          },
          {
            path: 'recommend', component: _import('school/portalRecommend'), name: 'school课程推荐'
          },
          {
            path: 'teacher', component: _import('school/portalTeacher'), name: 'school名师风采'
          }
        ]
      },
      { path: 'course', component: _import('school/course'), name: 'school课程管理' },
      { path: 'certificate', component: _import('school/certificate'), name: 'school证书审核' },
      { path: 'courseReview', component: _import('school/courseReview'), name: 'school课程包审核' },
      { path: '', component: _import('school/academy'), name: 'school院管理' },
      { path: 'department', component: _import('school/department'), name: 'school系管理' },
      { path: 'speciality', component: _import('school/speciality'), name: 'school专业管理' },
      { path: 'class', component: _import('school/class'), name: 'school班级管理' }
    ]
  },
  {
    path: '/learn',
    component: Layout,
    name: '学习管理',
    redirect: '/learn/index',
    children: [
      { path: 'index', component: _import('learn/index'), name: 'learn学习管理' }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: '个人中心',
    redirect: '/user/index',
    children: [
      { path: 'index', component: _import('user/index'), name: 'user个人设置中心' },
      { path: 'message', component: _import('user/message'), name: 'user消息管理' },
      { path: 'buy', component: _import('user/buy'), name: 'user购买记录' },
      { path: 'income', component: _import('user/income'), name: 'user收入记录' },
      { path: 'withdraw', component: _import('user/withdraw'), name: 'user申请提现' },
      { path: 'feedback', component: _import('user/feedback'), name: 'user意见反馈' }],
    path:'/school',
    component:Layout,
    name:'个人中心',
    redirect:'/school/student',
    meta:{
      address:'school'
    },
    children:[
      {path:'student',component:_import('school/student'),name:'user学生管理'},
      {path:'teacher',component:_import('school/teacher'),name:'user教师管理'},
      {path:'controller',component:_import('school/controller'),name:'user管理员'},
      {path:'portal',component:_import('school/portal'),name:'user门户配置'},
      {path:'course',component:_import('school/course'),name:'user课程管理'},
      {path:'certificate',component:_import('school/certificate'),name:'user证书审核'},
      {path:'academy',component:_import('school/academy'),name:'user院管理'},
      {path:'department',component:_import('school/department'),name:'user系管理'},
      {path:'speciality',component:_import('school/speciality'),name:'user专业管理'},
      {path:'class',component:_import('school/class'),name:'user班级管理'},
    ]
  },
  {
    path:'/system',
    component:Layout,
    name:'系统管理',
    redirect:'/system/menu',
    meta:{
      address:'system'
    },
    children:[
      {path:'tenantManager',component:_import('system/tenantManager'),name:'system租户管理'},
      {path:'tenantAccountManager',component:_import('system/tenantAccountManager'),name:'system租户账号管理'},
      {path:'courseCategory',component:_import('system/courseCategory'),name:'system课程分类'},
      {path:'help',component:_import('system/help'),name:'system帮助中心管理'},
      {path:'templates',component:_import('system/templates'),name:'system模板管理'},
      {path:'student',component:_import('system/student'),name:'system学生管理'},
      {path:'teacher',component:_import('system/teacher'),name:'system教师管理'},
      {path:'school',component:_import('system/school'),name:'system学校管理员'},
      {path:'system',component:_import('system/system'),name:'system系统管理员'},
      {path:'tag',component:_import('system/tag'),name:'system标签管理'},
      {path:'menu',component:_import('system/menu'),name:'system菜单管理'},
      {path:'role',component:_import('system/role'),name:'system角色管理'},
      {path: 'portal', component: _import('system/portal'), name: 'system门户配置',
        redirect: '/system/portal/mould',
        children:[
          {
            path: 'mould', component: _import('system/portalMould'), name: 'system模板配置'
          },
          {
            path: 'platform', component: _import('system/portalPlatform'), name: 'system平台信息'
          },
          {
            path: 'banner', component: _import('system/portalBanner'), name: 'system轮播图'
          },
          {
            path: 'recommend', component: _import('system/portalRecommend'), name: 'system课程推荐'
          },
          {
            path: 'teacher', component: _import('system/portalTeacher'), name: 'system名师风采'
          }
        ]
      },
      ]
  }
  // {
  //   path:'/*',
  //   redirect:'/login'
  // },
]

export default new Router({
  routes: constantRouterMap
})
