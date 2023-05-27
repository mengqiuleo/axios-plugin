import { AxiosRequestConfig, AxiosStatic, AxiosInstance } from 'axios';

type beforeCreateHook = (config?: AxiosRequestConfig, axios?: AxiosStatic) => void;
type createdHook = (axios?: AxiosInstance, config?: AxiosRequestConfig) => void;
interface AxiosPlugin {
    beforeCreate?: beforeCreateHook;
    created?: createdHook;
}
interface DefinePlugin extends AxiosPlugin {
    apply: (...args: Array<unknown>) => void;
}
declare function definePlugin<T extends DefinePlugin>(plugin: T): {
    this: T;
    new (...args: Parameters<T['apply']>): AxiosPlugin;
};
declare class AxiosPluginify {
    private axiosStatic;
    private config;
    private beforeCreate;
    private created;
    constructor(axiosStatic: AxiosStatic, config: AxiosRequestConfig);
    use(...plugins: Array<AxiosPlugin>): this;
    generate(destroy?: boolean): AxiosInstance;
    destroy(): void;
}
declare function pluginify(axiosStatic: AxiosStatic, //为了区分，axiosStatic统一代表axios本身
config?: AxiosRequestConfig): AxiosPluginify;

export { AxiosPlugin, DefinePlugin, beforeCreateHook, createdHook, definePlugin, pluginify };
