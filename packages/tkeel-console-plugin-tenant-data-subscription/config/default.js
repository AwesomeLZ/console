const API = {
  protocol: 'http',
  hostname: '127.0.0.1',
  port: '30707',
  pathname: '/apis',
};

module.exports = {
  publicPath: '/static/console-plugin-tenant-data-subscription/',
  basePath: '/tenant-data-subscription',
  client: {
    documentTitle: 'tKeel',
  },
  server: {
    port: '3008',
    proxy: {
      [API.pathname]: API.port
        ? `${API.protocol}://${API.hostname}:${API.port}`
        : `${API.protocol}://${API.hostname}`,
    },
  },
  api: API,
  plugin: {
    identify: {
      plugin_id: 'console-plugin-tenant-data-subscription',
      entries: [],
      dependence: [],
    },
  },
};
