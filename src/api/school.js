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
 * 获取院列表s
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
export function sysSpecialityPage(data){ //'collegeId=1&pageIndex=1&pageSize=10&specialityName='''
  //return commonsAjax('api/v1/sys/speciality/page',{ collegeId:1,pageIndex:1,pageSize:10  },'get')
  return commonsAjax('api/v1/sys/speciality/page',data,'get')
}
