const devUrl = '/api/v1/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

import { commonsAjax } from '../utils/requery'

/**
 * 活动列表
 */
export function chapterView(data) {
    let url = `${baseUrl}course/chapter/section/item/${data.itemId}/view`
    return commonsAjax(url, '', 'get')
  }

/**
 * 资源列表
 */
export function classModeResourceView(data) {
  let url = `${baseUrl}docview/url`
  return commonsAjax(url, data, 'post')
}
  