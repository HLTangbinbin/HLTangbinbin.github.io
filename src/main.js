import { createApp } from 'vue'; // 导入 createApp 函数
import App from './App.vue'; // 导入根组件
import router from './router'; // 导入路由实例
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App); // 创建应用实例

app.use(router); // 使用路由实例
app.use(ElementPlus);     // ✅ 启用 Element Plus

app.mount('#app'); // 挂载应用

