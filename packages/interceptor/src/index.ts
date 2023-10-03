import { AxiosPlugin } from "@axios-plugin/core";
import { AxiosInstance } from 'axios';

export interface InterceptorPluginOptions {
  [key: number]: string;
}
type NetworkError = {
  [key: number]: string;
};

const defaultOptions: NetworkError = {
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
}

export class InterceptorPlugin implements AxiosPlugin {
  public options: InterceptorPluginOptions
  constructor(options?: InterceptorPluginOptions) {
    this.options = { ...defaultOptions, ...options }
  }

  created(axiosInstance: AxiosInstance) {

    axiosInstance.interceptors.response.use(
      (response) => response,
      (err) => {
        const error = this.options[err.response.status]
        if(error){
          err['message'] = error
          console.log(`InterceptorPlugin's error`, error)
          // const newErr = new Error({'InterceptorPluginError': error});
          return Promise.reject(err)
        }   
      }
    )
  }
}
