import { AxiosPlugin } from '@axios-plugin/core';
import { AxiosInstance } from 'axios';

interface InterceptorPluginOptions {
    [key: number]: string;
}
declare class InterceptorPlugin implements AxiosPlugin {
    options: InterceptorPluginOptions;
    constructor(options?: InterceptorPluginOptions);
    created(axiosInstance: AxiosInstance): void;
}

export { InterceptorPlugin, InterceptorPluginOptions };
