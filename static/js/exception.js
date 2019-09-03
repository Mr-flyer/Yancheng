import { notification } from 'antd'
import { refreshRequest } from './http'

export async function handleException(res) {
    // 获取全局 dispatch
    const { dispatch } = window.g_app._store // 注：g_app 是 dva框架集成好的全局变量
    const { params, url, method } = res.config // 解构 axios 请求的配置对象

    return new Promise(async (resolve, reject) => {
        let { error_code, msg } = res.data // 解构后端返回的 data

        if (error_code === 10040 || error_code === 10050) {
            // 令牌失效或者令牌过期
            if (
                res.config.url === '/admin/v1/user/refresh_token' ||
                res.config.url === 'admin/v1/user/refresh_token'
            ) {
                // 退出
                dispatch({ type: 'login/logout' })
                return
            }
            // 重新获取令牌
            dispatch({ type: 'global/refreshToken' }).then(async r => {
                // 重新发送本次中断的请求
                const result = await refreshRequest({
                    params,
                    url,
                    method,
                })
                resolve(result)
            })
            return
        }

        // 认证失败，重新登录
        if (error_code === 10000 || error_code === 10100) {
            // 退出登录
            dispatch({ type: 'login/logout' })
            notification.error({
                message: `登录失效，请重新登录`,
                description: msg,
            })
            return
        }

        notification.error({
            message: `请求错误 ${error_code}`,
            description: msg,
        })

        // yeild call 使用promise时必须用resolve 否则无法执行之后的代码
        // reject(res.data);
        resolve(res.data)
    })
}

// 处理 network fail 异常 --- 即请求失败时
export function handleError(error) {
    if (!error.response) {
        notification.error({
            message: `请求异常`,
            description: '请检查API是否正确',
        })
        console.log('请求异常信息为', error)
    }
    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        notification.error({
            message: `警告`,
            description: '请求超时  ',
        })
        return new Promise((resolve, reject) => {
            resolve('timeout')
        })
    }
    throw new Error(error)
}
