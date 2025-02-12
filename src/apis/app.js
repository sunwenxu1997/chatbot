import request from '@/http/instance'

export function getJsSDK(data) {
    return request({
        url: '/wx/official_account/signature',
        method: 'POST',
        data
    })
}