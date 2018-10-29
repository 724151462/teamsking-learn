import { commonsAjax } from '../utils/requery'

/**
 * 获取课程列表
 */
export function coursePage (data) {
  return commonsAjax('/api/v1/course/page', data, 'get')
}

/**
 * 发布课程
 */
export function publish (data) {
  let url = '/api/v1/course/' + data + '/publish'
  return commonsAjax(url, '', 'put')
}

/**
 * 获取课程分类列表
 */
export function categories (data) {
  return commonsAjax('/api/v1/common/categories', 'data', 'get')
}

/**
 * 获取课程分类列表
 */
export function tags (data) {
  return commonsAjax('/api/v1/common/tags', 'data', 'get')
}

/**
 * 获取讲师列表
 */
export function instructorList (data) {
  return commonsAjax('/api/v1/course/instructor/list', 'data', 'get')
}

