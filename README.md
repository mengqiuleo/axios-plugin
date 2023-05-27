# axios-pluginify

`axios-pluginify` 是一款极小的工具, 可以让 `axios` 成为基于插件的请求库.

通过这种方式使得 `axios` 可以与其结合的类库例如 `axios-cache-adapter` 以及拦截器功能进行解耦, 让它们更加容易组织和复用.

# Install

```bash
npm install axios-pluginify
```

# Usage

**提示**: `axios` (对象)本身可以用于请求也可以通过属性来配置, 同时还支持通过 `create` 方法来创建新的实例 `axios-pluginify` 利用了 `create` 方法, 下面的例子中使用 `axiosInstance` 和 `axiosStatic` 将实例和 `axios` 本身进行区分.

## 自定义插件

```javascript
const axiosStatic = require('axios');
const { pluginify } = require('axios-pluginify');

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

const axiosInstance = pluginify(axiosStatic).use(new Plugin()).generate();

axiosInstance.get('/users');
```

## 包装已有类库

```javascript
const axiosStatic = require('axios');
const { default: MockAdapter } = require('axios-mock-adapter');
const { pluginify } = require('axios-pluginify');

class MockAdapterPlugin {
  created(axiosInstance) {
    const mock = new MockAdapter(axiosInstance);

    mock.onGet('/uesrs').reply(200, {
      msg: 'hello world',
    });
  }
}

const axiosInstance = pluginify(axiosStatic)
  .use(new MockAdapterPlugin())
  .generate();

axiosInstance.get('/users');
```

## 包装拦截器

```javascript
const axiosStatic = require('axios');
const { pluginify } = require('axios-pluginify');

class RequestWithToken {
  constructor(token) {
    this.token = token;
  }
  created(axiosInstance) {
    axiosInstance.interceptors.request.use((config) => {
      config.headers['x-access-token'] = this.token;
    });
  }
}

class ExtractResultPlugin {
  created(axiosInstance) {
    axiosInstance.interceptors.response.use((response) => {
      if (response.status === 200) {
        return response.data;
      }
    });
  }
}

const axiosInstance = pluginify(axiosStatic)
  .use(new RequestWithToken('token'), new ExtractResultPlugin())
  .generate();

axiosInstance.get('/users');
```

# API

## pluginify

### constructor

```javascript
pluginify(axiosStatic);
```

```javascript
pluginify(axiosStatic, {
  // 交由 axiosStatic.create() 所使用的配置, 可以被插件重写
});
```

### use

```javascript
const axiosPluginify = pluginify(axiosStatic);

axiosPluginify.use(new Plugin(), new Plugin(), new Plugin());
```

or

```javascript
axiosPluginify.use(new Plugin()).use(new Plugin()).use(new Plugin());
```

### generate

创建 `axios` 实例并结合 `use` 方法所给定的插件.

```javascript
const axiosPluginify = pluginify(axiosStatic);

const axiosInstance = axiosPluginify.use(new Plugin()).generate();
```

通过向 `generate` 传入 `true` 表示生成 `axiosInstance` 后销毁 `pluginify` 内部保存的引用, 避免内存泄漏.

```javascript
const axiosPluginify = pluginify(axiosStatic);

const axiosInstance = axiosPluginify.use(new Plugin()).generate(true);
```

### destroy

用于销毁 `pluginify` 内部保存的引用, 可以通过 `generate(true)` 触发.

## plugin

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

## definePlugin

定义一个插件, 效果和普通插件一样, 这个函数可以让你获取到语法提示:

```javascript
const axiosStatic = require('axios');
const { definePlugin, pluginify } = require('axios-pluginify');

pluginify(axiosStatic)
  .use(
    definePlugin({
      apply() {},
      beforeCreate() {},
      created() {},
    })
  )
  .generate(true);
```

在这里 `apply` 替换了 `class` 中的 `construtcor`, 如果你使用 `typescript` 那么 `apply` 受到类型系统限制是必选的, 如果你忽略这个错误也不会有问题.

另外 `definePlugin` 上面的钩子只能使用传统的函数不能是箭头函数因为在 `definePlugin` 内部显示绑定了 `this` 而箭头函数无法进行绑定.

## 内置的插件

- AxiosRetry
- AxiosCacheAdapter

这两个插件分别对 `axios-retry` 和 `axios-cache-adapter` 做了插件化处理, 同时也是最基本的插件示例.

# FAQ

## 我是否可以多次调用 `generate` 方法

可以, 不过 `axios-pluginify` 没有对 `beforeCreate` 和 `created` 所传入的参数做任何处理.

如果你在这些钩子函数中修改了传入钩子的参数, 则需要考虑这些插件在后续 `generate` 调用的时候的逻辑.

一个更加简单的方式是复用生产出的 `axios` 实例, 而不是多次调用 `generate` 方法.

## 插件的执行顺序是怎样的

`axios-pluginify` 会按照 `use` 方法的执行顺序来处理它们的挂载.

唯一需要注意的是 `axios` 的拦截器是栈结构, 也就是说后挂载的拦截器先执行.