const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 使用该配置打包到github pages后容易出现空白页面
  // publicPath: process.env.NODE_ENV === 'production' ? '/HLTangbinbin.github.io/' : './'
  publicPath: './'
})
