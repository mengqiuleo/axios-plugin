# `@axios-plugin/retry`

拦截失败的请求并在可能的情况下进行重试

## 安装
```bash
yarn add @axios-plugin/retry
```

## 使用
```js
import { RetryPlugin } from '@axios-plugin/retry'

axiosInstance = 
  pluginify(axios).use(new RetryPlugin({ retries: 2 }).generate()
```
参数可选，默认情况下会重试三次

## 参数
```js
new RetryPlugin()
new RetryPlugin(config)
```
该 Plugin 是对 [axios-retry](https://github.com/softonic/axios-retry) 的封装，所以参数和 axios-retry 保持一致。

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| retries | `Number` | `3` | The number of times to retry before failing. 1 = One retry after first failure |
| retryCondition | `Function` | `isNetworkOrIdempotentRequestError` | A callback to further control if a request should be retried.  By default, it retries if it is a network error or a 5xx error on an idempotent request (GET, HEAD, OPTIONS, PUT or DELETE). |
| shouldResetTimeout | `Boolean` | false | Defines if the timeout should be reset between retries |
| retryDelay | `Function` | `function noDelay() { return 0; }` | A callback to further control the delay in milliseconds between retried requests. By default there is no delay between retries. Another option is exponentialDelay ([Exponential Backoff](https://developers.google.com/analytics/devguides/reporting/core/v3/errors#backoff)). The function is passed `retryCount` and `error`. |
| onRetry | `Function` | `function onRetry(retryCount, error, requestConfig) { return; }` | A callback to notify when a retry is about to occur. Useful for tracing. By default nothing will occur. The function is passed `retryCount`, `error`, and `requestConfig`. |

## 注意
在使用 TimeoutPlugin 时，首先需要使用 pluginify 将 `axios`变成基于插件的请求库.
pluginify 内置在 [@axios-plugin/core](https://www.npmjs.com/package/@axios-plugin/core) 中.