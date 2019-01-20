import { commonsAjax } from '../utils/requery'

const devUrl = 'api/v1/sys/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/sys/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl


/**
 * 请求角色列表 
 * */
export function sysRolePage (data) {
  return commonsAjax(`${baseUrl}page`,data,'get')
}

/**
 * 角色列表 
 * */
export function sysRoleList (data) {
  return commonsAjax(`${baseUrl}role/list`,data,'get')
}

/**
 * 添加角色 
 * */
export function sysRoleAdd (data) {
  return commonsAjax(`${baseUrl}role`,data,'post')
}

/**
 * 编辑角色 
 * */
export function sysRoleEdit (data) {
  return commonsAjax(`${baseUrl}role`,data,'put')
}

/**
 * 删除角色
 * */
export function sysRoleDelete (list) {
  return commonsAjax(`${baseUrl}role`,list,'delete')
}


/*
*  查询用户权限菜单 
* */
export function sysUserMenuList () {
  return commonsAjax(`${baseUrl}user/menu/list`,{},'get')
}

/*
*  查询用户权限菜单 
* */
export function sysUserMenuTree () {
  return commonsAjax(`${baseUrl}menu/tree`,{},'get')
}

/**
 * 创建租户
 **/
export function sysTenantManager (data) {
  return commonsAjax(`${baseUrl}tenant/manager`,data,'post')
}

/**
 * 分页查询租户管理员 
 * */
export function sysTenantManagerPage (data) {
  return commonsAjax(`${baseUrl}tenant/manager/page`,data,'get')
}



/**
 * 修改租户
 **/
export function tenantMod (data) {
  return commonsAjax(`http://120.36.137.90:9008/api/v1/tenant/${data.tenantId}`,data,'put')
}

/**
 * 分页查询系统消息
 * */
export function sysManage (data) {
  return commonsAjax(`${baseUrl}message`,'','get')
}


/**
 * 管理员删除消息
 * */
export function sysMessageDel (data) {
  return commonsAjax(`${baseUrl}message`,data.messageIds,'delete')
}

/**
 * 课程消息新增
 */
export function courseMsgAdd(data) {
  let url = `${baseUrl}message/course`
  return commonsAjax(url, data, 'post')
}

/**
 * 获取课程分类
 */
export function courseCatalogList(data) {
  let url = `/api/v1/common/categories`
  return commonsAjax(url, data, 'get')
}


/**
 * 获取课程分类
 */
export function courseCatalogAdd(data) {
  let url = `${baseUrl}category`
  return commonsAjax(url, data, 'post')
}

/**
 * 获取课程分类
 */
export function courseCatalogEdit(data) {
  let url = `${baseUrl}category`
  return commonsAjax(url, data, 'put')
}

/**
 * 获取课程分类
 */
export function courseCatalogDel(data) {
  let url = `${baseUrl}category`
  return commonsAjax(url, data, 'delete')
}

/**
 * 系统消息新增
 */
export function sysMsgAdd(data) {
  let url = `${baseUrl}message/user`
  return commonsAjax(url, data, 'post')
}


/**
 * 校管信息列表
 */
export function schoolMsg(data) {
  let url = `${baseUrl}tenant/message`
  return commonsAjax(url, data, 'get')
}


/**
 * 设置平台信息
 */
export function platformInfo(data) {
  let url = `${baseUrl}tenant/info`
  return commonsAjax(url, data, 'put')
}


/**
 * 获取平台信息
 */
export function getPlatformInfo(data) {
  let url = `${baseUrl}tenant/info`
  return commonsAjax(url, '', 'get')
}


/**
 * 设置轮播
 */
export function bannerList(data) {
  let url = `${baseUrl}tenant/carousel/list`
  return commonsAjax(url, data, 'get')
}


/**
 * 添加轮播图
 */
export function addBanner(data) {
  let url = `${baseUrl}tenant/carousel`
  return commonsAjax(url, data, 'post')
}

/**
 * 删除轮播图
 */
export function delBanner(data) {
  let url = `${baseUrl}tenant/carousel`
  return commonsAjax(url, data, 'delete')
}

/**
 * 修改轮播图
 */
export function modBanner(data) {
  let url = `${baseUrl}tenant/carousel`
  return commonsAjax(url, data, 'put')
}


/**
 * 名师风采列表
 */
export function teacherRecList(data) {
  let url = `${baseUrl}recommend/teacher/page`
  return commonsAjax(url, data, 'get')
}

/**
 * 推荐教师选择列表
 */
export function teacherAllList(data) {
  let url = `${baseUrl}recommend/tenant/teacher/page`
  return commonsAjax(url, data, 'get')
}

/**
 * 推荐课程列表
 */
export function courseRecList(data) {
  let url = `${baseUrl}recommend/course/page`
  return commonsAjax(url, data, 'get')
}

/**
 * 推荐课程列表
 */
export function courseAllList(data) {
  let url = `${baseUrl}recommend/tenant/course/page`
  return commonsAjax(url, data, 'get')
}


/**
 * 推荐移除
 */
export function recRemove(data) {
  let url = `${baseUrl}recommend`
  return commonsAjax(url, data, 'delete')
}

/**
 * 添加推荐
 */
export function recAdd(data) {
  let url = `${baseUrl}recommend`
  return commonsAjax(url, data, 'post')
}

/**
 * 修改推荐
 */
export function recMod(data) {
  let url = `${baseUrl}recommend`
  return commonsAjax(url, data, 'put')
}

/**
 * 获取租户
 */
export function tenantGet(data) {
  let url = `http://120.36.137.90:9008/api/v1/tenant/page`
  return commonsAjax(url, data, 'post')
}

/**
 * 新增租户
 */
export function tenantAdd(data) {
  let url = `http://120.36.137.90:9008/api/v1/tenant`
  return commonsAjax(url, data, 'post')
}