import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserInfo = 'User-Info'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, user = {}) {
  Cookies.set(UserInfo, JSON.stringify(user))
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  Cookies.remove(UserInfo)
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  return Cookies.get(UserInfo)
}
