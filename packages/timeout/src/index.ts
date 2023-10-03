import { AxiosPlugin } from "@axios-plugin/core";
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface TimeoutPluginOptions {
  timeout: number;
}

export class TimeoutPlugin implements AxiosPlugin {
  public options: TimeoutPluginOptions
  public pluginName = 'TimeoutPlugin'
  constructor(options?: TimeoutPluginOptions) {
    this.options = options || { timeout: 2000 }
  }

  beforeCreate(config: AxiosRequestConfig) {
    if (this.options.timeout != null) {
      config.timeout = this.options.timeout;
    }
  }

  created(axiosInstance: AxiosInstance) {
    if (this.options.timeout != null) {
      axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            error.message = `Response timeout of ${this.options.timeout}ms exceeded`;
            console.log(error.message)
          }

          return Promise.reject(error);
        }
      );
    }
  }
}