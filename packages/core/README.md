# @axios-plugin/core

我希望将 `@axios-plugin` 称为一套 axios **请求层拦截器调度解决方案**，`@axios-plugin/core`是`@axios-plugin`的核心，它可以让 `axios` 成为基于插件的请求库，通过这种方式使得 `axios` 可以与我们自定义的拦截器功能进行解耦, 让它们更加容易组织和复用.
目的是为了实现所有**拦截器职责单一**、方便维护、并**统一维护**和**自动调度**，避免实际业务中对每个项目的重复封装.

## 安装
```bash
yarn add @axios-plugin/core
```

## 自定义插件
自定义插件有两种方式，一种是通过自定义Class，第二种是 definePlugin 函数

### PluginClass
```javascript
import axios from 'axios'
import { pluginify } from "@axios-plugin/core"

class Plugin {
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

const axiosInstance = pluginify(axios.create()).use(new Plugin()).generate();

axiosInstance.get('/users');
```
### definePlugin
```js
import axios from 'axios'
import { pluginify, definePlugin } from "@axios-plugin/core"

const axiosInstance = pluginify(axios.create())
                        .use(
                          definePlugin({
                            apply() {},
                            beforeCreate() {},
                            created() {},
                          })
                        )
                        .generate()
```
在这里 `apply` 替换了 `class` 中的 `construtcor`, 如果你使用 `typescript` 那么 `apply` 受到类型系统限制是必选的, 如果你忽略这个错误也不会有问题.

另外 `definePlugin` 上面的钩子只能使用传统的函数不能是箭头函数因为在 `definePlugin` 内部显示绑定了 `this` 而箭头函数无法进行绑定.


## 包装已有类库

```javascript
import axios from 'axios'
import { pluginify } from "@axios-plugin/core"
import MockAdapter from 'axios-mock-adapter'

class MockAdapterPlugin {
  created(axiosInstance) {
    const mock = new MockAdapter(axiosInstance)

    mock.onGet('/uesrs').reply(200, {
      msg: 'hello world'
    })
  }
}

const axiosInstance = pluginify(axios.create())
  .use(new MockAdapterPlugin())
  .generate()

axiosInstance.get('/users')
```

## 包装拦截器

```javascript
import axios from 'axios'
import { pluginify } from "@axios-plugin/core"

class RequestWithToken {
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
  created(axiosInstance) {
    axiosInstance.interceptors.response.use((response) => {
      if (response.status === 200) {
        return response.data
      }
    });
  }
}

const axiosInstance = pluginify(axios.create())
  .use(new RequestWithToken('token'), new ExtractResultPlugin())
  .generate()

axiosInstance.get('/users')
```

## API
### pluginify

#### constructor

```javascript
pluginify(axiosStatic)
```

```javascript
pluginify(axiosStatic, {
  // 交由 axiosStatic.create() 所使用的配置, 可以被插件重写
});
```

#### use

```javascript
const axiosPluginify = pluginify(axiosStatic)

axiosPluginify.use(new Plugin(), new Plugin(), new Plugin())
```

or

```javascript
axiosPluginify.use(new Plugin()).use(new Plugin()).use(new Plugin())
```

#### generate

创建 `axios` 实例并结合 `use` 方法所给定的插件.

```javascript
const axiosPluginify = pluginify(axiosStatic)

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

### definePlugin

定义一个插件, 效果和普通插件一样, 这个函数可以让你获取到语法提示:

```javascript
import axios from 'axios'
import { pluginify, definePlugin } from "@axios-plugin/core"

pluginify(axiosStatic)
  .use(
    definePlugin({
      apply() {},
      beforeCreate() {},
      created() {},
    })
  )
  .generate(true)
```


## 鸣谢
[axios-pluginify](https://github.com/uioz/axios-pluginify)
[设计一个可插拔的请求库?](https://juejin.cn/post/6960254713631604766#heading-14)
[如何优雅的管理 HTTP 请求和响应拦截器](https://www.yuque.com/wangpingan/cute-frontend/ocl9ah)

感谢各位前辈提供的思路和代码案例，排名不分先后