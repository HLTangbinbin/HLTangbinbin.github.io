<template>
  <div class="chart-container">
    <ChartToolbar @toggleAllLegends="handleToggleAllLegends" />

    <CityDrawer />

    <SmartNarrativePanel />

    <div class="chart-card" :style="{ height: chartStore.chartHeight.value + 'px' }">
      <ChartView
        v-if="chartStore.viewModeDisplay.value === 'chart' || chartStore.viewModeDisplay.value === 'map'"
        ref="echartsInstanceRef"
        :option="chartStore.chartOption.value"
        :chartId="chart.id"
        :initSelectAll="chartStore.legendAllSelected.value"
        :pieConfig="chartStore.isYearlyCompare.value ? null : chart.pieConfig"
        @legendStateChange="chartStore.legendAllSelected.value = $event"
        @dataPointClick="handleDataPointClick"
      />

      <DataTableView v-else-if="chartStore.viewModeDisplay.value === 'table'" />
    </div>
  </div>
</template>

<script setup>
import { provide, ref, defineEmits, defineProps } from 'vue';
import { createChartStore } from './store/useChartStore.js';
import ChartToolbar from './components/ChartToolbar.vue';
import CityDrawer from './components/CityDrawer.vue';
import SmartNarrativePanel from './components/SmartNarrativePanel.vue';
import DataTableView from './components/DataTableView.vue';
import ChartView from './ChartView.vue'; // 用户底层的 ECharts 包装器

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
  chartStore.legendAllSelected.value = !chartStore.legendAllSelected.value;
  if (echartsInstanceRef.value) {
    echartsInstanceRef.value.toggleAllLegends(chartStore.legendAllSelected.value);
  }
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
    margin: 10px auto 20px;
    padding: 10px;
    background-color: #fff;
    border-radius: 16px;
    /* 核心修复：增加细微描边，强制勾勒出物理边界，拒绝与背景融合 */
    border: 1px solid #e2e8f0;
    /* 稍微收敛阴影的扩散范围并略微增加力度，让卡片悬浮得更扎实 */
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
}

/* 内部图表包装器：控制层级 */
.chart-card {
    width: 100%;
    position: relative;
    z-index: 0 !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .chart-container {
        padding: 10px;
        margin: 10px auto 16px;
        border-radius: 12px;
    }
}
</style>
