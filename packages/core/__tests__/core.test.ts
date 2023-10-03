import axios, { AxiosStatic,AxiosInstance, AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { pluginify, AxiosPlugin } from '../src/index'

const mock = new MockAdapter(axios)

mock.onGet('/users/info').reply(200, {
  users: [{ id: 1, name: "John Smith" }]
})

describe('core test', () => {
  test('axios basic function test', async () => {
    const axiosStatic = axios.create({
      baseURL: ''
    })
  
    const res = await axiosStatic.get('/users/info')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('pluginify basic test', async () => {
    const axiosInstance = pluginify(axios).generate();
  
    const res = await axiosInstance.get('/users/info')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('a pluginClass function test', async () => {

    class Plugin implements AxiosPlugin {
      public pluginConfig:any = undefined
      public pluginName = 'plugin'
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
      created( axiosInstance: AxiosInstance, axiosConfig: AxiosRequestConfig) {
        console.log(axiosInstance);
        console.log(axiosConfig);
      }
    }

    //axiosStatic add config
    const config = {
      baseURL: '/users',
      timeout: 5000
    }
    const axiosInstance = pluginify(axios, config).use(new Plugin()).generate();
  
    const res = await axiosInstance.get('/info')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('some pluginClass function test', async () => {

    class Plugin implements AxiosPlugin {
      public pluginConfig:any = undefined
      public pluginName = 'plugin'
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
      created(axiosInstance: AxiosInstance, axiosConfig: AxiosRequestConfig) {
        console.log(axiosInstance);
        console.log(axiosConfig);
      }
    }

    //axiosStatic add config
    const config = {
      baseURL: '/users',
      timeout: 5000
    }
    const axiosInstance1 = pluginify(axios, config).use(new Plugin(), new Plugin(), new Plugin()).generate();
    const axiosInstance2 = pluginify(axios).use(new Plugin()).use(new Plugin()).use(new Plugin()).generate();
    //AxiosInstance add config
    axiosInstance2.defaults.baseURL = '/users'
    axiosInstance2.defaults.timeout = 5000
  
    const res1 = await axiosInstance1.get('/info')
    expect(res1.data.users).toEqual([{ id: 1, name: "John Smith" }])
    const res2 = await axiosInstance2.get('/info')
    expect(res2.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('error use', () => {
    class Plugin implements AxiosPlugin {
      public pluginConfig:any = undefined
      public pluginName = 'MessagePlugin'
      // 可选
      constructor(pluginConfig?: any) {
        this.pluginConfig = pluginConfig;
      }
    
      // 可选 axios 实例化后创建
      created(axiosInstance: AxiosInstance, axiosConfig: AxiosRequestConfig) {
        throw new Error("Message")
      }
    }
    const axiosInstance = pluginify(axios).use(new Plugin()).generate();
    console.log(axiosInstance)
  })
})
