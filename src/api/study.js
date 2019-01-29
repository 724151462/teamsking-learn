const devUrl = '/api/v1/study/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/study/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl
import {
  commonsAjax
} from '../utils/requery'

/************
 * 数据统计模块
 *************/



/**
 * 课后数据
 */
export function afterOther(data) {
  return commonsAjax(`${baseUrl}classafter/other`, data, 'post')
}
