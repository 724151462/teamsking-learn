const devUrl = '/api/v1/library/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/library/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

import {
    commonsAjax
  } from '../utils/requery'  

// ==========资源===========
export function getTestFileFold(data) {
  let url = `${baseUrl}quiz/quizzes`
  return commonsAjax(url, data, 'post')
}