<template>
  <div class="chart-container">
    <ChartToolbar @toggleAllLegends="handleToggleAllLegends" @exportCurrentView="handleExportCurrentView" />

    <CityDrawer />

    <SmartNarrativePanel />

    <div class="chart-card" :style="{ height: chartStore.chartHeight.value + 'px' }">
      <ChartView
        v-if="chartStore.viewModeDisplay.value === 'chart' || chartStore.viewModeDisplay.value === 'map'"
        ref="echartsInstanceRef"
        :option="chartStore.chartOption.value"
        :chartId="chart.id"
        :themeMode="chartStore.themeMode.value"
        :initSelectAll="chartStore.legendAllSelected.value"
        :pieConfig="chartStore.isYearlyCompare.value ? null : chart.pieConfig"
        @legendStateChange="chartStore.legendAllSelected.value = $event"
        @legendSelectionChange="chartStore.legendSelectionMap.value = $event"
        @dataPointClick="handleDataPointClick"
      />

      <DataTableView v-else-if="chartStore.viewModeDisplay.value === 'table'" />
    </div>
  </div>
</template>

<script setup>
import { provide, ref, defineEmits, defineProps, defineAsyncComponent } from 'vue';
import { ElMessage } from 'element-plus';
import { createChartStore } from './store/useChartStore.js';
import ChartView from './ChartView.vue'; // 用户底层的 ECharts 包装器

const ChartToolbar = defineAsyncComponent(() => import('./components/ChartToolbar.vue'));
const CityDrawer = defineAsyncComponent(() => import('./components/CityDrawer.vue'));
const SmartNarrativePanel = defineAsyncComponent(() => import('./components/SmartNarrativePanel.vue'));
const DataTableView = defineAsyncComponent(() => import('./components/DataTableView.vue'));

const props = defineProps({
  chart: { type: Object, required: true },
  returnData: { type: Object, required: true, default: () => ({}) },
  config: { type: Object, default: () => ({}) },
  viewMode: { type: String, default: 'monthly' },
  linkedSelection: { type: Object, default: () => null }
});
const emit = defineEmits(['linkSelect']);

// 初始化当前图表实例的唯一真理之源
const chartStore = createChartStore(props);

// 将 Store 注入到当前组件树，所有后代组件无条件享用
provide('chartStore', chartStore);

// 获取 ECharts 组件实例，用于触发内部方法
const echartsInstanceRef = ref(null);
const handleToggleAllLegends = () => {
  const nextSelected = !chartStore.legendAllSelected.value;
  chartStore.legendAllSelected.value = nextSelected;
  chartStore.legendSelectionMap.value = chartStore.legendList.value.reduce((acc, name) => {
    acc[name] = nextSelected;
    return acc;
  }, {});
  if (echartsInstanceRef.value) {
    echartsInstanceRef.value.toggleAllLegends(nextSelected);
  }
};

const sanitizeFileName = (value) => String(value || '图表导出').replace(/[\\/:*?"<>|]/g, '_');

const downloadDataUrl = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
};

const handleExportCurrentView = () => {
  if (chartStore.viewModeDisplay.value === 'table') {
    chartStore.exportToCSV();
    return;
  }

  if (!echartsInstanceRef.value?.exportImage) {
    ElMessage.warning('当前图表暂不支持截图导出');
    return;
  }

  const dataUrl = echartsInstanceRef.value.exportImage();
  if (!dataUrl) {
    ElMessage.warning('当前图表暂不支持截图导出');
    return;
  }

  const filename = `${sanitizeFileName(props.chart?.title)}_${new Date().toISOString().slice(0, 10)}.png`;
  downloadDataUrl(dataUrl, filename);
  ElMessage.success('图表截图导出成功！');
};

const handleDataPointClick = (payload) => {
  emit('linkSelect', {
    ...payload,
    chartId: props.chart?.id,
    chartTitle: props.chart?.title || '当前图表'
  });
};
</script>

<style scoped>
/* 最外层大卡片：控制白底、阴影、圆角和图表之间的间距 */
.chart-container {
    width: 98%;
    max-width: 1500px;
    margin: 14px auto 20px;
    padding: 14px 10px 10px;
    background-color: var(--bg-card);
    border-radius: 16px;
    border: 1px solid var(--border-default);
    box-shadow: var(--shadow-soft);
    box-sizing: border-box;
}

/* 内部图表包装器：控制层级 */
.chart-card {
    width: 100%;
    position: relative;
    z-index: 0 !important;
    overflow: hidden;
    margin-top: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .chart-container {
        padding: 10px 8px;
        margin: 10px auto 16px;
        border-radius: 12px;
    }
}
</style>
