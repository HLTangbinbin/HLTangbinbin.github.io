<!-- ChartContainer.vue -->
<template>
  <div class="chart-container">

    <div class="controls-wrap">
      <div class="chart-controls">
        <button :class="['chart-button', { 'is-active': currentChartType === 'bar' && !isHorizontal }]"
          @click="setChartType('bar', false)">
          柱状图
        </button>
        <button :class="['chart-button', { 'is-active': currentChartType === 'bar' && isHorizontal }]"
          @click="setChartType('bar', true)">
          条形图
        </button>
        <button :class="['chart-button', { 'is-active': currentChartType === 'line' && !isHorizontal }]"
          @click="setChartType('line', false)">
          折线图
        </button>
      </div>

      <div class="time-legend-row">
        <label class="year-label">滑动时间</label>
        <el-slider v-model="yearLimit" :min="1" :max="20" :step="1" show-tooltip :format-tooltip="formatTooltip"
          class="year-slider" />
        <button class="toggle-legend-btn" :style="{ backgroundColor: legendAllSelected ? '#0bc2d6' : '#ccc' }"
          @click="toggleAllLegends">
          {{ legendAllSelected ? '一键未选' : '一键全选' }}
        </button>

      </div>
    </div>

    <div class="chart-card">
      <ChartView
      ref="chartRef"
      :option="chartOption"
      :initSelectAll="legendAllSelected"
      @legendStateChange="legendAllSelected = $event" 
    />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import ChartView from './ChartView.vue';
import { getCommonChartOption } from '@/utils/CommonUtil.js';
import { logger } from '@/utils/Logger.js';

export default {
  name: 'ChartContainer',
  components: { ChartView },
  props: {
    chart: { type: Object, required: true },
    returnData: { type: Object, required: true, default: () => ({}) },
    config: { type: Object, default: () => ({}) },
    viewMode: { type: String, default: 'monthly' }
  },
  setup(props) {
    const currentChartType = ref('bar');
    const isHorizontal = ref(false);
    const yearLimit = ref(10);
    const legendAllSelected = ref(true);
    const chartRef = ref(null);
    // 格式化滑块提示
    const formatTooltip = (value) => {
      if (props.viewMode === 'yearly') {
        return `近 ${value} 年`;
      } else {
        return `近 ${value} 月`;
      }
    };

    const chartOption = computed(() => {
      const chartConfig = {
        data: props.returnData,
        title: props.chart.title || '默认标题',
        subtitle: props.chart.subtitle || '',
        zbcodeArr: props.chart.zbcodeArr || [],
        cityCodeArr: props.config.cityCodeArr || [],
        dbCode: props.chart.dbCode || 'nd',
        unit: props.chart.unit || '',
        exceptName: props.chart.exceptName || '',
        legendTop: props.chart.legendTop,
        gridTop: props.chart.gridTop,
        chartType: currentChartType.value,
        yearLimit: yearLimit.value,
        isHorizontal: isHorizontal.value
      };
      logger.debug('调用 getCommonChartOption 的参数:', chartConfig);
      return getCommonChartOption(chartConfig);
    });

    // 切换图表类型
    const setChartType = (type, horizontal) => {
      currentChartType.value = type;
      isHorizontal.value = horizontal;
    };

    // 一键全选/未选
    const toggleAllLegends = () => {
      legendAllSelected.value = !legendAllSelected.value;
      if (chartRef.value) {
        chartRef.value.toggleAllLegends(legendAllSelected.value);
      }
    };

    return {
      currentChartType,
      isHorizontal,
      yearLimit,
      legendAllSelected,
      chartOption,
      setChartType,
      toggleAllLegends,
      formatTooltip,
      chartRef
    };
  }
};
</script>

<style scoped>
/* 保持原有样式不变 */
.chart-container {
  width: 100%;
  max-width: 1500px;
  margin: 50px auto 60px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.controls-wrap {
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin: 0 auto;

}

.chart-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

.time-legend-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 16px;
}

.year-label {
  flex-shrink: 0;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.year-slider {
  min-width: 120px;
  max-width: 200px;
}

::v-deep(.year-slider .el-slider__bar) {
  background-color: #0bc2d6 !important;
}

::v-deep(.year-slider .el-slider__button) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
}

.toggle-legend-btn {
  flex-shrink: 0;
  padding: 6px 12px;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  height: auto;
}

.toggle-legend-btn:active {
  transform: scale(0.98);
}

.chart-button {
  padding: 6px 12px;
  margin: 10px;
  font-size: 13px;
  color: #fff;
  background-color: #ccc;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.chart-button.is-active {
  background-color: #0bc2d6;
}

.chart-card {
  width: 95%;
  height: 600px;
  margin: 0 auto;
  margin-top: 20px;
}

.chart-wrapper {
  width: 100%;
  height: 100%;

}
</style>