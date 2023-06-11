const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 接口域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          //重写路径
          "^/api": "" //需要rewrite的,
        }
      }
    }
  },
  configureWebpack: {
    resolve:{
      alias:{
        'assets': '@/assets',
      }
    }
  },
})
