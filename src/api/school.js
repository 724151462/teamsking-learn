import { commonsAjax } from '../utils/requery'

/**
 * 学院页面
 */
export function sysCollegePage (data) {
  return commonsAjax('api/v1/sys/college/page/',data,'get')
  //return commonsAjax('/api/v1/course/page', data, 'get')
}
