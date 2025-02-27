import {
  commonsAjax
} from '../utils/requery'

/**
 * 学院页面
 */


/***
 * 获取学院信息
 * @param data
 */
export function sysCollegePage(data) {
  return commonsAjax(`/api/v1/sys/college/page/`, data, 'get')
}
/**
 * 查看班级列表
 */
export function classPage(data) {
  return commonsAjax(`/api/v1/sys/class/page`, data, 'get')
}

/***
 *添加院信息
 * @param data
 */
export function sysCollege(data) {
  return commonsAjax(`/api/v1/sys/college`, data, 'post')
}

/***
 * 批量删除院信息
 * @param data
 */
export function sysCollegeDelete(data) {
  return commonsAjax(`/api/v1/sys/college`, data, 'delete')
}

/***
 * 根据workNumber查询名字
 * @param id
 */
export function sysTenantTeacher(id) {
  let url = `/api/v1/sys/tenant/teacher/` + id;
  return commonsAjax(url, '', 'get')
}

/***
 * 修改院信息
 */
export function sysCollegeEdit(data) {
  return commonsAjax(`/api/v1/sys/college`, data, 'put')
}

/****
 * 获取院列表
 */
export function sysCollegeList() {
  return commonsAjax(`/api/v1/sys/college/list`, '', 'get')
}
/***
 * 获取系列表
 */
export function sysDepartmentPage(data) {
  return commonsAjax(`/api/v1/sys/department/page`, data, 'get')
}

/**
 * 获取全部的系
 * /sys/department/list
 * */
export function sysDepartmentList(data) {
  return commonsAjax(`/api/v1/sys/department/list`, data, 'get')
}
/**
 * 获取全部的系
 * /sys/department/list
 * */
export function DepartmentList(data) {
  return commonsAjax(`/api/v1/sys/department/list`, data, 'get')
}

/***
 *添加系
 * @Param ( collegedId,departmentName,manager )
 */
export function sysDepartment(data) {
  return commonsAjax(`/api/v1/sys/department`, data, 'post')
}

/***
 * 编辑系
 * @param data
 */
export function sysDepartmentEdit(data) {
  return commonsAjax(`/api/v1/sys/department`, data, 'put')
}

/***
 * 删除系
 */
export function sysDepartmentDelete(data) {
  return commonsAjax(`/api/v1/sys/department`, data, 'delete');
}


/***
 * 获取专业列表
 */
export function sysSpecialityPage(data) {
  return commonsAjax(`/api/v1/sys/speciality/page`, data, 'get')
}
/***
 * 获取专业信息
 */
export function sysSpecialityInfo(id) {
  return commonsAjax(`/api/v1/sys/speciality/${id}`, '', 'get')
}
/**
 * 添加专业 /sys/speciality
 * */
export function sysSpeciality(data) {
  return commonsAjax(`/api/v1/sys/speciality`, data, 'post')
}
/**
 * 修改专业
 * */
export function sysSpecialityEdit(data) {
  return commonsAjax(`/api/v1/sys/speciality`, data, 'put')
}

/***
 *  删除专业  /sys/speciality
 */
export function sysSpecialityDelete(data) {
  return commonsAjax(`/api/v1/sys/speciality`, data, 'delete')
}

/***
 * 获取学生列表
 */
export function sysStudentPage(data) {
  let college = data.college || -1
  let department = data.department || -1
  let speciality = data.speciality || -1
  let studentClass = data.studentClass || -1
  let studentInfo = data.search || ''

  let url = `/api/v1/sys/student/page?collegeId=${college}&departmentId=${department}&classId=${studentClass}&specialityId=${speciality}&pageSize=10&pageIndex=${data.pageIndex || 1}&search=${studentInfo}`
  return commonsAjax(url, '', 'get')
}


/***
 * 学生启用/禁用
 */
export function sysStudentSwitch(data) {
  let url = `/api/v1/sys/student/${data.id}/${data.status}`
  return commonsAjax(url, '', 'get')
}


/***
 * 获取专业列表
 */
export function sysSpecialityList(data) {
  return commonsAjax(`/api/v1/sys/speciality/list`, data, 'get')
}


/***
 * 获取班级列表
 */
export function sysClassList(data) {
  return commonsAjax(`/api/v1/sys/class/list`, data, 'get')
}


/***
 * 添加新学生
 */
export function sysStudentAdd(data) {
  return commonsAjax(`/api/v1/sys/student`, data, 'post')
}
/***
 * 获取学生模板
 */
export function sysStudentTemp() {
  return commonsAjax(`/api/v1/sys/student/excel`, '', 'get')
}

/***
 * 上传学生模板
 */
export function sysUpTemp(data) {
  return commonsAjax(`/api/v1/sys/student/excel`, data, 'post')
}
/***
 * 获取excel解析缓存
 */
