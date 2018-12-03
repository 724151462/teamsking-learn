import { commonsAjax } from '../utils/requery'





/**
 * 请求角色列表    api/v1/sys/role/page
 * */
export function sysRolePage (data) {
  return commonsAjax('api/v1/sys/role/page',data,'get')
}

/**
 * 添加角色   /api/v1/sys/role
 * */
export function sysRoleAdd (data) {
  return commonsAjax('api/v1/sys/role',data,'post')
}

/**
 * 编辑角色   /api/v1/sys/role
 * */
export function sysRoleEdit (data) {
  return commonsAjax('api/v1/sys/role',data,'put')
}

/**
 * 删除角色   /api/v1/sys/role
 * */
export function sysRoleDelete (list) {
  return commonsAjax('api/v1/sys/role',list,'delete')
}


/*
*  查询用户权限菜单  /api/v1/sys/user/menu/list
* */
export function sysUserMenuList () {
  return commonsAjax('api/v1/sys/user/menu/list',{},'get')
}

/**
 * 分页查询租户管理员  /api/v1/sys/tenant/manager/page
 * */
export function sysTenantManagerPage () {
  return commonsAjax('api/v1/sys/tenant/manager/page',{},'get')
}





