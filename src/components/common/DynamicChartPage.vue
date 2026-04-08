<template>
  <template v-if="returnData && currentConfig && hasCharts">
    <DataIntegrityPanel
      v-if="showIntegrityPanel"
      :chartMetaList="currentConfig.charts"
      :returnData="returnData"
      :config="currentConfig.source"
    />
    <DataStatusPanel
      :chartMetaList="currentConfig.charts"
      :returnData="returnData"
    />
    <ChartPage
      :chartMetaList="currentConfig.charts"
      :returnData="returnData"
      :config="currentConfig.source"
      :pageMeta="currentConfig.page"
      :showToggles="true"
    />
  </template>
  <div v-else-if="loading" class="loading-overlay">
    <div class="spinner"></div>
    <div class="loading-text">数据加载中，请稍候...</div>
  </div>
  <div v-else class="page-state">
    <div v-if="stateMeta.title" class="page-state-eyebrow">{{ stateMeta.title }}</div>
    <div class="page-state-title">{{ errorMessage ? '页面加载失败' : '页面配置缺失' }}</div>
    <div class="page-state-text">{{ stateMeta.message }}</div>
    <div v-if="stateMeta.description" class="page-state-description">{{ stateMeta.description }}</div>
    <button v-if="errorMessage" class="page-state-action" type="button" @click="reloadPage">重新加载</button>
  </div>
</template>

<script setup>
import { computed, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import ChartPage from '@/components/common/ChartPage.vue';
import DataIntegrityPanel from '@/components/common/components/DataIntegrityPanel.vue';
import DataStatusPanel from '@/components/common/components/DataStatusPanel.vue';
import { loadChartData } from '@/config/dataLoader.js';
import { getRouteChartKey, resolveChartConfig } from '@/config/chartRegistry.js';
import { normalizePageConfig } from '@/config/pageConfig.js';
import { logger } from '@/utils/Logger.js';
import { getCurrentDataSourceMode } from '@/config/dataSource.js';

const route = useRoute();
const currentConfig = shallowRef(null);
const returnData = shallowRef(null);
const loading = shallowRef(false);
const errorMessage = shallowRef('');
let requestId = 0;
const showIntegrityPanel = computed(() => process.env.NODE_ENV !== 'production' || getCurrentDataSourceMode() === 'local');
const hasCharts = computed(() => Array.isArray(currentConfig.value?.charts) && currentConfig.value.charts.length > 0);
const fallbackPageMeta = computed(() => normalizePageConfig({}, {
  routeKey: getRouteChartKey(route.path),
  routePath: route.path
}).page);
const stateMeta = computed(() => {
  const page = currentConfig.value?.page || fallbackPageMeta.value;
  return {
    title: page?.breadcrumb?.length ? page.breadcrumb.join('/') : page?.title || '',
    description: page?.description || '',
    message: errorMessage.value || (currentConfig.value && !hasCharts.value
      ? '当前 JSON 暂未提供这个页面可用的图表数据。'
      : '当前路由未匹配到图表配置，请检查注册表或导航配置。')
  };
});

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
    const resolvedConfig = await resolveChartConfig(pathKey, route.path);

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

.page-state-eyebrow {
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
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

.page-state-description {
  max-width: 720px;
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-muted);
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

  .page-state-description {
    font-size: 12px;
    max-width: none;
  }
}

</style>
