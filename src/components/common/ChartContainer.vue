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

      <!-- 偏移控件：只在折线图模式下显示 -->
      <div v-if="currentChartType === 'line' && !isHorizontal" class="offset-controls">
        <el-select v-model="selectedLegend" placeholder="选择图例" class="legend-selector">
          <el-option v-for="legend in legendList" :key="legend" :label="legend" :value="legend" />
        </el-select>

        <div class="control-group">
          <label>偏移：</label>
          <input type="range" min="-10" max="10" step="1" v-model="offsetValue" @input="applyOffset" />
          <span class="offset-value">{{ offsetValue }}</span>
        </div>
      </div>

    </div>

    <div class="chart-card">
      <ChartView ref="chartRef" :option="chartOption" :chartId="chart.id" :initSelectAll="legendAllSelected"
        @legendStateChange="legendAllSelected = $event" />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
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
    // 新增状态
    const selectedLegend = ref(null)
    const offsetValue = ref(0)
    const legendNames = ref([])

    // 格式化滑块提示
    const formatTooltip = (value) => {
      if (props.viewMode === 'yearly') {
        return `近 ${value} 年`;
      } else {
        return `近 ${value} 月`;
      }
    };
   // 必须这么写，不然在上面使用legendNames取不到数据，使用legendNames.value写法又报错
    const legendList = computed(() => legendNames.value)

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
        isHorizontal: isHorizontal.value,
        enableBirthOffset: props.chart.enableBirthOffset || false,
        enableBirthPrediction: props.chart.enableBirthPrediction || false,
        selectedLegend: selectedLegend.value,
        offsetValue: offsetValue.value
      };

      const option = getCommonChartOption(chartConfig);

      return option;
    });


    // 监听 legendNames，初始化选中第一个
    // ✅ 在 watch 里同步 legend，不会报 eslint 错
    // watch returnData 或 chartOption 更新 legendNames
    watch(chartOption, async (newOption) => {

      legendNames.value = newOption?.legend?.data || []
      // 默认选中第一个 legend
      if (!selectedLegend.value && legendNames.value.length > 0) {
        selectedLegend.value = legendNames.value[0]
      }

      logger.debug('当前的legendNames和selectedLegend', legendNames.value, selectedLegend.value)
    }, { immediate: true })

    // 切换图表类型
    const setChartType = (type, horizontal) => {
      currentChartType.value = type;
      isHorizontal.value = horizontal;
    };

    // 一键全选/未选
    const toggleAllLegends = () => {
      logger.debug('一键全选:', legendAllSelected.value);
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
      chartRef,
      selectedLegend,
      offsetValue,
      legendList
    };
  }
};
</script>

<style scoped>
/* 保持原有样式不变 */
.chart-container {
  width: 95%;
  max-width: 1500px;
  margin: 30px auto 60px;
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

/* 新增偏移控制样式 */
.offset-controls {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 16px;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
}

.legend-selector {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.offset-slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.offset-label {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.offset-value {
  flex-shrink: 0;
  min-width: 100px;
  font-size: 14px;
  color: #606266;
}

/* 调整滑块样式 */
::v-deep(.el-slider) {
  flex-grow: 1;
  max-width: 300px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .offset-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .offset-slider-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .offset-label,
  .offset-value {
    text-align: center;
  }
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
  color: #fff;
  background-color: #ccc;
  border-radius: 8px;
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
  font-size: 13px;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
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
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.chart-button.is-active {
  background-color: #0bc2d6;
}

.chart-card {
  width: 95%;
  height: 700px;
  margin: 0 auto;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .chart-card {
    height: 500px;
    /* 手机上高度缩小 */
  }
}

.chart-wrapper {
  width: 100%;
  height: 100%;

}
</style>