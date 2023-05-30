# @axios-plugin/throttle

限制axios发送请求的频率，避免过多的请求对服务器造成负担或浪费带宽资源。

## 安装
```bash
yarn add @axios-plugin/throttle
```

## 使用
```js
import { ThrottlePlugin } from '@axios-plugin/throttle'

axiosInstance = 
  pluginify(axios.create() as AxiosStatic)
    .use(new ThrottlePlugin({ maxTime: 1000 })
    .generate()
```

## 参数
```js
new ThrottlePlugin() //默认是 500ms 内，不会重发请求
new ThrottlePlugin({ maxTime: 1000 }) // 1s
```

## 注意
在使用 TimeoutPlugin 时，首先需要使用 pluginify 将 `axios`变成基于插件的请求库.
pluginify 内置在 [@axios-plugin/core](https://www.npmjs.com/package/@axios-plugin/core) 中.