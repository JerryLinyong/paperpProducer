import request from '@/utils/request'

export function submitStatement(data) {
    return request({
        url: '/statement/submit',
        method: 'post',
        data
    })
}

export function getStatement(params) {
    return request({
        url: '/statement/generate',
        method: 'get',
        params
    })
}

export function login(data) {
    return request({
        url: '/user/login-with-statement',
        method: 'post',
        data
    })
}
