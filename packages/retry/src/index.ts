import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { AxiosPlugin } from "@axios-plugin/core"

import type { RetryOptions } from "./interface"

export class RetryPlugin implements AxiosPlugin {
  public pluginName = 'RetryPlugin'
  public times
  public delayTime
  public count = 0

  constructor(public options?: RetryOptions) {
    this.times = options.times || 3 //默认3次
    this.delayTime = options.delay || 300 // 默认 300ms 后重试
  }

  created(axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) {
    axiosInstance.interceptors.response.use(null, (err) => {
      let config = err.config
      if (!config || !this.times) return Promise.reject(err)

      if (this.count >= this.times) {
        return Promise.reject(err)
      }
      
      this.count++

      // 延时处理
      const delay = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, this.delayTime)
      })

      // 重新发起请求
      return delay.then(function () {
        return axiosInstance(config)
      })
    })

  }
}
