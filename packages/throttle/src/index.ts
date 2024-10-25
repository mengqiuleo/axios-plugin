import { AxiosPlugin } from "@axios-plugin/core"
import { AxiosInstance, AxiosRequestConfig } from "axios"
import { LRUCache } from "lru-cache"

export interface ThrottleOption {
  maxTime: number
}

interface RecordedCache {
	timestamp: number
};

export class ThrottlePlugin implements AxiosPlugin {
  public maxTime
  public cache = new LRUCache<string, RecordedCache>({ max: 10 })
  public pluginName = 'ThrottlePlugin'

  constructor(public options?: ThrottleOption){
    this.maxTime = options.maxTime || 500 //默认 500ms
  }

  created(axiosInstance?: AxiosInstance, config?: AxiosRequestConfig) {
    const tokenKey = `${config.method}-${config.url}`
    
    axiosInstance.interceptors.request.use(config => {
      const nowTime = new Date().getTime()

      if (
        this.cache.get(tokenKey) &&  
        nowTime - this.cache.get(tokenKey).timestamp < this.maxTime
      ) {
        return Promise.reject(new Error(''))
      }

      this.cache.set(tokenKey, { timestamp: nowTime })
      return config
    }, error => {
      if (this.cache.get(tokenKey)) {
        this.cache.delete(tokenKey)
      }
      return Promise.reject(error)
    })

    axiosInstance.interceptors.response.use(response => {
      return response
    }, error => {
      return Promise.reject(error)
    })

  }
}
