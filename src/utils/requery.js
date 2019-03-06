import axios from 'axios'
import qs from 'qs'
import Globe_VM from '../main'
import { getToken, removeToken , getReToken, checkToken,twoWeeksExchange} from './auth'
import {reToken} from "../api/login";
import Cookie from "js-cookie";

// axios.defaults.headers.token = '1f905951b9b371530396ea07f6cbe94a'

axios.defaults.baseURL = '/'
axios.defaults.timeout = 10000
axios.defaults.responseType = 'json'


/*是否有请求正在刷新token*/
window.isRefreshing = false
/*被挂起的请求数组*/
let refreshSubscribers = []
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
  config => {
    const authTmp  = Cookie.get('BackstageToken')
    /*判断是否已登录*/
    if (authTmp) {
      /*判断refresh_token是否过期*/
      Cookie.get('BackstageReToken')
      if (!getReToken()) {
        console.log('refreshToken过期，请重新登录')
        /*清除本地保存的auth*/
        removeToken()
        Globe_VM.$router.push({ path: '/login' })
        refreshSubscribers = []
        return false
      }
      /*判断token是否将要过期*/
      if (checkToken() && config.url.indexOf('/api/v1/token/accessToken?refreshTokenString=') === -1 && config.headers.token) {
        /*判断是否正在刷新*/
        if (!window.isRefreshing) {
          /*将刷新token的标志置为true*/
          window.isRefreshing = true
          console.log('正在刷新Token')
          /*发起刷新token的请求*/
          reToken({refreshTokenString:Cookie.get('BackstageReToken')})
            .then(res=>{
              console.log(res)
              if(res.code ===200){
                console.log(res)
                console.log('刷新Token完毕')
                /*将标志置为false*/
                window.isRefreshing = false
                /*成功刷新token*/
                config.headers.token = res.data.token
                /*更新reToken,Token*/
                twoWeeksExchange(res.data.token,res.data.refreshToken)
                /*执行数组里的函数,重新发起被挂起的请求*/
                onRrefreshed(res.data.token)
                /*执行onRefreshed函数后清空数组中保存的请求*/
                refreshSubscribers = []
                // console.log(res);
              }else{
                console.log('请重新登录')
              }
            }).catch(err=>{
            console.log(err)
            removeToken()
            Globe_VM.$router.push({ path: '/login' })
          })
        }
        //console.log(config)
        /*把请求(token)=>{....}都push到一个数组中*/
        let retry = new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            config.headers.token = token
            /*将请求挂起*/
            resolve(config)
          })
        })
        return retry
      }
      return config
    } else {
      /*未登录直接返回配置信息*/
      return config
    }
  },
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
      if (Number(res.data.code) === 401) {
        console.log('拦截到响应')
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
