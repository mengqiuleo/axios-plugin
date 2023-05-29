// @ts-ignore
import { AxiosPlugin } from "@axios-plugin/core";
import { AxiosInstance } from 'axios';

export class TokenPlugin implements AxiosPlugin {
  constructor(public token: string){
    
  }
  created(axios: AxiosInstance) {
    // 设置请求拦截器
    axios.interceptors.request.use(
      config => {
        // 如果 token 存在，则设置 Authorization 头部信息
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`; //* 使用 Bearer schema
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
}