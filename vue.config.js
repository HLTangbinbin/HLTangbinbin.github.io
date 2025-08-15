const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 使用该配置打包到github pages后容易出现空白页面
  // publicPath: process.env.NODE_ENV === 'production' ? '/HLTangbinbin.github.io/' : './',
  publicPath: './',
  
  // 性能优化配置
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // ECharts单独分包
          echarts: {
            name: 'chunk-echarts',
            priority: 20,
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            chunks: 'all',
          },
          // Element Plus单独分包
          elementPlus: {
            name: 'chunk-element-plus',
            priority: 20,
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            chunks: 'all',
          },
          // Vue相关库分包
          vue: {
            name: 'chunk-vue',
            priority: 30,
            test: /[\\/]node_modules[\\/](vue|vue-router)[\\/]/,
            chunks: 'all',
          },
          // 公共库分包
          vendors: {
            name: 'chunk-vendors',
            priority: 10,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          },
        },
      },
    },
    // 性能提示
    performance: {
      hints: 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  },
  
  // 生产环境优化
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 压缩配置
      config.optimization.minimize(true);
      
      // 移除console和debugger
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        return args;
      });
    }
  },
  
  devServer: {
    proxy: {
      '/api': {
        target: 'https://data.stats.gov.cn',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
})
