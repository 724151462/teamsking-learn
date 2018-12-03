import { commonsAjax } from '@/utils/requery'

/**
 * 登陆
 * */
export function logins (data) {
  return commonsAjax('/api/v1/sys/login', data, 'post')
}


/**
 * 菜单
 * */
export function menuList (data) {
  return commonsAjax('http://192.168.10.48:9008/api/v1/sys/user/menu/list', '', 'get')
}