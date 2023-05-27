'use strict';

const defaultOptions = {
    400: '错误的请求',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求错误,未找到该资源',
    405: '请求方法未允许',
    408: '请求超时',
    500: '服务器端出错',
    501: '网络未实现',
    502: '网络错误',
    503: '服务不可用',
    504: '网络超时',
    505: 'http版本不支持该请求'
};
class InterceptorPlugin {
    constructor(options) {
        this.options = { ...defaultOptions, ...options };
    }
    // @ts-ignore
    created(axiosInstance) {
        // @ts-ignore
        axiosInstance.interceptors.response.use((response) => response, (err) => {
            const error = this.options[err.response.status];
            if (error) {
                err['message'] = error;
                console.log(`InterceptorPlugin's error`, error);
                // const newErr = new Error({'InterceptorPluginError': error});
                return Promise.reject(err);
            }
        });
    }
}

exports.InterceptorPlugin = InterceptorPlugin;
