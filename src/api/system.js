import { commonsAjax } from '../utils/requery'

/**
 * 请求角色列表 
 * */
export function sysRolePage (data) {
  return commonsAjax(`/api/v1/sys/page`,data,'get')
}

/**
 * 管理员列表 
 * */
export function sysManagerPage (data) {
  return commonsAjax(`/api/v1/sys/tenant/manager/page`,data,'get')
}

/**
 * 角色列表 
 * */
export function sysRoleList (data) {
  return commonsAjax(`/api/v1/sys/role/list`,data,'get')
}

/**
 * 添加角色 
 * */
export function sysRoleAdd (data) {
  return commonsAjax(`/api/v1/sys/role`,data,'post')
}

/**
 * 编辑角色 
 * */
export function sysRoleEdit (data) {
  return commonsAjax(`/api/v1/sys/role`,data,'put')
}

/**
 * 设置权限 
 * */
export function sysRolePower (data) {
  return commonsAjax(`/api/v1/sys/role/edit`,data,'post')
}

/**
 * 设置权限 
 * */
export function sysRolePowerGet (data) {
  return commonsAjax(`/api/v1/sys/role/info/${data.roleId}`,data,'get')
}

/**
 * 删除角色
 * */
export function sysRoleDelete (list) {
  return commonsAjax(`/api/v1/sys/role`,list,'delete')
}

/*
*  添加权限菜单
* */
export function sysUserMenuAdd (data) {
  return commonsAjax(`/api/v1/sys/menu`,data,'post')
}

/*
*  修改用户权限菜单 
* */
export function sysUserMenuEdit (data) {
  return commonsAjax(`/api/v1/sys/menu`,data,'put')
}

/*
*  删除权限菜单 
* */
export function sysUserMenuDel (data) {
  return commonsAjax(`/api/v1/sys/menu/${data.menuId}`,'','delete')
}

/*
*  查询用户权限菜单 
* */
export function sysUserMenuList () {
  return commonsAjax(`/api/v1/sys/user/menu/list`,{},'get')
}

/*
*  查询用户权限菜单 
* */
export function sysUserMenuTree () {
  return commonsAjax(`/api/v1/sys/menu/tree`,{},'get')
}

/**
 * 创建租户
 **/
export function sysTenantManager (data) {
  return commonsAjax(`/api/v1/sys/tenant/manager`,data,'post')
}

/**
 * 修改租户管理员
 **/
export function sysTenantManagerEdit (data) {
  return commonsAjax(`/api/v1/sys/tenant/manager`,data,'put')
}

/**
 * 分页查询租户管理员 
 * */
export function sysTenantManagerPage (data) {
  return commonsAjax(`/api/v1/sys/tenant/manager/page`,data,'get')
}



/**
 * 修改租户
 **/
export function tenantMod (data) {
  return commonsAjax(`/api/v1/tenant/${data.tenantId}`,data,'put')
}

/**
 * 租户详情
 **/
export function tenantDetail (data) {
  return commonsAjax(`/api/v1/tenant/${data.tenantId}`,data,'get')
}

/**
 * 分页查询系统消息
 * */
export function sysManage (data) {
  return commonsAjax(`/api/v1/sys/message`,'','get')
}


/**
 * 管理员删除消息
 * */
export function sysMessageDel (data) {
  return commonsAjax(`/api/v1/sys/message`,data.messageIds,'delete')
}

/**
 * 课程消息新增
 */
export function courseMsgAdd(data) {
  let url = `/api/v1/sys/message/course`
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
  let url = `/api/v1/sys/category`
  return commonsAjax(url, data, 'post')
}

/**
 * 获取课程分类
 */
export function courseCatalogEdit(data) {
  let url = `/api/v1/sys/category`
  return commonsAjax(url, data, 'put')
}

/**
 * 获取课程分类
 */
export function courseCatalogDel(data) {
  let url = `/api/v1/sys/category`
  return commonsAjax(url, data, 'delete')
}

/**
 * 系统消息新增
 */
export function sysMsgAdd(data) {
  let url = `/api/v1/sys/message/user`
  return commonsAjax(url, data, 'post')
}


/**
 * 校管信息列表
 */
export function schoolMsg(data) {
  let url = `/api/v1/sys/tenant/message`
  return commonsAjax(url, data, 'get')
}


/**
 * 设置平台信息
 */
export function platformInfo(data) {
  let url = `/api/v1/sys/tenant/info`
  return commonsAjax(url, data, 'put')
}


