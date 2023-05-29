import { AxiosPlugin } from '@axios-plugin/core';
import { AxiosInstance } from 'axios';
import { IAxiosRetryConfig } from 'axios-retry';

declare class RetryPlugin implements AxiosPlugin {
    config?: IAxiosRetryConfig;
    constructor(config?: IAxiosRetryConfig);
    created(axios: AxiosInstance): void;
}

export { RetryPlugin };
