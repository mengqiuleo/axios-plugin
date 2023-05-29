import axios, { AxiosStatic, AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { RetryPlugin } from '../src/index'
import { pluginify } from "@axios-plugin/core"

describe('retry plugin', () => {
  let mock: MockAdapter
  let axiosInstance: AxiosInstance

  beforeEach(() => {
    mock = new MockAdapter(axios)

    axiosInstance = 
      pluginify(axios.create() as AxiosStatic).use(new RetryPlugin({ retries: 2 })).generate()
  })

  afterEach(() => {
    mock.restore()
  })

  it('retry test', async () => {
    const path = '/data'

    mock.onGet(path).networkError();

    await expect(axiosInstance.get(path)).rejects.toThrow();
    expect(mock.history.get.length).toBe(3);

  })
})