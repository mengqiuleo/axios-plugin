import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { pluginify } from "@axios-plugin/core";
import { TokenPlugin } from "../src/index"

describe('token plugin', () => {
  it('token', async () => {
    const token = '1234';
    const mock = new MockAdapter(axios);
    // 设置要模拟的响应
    mock.onGet('/api/data').reply(config => {
      expect(config.headers.Authorization).toBe(`Bearer ${token}`);
      return [200, { data: 'mock data' }];
    });

    const instance = pluginify(axios).use(new TokenPlugin(token)).generate();
    const res = await instance.get('/api/data')
    expect(res.data).toEqual({ data: 'mock data' });
  })
})