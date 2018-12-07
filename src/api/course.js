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
  return commonsAjax('/api/v1/common/categories', '', 'get')
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
export function teachersList (data) {
  let url = '/api/v1/tenant/' + 1 + '/teachers'
  return commonsAjax(url, '', 'get')
}

/**
 * 获取教师列表
 */
export function addInstructor (data) {
  console.log('要穿的数据', data)
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
  console.log(data)
  let url = '/api/v1/course/info/' + data
  return commonsAjax(url, '', 'get')
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
// export function quizPage (id, data) {
//   let url = '/api/v1/course/' + id + '/quiz/page'
//   return commonsAjax(url, data, 'get')
// }
/**
 * 获取试题列表2
 */
export function quizPage (data) {
  let url = '/api/v1/library/quiz/page'
  return commonsAjax(url, '', 'get')
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
  return commonsAjax(url, '', 'get')
}


/**
 * 添加章
 */

export function chaptersAdd (data) {
  let url = '/api/v1/course/chapter'
  return commonsAjax(url, data, 'post')
}


/**
 * 添加节
 */

export function sectionAdd (data) {
  let url = '/api/v1/course/chapter/section'
  return commonsAjax(url, data, 'post')
}


/**
 * 根据课程id获取成员
 */
export function memberList (data) {
  let url = `/api/v1/course/${data.courseId}/user/page`
  return commonsAjax(url, data, 'get')
}


/**
 * 根据课程id获取未分配和已分配的组员
 */
export function memberScheme (data) {
  let url = `/api/v1/course/{courseId}/scheme/{schemeId}/team/user`
  return commonsAjax(url, data, 'get')
}


/**
 * 设置为助教
 */
export function setAssistant (data) {
  let url = `/api/v1/course/${data.courseId}/user/${data.userId}/assistant`
  return commonsAjax(url, '', 'post')
}


/**
 * 取消助教
 */
export function unsetAssistant (data) {
  let url = `/api/v1/course/${data.courseId}/user/${data.userId}/assistant`
  return commonsAjax(url, '', 'delete')
}


/**
 * 取消助教
 */
export function deleteUser (data) {
  let url = `/api/v1/course/${data.courseId}/user/${data.userId}`
  return commonsAjax(url, '', 'delete')
}

// ===============资源管理===============
//

/**
 * 获取所有资源列表
 */
export function getResourceList (data) {
  let url = '/api/v1/resource/page'
  return commonsAjax(url, '', 'get')
}


/**
 * 添加小项
 */
export function itemAdd (data) {
  let url = '/api/v1/course/chapter/section/item'
  return commonsAjax(url, data, 'post')
}



/**
 * 添加成员方案名称
 */
export function schemeAdd (data) {
  let url = '/api/v1/course/scheme'
  return commonsAjax(url, data, 'post')
}


/**
 * 根据课程id获取方案列表
 */
export function schemeList (data) {
  let url = `/api/v1/course/${data}/schemes`
  return commonsAjax(url, '', 'get')
}



/**
 * 根据方案id获取方案成员列表
 */
export function memberEditList (data) {
  let url = `/api/v1/course/scheme/${data}/teams`
  return commonsAjax(url, '', 'get')
}


/**
 * 根据方案id获取方案成员分配/未分配列表
 */
export function memberMatchList (data) {
  let url = `/api/v1/course/${data.courseId}/scheme/${data.schemeId}/team/user`
  return commonsAjax(url, data, 'get')
}


/**
 * 根据方案id提交小组分配方案
 */
export function memberMatch (data) {
  let url = `/api/v1/course/scheme/${data.schemeId}/team`
  return commonsAjax(url, data, 'post')
}