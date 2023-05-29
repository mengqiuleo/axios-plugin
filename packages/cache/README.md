# @axios-plugin/cache

将请求结果存储在可配置的存储中，以防止不需要的网络请求。

## 安装
```bash
yarn add @axios-plugin/cache
```

## 使用
```js
new CachePlugin(type, options)
```
使用 CachePlugin 可以设置type：MemoryStorage, LocalStorage, SessionStorage


### Web Storage API
```js
import { CachePlugin, StorageType } from '@axios-plugin/cache'
const axiosInstance = pluginify(axios.create() as AxiosStatic).use(new CachePlugin(StorageType.Memory)).generate()
```
StorageType 有三个可选值: MemoryStorage, LocalStorage, SessionStorage
- 当使用 LocalStorage, SessionStorage 时，会默认在存储中加上前缀：`axios-cache:`
- 使用 Web Storage API，第二个参数不起作用


### Memory Storage
在使用 Memory 时，CachePlugin 可接收第二个参数

```js
import { CachePlugin, StorageType, Options } from '@axios-plugin/cache'
const options: Options = { cloneData: false, cleanupInterval: 36000, maxEntries: 300 }

axiosInstance = 
  pluginify(axios.create() as AxiosStatic).use(new CachePlugin(StorageType.MemoryStorage, options)).generate()
```

**参数**
```js
Options {
  cloneData?: boolean //用于指定是否克隆存储在缓存中的数据。默认情况下为false，即不进行克隆。
  cleanupInterval?: number //清理间隔：避免内存泄漏
  maxEntries?: number //用于指定缓存中最大条目数。如果超出这个数量，缓存将自动删除最旧的缓存项。如果设置为false，则不会限制缓存中的条目数。
}
```
使用这些可选参数可以根据具体的应用场景来优化缓存设置:
  
- 例如，如果你的缓存中的数据比较大或者需要保证缓存数据的独立性，可以将cloneData设置为true, 比如数据过多，后面同名的进行覆盖，导致存储数据出错
- 如果你希望定期清理过期的缓存数据，可以设置cleanupInterval
- 如果你希望避免缓存占用过多内存，可以设置maxEntries




## 注意
在使用 TimeoutPlugin 时，首先需要使用 pluginify 将 `axios`变成基于插件的请求库.
pluginify 内置在 [@axios-plugin/core](https://www.npmjs.com/package/@axios-plugin/core) 中.