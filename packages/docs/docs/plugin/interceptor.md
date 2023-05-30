# @axios-plugin/interceptor <Badge type="tip" text="^0.0.5" />

对各种响应状态码进行拦截, 可通过传入参数进行覆盖

## 安装
```bash
yarn add @axios-plugin/interceptor
```

## 使用
参数：
```ts
new InterceptorPlugin()

const options: InterceptorPluginOptions = {
      403: 'token过期, 请重新登录',
      400: '请求语法有错误'
    }
new InterceptorPlugin(options)
```

```ts
import { 
  InterceptorPlugin, 
  InterceptorPluginOptions 
} from "@axios-plugin/interceptor"
const instance = pluginify(axios.create() as AxiosStatic)
                    .use(new InterceptorPlugin(options))
                    .generate()

await instance.get('/api/users') //这里对 拦截器抛出的promise.reject进行重写，我们可以通过 res.message 获取传入的自定义错误消息
              .catch(res => { 
                console.log('res.message', res.message) //token过期, 请重新登录
              })
```

**InterceptorPlugin已经配置的参数**
``` js
const defaultOptions = {
  400: '错误的请求',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求错误,未找到该资源',
  405: '请求方法未允许',
  408: '请求超时',
  500: '服务器端出错',
  501: '网络未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'http版本不支持该请求'
}
```

## 注意
在使用 TimeoutPlugin 时，首先需要使用 pluginify 将 `axios`变成基于插件的请求库.
pluginify 内置在 [@axios-plugin/core](https://www.npmjs.com/package/@axios-plugin/core) 中.