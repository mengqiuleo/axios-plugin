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

#### constructor

```javascript
pluginify(axios.create())
```

```javascript
pluginify(axios.create(), {
  // 交由 axios.create() 所使用的配置, 可以被插件重写
});
```

#### use

```javascript
const axiosPluginify = pluginify(axios.create())

axiosPluginify.use(new Plugin(), new Plugin(), new Plugin())
```

or

```javascript
axiosPluginify.use(new Plugin()).use(new Plugin()).use(new Plugin())
```

#### generate

创建 `axios` 实例并结合 `use` 方法所给定的插件.

```javascript
const axiosPluginify = pluginify(axios.create())

const axiosInstance = axiosPluginify.use(new Plugin()).generate()
```

通过向 `generate` 传入 `true` 表示生成 `axiosInstance` 后销毁 `pluginify` 内部保存的引用, 避免内存泄漏.

```javascript
const axiosPluginify = pluginify(axios.create());

const axiosInstance = axiosPluginify.use(new Plugin()).generate(true)
```

#### destroy

用于销毁 `pluginify` 内部保存的引用, 可以通过 `generate(true)` 触发.

### plugin

插件是一个类(也可以是一个构造函数), 可以提供数个生命周期钩子.

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