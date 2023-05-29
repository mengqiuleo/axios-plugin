'use strict';

var axiosRetry = require('axios-retry');

class RetryPlugin {
    constructor(config) {
        this.config = config;
    }
    created(axios) {
        axiosRetry(axios, this.config);
    }
}

exports.RetryPlugin = RetryPlugin;
