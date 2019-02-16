import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import Cookie from 'js-cookie'

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

router.beforeEach((to, from, next) => {

  var index = routeList.indexOf(to.name)
  if (index !== -1) {
    //如果存在路由列表，则把之后的路由都删掉
    routeList.splice(index + 1, routeList.length - index - 1)
  } else {
    routeList.push(to.name)
  }
  to.meta.routeList = routeList
  store.commit('setNav', to.path)
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


