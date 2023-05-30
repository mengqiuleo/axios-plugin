# @axios-plugin/download <Badge type="tip" text="^0.0.5" />

使用 二进制blob 的方式对文件进行下载

::: warning

这个包由于某些原因，还未发布

:::


## 安装
```bash
yarn add @axios-plugin/download
```
## 使用
```js
import { DownLoadPlugin } from '@axios-plugin/download'
const axiosInstance = pluginify(axios.create() as AxiosStatic)
                        .use(new DownLoadPlugin("filename")).generate()
```


## 参数
```js
new DownLoadPlugin(filename: string)
```
参数为文件名，可选，默认值为 filename



## 注意
在使用 TimeoutPlugin 时，首先需要使用 pluginify 将 `axios`变成基于插件的请求库.
pluginify 内置在 [@axios-plugin/core](https://www.npmjs.com/package/@axios-plugin/core) 中.