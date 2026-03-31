<template>
  <template v-if="returnData && currentConfig">
    <DataStatusPanel
      :chartMetaList="currentConfig.charts"
      :returnData="returnData"
    />
    <ChartPage
      :chartMetaList="currentConfig.charts"
      :returnData="returnData"
      :config="currentConfig.source"
      :headerPath="headerPath"
      :showToggles="true"
    />
  </template>
  <div v-else-if="loading" class="loading-overlay">
    <div class="spinner"></div>
    <div class="loading-text">数据加载中，请稍候...</div>
  </div>
  <div v-else class="page-state">
    <div class="page-state-title">{{ errorMessage ? '页面加载失败' : '页面配置缺失' }}</div>
    <div class="page-state-text">{{ errorMessage || '当前路由未匹配到图表配置，请检查注册表或导航配置。' }}</div>
    <button v-if="errorMessage" class="page-state-action" type="button" @click="reloadPage">重新加载</button>
  </div>
</template>

<script setup>
import { computed, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import ChartPage from '@/components/common/ChartPage.vue';
import DataStatusPanel from '@/components/common/components/DataStatusPanel.vue';
import { loadChartData } from '@/config/dataLoader.js';
import { getRouteChartKey, resolveChartConfig } from '@/config/chartRegistry.js';
import { navConfig } from '@/config/navConfig.js';
import { logger } from '@/utils/Logger.js';

const route = useRoute();
const currentConfig = shallowRef(null);
const returnData = shallowRef(null);
const loading = shallowRef(false);
const errorMessage = shallowRef('');
let requestId = 0;
const headerPath = computed(() => resolveRouteLabels(route.path));

watch(() => route.path, async () => {
  await initializePage();
}, { immediate: true });

async function initializePage() {
  const currentRequestId = ++requestId;
  const pathKey = getRouteChartKey(route.path);

  loading.value = true;
  errorMessage.value = '';
  currentConfig.value = null;
  returnData.value = null;

  try {
    const resolvedConfig = await resolveChartConfig(pathKey);

    if (currentRequestId !== requestId) return;

    if (!resolvedConfig) {
      errorMessage.value = `未找到 [${pathKey}] 对应的图表配置。`;
      logger.warn(errorMessage.value);
      return;
    }

    currentConfig.value = resolvedConfig;
    returnData.value = await loadChartData(resolvedConfig.source);
  } catch (error) {
    if (currentRequestId !== requestId) return;

    errorMessage.value = `页面初始化失败: ${error.message || '未知错误'}`;
    logger.error(`[${pathKey}] 加载数据失败`, error);
  } finally {
    if (currentRequestId === requestId) {
      loading.value = false;
    }
  }
}

function reloadPage() {
  initializePage();
}

function resolveRouteLabels(path) {
  for (const level1 of navConfig) {
    const level1Path = normalizePath(level1.path);
    if (!path.startsWith(level1Path)) continue;

    const level1Labels = [level1.label];
    const level2Children = Array.isArray(level1.children) ? level1.children : [];

    for (const level2 of level2Children) {
      const level2Path = normalizePath(`${level1Path}/${level2.path}`);
      if (!path.startsWith(level2Path)) continue;

      const level2Labels = [...level1Labels, level2.label];
      const level3Children = Array.isArray(level2.children) ? level2.children : [];

      for (const level3 of level3Children) {
        const level3Path = normalizePath(`${level2Path}/${level3.path}`);
        if (path.startsWith(level3Path)) {
          return [...level2Labels, level3.label];
        }
      }

      return level2Labels;
    }

    return level1Labels;
  }

  return [];
}

function normalizePath(value) {
  return String(value || '').replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}
</script>

<style scoped>
.page-state {
  width: 98%;
  max-width: 1500px;
  min-height: 520px;
  margin: 10px auto 20px;
  padding: 36px 32px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
}

.page-state-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.page-state-text {
  max-width: 720px;
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-secondary);
}

.page-state-action {
  margin-top: 18px;
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--color-accent);
  background: var(--color-accent-fill);
  color: var(--color-accent-contrast);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.page-state-action:hover {
  background: var(--color-accent-soft);
}

@media (max-width: 768px) {
  .page-state {
    width: 98%;
    min-height: 360px;
    margin: 10px auto 16px;
    padding: 28px 18px;
    border-radius: 12px;
  }

  .page-state-title {
    font-size: 18px;
  }

  .page-state-text {
    font-size: 13px;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .mock-panel {
    width: 96%;
    top: 8px;
    padding: 10px 12px;
    border-radius: 12px;
  }
}
</style>
