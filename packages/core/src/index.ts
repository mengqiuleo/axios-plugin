import { AxiosStatic, AxiosInstance, AxiosRequestConfig } from 'axios';

export type beforeCreateHook = (config?: AxiosRequestConfig, axios?: AxiosStatic) => void;

export type beforeCreateHookName = string;

export type createdHook = (axios?: AxiosInstance, config?: AxiosRequestConfig) => void;

export type createdHookName = string;

export interface AxiosPlugin {
  pluginName: string;
  beforeCreate?: beforeCreateHook;
  created?: createdHook;
}

class AxiosPluginify {
  private beforeCreate: Map<beforeCreateHookName, beforeCreateHook> = new Map();
  private created: Map<createdHookName, createdHook> = new Map();

  constructor(
    private axiosStatic: AxiosStatic,
    private config: AxiosRequestConfig
  ) {}

  use(...plugins: Array<AxiosPlugin>) {
    for (const plugin of plugins) {
      if (typeof plugin.beforeCreate === 'function') {
        this.beforeCreate.set(`${plugin.pluginName}`, (config: AxiosRequestConfig, axios: AxiosStatic) =>
        plugin.beforeCreate(config, axios));
      }

      if (typeof plugin.created === 'function') {
        this.created.set(`${plugin.pluginName}`, (axios: AxiosInstance, config: AxiosRequestConfig) =>
        plugin.created(axios, config))
      }
    }

    return this;
  }

  generate(destroy = false): AxiosInstance {
    for (const [pluginName, pluginHook] of this.beforeCreate.entries()) {
      try {
        pluginHook(this.config, this.axiosStatic);
      } catch {
        console.error(`${pluginName}插件调用出错, 插件注册中断⚠`)
        return
      }
      
    }

    const axios = this.axiosStatic.create(this.config);

    for (const [pluginName, pluginHook] of this.created.entries()) {
      try {
        pluginHook(axios, this.config);
      } catch {
        console.error(`${pluginName}插件调用出错, 插件注册中断⚠`)
        return
      }
     
    }

    if (destroy) {
      this.destroy();
    }

    return axios;
  }

  destroy() {
    this.beforeCreate = null;
    this.created = null;
    this.config = this.axiosStatic = null;
  }
}

export function pluginify(
  axiosStatic: AxiosStatic,//为了区分，axiosStatic统一代表axios本身
  config: AxiosRequestConfig = {}
): AxiosPluginify {
  return new AxiosPluginify(axiosStatic, config);
}