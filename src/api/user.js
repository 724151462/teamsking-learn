const devUrl = '/api/v1/sys/' // 开发环境
const prodUrl = 'http://120.36.137.90:9008/api/v1/sys/' // 生产环境
const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl


const infoDev = 'http://192.168.10.48:9008/sys/user/info/' // 开发环境
// const infoDev = '/sys/user/info/' // 开发环境
const infoProd = 'http://120.36.137.90:9008/sys/user/info/' // 生产环境
const infoUrl = process.env.NODE_ENV === 'production' ? infoProd : infoDev

import { commonsAjax } from '@/utils/requery'

/**
 * 获取用户信息
 * */
export function getUserInfo (data) {

  let url = `${infoUrl}${data}`
  // return commonsAjax(url, '', 'get')
  return commonsAjax(url, '', 'get')
}

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
  console.log(data)
  let url = `${baseUrl}user/mobile/captcha`
  return commonsAjax(url, data, 'get')
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
