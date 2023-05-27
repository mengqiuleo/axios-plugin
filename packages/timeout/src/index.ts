// @ts-ignore
import { definePlugin, AxiosPlugin, pluginify } from "@axios-plugin/core";
import { AxiosRequestConfig, AxiosInstance } from 'axios';

interface TimeoutPluginOptions {
  timeout: number;
}

export class timeoutPlugin {
  constructor(private options: TimeoutPluginOptions) {}

  public beforeCreate(config: AxiosRequestConfig) {
    if (this.options.timeout != null) {
      config.timeout = this.options.timeout;
    }
  }

  public created(axios: AxiosInstance) {
    if (this.options.timeout != null) {
      axios.interceptors.response.use(
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