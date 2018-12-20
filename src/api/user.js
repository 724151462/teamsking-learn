const devUrl = '/api/v1/sys/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/sys/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

import { commonsAjax } from '@/utils/requery'

/**
 * 修改本人的用户信息，密码、身份证和电话号码除外
 * */
export function changeUserInfo (data) {
  return commonsAjax(`${baseUrl}user`, data, 'post')
}
/**
 * 绑定手机号
 * */
export function bindMobile (data) {
  return commonsAjax(`${baseUrl}user/mobile`, data, 'post')
}

/**
 * 发送绑定手机号的验证码
 * */
export function getBindCode (data) {
  return commonsAjax(`${baseUrl}user/mobile/captcha`, data, 'get')
}
/**
 * 发送取消绑定手机号的验证码
 * */
export function getResetCode (data) {
  return commonsAjax(`${baseUrl}user/mobile/captcha/reset`, data, 'get')
}
/**
 * 重置绑定的手机号
 * */
export function resetMobile (data) {
  return commonsAjax(`${baseUrl}user/mobile/reset`, data, 'post')
}

/**
 * 修改密码
 * */
export function changeUserPassword (data) {
  return commonsAjax(`${baseUrl}user/passwd`, data, 'post')
}
