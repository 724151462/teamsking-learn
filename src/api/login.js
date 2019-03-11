const devUrl = '/api/v1/sys/' // 开发环境
const prodUrl = 'http://apidev.tskedu.com:9008/api/v1/sys/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

const tenantDev = '/api/v1/login/tenant' // 开发环境
const tenantProd = 'http://apidev.tskedu.com:9008/api/v1/login/tenant' // 生产环境
const tenantUrl = process.env.NODE_ENV === 'production' ? tenantProd : tenantDev

const tokenDev = '/api/v1/token/accessToken' // 开发环境
const tokenProd = 'http://apidev.tskedu.com:9008/api/v1/api/v1/token/accessToken' // 生产环境
const tokenUrl = process.env.NODE_ENV === 'production' ? tokenProd : tokenDev

import { commonsAjax } from '@/utils/requery'



/**
 * 刷新Token
 * */
export function reToken (data) {
  return commonsAjax(`${tokenUrl}`, data, 'get')
}

/**
 * 获取租户列表用于登录
 * */
export function getTenant (data) {
  return commonsAjax(`${tenantUrl}`, data, 'get')
}

/**
 * 登陆
 * */
export function logins (data) {
  return commonsAjax(`${baseUrl}user/login`, data, 'post')
}

/**
 *退出登陆
 **/
export function logout (data) {
  return commonsAjax(`${baseUrl}/logout`, data, 'post')
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
