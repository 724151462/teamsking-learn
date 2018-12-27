const devUrl = '/api/v1/library/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/library/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

import {
    commonsAjax
  } from '../utils/requery'  

// ==============试题===========
/**
 * 获取试题列表
 */
export function getTestFileFold(data) {
  let url = `${baseUrl}quiz/quizzes`
  return commonsAjax(url, data, 'post')
}


export function getAnswer(data) {
  let url = `${baseUrl}quiz/${data.quizId}/options`
  return commonsAjax(url, '', 'get')
}


/**
 * 新建试题文件夹
 */
export function newTestFileFold(data) {
  let url = `${baseUrl}quiz/catalog`
  return commonsAjax(url, data, 'post')
}

/**
 * 批量删除试题文件夹
 */
export function deleteTestFileFold(data) {
  let url = `${baseUrl}quiz/catalog`
  return commonsAjax(url, data, 'delete')
}
