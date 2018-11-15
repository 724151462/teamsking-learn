import { commonsAjax } from '../utils/requery'





/**
 * 请求角色列表    api/v1/sys/role/page
 * */
export function sysRolePage (data) {
  return commonsAjax('api/v1/sys/role/page',data,'get')
}




