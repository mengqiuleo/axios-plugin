# 自定义插件

自定义插件通过自定义Class

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

const axiosInstance = pluginify(axios).use(new Plugin()).generate();

axiosInstance.get('/users');
```


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

const axiosInstance = pluginify(axios)
  .use(new RequestWithToken('token'), new ExtractResultPlugin())
  .generate()

axiosInstance.get('/users')
```
