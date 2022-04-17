const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // publicPath: "",
  productionSourceMap: false,
  devServer: {
    allowedHosts: "all",
    proxy: {
      '/api': {
        target: 'http://100.102.249.109:8080',
        // pathRewrite: { '^/api': '' },
      },
    },
  },
});
