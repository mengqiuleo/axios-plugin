import { AxiosPlugin } from '@axios-plugin/core';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

interface ThrottleOption {
    maxTime: number;
}
declare class ThrottlePlugin implements AxiosPlugin {
    options?: ThrottleOption;
    maxTime: number;
    constructor(options?: ThrottleOption);
    created(axiosInstance?: AxiosInstance, config?: AxiosRequestConfig): void;
}

export { ThrottlePlugin };
