import { commonsAjax } from '../utils/requery'

/**
 * 获取课程列表
 */
export function coursePage (data) {
  return commonsAjax('/api/v1/course/page', data, 'get')
}

/**
 * 获取课程分类列表
 */
// export function sysCategoryPage (data) {
//     return commonsAjax('/api/v1/sys/category/page',data,'get')
// }

// /api/v1/sys/category/page
