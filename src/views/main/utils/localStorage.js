const USER_INFO = 'USER_INFO'

export function saveUserInfo(info = {}) {
    localStorage.setItem(USER_INFO, JSON.stringify(info))
}
export function getUserInfo() {
    let userInfo = localStorage.getItem(USER_INFO)
    return userInfo ? JSON.parse(userInfo) : {}
}
export function clearUserInfo() {
    localStorage.setItem(USER_INFO, '')
}