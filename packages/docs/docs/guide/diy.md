# 自定义插件

自定义插件有两种方式，一种是通过自定义Class，第二种是 definePlugin 函数

## API

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
