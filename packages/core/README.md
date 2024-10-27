# @axios-plugin/core
`@axios-plugin/core`是`@axios-plugin`的核心，它可以让 `axios` 成为基于插件的请求库，通过这种方式使得 `axios` 可以与我们自定义的拦截器功能进行解耦, 让它们更加容易组织和复用。

`@axios-plugin`针对诸如 Token 的添加，失效处理，无感知更新、接口缓存、错误重试等常见业务场景，提供了解决方案。另外也是支持定制化的，当这些功能不满足你的需求时，可以通过[自定义插件](https://www.npmjs.com/package/@axios-plugin/core#自定义插件)的方式快速封装。


 `@axios-plugin` 算是一种 axios 请求层拦截器代码组织的方案，
目的是为了实现所有**拦截器职责单一**、方便维护、并**统一维护**和**自动调度**，避免实际业务中对每个项目的重复封装。

## 安装
```bash
npm i @axios-plugin/core
```

## 自定义插件
自定义插件通过自定义Class, 插件是一个类, 可以提供数个生命周期钩子.

插件的 TS 类型定义
```ts
export interface AxiosPlugin {
  pluginName: string;
  beforeCreate?: beforeCreateHook;
  created?: createdHook;
}
```

### PluginClass
```javascript
import axios from 'axios'
import { pluginify } from "@axios-plugin/core"

class Plugin {
  public pluginName = 'plugin' //必选，插件名，用于记录插件调用出错的情况
  // 可选
  constructor(pluginConfig) {
    this.pluginConfig = pluginConfig;
  }

  // 可选 axios 实例化前创建
  beforeCreate(axiosConfig, axiosStatic) {
    console.log(this.pluginConfig);
    console.log(axiosConfig);
    console.log(axiosStatic);
  }

  // 可选 axios 实例化后创建
  created(axiosInstance, axiosConfig) {
    console.log(axiosInstance);
    console.log(axiosConfig);
  }
}

const axiosInstance = pluginify(axios).use(new Plugin()).generate();

axiosInstance.get('/users');
```

## 包装已有类库

```javascript
import axios from 'axios'
import { pluginify } from "@axios-plugin/core"
import MockAdapter from 'axios-mock-adapter'

class MockAdapterPlugin {
  public pluginName = 'MockAdapterPlugin'
  created(axiosInstance) {
    const mock = new MockAdapter(axiosInstance)

    mock.onGet('/uesrs').reply(200, {
      msg: 'hello world'
    })
  }
}

const axiosInstance = pluginify(axios)
  .use(new MockAdapterPlugin())
  .generate()

axiosInstance.get('/users')
```

## 包装拦截器

```javascript
import axios from 'axios'
import { pluginify } from "@axios-plugin/core"

class RequestWithToken {
  public pluginName = 'RequestWithToken'
  constructor(token) {
    this.token = token
  }
  created(axiosInstance) {
    axiosInstance.interceptors.request.use((config) => {
      config.headers['x-access-token'] = this.token
    });
  }
}

class ExtractResultPlugin {
  public pluginName = 'ExtractResultPlugin'
  created(axiosInstance) {
    axiosInstance.interceptors.response.use((response) => {
      if (response.status === 200) {
        return response.data
      }
    });
  }
}

const axiosInstance = pluginify(axios)
  .use(new RequestWithToken('token'), new ExtractResultPlugin())
  .generate()

axiosInstance.get('/users')
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

创建 `axios` 实例并结合 `use` 方法所给定的插件.

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
  public pluginName = 'Plugin' //required
  // optional
  constructor() {}

  // optional
  beforeCreate(axiosRequestConfig, axiosStatic) {}

  // optional
  created(axiosInstance, axiosRequestConfig) {}
}
```

## FAQ


### 插件的执行顺序是怎样的

`@axios-plugin` 会按照 `use` 方法的执行顺序来处理它们的挂载。

但在 axios 内部，对于请求拦截器，是先挂载的后执行；对于响应拦截器，是先挂载的先执行。


### 遇到不正确的插件

这里对自定义插件的要求很低，只要编写的插件中含有 beforeCreate 或者 created 函数就OK，至于在函数内部做的事情都不做要求，最后在统一调用时，依次取出所有的插件函数执行。

目前对插件调用出错的情况，向外抛错，插件调用流程终止。