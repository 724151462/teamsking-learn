import { commonsAjax } from '../utils/requery'

/**
 * 阿里云 oss 获取验签等
 * */
export function ossAli (data) {
  let url = 'http://120.36.137.90:9008/api/v1/policy' + data
  return commonsAjax(url, '', 'get')
}

/**
 * 阿里云 oss 获取验签等
 * */
export function ossAliSts (data) {
  return commonsAjax('http://120.36.137.90:9008/api/v1/policy', '', 'get')
}
