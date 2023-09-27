import { AxiosStatic, AxiosInstance, AxiosRequestConfig } from 'axios';

export type beforeCreateHook = (config?: AxiosRequestConfig, axios?: AxiosStatic) => void;

export type createdHook = (axios?: AxiosInstance, config?: AxiosRequestConfig) => void;

export interface AxiosPlugin {
  beforeCreate?: beforeCreateHook;
  created?: createdHook;
}

class AxiosPluginify {
  private beforeCreate: Array<beforeCreateHook> = [];
  private created: Array<createdHook> = [];

  constructor(
    private axiosStatic: AxiosStatic,
    private config: AxiosRequestConfig
  ) {}

  use(...plugins: Array<AxiosPlugin>) {
    for (const plugin of plugins) {
      if (typeof plugin.beforeCreate === 'function') {
        this.beforeCreate.push(
          (config: AxiosRequestConfig, axios: AxiosStatic) =>
            plugin.beforeCreate(config, axios)
        );
      }

      if (typeof plugin.created === 'function') {
        this.created.push((axios: AxiosInstance, config: AxiosRequestConfig) =>
          plugin.created(axios, config)
        );
      }
    }

    return this;
  }

  generate(destroy = false): AxiosInstance {
    for (const hook of this.beforeCreate) {
      hook(this.config, this.axiosStatic);
    }

    const axios = this.axiosStatic.create(this.config);

    for (const hook of this.created) {
      hook(axios, this.config);
    }

    if (destroy) {
      this.destroy();
    }

    return axios;
  }

  destroy() {
    this.beforeCreate = [];
    this.created = [];
    this.config = this.axiosStatic = null;
  }
}

export function pluginify(
  axiosStatic: AxiosStatic,//为了区分，axiosStatic统一代表axios本身
  config: AxiosRequestConfig = {}
): AxiosPluginify {
  return new AxiosPluginify(axiosStatic, config);
}