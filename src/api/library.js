import {
    commonsAjax
  } from '../utils/requery'

// ==============试题===========
/**
 * 获取试题列表
 */
export function getTestFileFold(data) {
  let url = `/api/v1/library/quiz/quizzes`
  return commonsAjax(url, data, 'post')
}

export function getAnswer(data) {
  let url = `/api/v1/library/quiz/${data.quizId}/options`
  return commonsAjax(url, '', 'get')
}
//上传试题模板
export function upQuiz(data) {
  let url = `/api/v1/library/quiz/import`
  return commonsAjax(url, data, 'post')
}

//保存新试题
export function saveQuiz(data) {
  let url = `/api/v1/library/quiz`
  console.log(data)
  return commonsAjax(url, data, 'post')
}

/**
 * 新建试题文件夹
 */
export function newTestFileFold(data) {
  let url = `/api/v1/library/quiz/catalog`
  return commonsAjax(url, data, 'post')
}

/**
 * 批量删除试题文件夹
 */
export function deleteTestFileFold(data) {
  let url = `/api/v1/library/quiz/catalog`
  return commonsAjax(url, data, 'delete')
}
/**
 * 移动试题
 */
export function moveTest(data) {
  let url = `/api/v1/library/catalog/quiz`
  return commonsAjax(url, data, 'patch')
}
/**
 * 批量删除试题
 */
export function deleteQuiz(data) {
  let url = `/api/v1/library/quiz/`
  return commonsAjax(url, data, 'delete')
}

/**
 * 获取单个试题的信息，包含选项
 */
export function quizInfo(data) {
  let url = `/api/v1/library/quiz/${data}`
  return commonsAjax(url, data, 'get')
}
/**
 * 修改试题信息
 */
export function putQuiz(data) {
  let url = `/api/v1/library/quiz`
  return commonsAjax(url, data, 'put')
}
/**
 * 重命名文件夹
 */
export function testFileFoldRename(data) {
  let url = `/api/v1/library/quiz/catalog`
  return commonsAjax(url, data, 'put')
}

// ==============资源相关===========

/**
 * 获取资源列表
 */
export function getResList(data) {
  let url = `/api/v1/library/resource/resources`
  return commonsAjax(url, data, 'post')
}
/**
 * 课堂模式下获取资源列表
 */
export function classRes(data) {
  let url = `/api/v1/library/resource/resources/async`
  return commonsAjax(url, data, 'post')
}
/**
 * 新建资源文件夹
 */
export function newResFileFold(data) {
  let url = `/api/v1/library/resource/catalog`
  return commonsAjax(url, data, 'post')
}
/**
 * 资源id获取资源信息
 */
export function getFileDetail(data) {
  let url = `/api/v1/library/resource/${data.resourceId}`
  return commonsAjax(url, '', 'get')
}
/**
 * 移动资源
 */
export function moveRes(data) {
  let url = `/api/v1/library/catalog/resource`
  return commonsAjax(url, data, 'patch')
}
/**
 * 修改资源文件夹名字
 */
export function reResFileFold(data) {
    let url = `/api/v1/library/resource/catalog`
    return commonsAjax(url, data, 'put')
}
/**
 * 删除资源文件夹
 */
export function delResFileFold(data) {
    let url = `/api/v1/library/resource/catalog`
    return commonsAjax(url, data, 'delete')
}
/**
 * 资源删除(批量)
 */
export function deleteRes(data) {
  console.log('要删除的资源',data)
  let url = `/api/v1/library/resource`
  return commonsAjax(url, data, 'delete')
}

/**
 * 资源本地上传
 */
export function localUpload(data) {
  let url = `/api/v1/library/resource`
  return commonsAjax(url, data, 'post')
}

// ==============活动相关===========

/**
 * 活动批量删除
 */
export function deleteAc(data) {
  let url = `/api/v1/library/interaction/catalog`
  return commonsAjax(url, data, 'delete')
}
/**
 * 活动移动到另外的文件夹
 */
export function removeAc(data) {
  console.log(data)
    let url = `/api/v1/library/catalog/interaction`
    return commonsAjax(url, data, 'patch')
}
/**
 * 创建活动文件夹
 */
export function createAc(data) {
    let url = `/api/v1/library/interaction/catalog`
    return commonsAjax(url, data, 'post')
}
/**
 * 重命名文件夹
 */
export function renameAc(data) {
    let url = `/api/v1/library/interaction/catalog`
    return commonsAjax(url, data, 'put')
}
/**
 * 获取活动列表
 */
export function getAcList(data) {
    let url = `/api/v1/library/interaction/interactions`
    return commonsAjax(url, data, 'post')
}
/**
 * 获取头脑风暴的信息
 */
export function getStormInfo(data) {
  let url = `/api/v1/course/storm/record/${data}`
  return commonsAjax(url, '', 'get')
}
/**
 * 获取作业的信息
 */
export function getHomeWorkInfo(data) {
  let url = `/api/v1/course/homework/${data}`
  return commonsAjax(url, '', 'get')
}

/**
 * 获取测试的信息
 */
export function getExamInfo(data) {
  let url = `/api/v1/course/exam/${data}`
  return commonsAjax(url, '', 'get')
}
/**
 * 获取投票问卷的信息
 */
export function getVoteInfo(data) {
  let url = `/api/v1/course/vote/${data}`
  return commonsAjax(url, '', 'get')
}
