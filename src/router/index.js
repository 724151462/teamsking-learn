import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index.vue'
import Home from '@/views/layout/home.vue'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const constantRouterMap = [{
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
    component: Home,
    name: 'course',
    menuShow: true,
    type: 'courseCenter',
    redirect: '/course/list',
    children: [{
        path: '/course/list',
        component: Layout,
        name: '课程列表',
        leaf: true,
        menuShow: true,
        children: [{
            path: '/course/list',
            component: _import('course/list'),
            name: '课程列表'
          },
          {
            path: '/course/addCourse',
            component: _import('course/addCourse'),
            name: '课程编辑'
          },
          {
            path: '/course/list/chapter',
            component: _import('course/courseMain'),
            name: '课程列表',
            leaf: true,
            redirect: '/course/list/chapter',
            children: [{
                path: '/course/list/chapter',
                component: _import('course/chapter'),
                name: '章节内容',
              },
              {
                path: '/course/list/interact',
                component: _import('course/interact'),
                name: '互动',
              },
              {
                path: '/course/list/interact/vote',
                component: _import('course/interactContent/vote'),
                name: '发布投票',
              },
              {
                path: '/course/list/interact/voteresult',
                component: _import('course/interactContent/voteResult'),
                name: '投票结果',
              },
              {
                path: 'interact/brainstorm',
                component: _import('course/interactContent/brainStorm'),
                name: '发布头脑风暴',
              },
              {
                path: '/course/list/interact/brainresult',
                component: _import('course/interactContent/brainResult'),
                name: '头脑风暴结果',
              },
              {
                path: 'interact/homework',
                component: _import('course/interactContent/homeWork'),
                name: '作业/小组任务',
              },
              {
                path: '/course/list/interact/homeworkresult',
                component: _import('course/interactContent/workResult'),
                name: '作业/小组任务结果',
              },
              {
                path: 'interact/test',
                component: _import('course/interactContent/test'),
                name: '发布测试',
              },
              {
                path: '/course/list/interact/testresult',
                component: _import('course/interactContent/testResult'),
                name: '测试结果',
              },
              {
                path: '/course/list/member',
                component: _import('course/member'),
                name: '成员',
              },
              {
                path: 'member/manage',
                component: _import('course/memberContent/groupPlan'),
                name: '成员方案管理',
              },

              {
                path: '/course/list/teach',
                component: _import('course/teach'),
                name: '教学管理',
                redirect: '/course/list/teach/grade',
                children: [{
                    path: '/course/list/teach/grade',
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
                    component: _import('course/teachContent/homeworkList'),
                    name: '作业管理',
                  },
                  {
                    path: 'homeworkdetail',
                    component: _import('course/teachContent/homeworkDetail'),
                    name: '学生作业详情',
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
                  {
                    path: 'testmark',
                    component: _import('course/teachContent/testMark'),
                    name: '测试成绩',
                  },
                  {
                    path: 'video',
                    component: _import('course/teachContent/videos'),
                    name: '视频',
                  },
                ]
              },
              {
                path: '/course/list/notice',
                component: _import('course/notice'),
                name: '通知管理',
              },
              {
                path: '/course/list/discuss',
                component: _import('course/discuss'),
                name: '讨论中心',
              }
            ]
          },
          {
            path: '/course/list/interact',
            component: _import('course/courseMain'),
            name: '互动',
          },
          {
            path: '/course/list/member',
            component: _import('course/courseMain'),
            name: '成员',
          },
          {
            path: '/course/list/teach',
            component: _import('course/courseMain'),
            name: '教学管理',
            // redirect: '/course/list/teach/grade'
          },
          {
            path: '/course/list/notice',
            component: _import('course/courseMain'),
            name: '通知管理',
          },
          {
            path: '/course/list/discuss',
            component: _import('course/courseMain'),
            name: '讨论中心',
          },
          {
            path: '/course/list/discuss/disinfo',
            component: _import('course/discussDialog'),
            name: '讨论详情',
          },
          {
            path: '/course/list/interact/vote',
            component: _import('course/interactContent/vote'),
            name: '发布投票',
          },
          {
            path: '/course/list/teach/grade',
            component: _import('course/courseMain'),
            name: '成绩',
          },
        ]
      },
      {
        path: 'appraisal',
        component: _import('course/appraisal'),
        name: '课程评价',
        children: [

        ]
      },
      {
        path: 'test',
        component: Layout,
        name: '试题管理',
        children: [{
            path: '/course/resource/test',
            component: _import('course/resourse/test/test'),
            name: '试题管理',
            menuShow: true
          },
          {
            path: '/course/resource/addtest/:catalog',
            component: _import('course/resourse/test/addTest'),
            name: '试题添加',
          },
          {
            path: '/course/resource/edittest/:quiz',
            component: _import('course/resourse/test/editTest'),
            name: '试题编辑',
          }
        ]
      },
      {
        path: 'resource',
        component: Layout,
        name: '资源管理',
        children: [{
            path: '/course/resource/resource',
            component: _import('course/resourse/resourse/resourse'),
            name: '资源管理',
            menuShow: true
          }
        ]
      },
      {
        path: 'activity',
        component: Layout,
        name: '活动管理',
        children: [{
            path: '/course/activity/activity',
            component: _import('course/resourse/activity/activity'),
            name: '活动管理',
            menuShow: true
          }
        ]
      },
      {
        path:'/packge',
        component:Layout,
        name:'课程包管理',
        // redirect:'/school/student',
        children:[
          {path:'/course/packge/packge',component:_import('course/coursePackge/packgeMain'),name:'课程包广场',menuShow: true},
        ]
      }
    ],

  },

  {
    path: '/school',
    component: Home,
    name: 'school',
    type: 'schoolManageCenter',
    menuShow: true,
    redirect: '/school/student',
    children: [{
        path: '/school/student',
        menuShow: true,
        component: Layout,
        name: '用户管理',
        children: [{
            path: '/school/student',
            component: _import('school/student'),
            name: '学生管理',
            menuShow: true
          },
          {
            path: '/school/teacher',
            component: _import('school/teacher'),
            name: '教师管理',
            menuShow: true,
          },
          {
            path: '/school/teacher/addteacher',
            component: _import('school/addTeacher'),
            name: '添加教师',
          },
          {
            path: '/school/teacher/modifyteacher',
            component: _import('school/modifyTeacher'),
            name: '修改教师'
          },
        ],
      },
      {
        path: 'controller',
        component: Layout,
        name: 'school管理员1',
        redirect: '/school/notice',
        children: [
          {
            path: '/school/notice',
            component: _import('school/schoolNotice'),
            name: '消息管理',
            menuShow: true
          },
        ]
      },
      {
        path: 'portal',
        component: Layout,
        name: 'school门户配置',
        leaf: true,
        menuShow: true,
        redirect: '/school/portal/mould',
        children: [{
            path: '/school/portal/mould',
            component: _import('school/portal'),
            name: 'school模板配置',
            menuShow: true,
            children: [{
                path: '/school/portal/mould',
                component: _import('school/portalMould'),
                name: 'school模板配置',
                menuShow: true,
              },
              {
                path: '/school/portal/platform',
                component: _import('school/portalPlatform'),
                name: 'school平台信息',
                menuShow: true,
              },
              {
                path: '/school/portal/banner',
                component: _import('school/portalBanner'),
                name: 'school轮播图',
                menuShow: true,
              },
              {
                path: '/school/portal/recommend',
                component: _import('school/portalRecommend'),
                name: 'school课程推荐',
                menuShow: true,
              },
              {
                path: '/school/portal/teacher',
                component: _import('school/portalTeacher'),
                name: 'school名师风采',
                menuShow: true,
              }
            ]
          },
          {
            path: '/school/portal/platform',
            component: _import('school/portalPlatform'),
            name: 'school平台信息',
            menuShow: true,
          },
          {
            path: '/school/portal/banner',
            component: _import('school/portalBanner'),
            name: 'school轮播图',
            menuShow: true,
          },
          {
            path: '/school/portal/recommend',
            component: _import('school/portalRecommend'),
            name: 'school课程推荐',
            menuShow: true,
          },
          {
            path: '/school/portal/teacher',
            component: _import('school/portalTeacher'),
            name: 'school名师风采',
            menuShow: true,
          }
        ]
      },
      {
        path: 'course',
        component: Layout,
        name: 'school课程管理',
        redirect: "/school/course/course",
        children: [{
            path: '/school/course/course',
            component: _import('school/course'),
            name: 'school课程管理',
            menuShow: true,
          },
          {
            path: '/school/course/certificate',
            component: _import('school/certificate'),
            name: 'school证书审核',
            menuShow: true,
          },
          {
            path: '/school/course/courseReview',
            component: _import('school/courseReview'),
            name: 'school课程包审核',
            menuShow: true,
          },
        ]
      },
      {
        path: 'structure',
        component: Layout,
        name: '组织架构',
        redirect: "/school/structure/academy",
        children: [{
            path: '/school/structure/academy',
            component: _import('school/academy'),
            name: 'school院管理',
            menuShow: true,
          },
          {
            path: '/school/structure/department',
            component: _import('school/department'),
            name: 'school系管理',
            menuShow: true,
          },
          {
            path: '/school/structure/speciality',
            component: _import('school/speciality'),
            name: 'school专业管理',
            menuShow: true,
          },
          {
            path: '/school/structure/class',
            component: _import('school/class'),
            name: 'school班级管理',
            menuShow: true,
          }
        ]
      }
    ]
  },
  {
    path: '/learn',
    component: Home,
    name: 'learn',
    type: 'studyManage',
    menuShow: true,
    redirect: '/learn/inclass',
    children: [{
      path: '/learn/inclass',
      // leaf: true,
      component: Layout,
      name: 'learn学习管理',
      menuShow: true,
      children: [{
        path: '/learn/inclass',
        leaf: true,
        component: _import('learn/inClass'),
        name: '课堂',
        menuShow: true,
      },
      {
        path: '/learn/afterclass',
        leaf: true,
        component: _import('learn/afterClass'),
        name: '课后',
        menuShow: true,
      },
      {
        path: '/learn/teachdata',
        leaf: true,
        component: _import('learn/teachData'),
        name: '教学数据',
        menuShow: true,
      }]
    }]
  },
  {
    path: '/user',
    component: Layout,
    name: '个人中心',
    type: 'userCenter',
    redirect: '/user/index',
    children: [
      {path: 'index', component: _import('user/index'), name: 'user个人设置中心'},
      {path: 'message', component: _import('user/message'), name: 'user消息管理'},
      {path: 'operation', component: _import('user/operation'), name: 'user操作记录'},
      {path: 'buy', component: _import('user/buy'), name: 'user购买记录'},
      {path: 'income', component: _import('user/income'), name: 'user收入记录'},
      {path: 'withdraw', component: _import('user/withdraw'), name: 'user申请提现'},
      {path: 'feedback', component: _import('user/feedback'), name: 'user意见反馈'},
      {path: 'certificate', component: _import('user/certificate'), name: 'user我的证书'}],
  },
  {
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
    path: '/system',
    component: Home,
    name: 'system',
    menuShow: true,
    type: 'systemManage',
    redirect: '/system/tenantManager',
    meta: {
      address: 'system'
    },
    children: [{
        path: '/system/tenantManager',
        component: Layout,
        name: '租户管理',
        children: [{
            path: '/system/tenantManager',
            component: _import('system/tenantManager'),
            name: 'system租户管理',
            menuShow: true
          },
          {
            path: '/system/tenantAccountManager',
            component: _import('system/tenantAccountManager'),
            name: 'system租户账号管理',
            menuShow: true
          },
        ]
      },
      {
        path: '/system/system',
        component: Layout,
        name: '系统管理',
        children: [{
            path: '/system/courseCategory',
            component: _import('system/courseCategory'),
            name: '课程分类',
            menuShow: true
          },
          {
            path: '/system/help',
            component: _import('system/help'),
            name: '帮助中心管理',
            menuShow: true
          },
          {
            path: '/system/templates',
            component: _import('system/templates'),
            name: '模板管理',
            menuShow: true
          },
          {
            path: '/system/notice',
            component: _import('system/sysNotice'),
            name: '消息管理',
            menuShow: true
          },
        ]
      },
      {
        path: '/system/student',
        component: Layout,
        name: '用户中心',
        children: [{
            path: '/system/student',
            component: _import('system/student'),
            name: 'system学生管理',
            menuShow: true
          },
          {
            path: '/system/teacher',
            component: _import('system/teacher'),
            name: 'system教师管理',
            menuShow: true
          },
          {
            path: '/system/school',
            component: _import('system/school'),
            name: 'system学校管理员',
            menuShow: true
          },
          {
            path: '/system/teacher/teacherdetail',
            component: _import('system/teacherDetail'),
            name: '教师详情',
            menuShow: true
          },
          {
            path: '/system/manager',
            component: _import('system/system'),
            name: 'system系统管理员',
            menuShow: true
          },
          {
            path: '/system/tag',
            component: _import('system/tag'),
            name: 'system标签管理',
            menuShow: true
          },
        ]
      },
      {
        path: '/system/power',
        component: Layout,
        name: '权限管理',
        children: [{
            path: '/system/menu',
            component: _import('system/menu'),
            name: 'system菜单管理',
            menuShow: true
          },
          {
            path: '/system/role',
            component: _import('system/role'),
            name: 'system角色管理',
            menuShow: true
          },
        ]
      },
      {
        path: 'portal',
        component: Layout,
        name: 'system门户配置',
        redirect: '/system/portal/mould',
        leaf: true,
        menuShow: true,
        children: [{
            path: '/system/portal/mould',
            component: _import('system/portal'),
            name: 'system模板配置',
            menuShow: true,
            children: [{
                path: '/system/portal/mould',
                component: _import('system/portalMould'),
                name: 'system模板配置',
                menuShow: true,
              },
              {
                path: '/system/portal/platform',
                component: _import('system/portalPlatform'),
                name: 'system平台信息',
                menuShow: true,
              },
              {
                path: '/system/portal/banner',
                component: _import('system/portalBanner'),
                name: 'system轮播图',
                menuShow: true,
              },
              {
                path: '/system/portal/recommend',
                component: _import('system/portalRecommend'),
                name: 'system课程推荐',
                menuShow: true,
              },
              {
                path: '/system/portal/teacher',
                component: _import('system/portalTeacher'),
                name: 'system名师风采',
                menuShow: true,
              }
            ]
          },
          {
            path: '/system/portal/platform',
            component: _import('system/portalPlatform'),
            name: 'system平台信息',
            menuShow: true,
          },
          {
            path: '/system/portal/banner',
            component: _import('system/portalBanner'),
            name: 'system轮播图',
            menuShow: true,
          },
          {
            path: '/system/portal/recommend',
            component: _import('system/portalRecommend'),
            name: 'system课程推荐',
            menuShow: true,
          },
          {
            path: '/system/portal/teacher',
            component: _import('system/portalTeacher'),
            name: 'system名师风采',
            menuShow: true,
          }
        ]
      },
      // {
      //   path: 'tenantManager',
      //   component: _import('system/tenantManager'),
      //   name: 'system租户管理'
      // },
      // {
      //   path: 'tenantAccountManager',
      //   component: _import('system/tenantAccountManager'),
      //   name: 'system租户账号管理'
      // },


      // {
      //   path: 'courseCategory',
      //   component: _import('system/courseCategory'),
      //   name: 'system课程分类'
      // },
      // {
      //   path: 'help',
      //   component: _import('system/help'),
      //   name: 'system帮助中心管理'
      // },
      // {
      //   path: 'templates',
      //   component: _import('system/templates'),
      //   name: 'system模板管理'
      // },


      // {
      //   path: 'portal',
      //   component: _import('system/portal'),
      //   name: 'system门户配置',
      //   redirect: '/system/portal/mould',
      //   children: [{
      //       path: 'mould',
      //       component: _import('system/portalMould'),
      //       name: 'system模板配置'
      //     },
      //     {
      //       path: 'platform',
      //       component: _import('system/portalPlatform'),
      //       name: 'system平台信息'
      //     },
      //     {
      //       path: 'banner',
      //       component: _import('system/portalBanner'),
      //       name: 'system轮播图'
      //     },
      //     {
      //       path: 'recommend',
      //       component: _import('system/portalRecommend'),
      //       name: 'system课程推荐'
      //     },
      //     {
      //       path: 'teacher',
      //       component: _import('system/portalTeacher'),
      //       name: 'system名师风采'
      //     }
      //   ]
      // },
    ]
  },
  {
    path: '/course/classmodel',
    component: _import('classModel/index'),
    name: 'classIndex',
    leaf: true,
  },
  {
    path: '/course/check',
    component: _import('classModel/check'),
    name: 'modelCheck',
  },
  {
    path: '/course/classend',
    component: _import('classModel/classOver'),
    name: 'classEnd',
  },
  {
    path: '/course/classchapter',
    component: _import('classModel/modelMain'),
    name: 'modelMain',
    redirect: '/course/modelChapter',
    children: [
      {
        path: '/course/modelChapter',
        component: _import('classModel/modelContent/modelChapter'),
        name: 'modelMain',
      },
      {
        path: '/course/modelTest',
        component: _import('classModel/modelContent/modelTest'),
        name: 'modelMain',
      },
      {
        path: '/course/modelStrome',
        component: _import('classModel/modelContent/modelStrome'),
        name: 'modelMain',
      },
      {
        path: '/course/modelVote',
        component: _import('classModel/modelContent/modelVote'),
        name: 'modelMain',
      },
      {
        path: '/course/modelChooseAns',
        component: _import('classModel/modelContent/modelChooseAns'),
        name: 'modelMain',
      },
      {
        path: '/course/modelResource',
        component: _import('classModel/modelContent/modelResource'),
        name: 'modelMain',
      },
      {
        path: '/course/checked',
        component: _import('classModel/checked'),
        name: 'modelChecked',
      }
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
