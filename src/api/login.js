const devUrl = '/api/v1/sys/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/sys/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

import { commonsAjax } from '@/utils/requery'

/**
 * 登陆
 * */
export function logins (data) {
  return commonsAjax(`${baseUrl}login`, data, 'post')
}

/**
 * 登陆
 * */
export function loginDebug (data) {
  return commonsAjax(`${baseUrl}login/debug`, data, 'post')
}

/**
 * 菜单
 * */
export function menuList (data) {
  return commonsAjax(`${baseUrl}user/menu/list`, '', 'get')
}
