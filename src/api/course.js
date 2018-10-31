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
  return commonsAjax('/api/v1/course/instructor/list', '', 'get')
}

/**
 * 获取教师列表
 */
// <<<<<<< HEAD
// export function sysCollegePage (data) {
//   return commonsAjax('http://www.tms.teamsking.com:9008/api/v1/sys/college/page/',data,'get')
//   //return commonsAjax('/api/v1/course/page', data, 'get')
// =======
// export function teachersList (data) {
//   let url = '/api/v1/tenant/' + 1 + '/teachers'
//   return commonsAjax(url, '', 'get')
// >>>>>>> 9dfe0d8c1c3b3dfeab5a3ae9c3eaad64897b7979
// }

/**
 * 获取教师列表
 */
export function addInstructor (data) {
  console.log('要穿的数据',data)
  return commonsAjax('/api/v1/course/instructor', data, 'post')
}

/**
 * 保存课程
 */
export function saveCourse (data) {
  return commonsAjax('/api/v1/course', data, 'post')
}

/**
 * 查询课程信息
 */
export function courseInfo (data) {
  let url = '/api/v1/course/info/' + data
  return commonsAjax(url, '', 'post')
}

/**
 * 查询课程下资源列表
 */
export function resourcePage (id, data) {
  let url = '/api/v1/course/' + id + '/resource/page'
  return commonsAjax(url, data, 'get')
}

/**
 * 删除课程下资源
 */
export function deletedResource (id, data) {
  // resourceId
  let url = '/api/v1/course/resource/' + id
  return commonsAjax(url, data, 'delete')
}

/**
 * 获取试题列表
 */
export function quizPage (id, data) {
  let url = '/api/v1/course/' + id + '/quiz/page'
  return commonsAjax(url, data, 'get')
}

/**
 * 保存试题
 */
export function saveQuiz (data) {
  return commonsAjax('/api/v1/course/quiz', data, 'post')
}

/**
 * 删除试题
 */
export function deleteQuiz (data) {
  let url = '/api/v1/course/quiz/' + data
  return commonsAjax(url, '', 'delete')
}

/**
 * 根据课程id获取所有章节信息
 */
export function chaptersList (data) {
  let url = '/api/v1/course/' + data + '/chapters'
  return commonsAjax(url , '', 'get')
}

