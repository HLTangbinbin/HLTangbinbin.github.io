<template>
  <div class="chart-container">
    <div class="controls-wrap">
      <div class="controls-row">
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

        <button class="toggle-legend-btn" :style="{ backgroundColor: legendAllSelected ? '#0bc2d6' : '#ccc' }"
          @click="toggleAllLegends">
          {{ legendAllSelected ? '一键未选' : '一键全选' }}
        </button>

        <div class="time-control">
          <label class="year-label">选择时间:</label>
          <el-slider v-model="yearLimit" :min="1" :max="30" :step="1" class="year-slider" />
          <span class="offset-value">{{ yearLimit }}</span>
        </div>
      </div>

      <div v-if="showOffsetControls" class="line-mode-controls">
        <div class="legend-control">
          <el-select v-model="selectedLegend" placeholder="选择图例" class="legend-selector">
            <el-option v-for="legend in legendList" :key="legend" :label="legend" :value="legend" />
          </el-select>
        </div>

        <div class="offset-controls">
          <label class="year-label">折线偏移:</label>
          <div class="offset-slider-container">
            <el-slider v-model="offsetValue" :min="-30" :max="30" :step="1" class="year-slider" />
            <span class="offset-value">{{ offsetValue }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card" :style="{ height: chartHeight + 'px' }">
      <ChartView ref="chartRef" :option="chartOption" :chartId="chart.id" :initSelectAll="legendAllSelected"
        :pieConfig="chart.pieConfig" @legendStateChange="legendAllSelected = $event" />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import ChartView from './ChartView.vue';
import { getCommonChartOption } from '@/utils/CommonUtil.js';

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
    const selectedLegend = ref(null);
    const offsetValue = ref(0);
    const legendNames = ref([]);

    // 🌟 修复窗口宽度不更新的问题
    const windowWidth = ref(window.innerWidth);
    const onResize = () => { windowWidth.value = window.innerWidth; };
    onMounted(() => window.addEventListener('resize', onResize));
    onBeforeUnmount(() => window.removeEventListener('resize', onResize));

    // 动态计算高度
    const baseHeight = computed(() => (windowWidth.value > 768 ? 600 : 400));
    const pieExtraHeight = computed(() => (props.chart.pieConfig?.enabled ? (windowWidth.value > 768 ? 150 : 100) : 0));
    const chartHeight = computed(() => baseHeight.value + pieExtraHeight.value);

    const legendList = computed(() => legendNames.value);

    const chartOption = computed(() => {
      return getCommonChartOption({
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
        offsetValue: offsetValue.value,
        pieConfig: props.chart.pieConfig,
      });
    });

    watch(chartOption, (newOption) => {
      legendNames.value = newOption?.legend?.data || [];
      if (!selectedLegend.value && legendNames.value.length > 0) {
        selectedLegend.value = legendNames.value[0];
      }
    }, { immediate: true });

    const setChartType = (type, horizontal) => {
      currentChartType.value = type;
      isHorizontal.value = horizontal;
    };

    const toggleAllLegends = () => {
      legendAllSelected.value = !legendAllSelected.value;
      if (chartRef.value) {
        chartRef.value.toggleAllLegends(legendAllSelected.value);
      }
    };

    const showOffsetControls = computed(() => {
      const isCityMode = props.config.cityCodeArr && props.config.cityCodeArr.length > 0;
      return currentChartType.value === 'line' && !isHorizontal.value && !isCityMode;
    });

    return {
      currentChartType,
      isHorizontal,
      yearLimit,
      legendAllSelected,
      chartRef,
      selectedLegend,
      offsetValue,
      legendNames,
      windowWidth,
      chartHeight,
      legendList,
      chartOption,
      setChartType,
      toggleAllLegends,
      showOffsetControls
    };
  }
};
</script>

<style scoped>
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

.controls-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.chart-controls {
  display: flex;
  gap: 12px;
}

.time-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.offset-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.line-mode-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  width: 100%;
}

.year-label {
  font-weight: 400;
  flex-shrink: 0;
  padding: 8px 14px;
  font-size: 18px;
  border-radius: 8px;
}

.year-slider {
  min-width: 150px;
  max-width: 250px;
}

.toggle-legend-btn {
  flex-shrink: 0;
  padding: 8px 14px;
  font-size: 14px;
  color: #fff;
  background-color: #0bc2d6;
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
  padding: 8px 14px;
  font-size: 14px;
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
  margin: 0 auto;
  margin-top: 20px;
}

.legend-selector {
  width: 100%;
  min-width: 250px;
  max-width: 350px;
}

.offset-slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.offset-value {
  flex-shrink: 0;
  min-width: 30px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: row;
    gap: 6px;
    margin-top: 8px;
  }

  .chart-controls {
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 0;
  }

  .toggle-legend-btn {
    margin: 0;
    padding: 6px 10px;
    font-size: 12px;
  }

  .time-control {
    width: 100%;
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 8px;
  }

  .time-control .year-label {
    padding: 4px 4px;
    font-size: 13px;
  }

  .time-control .year-slider {
    min-width: 100px;
    max-width: 150px;
    flex-grow: 1;
  }

  .legend-selector {
    max-width: 120px;
    min-width: auto;
  }

  .line-mode-controls {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 8px;
    margin-top: 8px;
    padding: 6px;
    border-radius: 8px;
  }

  .legend-control {
    flex: 1;
    min-width: 50px;
    max-width: 34%;
    margin-right: 8px;
  }

  .offset-controls {
    flex: 1;
    min-width: 150px;
    max-width: 80%;
    display: flex;
    flex-wrap: nowrap;
    gap: 6px;
  }

  .offset-slider-container {
    gap: 4px;
    flex-grow: 1;
  }

  .offset-controls .year-slider {
    min-width: 120px;
    max-width: 200px;
  }

  .year-label {
    padding: 4px 8px;
    font-size: 13px;
    white-space: nowrap;
  }

  .chart-button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .offset-value {
    font-size: 12px;
    min-width: 25px;
  }
}

<<<<<<< HEAD
/* 滑块样式覆盖 (使用 Vue3 推荐的 :deep 语法) */
:deep(.el-slider__bar) {
=======
::v-deep(.el-slider__bar) {
>>>>>>> 1e4e24f (重构echart相关页面，优化性能)
  background-color: #0bc2d6 !important;
}

:deep(.el-slider__button) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
}

<<<<<<< HEAD
/* 选legend择框圆角 */
:deep(.legend-selector .el-select__wrapper) {
=======
::v-deep(.legend-selector .el-select__wrapper) {
>>>>>>> 1e4e24f (重构echart相关页面，优化性能)
  border-radius: 6px !important;
}

:deep(.legend-selector .el-select__tags) {
  border-radius: 6px !important;
}
</style>