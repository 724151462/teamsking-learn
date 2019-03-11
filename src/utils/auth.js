import Cookie from 'js-cookie'

const TokenKey = 'BackstageToken'
const reTokenKey = 'BackstageReToken'
export function getToken () {
  return Cookie.get(TokenKey)
}

export function setToken (token) {
  return Cookie.set(TokenKey, token)
}

export function removeToken () {
  Cookie.remove('tokenLive')
  Cookie.remove(reTokenKey)
  Cookie.remove('userId')
  return Cookie.remove(TokenKey)
}

// 一个一周有效的cookie
export function twoWeeksExchange (token,reToken) {
  let inFifteenMinutes = new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000);

  Cookie.set('tokenLive',Date.now() + 10 * 1000 * 60 , { expires: 7 })

  Cookie.set(reTokenKey, reToken, { expires: 15 })
  // Cookie.set(TokenKey, token, { expires: inFifteenMinutes })
  Cookie.set(TokenKey, token, { expires: 7 })

}
//检查Token是否将要过期
export function checkToken() {
  return Date.now()>Number(Cookie.get('tokenLive'))
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
  Cookie.remove('tokenLive')
  Cookie.remove(reTokenKey)
  return Cookie.remove('userId')
}

export function getReToken() {
  return Cookie.get(reTokenKey)
}
export function twoWeeksGetExchange () {
  return Cookie.get(TokenKey)
}
