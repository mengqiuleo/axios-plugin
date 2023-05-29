import { AxiosPlugin } from '@axios-plugin/core';
import { AxiosInstance } from 'axios';

declare class DownLoadPlugin implements AxiosPlugin {
    filename?: string;
    constructor(filename?: string);
    created(axios: AxiosInstance): void;
}

export { DownLoadPlugin };
