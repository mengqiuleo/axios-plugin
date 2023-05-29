import { AxiosPlugin } from '@axios-plugin/core';
import { AxiosInstance } from 'axios';

declare class TokenPlugin implements AxiosPlugin {
    token: string;
    constructor(token: string);
    created(axios: AxiosInstance): void;
}

export { TokenPlugin };
