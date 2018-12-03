import Cookie from 'js-cookie'

const TokenKey = 'token'

export function getToken () {
  return Cookie.get(TokenKey)
}

export function setToken (token) {
  return Cookie.set(TokenKey, token)
}

export function removeToken () {
  return Cookie.remove(TokenKey)
}

// 一个两周有效的cookie
export function twoWeeksExchange () {
  return Cookie.set('timeCookie', '14', { expires: 14 })
}

export function twoWeeksGetExchange () {
  return Cookie.get('timeCookie')
}
