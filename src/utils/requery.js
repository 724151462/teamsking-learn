import axios from 'axios'
import qs from 'qs'
import { GlobeVM } from '../main'
import { getToken, removeToken } from './auth'

if (getToken()) {
  axios.defaults.headers.token = getToken()
}
// axios.defaults.headers.token = '40347a4bbe35a4b8501468a27089d64f'
// <<<<<<< HEAD
// axios.defaults.headers.token = '565cfe13309c7734724cdabdd77d8b40'
// =======
// axios.defaults.headers.token = '7c7ca7451073f3c94f9a4ae26fabbd03'
// >>>>>>> 9dfe0d8c1c3b3dfeab5a3ae9c3eaad64897b7979
axios.defaults.headers.token = '0493e95392b7679a9597c66de10cdb78'
axios.defaults.baseURL = '/'
axios.defaults.timeout = 10000
axios.defaults.responseType = 'json'

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
    if (res.data.code === 500 && res.msg === '登录超时') {
      removeToken()
      GlobeVM.$router.push({ path: '/login' })
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
    if (data !== '' && method === 'get') {
      date.url += '?' + qs.stringify(data)
    }
    if(data !== '' && method === 'post'){
      date.data = data
    }
    if( data !== '' && method === 'delete'){
      date.data = data
    }
    if( data !== '' && method === 'put'){
      date.data = data
    }
    axios(date).then(res => {
      reject(res.data)
    }).catch(error => {
      resolve(error)
    })
  })
}
