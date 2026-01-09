<template>
  <div class="app-root">
    <h1 class="main-title">大唐统计局</h1>
    <NavBar :navItems="navItems" basePath="/" />

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">数据加载中，请稍候...</div>
    </div>

    <router-view v-if="!loading"></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";
import { loadChartData } from "@/config/dataLoader.js";
import { WHNewHouseCharts } from "@/config/chartMetaWH.js";
import { CityGDPCharts } from "@/config/chartMetaCity.js";
import { ProvincialGDPCharts } from "@/config/chartMetaProvince.js";
import { GDPCharts } from "@/config/chartMetaNation.js";
import { logger } from "./utils/Logger";

export default {
  name: "App",
  components: { NavBar },
  data() {
    return {
      loading: true,
      navItems: [
        { label: "武汉", path: "WH" },
        { label: "城市", path: "FirstTierCity" },
        { label: "省市", path: "MajorProvincial" },
        { label: "全国", path: "NationWide" }
      ]
    };
  },
  async mounted() {
    try {
      const configs = [
        { source: WHNewHouseCharts.source, name: "武汉数据" },
        { source: CityGDPCharts.source, name: "城市数据" },
        { source: ProvincialGDPCharts.source, name: "省市数据" },
        { source: GDPCharts.source, name: "全国数据" }
      ];

      const currentPath = window.location.pathname || "/WH";
      const currentConfig = configs.find(config =>
        currentPath.includes("WH") ? config.name === "武汉数据" :
        currentPath.includes("FirstTierCity") ? config.name === "城市数据" :
        currentPath.includes("MajorProvincial") ? config.name === "省市数据" :
        currentPath.includes("NationWide") ? config.name === "全国数据" :
        config.name === "武汉数据"
      );

      if (currentConfig) await loadChartData(currentConfig.source);

      setTimeout(async () => {
        const otherConfigs = configs.filter(config => config !== currentConfig);
        for (const config of otherConfigs) {
          try {
            await loadChartData(config.source);
          } catch (e) {
            logger.warn(`延迟预加载失败: ${config.name}`, e);
          }
        }
      }, 2000);

      this.loading = false;
    } catch (e) {
      logger.error("预加载失败", e);
      this.loading = false;
    }
  }
};
</script>

<style>
/* ----------------- 全局重置 ----------------- */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* ----------------- 全局背景 ----------------- */
.app-root {
  min-height: 100vh;        
  padding-bottom: 30px; /* 页面底部留白 */
  background-color: #f5f7fa; 
}

/* ----------------- 标题 ----------------- */
.main-title {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 16px 0;
  font-size: 24px;
  font-weight: bold;
}

/* ----------------- 页面容器 ----------------- */
.page-wrapper {
  padding-top: 20px;
  padding-bottom: 60px; /* 页面内容到底部留白 */
}

/* ----------------- loading ----------------- */
.loading-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(255,255,255,0.9);
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
@keyframes spin { to { transform: rotate(360deg); } }
</style>