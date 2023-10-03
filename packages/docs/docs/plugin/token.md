# @axios-plugin/token <Badge type="tip" text="^0.0.5" />

为 axios 增加 token

## 安装
```bash
yarn add @axios-plugin/token
```

## 使用
```js
import { TokenPlugin } from '@axios-plugin/throttle'

axiosInstance = 
  pluginify(axios)
    .use(new TokenPlugin("tokenPlugin")
    .generate()
```

## 参数
```js
new TokenPlugin("tokenPlugin") //传入token
```
token 默认使用 **Bearer schema**

## 注意
在使用 TimeoutPlugin 时，首先需要使用 pluginify 将 `axios`变成基于插件的请求库.
pluginify 内置在 [@axios-plugin/core](https://www.npmjs.com/package/@axios-plugin/core) 中.