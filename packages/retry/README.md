# `@axios-plugin/retry`

拦截失败的请求并在可能的情况下进行重试

## 安装
```bash
npm i @axios-plugin/retry
```

## 使用
```js
import { RetryPlugin } from '@axios-plugin/retry'

axiosInstance = 
  pluginify(axios).use(new RetryPlugin({ times: 2 }).generate()
```

## 参数

### RetryOptions 

| Signature | Description | Type | Default |
|-----------|-------------|------|---------|
| times | 请求重试次数 | number | 3 |
| delay | 请求重试延迟时间，默认在 300ms 后重试 | number | 300 |
