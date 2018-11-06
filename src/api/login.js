import { commonsAjax } from '@/utils/requery'

/**
 * 登陆
 * */
export function logins (data) {
  return commonsAjax('/api/v1/sys/login', data, 'post')
}