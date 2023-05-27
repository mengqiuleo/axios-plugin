# @axios-plugin/core
`@axios-plugin/core`是`@axios-plugin`的核心，它可以让 `axios` 成为基于插件的请求库，通过这种方式使得 `axios` 可以与我们自定义的拦截器功能进行解耦, 让它们更加容易组织和复用。

`@axios-plugin`针对诸如 Token 的添加，失效处理，无感知更新、接口缓存、错误重试等常见业务场景，提供了解决方案。另外也是支持定制化的，当这些功能不满足你的需求时，可以通过[自定义插件](https://www.npmjs.com/package/@axios-plugin/core#自定义插件)的方式快速封装。


我更希望将 `@axios-plugin` 称为一套 axios **请求层拦截器调度解决方案**，
目的是为了实现所有**拦截器职责单一**、方便维护、并**统一维护**和**自动调度**，避免实际业务中对每个项目的重复封装。

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

### definePlugin

定义一个插件, 效果和普通插件一样, 这个函数可以让你获取到语法提示:

```javascript
import axios from 'axios'
import { pluginify, definePlugin } from "@axios-plugin/core"

pluginify(axios.create())
  .use(
    definePlugin({
      apply() {},
      beforeCreate() {},
      created() {},
    })
  )
  .generate(true)
```

## TODO
-  处理 ts 类型警告，而不是使用 @ts-ignore
-  支持可更换请求库，eg: fetch、xhr
-  开发自定义Plugin脚手架模板
-  增强拦截器调度
     -  处理拦截器失败的情况
     -  拦截器同步执行、异步执行、并发执行、循环执行等情况

## FAQ


### 插件的执行顺序是怎样的

`@axios-plugin` 会按照 `use` 方法的执行顺序来处理它们的挂载.

唯一需要注意的是 `axios` 的拦截器是栈结构, 也就是说**后挂载的拦截器先执行**.


### 我是否可以多次调用 `generate` 方法

可以, 不过 `@axios-plugin/core` 没有对 `beforeCreate` 和 `created` 所传入的参数做任何处理.

如果你在这些钩子函数中修改了传入钩子的参数, 则需要考虑这些插件在后续 `generate` 调用的时候的逻辑.

一个更加简单的方式是复用生产出的 `axios` 实例, 而不是多次调用 `generate` 方法.


## 鸣谢
[axios-pluginify](https://github.com/uioz/axios-pluginify)

[设计一个可插拔的请求库?](https://juejin.cn/post/6960254713631604766#heading-14)

[如何优雅的管理 HTTP 请求和响应拦截器](https://www.yuque.com/wangpingan/cute-frontend/ocl9ah)

感谢各位前辈提供的思路和代码案例，特别感谢 [axios-pluginify](https://github.com/uioz/axios-pluginify) 前辈的代码实现方案！！！


## License
MIT License © 2023 [mengqiuleo](https://github.com/mengqiuleo)