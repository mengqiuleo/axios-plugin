import { AxiosStatic, AxiosInstance, AxiosRequestConfig } from 'axios';

export type beforeCreateHook = (config: AxiosRequestConfig, axios: AxiosStatic) => void;

export type createdHook = (config: AxiosRequestConfig, axios: AxiosInstance) => void;

export interface AxiosPlugin {
  beforeCreate?: beforeCreateHook;
  created?: createdHook;
}

export interface DefinePlugin extends AxiosPlugin {
  apply: (...args: Array<unknown>) => void;
}

export function definePlugin<T extends DefinePlugin>(
  plugin: T
): { this: T; new (...args: Parameters<T['apply']>): AxiosPlugin } {
  return function pluginWrapper(
    this: AxiosPlugin,
    ...args: Parameters<typeof plugin['apply']>
  ) {
    debugger
    if (typeof plugin.apply === 'function') {
      console.log('plugin.apply', plugin.apply)
      plugin.apply && plugin.apply.apply(this, args);
    }

    if (plugin.beforeCreate) {
      this.beforeCreate = plugin.beforeCreate.bind(this);
    }
    if (plugin.created) {
      this.created = plugin.created.bind(this);
    }
  } as any;
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
            // @ts-ignore
            plugin.beforeCreate(config, axios)
        );
      }

      if (typeof plugin.created === 'function') {
        // @ts-ignore
        this.created.push((axios: AxiosInstance, config: AxiosRequestConfig) =>
          // @ts-ignore
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
      // @ts-ignore
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
    // @ts-ignore
    this.config = this.axiosStatic = null;
  }
}

export function pluginify(
  axiosStatic: AxiosStatic,//为了区分，axiosStatic统一代表axios本身
  config: AxiosRequestConfig = {}
): AxiosPluginify {
  return new AxiosPluginify(axiosStatic, config);
}