import { AxiosPlugin } from "@axios-plugin/core"
import { AxiosInstance } from 'axios'
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';

export class RetryPlugin implements AxiosPlugin {
  public pluginName = 'RetryPlugin'
  constructor(public config?: IAxiosRetryConfig) {}

  created(axios: AxiosInstance) {
    axiosRetry(axios, this.config)
  }
}
