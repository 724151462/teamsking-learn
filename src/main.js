import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import Cookie from 'js-cookie'
import MenuUtils from '@/utils/MenuUtils'

Vue.use(ElementUI)

Vue.prototype.loadingCss = {
  lock: true,
  text: 'loading',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.7)'
};
Vue.config.productionTip = false
window.STOMP_CLIENT = ''

var routeList = []
let data = JSON.parse(window.sessionStorage.getItem('menuList'))
if (data){
  //这里是防止用户手动刷新页面，整个app要重新加载,动态新增的路由，会消失，所以我们重新add一次
  let routes = []
  // MenuUtils(routes,data)
  router.addRoutes(routes)
  window.sessionStorage.removeItem('isLoadNodes')
}
router.beforeEach((to, from, next) => {
  // let data = JSON.parse(window.sessionStorage.getItem('menuList'))
  // if(data&&route.path === '/login'){
  //   //这里不使用router进行跳转，是因为，跳转到登录页面的时候，是需要重新登录，获取数据的，这个时候，会再次向router实例里面add路由规则，
  //   //而next()跳转过去之后，没有刷新页面，之前的规则还是存在的，但是使用location的话，可以刷新页面，当刷新页面的时候，整个app会重新加载
  //   //而我们在刷新之前已经把sessionStorage里的user移除了，所以上面的添加路由也不行执行
  //   window.sessionStorage.removeItem('menuList')
  //   window.sessionStorage.removeItem('isLoadNodes')
  //   window.location.href = '/'
  //   return false
  // }
  // if (!data && route.path !== '/login') {
  //   next({ path: '/login' })
  // } else {
  //   if (route.path) {
  //     next()
  //   } else {
  //     next({ path: '/404' })
  //   }
  // }

  var index = routeList.indexOf(to.name)
  if (index !== -1) {
    //如果存在路由列表，则把之后的路由都删掉
    routeList.splice(index + 1, routeList.length - index - 1)
  } else {
    routeList.push(to.name)
  }
  to.meta.routeList = routeList
  var n = (to.path.split('/')).length - 1;
  console.log('timess', n)
  if (n <= 3) {
    Cookie.set('path', to.path)
  }
  next()
})

const Globe_VM = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default Globe_VM


if(process.env.NODE_ENV === "development"){
  //开发测试
  // window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {
  //   console.log("开发环境：错误信息：" +errorMessage+";出错文件："+scriptURI+";出错行号："+lineNumber);
  //   new Error(errorObj);
  // }
}
