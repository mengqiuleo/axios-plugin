import axios, { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ThrottlePlugin } from '../src/index'
import { pluginify } from "@axios-plugin/core"

describe('throttle plugin', () => {
  let mock: MockAdapter
  let axiosInstance: AxiosInstance

  beforeEach(() => {
    mock = new MockAdapter(axios)

    axiosInstance = 
      pluginify(axios).use(new ThrottlePlugin({ maxTime: 1000 })).generate()
  })

  afterEach(() => {
    mock.restore()
  })

  it('throttle test', async () => {
    const path = '/data'

    mock.onGet(path).reply(200, { data: 'success' });

    const res = await axiosInstance.get(path)
    console.log('res', res.data)
    await expect(axiosInstance.get(path)).rejects.toThrow();
    await expect(axiosInstance.get(path)).rejects.toThrow();
  })
})