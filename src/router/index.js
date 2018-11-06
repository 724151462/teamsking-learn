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
      { path: 'student', component: _import('school/student'), name: '学生管理' },
      { path: 'teacher', component: _import('school/teacher'), name: '教师管理' },
      { path: 'controller', component: _import('school/controller'), name: '管理员' },
      { path: 'portal', component: _import('school/portal'), name: '门户配置' },
      { path: 'course', component: _import('school/course'), name: '课程管理' },
      { path: 'certificate', component: _import('school/certificate'), name: '证书审核' },
      { path: 'academy', component: _import('school/academy'), name: '院管理' },
      { path: 'department', component: _import('school/department'), name: '系管理' },
      { path: 'specialty', component: _import('school/specialty'), name: '专业管理' },
      { path: 'class', component: _import('school/class'), name: '班级管理' }
    ]
  },
  {
    path: '/learn',
    component: Layout,
    name: '学习管理',
    redirect: '/learn/index',
    children: [
      { path: 'index', component: _import('learn/index'), name: '学习管理' }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    name: '系统管理',
    redirect: '/sys/tenantAccount',
    children: [
      { path: 'tenantAccount', component: _import('system/tenantAccount'), name: '租户账号管理' },
      { path: 'tenant', component: _import('system/tenant'), name: '租户管理' },
      { path: 'courseClass', component: _import('system/courseClass'), name: '课程分类' },
      { path: 'help', component: _import('system/help'), name: '帮助中心' },
      { path: 'templates', component: _import('system/templates'), name: '模板管理' },
      { path: 'student', component: _import('system/student'), name: '学生管理' },
      { path: 'teacher', component: _import('system/teacher'), name: '教师管理' },
      { path: 'school', component: _import('system/school'), name: '学校管理' },
      { path: 'sys', component: _import('system/sys'), name: '系统管理' },
      { path: 'label', component: _import('system/label'), name: '标签管理' },
      { path: 'menu', component: _import('system/menu'), name: '菜单管理' },
      { path: 'character', component: _import('system/character'), name: '角色管理' },
      { path: 'portal', component: _import('system/portal'), name: '门户配置' }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: '个人中心',
    redirect: '/user/index',
    children: [
      { path: 'index', component: _import('user/index'), name: '个人设置中心' },
      { path: 'message', component: _import('user/message'), name: '消息管理' },
      { path: 'buy', component: _import('user/buy'), name: '购买记录' },
      { path: 'income', component: _import('user/income'), name: '收入记录' },
      { path: 'withdraw', component: _import('user/withdraw'), name: '申请提现' },
      { path: 'feedback', component: _import('user/feedback'), name: '意见反馈' }
    ]
  },
  {
    path:'/*',
    redirect:'/login'
  },
]

export default new Router({
  routes: constantRouterMap
})