export function sysGetTempData(data) {
  return commonsAjax(`/api/v1/sys/student/excel/tmp`, '', 'get')
}
/***
 * 导入学生信息
 */
export function sysPushTemp(data) {
  return commonsAjax(`/api/v1/sys/student/excel`, data, 'put')
}

/***
 * 获取学生信息
 */
export function sysStudentInfo(id) {
  return commonsAjax(`/api/v1/sys/student/${id}`, '', 'get')
}


/***
 * 修改学生信息
 */
export function sysStudentModify(data) {
  let url = `/api/v1/sys/student`
  return commonsAjax(url, data, 'put')
}

/***
 * 删除学生信息
 */
export function sysStudentDelete(data) {
  let url = `/api/v1/sys/student`
  return commonsAjax(url, data, 'delete')
}

/***
 * 查询老师信息
 */
export function sysTeacherPage(data) {
  let college = data.college || -1,
    department = data.department || -1,
    page = data.pageIndex || 1,
    teacherInfo = data.teacherInfo || '',
    pageSize = data.pageSize || 10;
  let url = `/api/v1/sys/teacher/page?collegeId=${college}&departmentId=${department}&search=${teacherInfo}&pageIndex=${page}&pageSize=${pageSize}`
  return commonsAjax(url, '', 'get')
}

/***
 * 教师启用/禁用
 */
export function sysTeacherSwitch(data) {
  let url = `/api/v1/sys/teacher/${data.id}/${data.status}`
  return commonsAjax(url, '', 'get')
}


/***
 * 添加教师
 */
export function sysTeacherAdd(data) {
  return commonsAjax(`/api/v1/sys/teacher`, data, 'post')
}


/***
 * 重置教师密码
 */
export function sysTeacherReset(data) {
  let url = `/api/v1/sys/teacher/passwd`
  return commonsAjax(url, data, 'post')
}

/***
 * 重置学生密码
 */
export function sysStudentReset(data) {
  let url = `/api/v1/sys/student/passwd`
  return commonsAjax(url, data, 'post')
}


/***
 * 教师id查询
 */
export function sysTeacherId(data) {
  let url = `/api/v1/sys/teacher/${data.id}`
  return commonsAjax(url, '', 'get')
}


/***
 * 教师id查询
 */
export function sysTeacherModify(data) {
  let url = `/api/v1/sys/teacher`
  return commonsAjax(url, data, 'put')
}


// ===============证书===============
//

/***
 * 获取证书列表
 */
export function sysCertificatePage(data) {
  return commonsAjax(`/api/v1/sys/certificate/page`, data, 'get')
}

/***
 * 保存证书
 */
export function sysSaveCertificate(data) {
  return commonsAjax(`/api/v1/sys/certificate`, data, 'post')
}


/***
 * 查看证书
 */
export function sysCertificateId(data) {
  return commonsAjax(`/api/v1/sys/certificate/${data.id}`, '', 'get')
}


/***
 * 审核
 */
export function sysCertificateAudit(data) {
  return commonsAjax(`/api/v1/sys/certificate`, data, 'put')
}


/***
 * 审核详情
 */
export function sysCertificateDetail(data) {
  return commonsAjax(`/api/v1/sys/certificate/${data}/audit`, '', 'get')
}


// ===============课程===============
//

/***
 * 获取课程列表
 */
export function sysCoursePage(data) {
  return commonsAjax('/api/v1/tenant/course/page', data, 'get')
}


/***
 * 获取课程id
 */
export function sysCourseId(data) {
  return commonsAjax(`/api/v1/course/${data}`, '', 'get')
}

/***
 * 分页查询班级列表 /sys/class/page
 */


export function sysClassPage(data) {
  return commonsAjax(`/api/v1/sys/class/page`, data, 'get')
}

/**
 * 添加班级 /sys/class
 * */
export function sysClass(data) {
  return commonsAjax(`/api/v1/sys/class`, data, 'post')
}

/**
 *  修改班级 /sys/class
 */
export function sysClassUpdate(data) {
  return commonsAjax(`/api/v1/sys/class`, data, 'put')
}

/**
 * 删除班级  /sys/class
 */
export function sysClassDelete(data) {
  return commonsAjax(`/api/v1/sys/class`, data, 'delete')
}


/**
 * 获取名师风采列表 /sys/recommend/teacher/page
 * */
export function sysRecommenTeacherPage() {
  return commonsAjax(`/api/v1/sys/recommend/teacher/page`, {}, 'get')
}

/***
 * 获取名师列表   /sys/recommend/tenant/teacher/page
 */
export function sysRecommenTenantTeacherPage() {
  return commonsAjax(`/api/v1/sys/recommend/tenant/teacher/page`, {}, 'get')
}