import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


// 导入性能监控
import performanceMonitor from './utils/PerformanceMonitor.js'
import { logger } from './utils/Logger'

const app = createApp(App)

// 全局挂载性能监控
app.config.globalProperties.$performance = performanceMonitor
window.performanceMonitor = performanceMonitor

// 路由性能监控
router.beforeEach((to, from, next) => {
  if (from.path !== '/') {
    performanceMonitor.recordMetric('navigation', {
      timestamp: Date.now(),
      type: 'routeStart',
      from: from.path,
      to: to.path
    });
  }
  next();
});

router.afterEach((to, from) => {
  if (from.path !== '/') {
    performanceMonitor.recordMetric('navigation', {
      timestamp: Date.now(),
      type: 'routeComplete',
      from: from.path,
      to: to.path
    });
  }
});

app.use(router)
app.use(ElementPlus)

// 开发环境下的性能调试
if (process.env.NODE_ENV === 'development') {
  // 暴露性能监控到控制台
  window.$performance = performanceMonitor;
  
  // 添加性能报告命令
  logger.debug('性能监控已启动，使用 $performance.getReport() 查看报告');
}

app.mount('#app')

