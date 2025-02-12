// axios 请求拦截器封装
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
    timeout: 10000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
    (config) => {
        // do something before request is sent
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
        const res = response.data
        if (res.code !== 200) {
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
