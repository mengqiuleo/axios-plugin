import axios, { AxiosStatic, AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { CachePlugin, StorageType, Options } from '../src/index'
import { pluginify } from "@axios-plugin/core"

// TODO: axios-extensions 自己的错误，已提pr
// github issue: https://github.com/kuitos/axios-extensions/issues/99

describe('CachePlugin', () => {
  let mock: MockAdapter
  let axiosInstance: AxiosInstance

  beforeEach(() => {
    mock = new MockAdapter(axios)

    // @ts-ignore
    const options: Options = { cloneData: false, cleanupInterval: 36000, maxEntries: 300 }

    axiosInstance = 
      pluginify(axios.create() as AxiosStatic).use(new CachePlugin(StorageType.MemoryStorage)).generate()
  })

  afterEach(() => {
    mock.restore()
  })

  it('cache GET requests', async () => {
    const responseData = { data: 'test' }
    const path = '/data'

    mock.onGet(path).replyOnce(200, responseData)

    const firstResponse = await axiosInstance.get(path)
    const secondResponse = await axiosInstance.get(path)

    expect(firstResponse.data).toEqual(responseData)
    expect(secondResponse.data).toEqual(responseData)
  });

  it('POST', async () => {
    const path = '/data';

    mock.onPost(path).reply(() => {
      return [200, {}];
    });

    await axiosInstance.post(path, { data: 'test' });
    await axiosInstance.post(path, { data: 'test' })

    expect(mock.history.post.length).toBe(2);
  });
});
