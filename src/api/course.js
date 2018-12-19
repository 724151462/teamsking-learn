const devUrl = '/api/v1/course/' // 开发环境
const prodUrl = 'http://120.36.137.90:8008/api/v1/course/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

const commonDevUrl = '/api/v1/' // 开发环境
const commonProdUrl = 'http://120.36.137.90:8008/api/v1/' // 生产环境
const commonBaseUrl = process.env.NODE_ENV === 'production' ? commonProdUrl : commonDevUrl

import {
  commonsAjax
} from '../utils/requery'

/**
 * 获取课程列表
 */
export function coursePage(data) {
  return commonsAjax(`${baseUrl}page`, data, 'get')
}

/**
 * 发布课程
 */
export function publish(data) {
  let url = `${baseUrl}` + data + '/publish'
  return commonsAjax(url, '', 'put')
}


/**
 * 课程简单信息
 */
export function courseBaseInfo(data) {
  let url = `${baseUrl}${data}`
  return commonsAjax(url, '', 'get')
}


/**
 * 修改学习模式
 */
export function studyModeModify(data) {
  let url = `${baseUrl}${data.courseId}/studymode/${data.studyMode}`
  return commonsAjax(url, '', 'put')
}


/**
 * 获取课程分类列表
 */
export function categories(data) {
  return commonsAjax(`${commonBaseUrl}common/categories`, '', 'get')
}

/**
 * 获取课程标签列表
 */
export function tags(data) {
  return commonsAjax(`${commonBaseUrl}common/tags`, 'data', 'get')
}

/**
 * 获取讲师列表
 */
export function instructorList(data) {
  return commonsAjax(`${baseUrl}instructor/list`, data, 'get')
}

/**
 * 获取教师列表
 */
export function teachersList(data) {
  let url = `${commonBaseUrl}tenant/` + 1 + '/teachers'
  return commonsAjax(url, '', 'get')
}

/**
 * 添加讲师
 */
export function addInstructor(data) {
  console.log('添加讲师')
  return commonsAjax(`${baseUrl}instructor`, data, 'post')
}

/**
 * 保存课程
 */
export function saveCourse(data) {
  return commonsAjax(`${baseUrl}`, data, 'post')
}
/**
 * 查询课程信息
 */▆
export function courseInfo(data) {
  console.log(data)
  let url = `${baseUrl}info/` + data
  return commonsAjax(url, '', 'get')
}

/**
 * 根据课程id获取所有章节信息
 */
export function chaptersList(data) {
  let url = `${baseUrl}` + data + '/chapters'
  return commonsAjax(url, '', 'get')
}


export function chaptersListSimple(data) {
  let url = `${baseUrl}chapter/list/${data.courseId}`
  return commonsAjax(url, '', 'get')
}


/**
 * 添加章
 */

export function chaptersAdd(data) {
  let url = `${baseUrl}chapter`
  return commonsAjax(url, data, 'post')
}


/**
 * 删除章
 */

export function chaptersDelete(data) {
  let url = `${baseUrl}chapter/chapter`
  return commonsAjax(url, data, 'delete')
}


/**
 * 添加节
 */

export function sectionAdd(data) {
  let url = `${baseUrl}chapter/section`
  return commonsAjax(url, data, 'post')
}


/**
 * 根据课程id获取成员
 */
export function memberList(data) {
  let url = `${baseUrl}${data.courseId}/user/page`
  return commonsAjax(url, data, 'get')
}


/**
 * 根据课程id获取未分配和已分配的组员
 */
export function memberScheme(data) {
  let url = `${baseUrl}${data.courseId}/scheme/${data.schemeId}/team/user`
  return commonsAjax(url, data, 'get')
}


/**
 * 设置为助教
 */
export function setAssistant(data) {
  let url = `${baseUrl}${data.courseId}/user/${data.userId}/assistant`
  return commonsAjax(url, '', 'post')
}


/**
 * 取消助教
 */
export function unsetAssistant(data) {
  let url = `${baseUrl}${data.courseId}/user/${data.userId}/assistant`
  return commonsAjax(url, '', 'delete')
}


/**
 * 取消助教
 */
export function deleteUser(data) {
  let url = `${baseUrl}${data.courseId}/user/${data.userId}`
  return commonsAjax(url, '', 'delete')
}

// ===============资源管理===============
//

/**
 * 获取所有资源列表
 */
export function getResourceList(data) {
  let url = `${baseUrl}resource/page`
  return commonsAjax(url, '', 'get')
}


/**
 * 添加小项
 */
export function itemAdd(data) {
  let url = `${baseUrl}chapter/section/item`
  return commonsAjax(url, data, 'post')
}



/**
 * 添加成员方案名称
 */
export function schemeAdd(data) {
  let url = `${baseUrl}scheme`
  return commonsAjax(url, data, 'post')
}


/**
 * 根据课程id获取方案列表
 */
export function schemeList(data) {
  let url = `${baseUrl}${data}/schemes`
  return commonsAjax(url, '', 'get')
}



/**
 * 根据方案id获取方案成员列表
 */
