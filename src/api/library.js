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

//保存新试题
export function saveQuiz(data) {
  let url = `${baseUrl}quiz`
  console.log(data)
  return commonsAjax(url, data, 'post')
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
 * 批量删除试题
 */
export function deleteQuiz(data) {
  let url = `${baseUrl}quiz/`
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
 * 移动资源
 */
export function moveRes(data) {
  // let url = `http://120.36.137.90:9008/api/v1/library/catalog/resource`
  let url = `${baseUrl}/catalog/resource`
  return commonsAjax(url, data, 'patch')
}
/**
 * 修改资源文件夹名字
 */
export function reResFileFold(data) {
    let url = `${baseUrl}resource/catalog`
    return commonsAjax(url, data, 'put')
}
/**
 * 删除资源文件夹
 */
export function delResFileFold(data) {
    let url = `${baseUrl}resource/catalog`
    return commonsAjax(url, data, 'delete')
}
/**
 * 资源删除(批量)
 */
export function deleteRes(data) {
  console.log('要删除的资源',data)
  let url = `${baseUrl}/resource`
  return commonsAjax(url, data, 'delete')
}

/**
 * 资源本地上传
 */
export function localUpload(data) {
  let url = `${baseUrl}resource`
  return commonsAjax(url, data, 'post')
}

// ==============活动相关===========

/**
 * 活动批量删除
 */
export function deleteAc(data) {
  let url = `${baseUrl}interaction/catalog`
  return commonsAjax(url, data, 'delete')
}
/**
 * 活动移动到另外的文件夹
 */
export function removeAc(data) {
  console.log(data)
    let url = `${baseUrl}interaction/catalog`
    return commonsAjax(url, data, 'patch')
}
/**
 * 创建活动文件夹
 */
export function createAc(data) {
    let url = `${baseUrl}interaction/catalog`
    return commonsAjax(url, data, 'post')
}
/**
 * 重命名文件夹
 */
export function renameAc(data) {
    let url = `${baseUrl}interaction/catalog`
    return commonsAjax(url, data, 'put')
}
/**
 * 获取活动列表
 */
export function getAcList(data) {
    let url = `${baseUrl}interaction/interactions`
    return commonsAjax(url, data, 'post')
}
