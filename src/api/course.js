const devUrl = '/api/v1/course/' // 开发环境
const prodUrl = 'http://120.36.137.90:8008/api/v1/course/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

const commonDevUrl = '/api/v1/' // 开发环境
const commonProdUrl = 'http://120.36.137.90:8008/api/v1/' // 生产环境
const commonBaseUrl = process.env.NODE_ENV === 'production' ? commonProdUrl : commonDevUrl

//资源库基础URL
const libDevUrl = '/api/v1/library/' // 开发环境
const libProdUrl = 'http://120.36.137.90:8008/api/v1/library/' // 生产环境
const libBaseUrl = process.env.NODE_ENV === 'production' ? libProdUrl : libDevUrl

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
  let url = `${commonBaseUrl}${data.courseId}/studymode/${data.studyMode}`
  return commonsAjax(url, '', 'put')
}


/**
 * 获取课程分类列表
 */
export function categories(data) {
  return commonsAjax(`${commonBaseUrl}common/categories`, '', 'get')
}

/**
 * 获取课程分类列表
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
 * 获取教师列表
 */
export function addInstructor(data) {
  console.log('要穿的数据', data)
  return commonsAjax(`${baseUrl}instructor`, data, 'post')
}

/**
 * 保存课程
 */
export function saveCourse(data) {
  return commonsAjax(`/api/v1/course`, data, 'post')
}

/**
 * 查询课程信息
 */
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


/**
 * 添加章
 */

export function chaptersAdd(data) {
  let url = `${baseUrl}chapter`
  return commonsAjax(url, data, 'post')
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
}


//============资源管理==================

  /**
   * 查询课程下资源列表
   */
  export function resourcePage(id, data) {
    let url = `${baseUrl}${id}/resource/page`
    return commonsAjax(url, data, 'get')
  }

  /**
   * 删除课程下资源
   */
  export function deletedResource(id, data) {
    // resourceId
    let url = `${baseUrl}resource/` + id
    return commonsAjax(url, data, 'delete')
  }

  // ===============试题管理===============
  //
  /**
   * 上传试题模板
   */
  export function upQuiz(id, data) {
    let url = `${baseUrl}${id}/quiz`
    // console.log('模板上传路径为：'+url)
    return commonsAjax(url, data, 'post')
  }

  /**
   * 获取试题列表
   */

  // export function quizPage (id, data) {
  //   let url = '${baseUrl}' + id + '/quiz/page'
  //   return commonsAjax(url, data, 'get')
  // }

  /**
   * 获取试题列表2
   */
  export function quizPage(data) {
    let url = `${baseUrl}library/quiz/page`
    return commonsAjax(url, '', 'get')
  }
  /**
   * 保存单个试题信息
   */
  export function saveQuiz(data) {
    return commonsAjax(`${baseUrl}quiz`, data, 'post')
  }

  /**
   * 获取单个试题信息(包含选项)
   */
  export function quizInfo(id) {
    let url = `${libBaseUrl}quiz/${id}`
    return commonsAjax(url, '', 'get')
  }

  /**
   * 删除试题
   */
  export function deleteQuiz(data) {
    let url = `${baseUrl}quiz/` + data
    return commonsAjax(url, '', 'delete')
  }

/**
 * 修改试题
 */
export function putQuiz(data) {
  let url = `${baseUrl}quiz`
  return commonsAjax(url, data, 'put')
}

  /**
   * 复制方案
   */
  export function groupCopy(data) {
    let url = `${baseUrl}scheme/${data.schemeId}`
    return commonsAjax(url, '', 'post')
  }