export function memberEditList(data) {
  let url = `${baseUrl}scheme/${data.schemeId}/teams`
  return commonsAjax(url, '', 'get')
}



/**
 * 新增组名
 */
export function teamNameAdd(data) {
  let url = `${baseUrl}scheme/${data.schemeId}/team`
  return commonsAjax(url, data, 'post')
}


/**
 * 修改组名
 */
export function teamNameModify(data) {
  console.log(data)
  let url = `${baseUrl}scheme/${data.schemeId}/team/${data.teamId}`
  return commonsAjax(url, {
    'teamName': data.teamName
  }, 'put')
}



/**
 * 根据方案id获取方案成员分配/未分配列表
 */
export function memberMatchList(data) {
  let url = `${baseUrl}${data.courseId}/scheme/${data.schemeId}/team/user`
  return commonsAjax(url, data, 'get')
}


/**
 * 根据方案id提交小组分配方案
 */
export function memberMatch(data) {
  let url = `${baseUrl}scheme/${data.schemeId}/team`
  return commonsAjax(url, data, 'post')
}


/**
 * 删除小组方案
 */
export function teamDelete(data) {
  let url = `${baseUrl}scheme/${data.schemeId}/team/${data.teamId}`
  return commonsAjax(url, '', 'delete')
}


/**
 * 删除小组方案
 */
export function delGroupMember(data) {
  let url = `${baseUrl}scheme/team/${data.teamId}/user/${data.userId}`
  return commonsAjax(url, '', 'delete')
}


/**
 * 修改方案名称
 */
export function planNameModify(data) {
  let url = `${baseUrl}scheme/${data.schemeId}`
  return commonsAjax(url, data.nameForm, 'put')
}


/**
 * 删除方案名称
 */
export function groupDelete(data) {
  let url = `${baseUrl}scheme/${data.schemeId}`
  return commonsAjax(url, data, 'delete')
}


/**
 * 复制方案
 */
export function groupCopy(data) {
  let url = `${baseUrl}scheme/${data.schemeId}`
  return commonsAjax(url, '', 'post')
}

// ========测试=========


/**
 * 测试添加
 */
export function testAdd(data) {
  let url = `${baseUrl}exam`
  return commonsAjax(url, data, 'post')
}


/**
 * 测试列表
 */
export function testList(data) {
  let url = `${baseUrl}exam/list/${data.courseId}`
  return commonsAjax(url, data, 'get')
}


/**
 * 测试成绩
 */
export function testMark(data) {
  let url = `${baseUrl}exam/submit/list/${data.courseId}/${data.examId}`
  return commonsAjax(url, '', 'get')
}


/**
 * 成绩详情
 */
export function markDetail(data) {
  let url = `${baseUrl}exam/submit/detail/${data.examId}/${data.examSubmissionId}`
  return commonsAjax(url, '', 'get')
}


/**
 * 笔记列表
 */
export function noteList(data) {
  let url = `${baseUrl}note/list/${data.courseId}`
  return commonsAjax(url, '', 'get')
}


/**
 * 笔记删除
 */
export function noteDelete(data) {
  let url = `${baseUrl}note`
  return commonsAjax(url, data, 'delete')
}


/**
 * 头脑风暴
 */
export function storm(data) {
  let url = `${baseUrl}storm/${data.stormId}`
  return commonsAjax(url, '', 'get')
}


/**
 * 作业详情
 */
export function homeWorkDetail(data) {
  let url = `${baseUrl}homework/${data.homeworkId}`
  return commonsAjax(url, '', 'get')
}


/**
 * 作业列表
 */
export function homeWorkList(data) {
  let url = `${baseUrl}homeworksubmission/${data.courseId}`
  return commonsAjax(url, '', 'get')
}


/**
 * 作业回答列表
 */
export function homeWorkAnswerList(data) {
  let url = `${baseUrl}homeworksubmission/item/${data.courseId}/${data.homeworkId}`
  return commonsAjax(url, '', 'get')
}


export function homeWorkRepulse(data) {
  let url = `${baseUrl}homeworksubmission/repulse/${data.homeworkSubmissionId}`
  return commonsAjax(url, '', 'get')
}

/**
 * 作业评分
 */
export function homeWorkScore(data) {
  let url = `${baseUrl}homeworksubmission`
  return commonsAjax(url, data, 'post')
}


// ==========活动==========
/**
 * 活动列表
 */
export function interactList(data) {
  let url = `${baseUrl}${data.courseId}/interactions`
  return commonsAjax(url, data, 'post')
}


/**
 * 投票详情
 */
export function interactVote(data) {
  let url = `${baseUrl}vote/${data.voteId}`
  return commonsAjax(url, data, 'get')
}


/**
 * 保存投票
 */
export function voteSave(data) {
  let url = `${baseUrl}vote`
  return commonsAjax(url, data, 'post')
}


/**
 * 头脑风暴详情
 */
export function interactBS(data) {
  let url = `${baseUrl}storm/${data.stormId}`
  return commonsAjax(url, '', 'get')
}


/**
 * 测试详情
 */
export function interactExam(data) {
  let url = `${baseUrl}exam/${data.examId}`
  return commonsAjax(url, '', 'get')
}
