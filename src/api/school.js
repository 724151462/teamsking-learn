import { commonsAjax } from '../utils/requery'

/**
 * 学院页面
 */


/***
 * 获取学院信息
 * @param data
 */
export function sysCollegePage (data) {
  return commonsAjax('api/v1/sys/college/page/', data, 'get')
  // return commonsAjax('/api/v1/course/page', data, 'get')
}
/**
 * 查看班级列表
 */
export function classPage (data) {
  return commonsAjax('/api/v1/sys/class/page', data, 'get')
}

/***
 *添加院信息
 * @param data
 */
export function sysCollege (data) {
  return commonsAjax('api/v1/sys/college',data,'post')
  //return commonsAjax('/api/v1/course/page', data, 'get')
}

/***
 * 批量删除院信息
 * @param data
 */
export function sysCollegeDelete( data ){
  return commonsAjax('api/v1/sys/college',data,'delete')
}

/***
 * 根据workNumber查询名字
 * @param id
 */
export function sysTenantTeacher( id ){
  let url = '/api/v1/sys/tenant/teacher/'+id;
  return commonsAjax(url,'','get')
}

/***
 * 修改院信息
 */
export function sysCollegeEdit(data){
  return commonsAjax('api/v1/sys/college',data,'put')
}

/****
 * 获取院列表
 */
export function sysCollegeList(){
  return commonsAjax('api/v1/sys/college/list','','get')
}

/***
 * 获取系列表
 */
export function sysDepartmentPage(data){
  return commonsAjax('api/v1/sys/department/page',data,'get')
}

/**
 * 获取全部的系
 * /api/v1/sys/department/list
 * */
export function sysDepartmentList(){
  return commonsAjax('/api/v1/sys/department/list',{ collegeId : -1 },'get')
}


/***
 *添加系
 * @Param ( collegedId,departmentName,manager )
 */
export function sysDepartment(data){
  return commonsAjax('api/v1/sys/department',data,'post')
}

/***
 * 编辑系
 * @param data
 */
export function sysDepartmentEdit(data){
  return commonsAjax('api/v1/sys/department',data,'put')
}

/***
 * 删除系
 */
export function sysDepartmentDelete(data){
  return commonsAjax('/api/v1/sys/department',data,'delete');
}


/***
 * 获取专业列表
 */
export function sysSpecialityPage(data){
  //return commonsAjax('api/v1/sys/speciality/page',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax('api/v1/sys/speciality/page',data,'get')
}
/**
 * 添加专业 /api/v1/sys/speciality
 * */
export function sysSpeciality(data){
  return commonsAjax('api/v1/sys/speciality',data,'post')
}
/**
 * 修改专业
 * */
export function sysSpecialityEdit(data){
  return commonsAjax('api/v1/sys/speciality',data,'put')
}

/***
 *  删除专业  /api/v1/sys/speciality
 */
export function sysSpecialityDelete(data){
  return commonsAjax('api/v1/sys/speciality',data,'delete')
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
  let studentInfo = data.studentInfo || ''

  //return commonsAjax('api/v1/sys/student/page',{ studentId:1,pageIndex:1,pageSize:10  },'get')
  let url = `api/v1/sys/student/page?collegeId=${college}&departmentId=${department}&classId=${studentClass}&specialityId=${speciality}&pageSize=10&pageIndex=${data.pageIndex}`
  return commonsAjax(url,'','get')
}


/***
* 学生启用/禁用
*/
export function sysStudentSwitch(data){
  let url = `api/v1/sys/student/${data.id}/${data.status}`
  return commonsAjax(url, '', 'get')
}


/***
 * 获取专业列表
 */
export function sysSpecialityList(data){
  //return commonsAjax('api/v1/sys/speciality/list',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax('api/v1/sys/speciality/list', data, 'get')
}


/***
 * 获取班级列表
 */
export function sysClassList(data){
  //return commonsAjax('api/v1/sys/speciality/list',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax('/api/v1/sys/class/list', data, 'get')
}


/***
 * 添加新学生
 */
export function sysStudentAdd(data){
  //return commonsAjax('api/v1/sys/student',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax('/api/v1/sys/student', data, 'post')
}


/***
 * 修改学生信息
 */
export function sysStudentModify(data){
  let url = '/api/v1/sys/student'
  return commonsAjax(url,data,'put')
}

/***
 * 删除学生信息
 */
export function sysStudentDelete(data){
  let url = '/api/v1/sys/student'
  return commonsAjax(url,data,'delete')
}

/***
 * 查询老师信息
 */
export function sysTeacherPage(data){
  let college = data.college || -1
  let department = data.department || -1
  let teacherInfo = data.teacherInfo || ''
  //return commonsAjax('api/v1/sys/student/page',{ studentId:1,pageIndex:1,pageSize:10  },'get')
  let url = `api/v1/sys/teacher/page?collegeId=${college}&departmentId=${department}&search=${teacherInfo}&pageSize=2&pageIndex=${data.pageIndex}`
  return commonsAjax(url,'','get')
}


/***
* 教师启用/禁用
*/
export function sysTeacherSwitch(data){
  let url = `api/v1/sys/teacher/${data.id}/${data.status}`
  return commonsAjax(url, '', 'get')
}


/***
* 添加教师
*/
export function sysTeacherAdd(data){
  return commonsAjax('api/v1/sys/teacher', data, 'post')
}


/***
 * 重置教师密码
 */
export function sysTeacherReset(data){
  let url = '/api/v1/sys/teacher/passwd'
  return commonsAjax(url,data,'post')
}


/***
* 教师id查询
*/
export function sysTeacherId(data){
  let url = `api/v1/sys/teacher/${data.id}`
  return commonsAjax(url, '', 'get')
}


/***
* 教师id查询
*/
export function sysTeacherModify(data){
  let url = `api/v1/sys/teacher`
  return commonsAjax(url, data, 'put')
}


// ===============证书===============
//

/***
 * 获取证书列表
 */
export function sysCertificatePage(data){
  return commonsAjax('api/v1/sys/certificate/page',data,'get')
}


/***
 * 查看证书
 */
export function sysCertificateId(data){
  return commonsAjax(`api/v1/sys/certificate/${data.id}`, '' ,'get')
}


/***
 * 审核
 */
export function sysCertificateAudit(data){
  return commonsAjax(`api/v1/sys/certificate`, data ,'put')
}


/***
 * 审核详情
 */
export function sysCertificateDetail(data){
  return commonsAjax(`/api/v1/sys/certificate/${data}/audit`, '' ,'get')
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
 * 分页查询班级列表 /api/v1/sys/class/page
 */


export function sysClassPage(data){
  return commonsAjax('api/v1/sys/class/page',data,'get')
}

/**
 * 添加班级 api/v1/sys/class
 * */
export function sysClass(data){
  return commonsAjax('api/v1/sys/class',data,'post')
}

/**
 *  修改班级 api/v1/sys/class
 */
export function sysClassUpdate(data){
  return commonsAjax('api/v1/sys/class',data,'put')
}

/**
 * 删除班级  api/v1/sys/class
 */
export function sysClassDelete(data){
  return commonsAjax('api/v1/sys/class',data,'delete')
}


/**
 * 获取名师风采列表 api/v1/sys/recommend/teacher/page
 * */
export function sysRecommenTeacherPage(){
  return commonsAjax('api/v1/sys/recommend/teacher/page',{ },'delete')
}
