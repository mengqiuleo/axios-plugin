# `@axios-plugin/throttle`

限制axios发送请求的频率，避免过多的请求对服务器造成负担或浪费带宽资源。

## 安装
```bash
npm i @axios-plugin/throttle
```

## 使用
```js
import { ThrottlePlugin } from '@axios-plugin/throttle'

axiosInstance = 
  pluginify(axios).use(new ThrottlePlugin({ maxTime: 1000 }).generate()
```

## 参数

### ThrottleOptions 

| Signature | Description | Type | Default |
|-----------|-------------|------|---------|
| maxTime | 节流时间，默认是 500ms | number | 500 |
