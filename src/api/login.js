import { commonsAjax } from '@/utils/requery'

/**
 * 刷新Token
 * */
export function reToken (data) {
  return commonsAjax(`/token/accessToken/`, data, 'get')
}

/**
 * 获取租户列表用于登录
 * */
export function getTenant (data) {
  return commonsAjax(`/login/tenant`, data, 'get')
}

/**
 * 登陆
 * */
export function logins (data) {
  return commonsAjax(`/sys/user/login`, data, 'post')
}

/**
 *退出登陆
 **/
export function logout (data) {
  return commonsAjax(`/sys//logout`, data, 'post')
}

/**
 * 登陆
 * */
export function loginDebug (data) {
  return commonsAjax(`/sys/login/debug`, data, 'post')
}

/**
 * 菜单
 * */
export function menuList (data) {
  return commonsAjax(`/sys/user/menu/list`, '', 'get')
}
