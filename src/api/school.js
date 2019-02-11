const devUrl = '/api/v1/sys/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/sys/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

import { commonsAjax } from '../utils/requery'

/**
 * 学院页面
 */


/***
 * 获取学院信息
 * @param data
 */
export function sysCollegePage (data) {
  return commonsAjax(`${baseUrl}college/page/`, data, 'get')
  // return commonsAjax('/api/v1/course/page', data, 'get')
}
/**
 * 查看班级列表
 */
export function classPage (data) {
  return commonsAjax(`${baseUrl}class/page`, data, 'get')
}

/***
 *添加院信息
 * @param data
 */
export function sysCollege (data) {
  return commonsAjax(`${baseUrl}college`,data,'post')
  //return commonsAjax('/api/v1/course/page', data, 'get')
}

/***
 * 批量删除院信息
 * @param data
 */
export function sysCollegeDelete( data ){
  return commonsAjax(`${baseUrl}college`,data,'delete')
}

/***
 * 根据workNumber查询名字
 * @param id
 */
export function sysTenantTeacher( id ){
  let url = `${baseUrl}tenant/teacher/`+id;
  return commonsAjax(url,'','get')
}

/***
 * 修改院信息
 */
export function sysCollegeEdit(data){
  return commonsAjax(`${baseUrl}college`,data,'put')
}

/****
 * 获取院列表
 */
export function sysCollegeList(){
  return commonsAjax(`${baseUrl}college/list`,'','get')
}

/***
 * 获取系列表
 */
export function sysDepartmentPage(data){
  return commonsAjax(`${baseUrl}department/page`,data,'get')
}

/**
 * 获取全部的系
 * ${baseUrl}department/list
 * */
export function sysDepartmentList(){
  return commonsAjax(`${baseUrl}department/list`,{ collegeId : -1 },'get')
}
/**
 * 获取全部的系
 * ${baseUrl}department/list
 * */
export function DepartmentList(data){
  return commonsAjax(`${baseUrl}department/list`,data,'get')
}

/***
 *添加系
 * @Param ( collegedId,departmentName,manager )
 */
export function sysDepartment(data){
  return commonsAjax(`${baseUrl}department`,data,'post')
}

/***
 * 编辑系
 * @param data
 */
export function sysDepartmentEdit(data){
  return commonsAjax(`${baseUrl}department`,data,'put')
}

/***
 * 删除系
 */
export function sysDepartmentDelete(data){
  return commonsAjax(`${baseUrl}department`,data,'delete');
}


/***
 * 获取专业列表
 */
export function sysSpecialityPage(data){
  //return commonsAjax('${baseUrl}speciality/page',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax(`${baseUrl}speciality/page`,data,'get')
}
/**
 * 添加专业 ${baseUrl}speciality
 * */
export function sysSpeciality(data){
  return commonsAjax(`${baseUrl}speciality`,data,'post')
}
/**
 * 修改专业
 * */
export function sysSpecialityEdit(data){
  return commonsAjax(`${baseUrl}speciality`,data,'put')
}

/***
 *  删除专业  ${baseUrl}speciality
 */
export function sysSpecialityDelete(data){
  return commonsAjax(`${baseUrl}speciality`,data,'delete')
}

/***
 * 获取学生列表
 */
export function sysStudentPage(data){
  console.log('ewq',data)
  let college = data.college || -1
  let department = data.department || -1
  let speciality = data.speciality || -1
  let studentClass = data.studentClass || -1
  let studentInfo = data.search || ''

  //return commonsAjax('${baseUrl}student/page',{ studentId:1,pageIndex:1,pageSize:10  },'get')
  let url = `${baseUrl}student/page?collegeId=${college}&departmentId=${department}&classId=${studentClass}&specialityId=${speciality}&pageSize=10&pageIndex=${data.pageIndex || 1}&search=${studentInfo}`
  return commonsAjax(url,'','get')
}


/***
* 学生启用/禁用
*/
export function sysStudentSwitch(data){
  let url = `${baseUrl}student/${data.id}/${data.status}`
  return commonsAjax(url, '', 'get')
}


/***
 * 获取专业列表
 */
export function sysSpecialityList(data){
  //return commonsAjax('${baseUrl}speciality/list',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax(`${baseUrl}speciality/list`, data, 'get')
}


/***
 * 获取班级列表
 */
export function sysClassList(data){
  //return commonsAjax('${baseUrl}speciality/list',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax(`${baseUrl}class/list`, data, 'get')
}


