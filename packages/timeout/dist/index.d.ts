import { AxiosPlugin } from '@axios-plugin/core';
import { AxiosRequestConfig, AxiosInstance } from 'axios';

interface TimeoutPluginOptions {
    timeout: number;
}
declare class TimeoutPlugin implements AxiosPlugin {
    options: TimeoutPluginOptions;
    constructor(options?: TimeoutPluginOptions);
    beforeCreate(config: AxiosRequestConfig): void;
    created(axiosInstance: AxiosInstance): void;
}

export { TimeoutPlugin, TimeoutPluginOptions };
