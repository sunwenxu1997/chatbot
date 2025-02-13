// axios 请求拦截器封装
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  baseURL: '/api',
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    config.headers['Authorization'] = 'Bearer ' + 'pat_xFIDz8MA21VGnNdJ8DAeTMAOptcTFvWYnJ5EFEvxa9n9UbL4N1uL6cv2lcv9cJhx' //import.meta.env.VITE_TOKEN
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  (response) => {
    console.log(response);
    // 判断返回格式 responseType: 'stream' 为流式响应，直接返回所有数据
    if (response.config.responseType === 'stream') {
      return response
    }
    const res = response.data
    if (res.code !== 0) {
      ElMessage.error(res.msg)
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service
