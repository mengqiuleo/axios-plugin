class AxiosPluginify {
  constructor(axiosStatic,config) {
    this.axiosStatic = axiosStatic
    this.config = config
  }

  use(...plugins) {
    for (const plugin of plugins) {
      if (typeof plugin.beforeCreate === 'function') {
        this.beforeCreate.push(
          (config, axios) =>
            plugin.beforeCreate(config, axios)
        );
      }

      if (typeof plugin.created === 'function') {
        this.created.push((axios, config) =>
          plugin.created(axios, config)
        );
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
      hook(axios, this.config);
    }
    return axios;
  }

}