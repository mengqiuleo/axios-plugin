import axiosRetry from 'axios-retry';

class RetryPlugin {
    constructor(config) {
        this.config = config;
    }
    created(axios) {
        axiosRetry(axios, this.config);
    }
}

export { RetryPlugin };
