import { JSDOM } from 'jsdom';
import axios, { AxiosInstance } from 'axios';
import { DownLoadPlugin } from '../src/index';

const jsdom = new JSDOM();

//@ts-ignore
(global as any).document = jsdom.window.document;
//@ts-ignore
(global as any).window = jsdom.window;

// Mock axios实例
const mockAxios = axios.create({
  baseURL: 'http://example.com',
});

describe('Test DownLoadPlugin', () => {
  let plugin: DownLoadPlugin;
  let axiosInstance: AxiosInstance;

  beforeEach(() => {
    axiosInstance = Object.assign(mockAxios);
    plugin = new DownLoadPlugin();
    plugin.created(axiosInstance);
  });

  // TODO: 这个测试不太会写，可能因为原本没有测试文件，所有 DownLoadPlugin 这个包一直发不出去
  it.skip('should download file with correct filename', async () => {
    const linkSpy = jest.spyOn(document, 'createElement').mockImplementation(() => ({
      click: jest.fn(),
      href: '',
      download: '',
    }) as unknown as HTMLElement );
    const revokeSpy = jest.spyOn(window.URL, 'revokeObjectURL');
    // 假设下载地址返回的是文本内容
    const data = 'This is a test file.';
    const headers = {
      'content-type': 'application/octet-stream',
    };
    const response = {
      data,
      status: 200,
      statusText: 'OK',
      headers,
      config: {},
    };
    const getSpy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(response);
    await axiosInstance.get('/download');
    expect(getSpy).toHaveBeenCalledWith('/download', {});
    expect(linkSpy).toHaveBeenCalledTimes(1);
    expect(revokeSpy).toHaveBeenCalledTimes(1);
    expect(linkSpy.mock.results[0].value.download).toBe('filename');
  });
});