/**
 * 获取平台信息
 */
export function getPlatformInfo(data) {
  let url = `/api/v1/sys/tenant/info`
  return commonsAjax(url, '', 'get')
}


/**
 * 设置轮播
 */
export function bannerList(data) {
  let url = `/api/v1/sys/tenant/carousel/list`
  return commonsAjax(url, data, 'get')
}


/**
 * 添加轮播图
 */
export function addBanner(data) {
  let url = `/api/v1/sys/tenant/carousel`
  return commonsAjax(url, data, 'post')
}

/**
 * 删除轮播图
 */
export function delBanner(data) {
  let url = `/api/v1/sys/tenant/carousel`
  return commonsAjax(url, data, 'delete')
}

/**
 * 修改轮播图
 */
export function modBanner(data) {
  let url = `/api/v1/sys/tenant/carousel`
  return commonsAjax(url, data, 'put')
}


/**
 * 名师风采列表
 */
export function teacherRecList(data) {
  let url = `/api/v1/sys/recommend/teacher/page`
  return commonsAjax(url, data, 'get')
}

/**
 * 推荐教师选择列表
 */
export function teacherAllList(data) {
  let url = `/api/v1/sys/recommend/tenant/teacher/page`
  return commonsAjax(url, data, 'get')
}

/**
 * 推荐课程列表
 */
export function courseRecList(data) {
  let url = `/api/v1/sys/recommend/course/page`
  return commonsAjax(url, data, 'get')
}

/**
 * 推荐课程列表
 */
export function courseAllList(data) {
  let url = `/api/v1/sys/recommend/tenant/course/page`
  return commonsAjax(url, data, 'get')
}


/**
 * 推荐移除
 */
export function recRemove(data) {
  let url = `/api/v1/sys/recommend`
  return commonsAjax(url, data, 'delete')
}

/**
 * 添加推荐
 */
export function recAdd(data) {
  let url = `/api/v1/sys/recommend`
  return commonsAjax(url, data, 'post')
}

/**
 * 修改推荐
 */
export function recMod(data) {
  let url = `/api/v1/sys/recommend`
  return commonsAjax(url, data, 'put')
}

/**
 * 获取租户
 */
export function tenantGet(data) {
  let url = `/api/v1/tenant/page`
  return commonsAjax(url, data, 'post')
}

/**
 * 新增租户
 */
export function tenantAdd(data) {
  let url = `/api/v1/tenant`
  return commonsAjax(url, data, 'post')
}

/**
 * 获取标签
 */
export function getTag(data) {
  let url = `/api/v1/sys/tag/page`
  return commonsAjax(url, data, 'post')
}

/**
 * 新增标签
 */
export function setTag(data) {
  let url = `/api/v1/sys/tag`
  return commonsAjax(url, data, 'post')
}

/**
 * 修改标签
 */
export function modTag(data) {
  let url = `/api/v1/sys/tag`
  return commonsAjax(url, data, 'put')
}

/**
 * 删除标签
 */
export function delTag(data) {
  let url = `/api/v1/sys/tag`
  return commonsAjax(url, data, 'delete')
}


// =========帮助中心============

/**
 * 帮助中心列表
 */
export function helpList(data) {
  let url = `/api/v1/sys/helpnav/tree`
  return commonsAjax(url, data, 'get')
}

/**
 * 帮助详情
 */
export function helpDetail(data) {
  let url = `/api/v1/sys/helpcontent/page`
  return commonsAjax(url, data, 'get')
}

/**
 * 修改标题
 */
export function editQuestionTitle(data) {
  let url = `/api/v1/sys/helpnav`
  return commonsAjax(url, data, 'put')
}

/**
 * 新增标题
 */
export function addQuestionTitle(data) {
  let url = `/api/v1/sys/helpnav`
  return commonsAjax(url, data, 'post')
}

/**
 * 删除标题
 */
export function delQuestionTitle(data) {
  let url = `/api/v1/sys/helpnav`
  return commonsAjax(url, data, 'delete')
}

/**
 * 新增内容
 */
export function addContent(data) {
  let url = `/api/v1/sys/helpcontent`
  return commonsAjax(url, data, 'post')
}

/**
 * 修改内容
 */
export function editContent(data) {
  let url = `/api/v1/sys/helpcontent`
  return commonsAjax(url, data, 'put')
}

/**
 * 删除内容
 */
export function delContent(data) {
  let url = `/api/v1/sys/helpcontent`
  return commonsAjax(url, data, 'delete')
}