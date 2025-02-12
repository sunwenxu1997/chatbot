import request from '@/utils/http'

// 查看智能体列表
export function publishedBotsList(params) {
  return request({
    url: '/v1/space/published_bots_list',
    method: 'GET',
    params
  })
}
// 获取智能体配置
export function getOnlineInfo(params) {
  return request({
    url: '/v1/bot/get_online_info',
    method: 'GET',
    params
  })
}

// 发起会话
export function createSession(data, { onDownloadProgress }) {
  return request({
    url: '/v3/chat',
    method: 'POST',
    data,
    responseType: 'stream',
    onDownloadProgress
  })
}
