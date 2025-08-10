<template>
  <div>
    <div>
      <h1 class="main-title">大唐统计局</h1>
    </div>
    <div class="nav-wrapper">
      <nav class="nav-container">
        <router-link
          to="/WH"
          class="nav"
          :class="{ active: $route.path.startsWith('/WH') }"
          >武汉</router-link
        >
        <router-link
          to="/FirstTierCity"
          class="nav"
          :class="{ active: $route.path.startsWith('/FirstTierCity') }"
          >城市</router-link
        >
        <router-link
          to="/MajorProvincial"
          class="nav"
          :class="{ active: $route.path.startsWith('/MajorProvincial') }"
          >省市</router-link
        >
        <router-link
          to="/NationWide"
          class="nav"
          :class="{ active: $route.path.startsWith('/NationWide') }"
          >全国</router-link
        >
      </nav>
    </div>

    <!-- 全局 loading 遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">数据加载中，请稍候...</div>
    </div>

    <router-view v-if="!loading"></router-view>
  </div>
</template>

<script>
import { loadChartData } from "@/config/dataLoader.js";
import { WHGDPCharts } from "@/config/chartMetaWH.js";
import { CityGDPCharts } from "@/config/chartMetaCity.js";
import { ProvincialGDPCharts } from "@/config/chartMetaProvince.js";
import { GDPCharts } from "@/config/chartMetaNation.js";
import { logger } from "./utils/Logger";

export default {
  name: "App",
  data() {
    return {
      loading: true,
    };
  },
  async mounted() {
    try {
      await Promise.all([
        loadChartData(WHGDPCharts.source),
        loadChartData(CityGDPCharts.source),
        loadChartData(ProvincialGDPCharts.source),
        loadChartData(GDPCharts.source),
      ]);
      // 预加载成功，关闭 loading
      this.loading = false;
      logger.info("json 预加载成功");
    } catch (e) {
      logger.info("json 预加载失败", e);
      // 出错也关闭 loading，避免卡死
      this.loading = false;
    }
  },
};
</script>

<style>
.main-title {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #fff;
}

.nav-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  white-space: nowrap;
  width: 100%;
  padding: 12px 0 16px;
  box-sizing: border-box;
  background-color: #fff;
  text-align: center;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.nav-wrapper::-webkit-scrollbar {
  display: none;
}

.nav-container {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border-radius: 999px;
  padding: 10px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 -4px 12px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.nav {
  text-decoration: none;
  color: #000;
  padding: 10px 20px;
  margin: 0 10px;
  font-weight: bold;
  border-radius: 20px;
  transition: background-color 0.3s, color 0.3s;
}

.nav.active {
  color: #fff !important;
  background-color: #0bc2d6 !important;
}

/* loading 遮罩样式 */
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