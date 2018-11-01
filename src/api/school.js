import { commonsAjax } from '../utils/requery'

/**
 * 学院页面
 */
/***
 * 获取学院信息
 * @param data
 */
export function sysCollegePage (data) {
  return commonsAjax('api/v1/sys/college/page/',data,'get')
  //return commonsAjax('/api/v1/course/page', data, 'get')
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
 * @param data
 */
// export default  /api/v1/sys/teacher/college/manager
// export function sysTeacherCollegeManager( data ){
//   return commonsAjax('/api/v1/sys/teacher/college/manager',data,'get')
// }
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
 * 说明  这边是为了做输入选择  所以选择查询所有的院  所以参数写死
 */
export function sysCollegeList(){
  return commonsAjax('api/v1/sys/college/list','','get')
}

/***
 * 获取系列表
 */
export function sysDepartmentPage(data){
  //return commonsAjax('api/v1/sys/speciality/page',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax('api/v1/sys/department/page',data,'get')
}

/***
 *添加系 /  编辑系
 * Param ( collegedId,departmentName,manager )  /  Param ( collegedId,departmentName,manager )
 */
export function sysDepartment(data){
  //'collegeId=1&pageIndex=1&pageSize=10&specialityName='''  /api/v1/sys/departmen
  return commonsAjax('api/v1/sys/department',data,'post')
}
export function sysDepartmentEdit(data){
  //'collegeId=1&pageIndex=1&pageSize=10&specialityName='''  /api/v1/sys/departmen
  return commonsAjax('api/v1/sys/department',data,'put')
}





/***
 * 获取专业列表
 */
export function sysSpecialityPage(data){ //'collegeId=1&pageIndex=1&pageSize=10&specialityName='''
  //return commonsAjax('api/v1/sys/speciality/page',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax('api/v1/sys/speciality/page',data,'get')
}
