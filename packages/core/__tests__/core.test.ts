import axios, { AxiosStatic,AxiosInstance, AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { pluginify, AxiosPlugin, definePlugin, DefinePlugin } from '../src/index'

const mock = new MockAdapter(axios)

mock.onGet('/users').reply(200, {
  users: [{ id: 1, name: "John Smith" }]
})

describe('core test', () => {
  test('axios basic function test', async () => {
    const axiosStatic = axios.create({
      baseURL: ''
    })
  
    const res = await axiosStatic.get('/users')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('pluginify basic test', async () => {
    const axiosStatic = axios.create({
      baseURL: ''
    })

    // TODO: fix type error
    const axiosInstance = pluginify(axiosStatic as AxiosStatic).generate();
  
    const res = await axiosInstance.get('/users')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('a pluginClass function test', async () => {
    const axiosStatic = axios.create({
      baseURL: ''
    })

    class Plugin implements AxiosPlugin {
      public pluginConfig:any = undefined
      // 可选
      constructor(pluginConfig?: any) {
        this.pluginConfig = pluginConfig;
      }
    
      // 可选 axios 实例化前创建
      beforeCreate(axiosConfig: AxiosRequestConfig, axiosStatic: AxiosStatic) {
        console.log(this.pluginConfig);
        console.log(axiosConfig);
        console.log(axiosStatic);
      }
    
      // 可选 axios 实例化后创建
      created(axiosConfig: AxiosRequestConfig, axiosInstance: AxiosInstance) {
        console.log(axiosInstance);
        console.log(axiosConfig);
      }
    }

    // TODO: fix type error
    const axiosInstance = pluginify(axiosStatic as AxiosStatic).use(new Plugin()).generate();
  
    const res = await axiosInstance.get('/users')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('some pluginClass function test', async () => {
    const axiosStatic = axios.create({
      baseURL: ''
    })

    class Plugin implements AxiosPlugin {
      public pluginConfig:any = undefined
      // 可选
      constructor(pluginConfig?: any) {
        this.pluginConfig = pluginConfig;
      }
    
      // 可选 axios 实例化前创建
      beforeCreate(axiosConfig: AxiosRequestConfig, axiosStatic: AxiosStatic) {
        console.log(this.pluginConfig);
        console.log(axiosConfig);
        console.log(axiosStatic);
      }
    
      // 可选 axios 实例化后创建
      created(axiosConfig: AxiosRequestConfig, axiosInstance: AxiosInstance) {
        console.log(axiosInstance);
        console.log(axiosConfig);
      }
    }

    // TODO: fix type error
    const axiosInstance1 = pluginify(axiosStatic as AxiosStatic).use(new Plugin(), new Plugin(), new Plugin()).generate();
    const axiosInstance2 = pluginify(axiosStatic as AxiosStatic).use(new Plugin()).use(new Plugin()).use(new Plugin()).generate();
  
    const res1 = await axiosInstance1.get('/users')
    expect(res1.data.users).toEqual([{ id: 1, name: "John Smith" }])
    const res2 = await axiosInstance2.get('/users')
    expect(res2.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('definePlugin test', async () => {
    const axiosStatic = axios.create({
      baseURL: ''
    })

    const plugin = definePlugin({
      apply(pluginConfig) {
        console.log(pluginConfig)
      },
      beforeCreate(axiosConfig: AxiosRequestConfig, axiosStatic: AxiosStatic) {
        console.log(axiosConfig);
        console.log(axiosStatic);
      },
      created(axiosConfig: AxiosRequestConfig, axiosInstance: AxiosInstance) {
        console.log(axiosInstance);
        console.log(axiosConfig);
      }
    } as DefinePlugin)

    // TODO: fix type error
    const axiosInstance = pluginify(axiosStatic as AxiosStatic).use(plugin as AxiosPlugin).generate()
    const res = await axiosInstance.get('/users')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })
})