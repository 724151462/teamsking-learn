const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // 基本路径
  baseUrl: '/',
  assetsDir: 'assets',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
/*
    overlay: {
      warnings: true,
      errors: true
    },
*/
    port: 8080,
    proxy: {
      '/api': {
         target: 'http://192.168.10.57:9008',
        // target: 'http://apidev.tskedu.cn:9008',
        // target: 'https://api.tskedu.com',
        secure: false,
        ws: true,
        changeOrigin: true
      }
    },
  },
}
