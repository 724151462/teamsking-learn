import { commonsAjax } from '../utils/requery'

/**
 * 阿里云 oss 获取验签等
 * */
export function ossAli (data) {
  let url = '/policy' + data
  return commonsAjax(url, '', 'get')
}

/**
 * 阿里云 oss 获取验签等
 * */
export function ossAliSts (data) {
  return commonsAjax('/policy', '', 'get')
}

/**
 * 直传方式 获取验签
 * */
export function webUpload (data) {
  return commonsAjax('/policy/web', data, 'get')
}