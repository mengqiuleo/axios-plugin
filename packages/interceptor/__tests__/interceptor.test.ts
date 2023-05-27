import axios, { AxiosStatic } from 'axios'
import MockAdapter from 'axios-mock-adapter'
// @ts-ignore
import { pluginify, AxiosPlugin } from "@axios-plugin/core"
import { InterceptorPlugin, InterceptorPluginOptions } from "../src/index"

describe('InterceptorPlugin', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should add interceptor to axios instance', async () => {
    mock.onGet('/api/users').reply(404, {});

    const instance = pluginify(axios.create() as AxiosStatic).use(new InterceptorPlugin()).generate()
    await expect(instance.get('/api/users')).rejects.toThrowError()
  });

  it('add customize error', async () => {
    mock.onGet('/api/users').reply(403, {});
    
    const options: InterceptorPluginOptions = {
      403: 'token过期, 请重新登录',
      400: '请求语法有错误'
    }

    const instance = pluginify(axios.create() as AxiosStatic).use(new InterceptorPlugin(options)).generate()
    await expect(instance.get('/api/users')).rejects.toThrowError()
    await instance.get('/api/users').catch(res => {
      console.log('res.message', res.message)
    })
  });
});