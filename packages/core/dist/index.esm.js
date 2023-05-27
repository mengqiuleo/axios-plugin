function definePlugin(plugin) {
    return function pluginWrapper(...args) {
        debugger;
        if (typeof plugin.apply === 'function') {
            console.log('plugin.apply', plugin.apply);
            plugin.apply && plugin.apply.apply(this, args);
        }
        if (plugin.beforeCreate) {
            this.beforeCreate = plugin.beforeCreate.bind(this);
        }
        if (plugin.created) {
            this.created = plugin.created.bind(this);
        }
    };
}
class AxiosPluginify {
    constructor(axiosStatic, config) {
        this.axiosStatic = axiosStatic;
        this.config = config;
        this.beforeCreate = [];
        this.created = [];
    }
    use(...plugins) {
        for (const plugin of plugins) {
            if (typeof plugin.beforeCreate === 'function') {
                this.beforeCreate.push((config, axios) => 
                // @ts-ignore
                plugin.beforeCreate(config, axios));
            }
            if (typeof plugin.created === 'function') {
                // @ts-ignore
                this.created.push((axios, config) => 
                // @ts-ignore
                plugin.created(axios, config));
            }
        }
        return this;
    }
    generate(destroy = false) {
        for (const hook of this.beforeCreate) {
            hook(this.config, this.axiosStatic);
        }
        const axios = this.axiosStatic.create(this.config);
        for (const hook of this.created) {
            // @ts-ignore
            hook(axios, this.config);
        }
        if (destroy) {
            this.destroy();
        }
        return axios;
    }
    destroy() {
        this.beforeCreate = [];
        this.created = [];
        // @ts-ignore
        this.config = this.axiosStatic = null;
    }
}
function pluginify(axiosStatic, //为了区分，axiosStatic统一代表axios本身
config = {}) {
    return new AxiosPluginify(axiosStatic, config);
}

export { definePlugin, pluginify };
