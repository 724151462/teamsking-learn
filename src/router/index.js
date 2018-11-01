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
      },
      {
        path: 'upCourses',
        component: _import('course/upCourses'),
        name: '编辑课程资源',
        redirect: '/course/upCourses/resource',
        children: [
          {
            path: 'resource',
            component: _import('course/upCourse/resource'),
            name: '课程资源',
            redirect: '/course/upCourses/resource/videos',
            children: [
              {
                path: 'videos',
                component: _import('course/upCourse/upCourseUp/videos'),
                name: '视频库'
              },
              {
                path: 'document',
                component: _import('course/upCourse/upCourseUp/document'),
                name: '文档库'
              },
              {
                path: 'exercise',
                component: _import('course/upCourse/upCourseUp/exercise'),
                name: '习题库'
              },
              {
                path: 'activity',
                component: _import('course/upCourse/upCourseUp/activity'),
                name: '活动库'
              }
            ]
          },
          {
            path: 'chapter',
            component: _import('course/upCourse/chapter'),
            name: '章节内容'
          },
          {
            path: 'activityUp',
            component: _import('course/upCourse/activityUp'),
            name: '活动'
          },
          {
            path: 'member',
            component: _import('course/upCourse/member'),
            name: '成员'
          },
          {
            path: 'teaching',
            component: _import('course/upCourse/teaching'),
            name: '教学管理',
            redirect: '/course/upCourses/teaching/grade',
            children: [
              {
                path: 'grade',
                component: _import('course/upCourse/upTeaching/grade'),
                name: '成绩管理'
              },
              {
                path: 'notes',
                component: _import('course/upCourse/upTeaching/notes'),
                name: '笔记管理'
              },
              {
                path: 'operation',
                component: _import('course/upCourse/upTeaching/operation'),
                name: '作业管理'
              },
              {
                path: 'test',
                component: _import('course/upCourse/upTeaching/test'),
                name: '测验'
              },
              {
                path: 'storm',
                component: _import('course/upCourse/upTeaching/storm'),
                name: '头脑风暴'
              },
              {
                path: 'questionnaire',
                component: _import('course/upCourse/upTeaching/questionnaire'),
                name: '投票问卷'
              },
              {
                path: 'videos',
                component: _import('course/upCourse/upTeaching/videos'),
                name: '视频'
              }
            ]
          },
          {
            path: 'notice',
            component: _import('course/upCourse/notice'),
            name: '通知管理'
          },
          {
            path: 'discuss',
            component: _import('course/upCourse/discuss'),
            name: '讨论中心'
          }
        ]
      }
    ]
  },
  {
    path: '/school',
    component: Layout,
    name: '校管中心',
    redirect: '/school/student',
    meta: {
      address: 'school'
    },
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
  }
]

export default new Router({
  routes: constantRouterMap
})
