// @ts-ignore
// import { AxiosPlugin } from "@axios-plugin/core"
// import { AxiosAdapter, AxiosRequestConfig, AxiosStatic } from 'axios'
// import { setupCache } from 'axios-cache-adapter'
// import { cacheAdapterEnhancer, Cache } from 'axios-extensions'

//* 这里放一些最开始的代码，废弃了，因为找的这两个库都有问题


// CachePlugin 是对第三方包进行封装：https://github.com/RasCarlito/axios-cache-adapter
// 在缓存时间内，发起的相同的路径的 GET 请求，都只会调用一次接口，响应相同的数据。
// 真的无语了，axios-cache-adapter也不能用，https://github.com/RasCarlito/axios-cache-adapter/issues/272，艹
// export class CachePlugin1 implements AxiosPlugin {
//   maxAge: CachePluginOptions
//   constructor(maxAge?: CachePluginOptions) {
//     this.maxAge = maxAge || { maxAge: 15 * 60 * 1000 }
//   }
//   beforeCreate(config: AxiosRequestConfig, axiosInstance: AxiosStatic) {
//     config.adapter = setupCache({
//       maxAge: this.maxAge.maxAge
//     }).adapter
//   }
// }

// export interface CachePluginOptions {
//   maxAge: number
// }

// 这里是本来想用 axios-extensions，但是这个npm包有bug，已提pr，等不到了
// export class CachePlugin2 implements AxiosPlugin {
//   constructor(public maxAge?: number) {
//     this.maxAge = maxAge || 15 * 60 * 1000 //15min
//   }
  
//   beforeCreate(config?: AxiosRequestConfig, axios?: AxiosStatic) {
//     if(this.maxAge){
//       config.adapter = cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, {
//         defaultCache: new Cache({
//           maxAge: this.maxAge,
//           max: 100
//         })
//       })
//     }
//   }
// }
