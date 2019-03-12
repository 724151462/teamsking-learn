import { commonsAjax } from '../utils/requery'

/**
 * 活动列表
 */
export function chapterView(data) {
    let url = `/course/chapter/section/item/${data.itemId}/view`
    return commonsAjax(url, '', 'get')
  }

/**
 * 资源列表
 */
export function getResourceViewByUrl(data) {
  let url = `/docview/url`
  return commonsAjax(url, data, 'post')
}
  