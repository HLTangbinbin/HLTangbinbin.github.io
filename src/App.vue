<template>
  <div class="app-root">
    <h1 class="main-title">大唐统计局</h1>
    <NavBar :navItems="navItems" basePath="/" />

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">系统初始化中...</div>
    </div>

    <router-view v-else></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";
import { navConfig } from "@/config/navConfig";
import { logger } from "@/utils/Logger";

export default {
  name: "App",
  components: { NavBar },
  data() {
    return {
      loading: true,
      // 直接从唯一的真理来源 navConfig 中提取顶层菜单，不用手写了！
      navItems: navConfig.map(item => ({ label: item.label, path: item.path.replace('/', '') }))
    };
  },
  mounted() {
    // 移除臃肿的硬编码预加载，首屏渲染立刻放行！
    // 具体的图表数据加载已经交给 DynamicChartPage 和 dataLoader 去处理了
    setTimeout(() => {
      this.loading = false;
      logger.debug("系统初始化完成");
    }, 300); // 给个极其短暂的动画缓冲，提升体验
  }
};
</script>

<style>
/* CSS 保持你原本的完全不变，无需修改这里的内容 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.app-root {
  min-height: 100vh;
  padding-bottom: 30px;
  background-color: #f5f7fa;
}

.main-title {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 16px 0;
  font-size: 24px;
  font-weight: bold;
}

.page-wrapper {
  padding-top: 20px;
  padding-bottom: 60px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 6px solid #0bc2d6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.loading-text {
  font-size: 18px;
  color: #0bc2d6;
  font-weight: bold;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>