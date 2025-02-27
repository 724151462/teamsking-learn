import { commonsAjax } from '@/utils/requery'

/**
 * 获取用户信息
 * */
export function getUserInfo (id) {

  let url = `/api/v1/sys/user/info/${id}`
  let data = {userId: id}
  return commonsAjax(url, '', 'get')
}
/**
 * 初始化用户名
 * */
export function userInit (data) {

  let url = `/api/v1/sys/user/init`
  return commonsAjax(url, data, 'post')
}
/**
 * 获取用户信息(不需要权限)
 * */
export function getMeInfo (id) {
  let url = `/api/v1/sys/user/info/me`
  return commonsAjax(url, '', 'get')
}
/**
 * 获取用户消息列表
 * */
export function getMsg (data) {
  let url = `/api/v1/sys/user/message/page`
  return commonsAjax(url, data, 'get')
}
/**
 * 删除用户消息
 * */
export function delMsg (data) {
  let url = `/api/v1/sys/user/message`
  return commonsAjax(url, data, 'delete')
}
/**
 * 设为已读
 * */
export function readMsg (data) {
  let url = `/api/v1/sys/user/message`
  return commonsAjax(url, data, 'post')
}
/**
 * 修改头像
 * */
export function changeUserAvatar (data) {
  return commonsAjax(`/api/v1/study/user/avatar/`, data, 'post')
}

/**
 * 修改本人的用户信息，密码、身份证和电话号码除外
 * */
export function changeUserInfo (data) {
  return commonsAjax(`/api/v1/sys/user`, data, 'post')
}
/**
 * 绑定手机号
 * */
export function bindMobile (data) {
  return commonsAjax(`/api/v1/sys/user/mobile/form`, data, 'post')
}
/**
 * 发送绑定手机号的验证码
 * */
export function getBindCode (data) {
  console.log(data)
  let url = `/api/v1/sys/user/mobile/captcha`
  return commonsAjax(url, data, 'get')
}
/**
 * 发送取消绑定手机号的验证码
 * */
export function getResetCode (data) {
  return commonsAjax(`/api/v1/sys/user/mobile/captcha/reset`, data, 'get')
}
/**
 * 重置绑定的手机号
 * */
export function resetMobile (data) {
  return commonsAjax(`/api/v1/sys/user/mobile/reset`, data, 'post')
}

/**
 * 修改密码
 * */
export function changeUserPassword (data) {
  return commonsAjax(`/api/v1/sys/user/passwd`, data, 'post')
}

/**
 * 绑定邮箱
 * */
export function bindEmail (data) {
  return commonsAjax(`/api/v1/sys/user/mail/captcha/replace`, data, 'post')
}
/**
 * 发送绑定邮箱验证码
 * */
export function getEmailBindCode (data) {
  return commonsAjax(`/api/v1/sys/user/mail/captcha`, data, 'get')
}

/**
 * 邮箱换绑时检查密码
 * */
export function checkMailPass (data) {
  return commonsAjax(`/api/v1/sys/user/mail/captcha`, data, 'post')
}
/**
 * 邮箱换绑时检查密码
 * */
export function checkMobilePass (data) {
  return commonsAjax(`/api/v1/sys/user/mobile/captcha/replace/form`, data, 'post')
}
/**
 * 获取换邮箱绑口令
 * */
export function getResetEmailCode (data) {
  return commonsAjax(`/api/v1/sys/user/mail/captcha/replace`, data, 'get')
}
/**
 * 验证邮箱换绑口令
 * */
export function checkEmailResetCode (data) {
  return commonsAjax(`/api/v1/sys/user/mail/captcha`, data, 'post')
}
//================
// ====忘记密码
// ===============

//忘记密码发送验证码（手机号）
export function mobileForgot(data) {
  return commonsAjax(`/api/v1/sys/login/reset/passwd/captcha/${data.mobile}`, data, 'get')
}
//忘记密码发送验证码（邮箱）
export function emailForgot (data) {
  return commonsAjax(`/api/v1/sys/login/reset/passwd/mailcaptcha`, data, 'get')
}
//手机重置密码
export function mobileFotgotCheck (data) {
  return commonsAjax(`/api/v1/sys/login/reset/captcha/mobile`, data, 'post')
}
//验证码，验证（邮箱）
export function emailFotgotCheck (data) {
  return commonsAjax(`/api/v1/sys/login/reset/passwd/mailcaptcha`, data, 'post')
}
//重置密码（邮箱）
export function resetPass (data) {
  return commonsAjax(`/api/v1/sys/login/reset/passwd/mailcaptcha`, data, 'put')
}

//============================证书相关==================================
/**
 * 保存证书
 * */
export function saveCertificate (data) {
    return commonsAjax(`/api/v1/sys/certificate`, data, 'post')
}
/**
 * 修改证书
 * */
export function changeCer (data) {
  return commonsAjax(`/api/v1/sys/certificate/info`, data, 'post')
}
/**
 * 删除证书
 * */
export function delCertificate (data) {
    return commonsAjax(`/api/v1/sys/user/certificate`, data, 'delete')
}
/**
 * 获取用户证书列表
 * */
export function certificateList (data) {
    return commonsAjax(`/api/v1/sys/user/certificate`, data, 'get')
}

/**
 * 证书审核详情
 * */
export function statusCre (data) {
  return commonsAjax(`/api/v1/sys/certificate/${data}/audit`, data, 'get')
}

/**
 * 获取证书信息
 * */
export function cerInfo (data) {
  return commonsAjax(`/api/v1/sys/certificate/${data}`, data, 'get')
}
//============================教师相关===========================
/**
 * 获取我的教师信息
 * */
export function teacherInfo (data) {
  return commonsAjax(`/api/v1/sys/user/teacher/me`, data, 'get')
}
/**
 * 修改我的教师信息
 * */
export function saveTeacherInfo (data) {
  return commonsAjax(`/api/v1/sys/user/teacher/me`, data, 'put')
}

