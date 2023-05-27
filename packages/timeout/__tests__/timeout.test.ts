import axios, { AxiosStatic } from 'axios'
import MockAdapter from 'axios-mock-adapter'
// @ts-ignore
import { pluginify, AxiosPlugin } from "@axios-plugin/core";
import { TimeoutPlugin } from "../src/index"

describe('Timeout Plugin', () => {
  test('should timeout after 1 second', async () => {
    const url = '/timeout';
    const mock = new MockAdapter(axios);
    mock.onGet(url).timeout();
    const instance = pluginify(axios.create() as AxiosStatic).use(new TimeoutPlugin({ timeout: 1000 }) as unknown as AxiosPlugin).generate();
    await expect(instance.get(url)).rejects.toThrowError(/timeout/);
  });

  test('should timeout without param', async () => {
    const url = '/timeout';
    const mock = new MockAdapter(axios);
    mock.onGet(url).timeout();
    const instance = pluginify(axios.create() as AxiosStatic).use(new TimeoutPlugin() as unknown as AxiosPlugin).generate();
    await expect(instance.get(url)).rejects.toThrowError(/timeout/);
  });

  test('should not timeout before 1 second', async () => {
    const url = 'https://httpbin.org/delay/0.5';
    const mock = new MockAdapter(axios);
    mock.onGet(url).reply(200, { data: 'success' });

    const instance = pluginify(axios.create() as AxiosStatic).use(new TimeoutPlugin({ timeout: 1000 }) as unknown as AxiosPlugin).generate();
    const response = await instance.get(url);

    expect(response.data.data).toEqual('success');
  });
})
