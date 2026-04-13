import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  ElButton,
  ElCheckboxButton,
  ElDrawer,
  ElIcon,
  ElImage,
  ElInput,
  ElOption,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElSlider,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus'
import 'element-plus/es/components/base/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/checkbox-button/style/css'
import 'element-plus/es/components/drawer/style/css'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/image/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/radio-button/style/css'
import 'element-plus/es/components/radio-group/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/slider/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/tag/style/css'
import 'element-plus/es/components/message/style/css'
import './assets/styles/tokens.css'
import './assets/styles/theme.css'


// 导入性能监控
import performanceMonitor from './utils/PerformanceMonitor.js'
import { logger } from './utils/Logger'

const app = createApp(App)
const elementPlusComponents = [
  ElButton,
  ElCheckboxButton,
  ElDrawer,
  ElIcon,
  ElImage,
  ElInput,
  ElOption,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElSlider,
  ElTable,
  ElTableColumn,
  ElTag,
]

// 全局挂载性能监控
app.config.globalProperties.$performance = performanceMonitor
window.performanceMonitor = performanceMonitor
window.router = router
performanceMonitor.start()
performanceMonitor.observeNavigation(router)

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
elementPlusComponents.forEach((component) => {
  app.component(component.name, component)
})

// 开发环境下的性能调试
if (process.env.NODE_ENV === 'development') {
  // 暴露性能监控到控制台
  window.$performance = performanceMonitor;
  
  // 添加性能报告命令
  logger.debug('性能监控已启动，使用 $performance.getReport() 查看报告');
}

app.mount('#app')
