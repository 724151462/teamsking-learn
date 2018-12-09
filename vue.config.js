const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // 基本路径
  baseUrl: '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
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
        //  target: 'http://192.168.10.48:9008',
        target: 'http://120.36.137.90:9008',
        // target: 'http://192.168.1.233:9008',
        // target: 'https://wap.roobbc.com',
        secure: false,
        ws: true,
        changeOrigin: true
      }
    }
  }
}
