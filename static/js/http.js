/**
 * 采用双token授权原则
 * refresh_token 有效期比 access_token 长
 * 当 access_token 失效时 可通过 refresh_token 静默拉取
 * 当 refresh_token 也失效时 用户才需要从新登陆
 */
import axios from 'axios'
import { getToken } from './token'
import { handleException, handleError } from './exception'

// 创建一个拥有通用配置的axios实例
const http = axios.create({
    transformResponse: [data => JSON.parse(data)], // 请求前对 data 预格式化
    withCredentials: false, // 是否携带 cookie
    timeout: 5000, // 请求超时
    // 定义可获得的http响应状态码
    // return true、设置为null或者undefined，promise将resolved,否则将rejected
    validateStatus(status) {
        return status >= 200 && status < 500
    },
})

/**
 * 配置 axios实例 请求拦截器
 * 回调参数一 请求前配置
 * 回调参数二 请求失败操作
 */
http.interceptors.request.use(
    requestConfig => {
        // 更新 access_token 时，需替换 请求头中 Authorization 字段值为 refresh_token 从新拉取
        if (
            requestConfig.url === '/admin/v1/user/refresh_token' ||
            requestConfig.url === 'admin/v1/user/refresh_token'
        ) {
            const refreshToken = getToken('refresh_token')
            if (refreshToken) {
                requestConfig.headers.Authorization = refreshToken
                return requestConfig
            }
        } else {
            // 其他接口均用 Authorization 字段值均为 access_token
            const accessToken = getToken('access_token')
            if (accessToken) {
                requestConfig.headers.Authorization = accessToken
                return requestConfig
            }
        }
        return requestConfig // 注：配置完毕后需要返回配置信息
    },
    error => Promise.reject(error)
)

/**
 * 响应拦截器
 * 回调参数一 响应成功后数据处理
 * 回调参数二 响应失败操作
 */
http.interceptors.response.use(
    async res => {
        // 如果错误码不是2开头
        if (res.status.toString().charAt(0) !== '2') {
            const result = await handleException(res) // 请求成功但报错 ---- 一般错误处理
            return result
        }
        return res.data
    },
    error => handleError(error)
) // 请求失败处理

// http instance
export default http

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function post(url, data = {}, params = {}) {
    return http({
        method: 'post',
        url,
        data,
        params,
    })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function get(url, params = {}) {
    return http({
        method: 'get',
        url,
        params,
    })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put(url, data = {}, params = {}) {
    return http({
        method: 'put',
        url,
        params,
        data,
    })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function _delete(url, params = {}) {
    return http({
        method: 'delete',
        url,
        params,
    })
}

export async function refreshRequest(response) {
    return http(response)
}
