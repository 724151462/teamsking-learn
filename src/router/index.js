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
        path: 'list/:id',
        component: _import('course/courseMain'),
        name: '课程父页面',
        redirect: 'list/:id/chapter',
        children: [
          {
            path: 'chapter',
            component: _import('course/chapter'),
            name: '章节内容',
            
          },
          {
            path: 'interact',
            component: _import('course/interact'),
            name: '互动',
          },
          {
            path: 'interact/vote',
            component: _import('course/interactContent/vote'),
            name: '发布投票',
          },
          {
            path: 'interact/brainstorm',
            component: _import('course/interactContent/brainStorm'),
            name: '发布头脑风暴',
          },
          {
            path: 'interact/homework',
            component: _import('course/interactContent/homeWork'),
            name: '作业/小组任务',
          },
          {
            path: 'interact/test',
            component: _import('course/interactContent/test'),
            name: '发布测试',
          },
          {
            path: 'member',
            component: _import('course/member'),
            name: '成员',
          },
          
          {
            path: 'teach',
            component: _import('course/teach'),
            name: '教学管理',
            redirect: 'teach/grade',
            children: [
              {
                path: 'grade',
                component: _import('course/teachContent/grade'),
                name: '成绩管理',
              },
              {
                path: 'notes',
                component: _import('course/teachContent/notes'),
                name: '笔记管理',
              },
              {
                path: 'homework',
                component: _import('course/teachContent/operation'),
                name: '作业管理',
              },
              {
                path: 'storm',
                component: _import('course/teachContent/storm'),
                name: '头脑风暴',
              },
              {
                path: 'questionnaire',
                component: _import('course/teachContent/questionnaire'),
                name: '投票问卷',
              },
              {
                path: 'test',
                component: _import('course/teachContent/test'),
                name: '测试管理',
              },
            ]
          },
          {
            path: 'notice',
            component: _import('course/notice'),
            name: '通知管理',
          },
          {
            path: 'discuss',
            component: _import('course/discuss'),
            name: '讨论中心',
          }
        ],
          
      },
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
      { path: 'teacher/addteacher', component: _import('school/addTeacher'), name: '添加教师' },
      { path: 'teacher/modifyteacher/:id', component: _import('school/modifyTeacher'), name: '修改教师' },
      { path: 'controller', component: _import('school/controller'), name: '管理员' },
      { path: 'portal', component: _import('school/portal'), name: '门户配置', 
        redirect: '/school/portal/mould',
        children:[
          {
            path: 'mould', component: _import('school/portalMould'), name: '模板配置'
          },
          {
            path: 'platform', component: _import('school/portalPlatform'), name: '平台信息'
          },
          {
            path: 'banner', component: _import('school/portalBanner'), name: '轮播图'
          },
          {
            path: 'recommend', component: _import('school/portalRecommend'), name: '课程推荐'
          },
          {
            path: 'teacher', component: _import('school/portalTeacher'), name: '名师风采'
          }
        ]
      },
      { path: 'course', component: _import('school/course'), name: '课程管理' },
      { path: 'certificate', component: _import('school/certificate'), name: '证书审核' },
      { path: 'academy', component: _import('school/academy'), name: '院管理' },
      { path: 'department', component: _import('school/department'), name: '系管理' },
      // { path: 'specialty', component: _import('school/specialty'), name: '专业管理' },
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
      { path: 'feedback', component: _import('user/feedback'), name: '意见反馈' }],
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
      {path:'academy',component:_import('school/academy'),name:'院管理'},
      {path:'department',component:_import('school/department'),name:'系管理'},
      {path:'speciality',component:_import('school/speciality'),name:'专业管理'},
      {path:'class',component:_import('school/class'),name:'班级管理'},
    ]
  },
  // {
  //   path:'/*',
  //   redirect:'/login'
  // },
]

export default new Router({
  routes: constantRouterMap
})
