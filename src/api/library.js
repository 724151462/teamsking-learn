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
/**
 * 删除一个试题
 */
export function deleteQuiz(id) {
  let url = `${baseUrl}quiz/${id}`
  let data = {quizId: id}
  return commonsAjax(url, data, 'delete')
}
/**
 * 获取单个试题的信息，包含选项
 */
export function quizInfo(data) {
  let url = `${baseUrl}quiz/${data}`
  return commonsAjax(url, data, 'get')
}
/**
 * 修改试题信息
 */
export function putQuiz(data) {
  let url = `${baseUrl}quiz`
  return commonsAjax(url, data, 'put')
}
/**
 * 重命名文件夹
 */
export function testFileFoldRename(data) {
  let url = `${baseUrl}quiz/catalog`
  return commonsAjax(url, data, 'put')
}

// ==============资源相关===========

/**
 * 获取资源列表
 */
export function getResList(data) {
  let url = `${baseUrl}resource/resources`
  return commonsAjax(url, data, 'post')
}

/**
 * 新建资源文件夹
 */
export function newResFileFold(data) {
  let url = `${baseUrl}resource/catalog`
  return commonsAjax(url, data, 'post')
}
/**
 * 资源删除(批量)
 */
export function deleteResList(data) {
  let url = `${baseUrl}quiz/resource`
  return commonsAjax(url, data, 'delete')
}

