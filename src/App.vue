<template>
  <div class="app-root">
    <h1 class="main-title">大唐统计局</h1>
    
    <NavBar :navConfig="navConfig" />

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
import { registerAllMaps } from '@/utils/mapProvider.js';

export default {
  name: "App",
  components: { NavBar },
  data() {
    return {
      loading: true,
      navConfig 
    };
  },
  async mounted() {
    // 等待地图物料从网络下载并注册完毕
    await registerAllMaps();

    // 地图准备就绪后，关闭全屏Loading并放行渲染
    setTimeout(() => {
      this.loading = false;
    }, 300);
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
/* 禁止文字选中 */
body, html, #app {
  user-select: none;       /* 标准 */
  -webkit-user-select: none; /* Safari/Chrome */
  -moz-user-select: none;  /* Firefox */
  -ms-user-select: none;   /* IE/Edge */
}

/* 禁止右键菜单（可选） */
body, html, #app {
  -webkit-touch-callout: none; /* iOS Safari */
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