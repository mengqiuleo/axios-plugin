# @axios-plugin/timeout <Badge type="tip" text="^0.0.5" />

当请求超时后，将抛出异常，可传入自定义超时时间

## 安装
```bash
yarn add @axios-plugin/timeout
```

## 使用
参数：
```js
new TimeoutPlugin({ timeout: 1000 }) //传入自定义超时时间
new TimeoutPlugin() //使用默认超时时间 timeout=2000
```

```js
import axios from 'axios'
import { pluginify } from "@axios-plugin/core"
import { timeoutPlugin } from '@axios-plugin/timeout'

const instance = pluginify(axios.create())
                  .use(new TimeoutPlugin({ timeout: 1000 }))
                  .generate()
```

## 注意
在使用 TimeoutPlugin 时，首先需要使用 pluginify 将 `axios`变成基于插件的请求库.
pluginify 内置在 [@axios-plugin/core](https://www.npmjs.com/package/@axios-plugin/core) 中.