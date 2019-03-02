import Cookie from 'js-cookie'

const TokenKey = 'BackstageToken'
const resreshTokenKey = 'BackstageReToken'
export function getToken () {
  return Cookie.get(TokenKey)
}

export function setToken (token) {
  return Cookie.set(TokenKey, token)
}

export function removeToken () {
  return Cookie.remove(TokenKey)
}

// 一个一周有效的cookie
export function twoWeeksExchange (token) {
  return Cookie.set(TokenKey, token, { expires: 7 })
}
// 用户登录后保存用户信息
export function saveUserInfo (data) {
  //保存用户ID和真实姓名
  return Cookie.set('userId', data, { expires: 7 })
}
//获取用户名ID
export function getUserId () {
  return Cookie.get('userId')
}
//退出登录时移除用户ID
export function removeUserId () {
  return Cookie.remove('userId')
}

export function twoWeeksGetExchange () {
  return Cookie.get(TokenKey)
}
