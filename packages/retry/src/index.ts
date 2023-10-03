import { AxiosPlugin } from "@axios-plugin/core"
import { AxiosInstance } from 'axios'
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';

export class RetryPlugin implements AxiosPlugin {
  constructor(public config?: IAxiosRetryConfig) {}

  created(axios: AxiosInstance) {
    axiosRetry(axios, this.config)
  }
}
