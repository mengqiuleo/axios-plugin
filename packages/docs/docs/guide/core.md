# @axios-plugin/core <Badge type="tip" text="^0.0.5" />
`@axios-plugin/core`是`@axios-plugin`的核心，它可以让 `axios` 成为基于插件的请求库，通过这种方式使得 `axios` 可以与我们自定义的拦截器功能进行解耦, 让它们更加容易组织和复用。

::: tip
之后所有提供的插件以及自定义的插件都要依赖于这个包
:::

## 安装
```bash
yarn add @axios-plugin/core
```


## API
### pluginify


```javascript
pluginify(axios)

pluginify(axios, config);
// config 的 TS 类型为 AxiosRequestConfig
```
config 具体内容可参考：https://axios-http.com/zh/docs/req_config

### use

```javascript
const axiosPluginify = pluginify(axios)

axiosPluginify.use(new Plugin(), new Plugin(), new Plugin())

//or

axiosPluginify.use(new Plugin()).use(new Plugin()).use(new Plugin())
```

### demo

```javascript
//1. axiosStatic add config
const config = {
  baseURL: '/users',
  timeout: 5000
}
const axiosInstance1 = pluginify(axios, config).use(new Plugin(), new Plugin()).generate();
const axiosInstance2 = pluginify(axios).use(new Plugin()).use(new Plugin()).generate();

//2. AxiosInstance add config
axiosInstance2.defaults.baseURL = '/users'
axiosInstance2.defaults.timeout = 5000

const res1 = await axiosInstance1.get('/info')
const res2 = await axiosInstance2.get('/info')
```


### generate

创建 `axios` 实例并调用 `use` 方法所给定的插件.

```javascript
const axiosPluginify = pluginify(axios)

const axiosInstance = axiosPluginify.use(new Plugin()).generate()
```

通过向 `generate` 传入 `true` 表示生成 `axiosInstance` 后销毁 `pluginify` 内部保存的引用, 避免内存泄漏.

```javascript
const axiosPluginify = pluginify(axios);

const axiosInstance = axiosPluginify.use(new Plugin()).generate(true)
```

### destroy

用于销毁 `pluginify` 内部保存的引用, 可以通过 `generate(true)` 触发.

### plugin

插件是一个类, 可以提供数个生命周期钩子.

```javascript
class Plugin {
  // optional
  constructor() {}

  // optional
  beforeCreate(axiosRequestConfig, axiosStatic) {}

  // optional
  created(axiosInstance, axiosRequestConfig) {}
}
```

这里的 axiosInstance 代表 创建出的 axios 实例，axiosStatic 代表 axios 本身