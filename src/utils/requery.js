import axios from 'axios'
import qs from 'qs'
import Globe_VM from '../main'
import { getToken, removeToken , getReToken} from './auth'


// axios.defaults.headers.token = '1f905951b9b371530396ea07f6cbe94a'

axios.defaults.baseURL = '/'
axios.defaults.timeout = 10000
axios.defaults.responseType = 'json'



/*是否有请求正在刷新token*/
window.isRefreshing = false
/*被挂起的请求数组*/
let refreshSubscribers = []

/*获取刷新token请求的token*/
function getRefreshToken () {
  return JSON.parse(localStorage.auth).refresh_token
}

/*push所有请求到数组中*/
function subscribeTokenRefresh (cb) {
  refreshSubscribers.push(cb)
}

/*刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）*/
function onRrefreshed (token) {
  refreshSubscribers.map(cb => cb(token))
}

/**
 * 请求拦截器
 */
axios.interceptors.request.use(
/**
 * 请求之前数据处理,这里可以做拦截是否序列化数据处理(在下面请求的时候处理了)
 */
  config => {
    return config
  },
  // config => {
  //   const authTmp = localStorage.auth
  //   /*判断是否已登录*/
  //   if (authTmp) {
  //     /*解析登录信息*/
  //     let auth = JSON.parse(authTmp)
  //     /*判断auth是否存在*/
  //     if (auth) {
  //       /*在请求头中添加token类型、token*/
  //       config.headers.Authorization = auth.token_type + ' ' + auth.token
  //       /*判断刷新token请求的refresh_token是否过期*/
  //       if (util.isRefreshTokenExpired()) {
  //         alert('刷新token过期，请重新登录')
  //         /*清除本地保存的auth*/
  //         localStorage.removeItem('auth')
  //         window.location.href = '#/login'
  //         return
  //       }
  //       /*判断token是否将要过期*/
  //       if (util.isTokenExpired() && config.url.indexOf('admin/auth/current') === -1) {
  //         /*判断是否正在刷新*/
  //         if (!window.isRefreshing) {
  //           /*将刷新token的标志置为true*/
  //           window.isRefreshing = true
  //           /*发起刷新token的请求*/
  //           apiList.refreshToken({refresh_token: getRefreshToken()}).then(res => {
  //             /*将标志置为false*/
  //             window.isRefreshing = false
  //             /*成功刷新token*/
  //             config.headers.Authorization = res.data.data.token_type + ' ' + res.data.data.token
  //             /*更新auth*/
  //             localStorage.setItem('auth', JSON.stringify(res.data.data))
  //             /*执行数组里的函数,重新发起被挂起的请求*/
  //             onRrefreshed(res.data.data.token)
  //             /*执行onRefreshed函数后清空数组中保存的请求*/
  //             refreshSubscribers = []
  //           }).catch(err => {
  //             alert(err.response.data.message)
  //             /*清除本地保存的auth*/
  //             // localStorage.removeItem('auth')
  //             window.location.href = '#/login'
  //           })
  //         }
  //         /*把请求(token)=>{....}都push到一个数组中*/
  //         let retry = new Promise((resolve, reject) => {
  //           /*(token) => {...}这个函数就是回调函数*/
  //           subscribeTokenRefresh((token) => {
  //             config.headers.Authorization = 'Bearer ' + token
  //             /*将请求挂起*/
  //             resolve(config)
  //           })
  //         })
  //         return retry
  //       }
  //     }
  //     return config
  //
  //   } else {
  //     /*未登录直接返回配置信息*/
  //     return config
  //   }
  // },
  error => {
    // console.log('错误信息',error)
    return Promise.reject(error)
  }
)
/**
 * 响应拦截器
 */
axios.interceptors.response.use(
  res => {
    // console.log('tokens',getToken())
      if (Number(res.data.code) === 401) {
        removeToken()
        Globe_VM.$router.push({ path: '/login' })
      }
    if (res.data) {
      return Promise.reject(res.data)
    }
    return res
  },
  error => {
    return error
  }
)

export function commonsAjax (url, data, method, headers) {
  return new Promise((resolve, reject) => {
    let date = {
      url: url,
      method: method
    }
    if (getToken()) {
      date.headers = {token: getToken()}
    }
    if (data !== '' && method === 'get') {
      date.url += '?' + qs.stringify(data)
    }
    if (data !== '' && method === 'post') {
      date.data = data
    }
    if( data !== '' && method === 'delete'){
      date.data = data
    }
    if( data !== '' && method === 'put'){
      date.data = data
    }
    if( data !== '' && method === 'patch'){
      date.data = data
    }
    axios(date).then(res => {
      reject(res.data)
    }).catch(error => {
      resolve(error)
    })
  })
}