/***
 * 添加新学生
 */
export function sysStudentAdd(data){
  //return commonsAjax('${baseUrl}student',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax(`${baseUrl}student`, data, 'post')
}


/***
 * 获取学生信息
 */
export function sysStudentInfo(data){
  return commonsAjax(`${baseUrl}student/${data.studentId}`, '', 'get')
}


/***
 * 修改学生信息
 */
export function sysStudentModify(data){
  let url = `${baseUrl}student`
  return commonsAjax(url,data,'put')
}

/***
 * 删除学生信息
 */
export function sysStudentDelete(data){
  let url = `${baseUrl}student`
  return commonsAjax(url,data,'delete')
}

/***
 * 查询老师信息
 */
export function sysTeacherPage(data){
  let college = data.college || -1
  let department = data.department || -1
  let teacherInfo = data.teacherInfo || ''
  //return commonsAjax('${baseUrl}student/page',{ studentId:1,pageIndex:1,pageSize:10  },'get')
  let url = `${baseUrl}teacher/page?collegeId=${college}&departmentId=${department}&search=${teacherInfo}&pageIndex=${data.pageIndex}`
  return commonsAjax(url,'','get')
}

/***
* 教师启用/禁用
*/
export function sysTeacherSwitch(data){
  let url = `${baseUrl}teacher/${data.id}/${data.status}`
  return commonsAjax(url, '', 'get')
}


/***
* 添加教师
*/
export function sysTeacherAdd(data){
  return commonsAjax(`${baseUrl}teacher`, data, 'post')
}


/***
 * 重置教师密码
 */
export function sysTeacherReset(data){
  let url = `${baseUrl}teacher/passwd`
  return commonsAjax(url,data,'post')
}


/***
* 教师id查询
*/
export function sysTeacherId(data){
  let url = `${baseUrl}teacher/${data.id}`
  return commonsAjax(url, '', 'get')
}


/***
* 教师id查询
*/
export function sysTeacherModify(data){
  let url = `${baseUrl}teacher`
  return commonsAjax(url, data, 'put')
}


// ===============证书===============
//

/***
 * 获取证书列表
 */
export function sysCertificatePage(data){
  return commonsAjax(`${baseUrl}certificate/page`,data,'get')
}

/***
 * 保存证书
 */
export function sysSaveCertificate(data){
  return commonsAjax(`${baseUrl}/certificate`,data,'post')
}


/***
 * 查看证书
 */
export function sysCertificateId(data){
  return commonsAjax(`${baseUrl}certificate/${data.id}`, '' ,'get')
}


/***
 * 审核
 */
export function sysCertificateAudit(data){
  return commonsAjax(`${baseUrl}certificate`, data ,'put')
}


/***
 * 审核详情
 */
export function sysCertificateDetail(data){
  return commonsAjax(`${baseUrl}certificate/${data}/audit`, '' ,'get')
}


// ===============课程===============
//

/***
 * 获取课程列表
 */
export function sysCoursePage(data){
  return commonsAjax('/api/v1/course/page',data,'get')
}


/***
 * 获取课程id
 */
export function sysCourseId(data){
  return commonsAjax(`/api/v1/course/${data}`,'','get')
}

/***
 * 分页查询班级列表 ${baseUrl}class/page
 */


export function sysClassPage(data){
  return commonsAjax(`${baseUrl}class/page`,data,'get')
}

/**
 * 添加班级 ${baseUrl}class
 * */
export function sysClass(data){
  return commonsAjax(`http://120.36.137.90:8008/api/v1/class`,data,'post')
}

/**
 *  修改班级 ${baseUrl}class
 */
export function sysClassUpdate(data){
  return commonsAjax(`${baseUrl}class`,data,'put')
}

/**
 * 删除班级  ${baseUrl}class
 */
export function sysClassDelete(data){
  return commonsAjax(`${baseUrl}class`,data,'delete')
}


/**
 * 获取名师风采列表 ${baseUrl}recommend/teacher/page
 * */
export function sysRecommenTeacherPage(){
  return commonsAjax(`${baseUrl}recommend/teacher/page`,{},'get')
}

/***
 * 获取名师列表   ${baseUrl}recommend/tenant/teacher/page
 */
export function sysRecommenTenantTeacherPage(){
  return commonsAjax(`${baseUrl}recommend/tenant/teacher/page`,{},'get')
}
