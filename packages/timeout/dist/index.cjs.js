'use strict';

class TimeoutPlugin {
    constructor(options) {
        this.options = options || { timeout: 2000 };
    }
    beforeCreate(config) {
        if (this.options.timeout != null) {
            config.timeout = this.options.timeout;
        }
    }
    // @ts-ignore
    created(axiosInstance) {
        if (this.options.timeout != null) {
            axiosInstance.interceptors.response.use((response) => response, (error) => {
                if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
                    error.message = `Response timeout of ${this.options.timeout}ms exceeded`;
                    console.log(error.message);
                }
                return Promise.reject(error);
            });
        }
    }
}

exports.TimeoutPlugin = TimeoutPlugin;
