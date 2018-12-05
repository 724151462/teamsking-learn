import axios from 'axios'
import qs from 'qs'
import Globe_VM from '../main'
import { getToken, removeToken } from './auth'


if (getToken()) {
  axios.defaults.headers.token = getToken()
}
// axios.defaults.headers.token = '1f128063aae4ac84abedfa7befd1e0db'

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
    axios(date).then(res => {
      reject(res.data)
    }).catch(error => {
      resolve(error)
    })
  })
}
