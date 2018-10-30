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
}   //PUT /api/v1/sys/college
