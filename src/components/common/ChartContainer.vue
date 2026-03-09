<template>
  <div class="chart-container">
    <div class="bi-toolbar">

      <div class="toolbar-group">
        <div class="group-label"><i class="el-icon-data-analysis"></i> 视图</div>
        <el-radio-group v-model="chartTypeModel" size="medium" class="chart-type-radio">
          <el-radio-button label="bar">柱状图</el-radio-button>
          <el-radio-button label="hbar">条形图</el-radio-button>
          <el-radio-button label="line">折线图</el-radio-button>
        </el-radio-group>
        <el-button size="medium" :type="legendAllSelected ? 'primary' : 'default'" :plain="!legendAllSelected"
          @click="toggleAllLegends">
          {{ legendAllSelected ? '一键未选' : '一键全选' }}
        </el-button>
      </div>

      <div class="toolbar-group">
        <div class="group-label"><i class="el-icon-time"></i> 维度</div>

        <el-switch v-if="showCompareToggle" v-model="isYearlyCompare" active-text="同环比" inactive-text="连续"
          class="compare-switch" />

        <div class="slider-wrapper">
          <span class="ctrl-text">{{ isYearlyCompare ? '对比年数' : '时间跨度' }}</span>
          <el-slider v-model="yearLimit" :min="1" :max="30" :step="1" class="flex-slider" />
          <span class="ctrl-val">{{ yearLimit }}{{ isYearlyCompare ? '年' : '' }}</span>
        </div>
      </div>

      <div v-if="showLegendSelector || showOffsetControls" class="toolbar-group">
        <div class="group-label"><i class="el-icon-set-up"></i> {{ showOffsetControls ? '高级' : '目标' }}</div>

        <el-select v-if="showLegendSelector" v-model="selectedLegend" size="medium" placeholder="切换指标"
          class="legend-select">
          <el-option v-for="legend in legendList" :key="legend" :label="legend" :value="legend" />
        </el-select>

        <div v-if="showOffsetControls" class="slider-wrapper offset-slider">
          <span class="ctrl-text">偏移量</span>
          <el-slider v-model="offsetValue" :min="-30" :max="30" :step="1" class="flex-slider" />
          <span class="ctrl-val" :class="{ 'is-positive': offsetValue > 0, 'is-negative': offsetValue < 0 }">
            {{ offsetValue > 0 ? '+' : '' }}{{ offsetValue }}
          </span>
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
    config: { type: Object, default: () => ({}) }
  },
  setup(props) {
    const currentChartType = ref('bar');
    const isHorizontal = ref(false);
    const yearLimit = ref(10);
    const legendAllSelected = ref(true);
    const chartRef = ref(null);

    const isYearlyCompare = ref(false);
    const selectedLegend = ref(null);
    const offsetValue = ref(0);
    const legendNames = ref([]);

    const chartTypeModel = computed({
      get() {
        if (currentChartType.value === 'bar') return isHorizontal.value ? 'hbar' : 'bar';
        return 'line';
      },
      set(val) {
        if (val === 'hbar') { currentChartType.value = 'bar'; isHorizontal.value = true; }
        else if (val === 'bar') { currentChartType.value = 'bar'; isHorizontal.value = false; }
        else { currentChartType.value = 'line'; isHorizontal.value = false; }
      }
    });

    const windowWidth = ref(window.innerWidth);
    const onResize = () => { windowWidth.value = window.innerWidth; };
    onMounted(() => window.addEventListener('resize', onResize));
    onBeforeUnmount(() => window.removeEventListener('resize', onResize));

    const baseHeight = computed(() => (windowWidth.value > 768 ? 600 : 400));
    const pieExtraHeight = computed(() => (props.chart.pieConfig?.enabled ? (windowWidth.value > 768 ? 150 : 100) : 0));
    const chartHeight = computed(() => baseHeight.value + pieExtraHeight.value);

    const legendList = computed(() => legendNames.value);

    // 🌟 核心判断：图表是否真的是月度数据！
    const isMonthlyChart = computed(() => props.chart.dbCode === 'yd');

    // 切到年度数据等其他情况时，强制关闭同环比
    watch(isMonthlyChart, (isMonthly) => {
      if (!isMonthly) isYearlyCompare.value = false;
    }, { immediate: true });

    const chartOption = computed(() => {
      // 🌟 修复 1：同环比模式下，去底层请求数据时，固定给 360 个月（30年）以防止切断。不要随滑块联动！
      const actualDataLimit = (isYearlyCompare.value && isMonthlyChart.value) ? 360 : yearLimit.value;

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
        yearLimit: actualDataLimit,       // 控制截取底层原始数据的条数
        compareYearCount: yearLimit.value,// 控制同环比模式下画几条线
        isHorizontal: isHorizontal.value,
        isYearlyCompare: isMonthlyChart.value ? isYearlyCompare.value : false,
        selectedLegend: selectedLegend.value,
        offsetValue: offsetValue.value,
        pieConfig: props.chart.pieConfig,
        enableBirthOffset: props.chart.enableBirthOffset || false,
        enableBirthPrediction: props.chart.enableBirthPrediction || false,
      });
    });

    watch(chartOption, (newOption) => {
      // 🌟 修复 3：强行读取底层传出来的 originalLegendData (原始指标名)，保证下拉框永远正确！
      legendNames.value = newOption?.originalLegendData || newOption?.legend?.data || [];
      // 如果当前选中的不在列表里，重置为第一个
      if (!legendNames.value.includes(selectedLegend.value) && legendNames.value.length > 0) {
        selectedLegend.value = legendNames.value[0];
      }
    }, { immediate: true });

    watch(isYearlyCompare, (isCompare) => {
      if (isCompare) offsetValue.value = 0;
    });

    const toggleAllLegends = () => {
      legendAllSelected.value = !legendAllSelected.value;
      if (chartRef.value) chartRef.value.toggleAllLegends(legendAllSelected.value);
    };

    // 🌟 修复 2：绝对精准识别月度折线图才显示同环比开关
    const showCompareToggle = computed(() => {
      return isMonthlyChart.value && currentChartType.value === 'line' && !isHorizontal.value;
    });

    const showLegendSelector = computed(() => {
      if (legendList.value.length <= 1) return false;
      return isYearlyCompare.value || showOffsetControls.value;
    });

    const showOffsetControls = computed(() => {
      return props.chart.enableOffset === true &&
        currentChartType.value === 'line' &&
        !isHorizontal.value &&
        !isYearlyCompare.value;
    });

    return {
      chartTypeModel, currentChartType, isHorizontal, yearLimit, legendAllSelected,
      chartRef, selectedLegend, offsetValue, legendNames, windowWidth, chartHeight,
      legendList, chartOption, isYearlyCompare, showCompareToggle, showLegendSelector,
      showOffsetControls, toggleAllLegends
    };
  }
};
</script>

<style scoped>
.chart-container {
  width: 95%;
  max-width: 1500px;
  margin: 30px auto 60px;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}

/* 🌟 整体工具栏居中对齐 */
.bi-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* 整体居中，两边留白更协调 */
  gap: 16px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

/* 模块容器紧贴内容，不再强行拉伸 */
.toolbar-group {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  gap: 16px;
  flex: 0 0 auto;
  /* 禁止拉伸和挤压 */
  white-space: nowrap;
  /* 强制组内元素不换行 */
}

.group-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  padding-right: 12px;
  border-right: 1px solid #e2e8f0;
}

.chart-type-radio {
  flex-shrink: 0;
}

.compare-switch {
  --el-switch-on-color: #0bc2d6;
  margin-right: 4px;
}

/* 🌟 强制 switch 文本不换行，解决挤压变形问题 */
:deep(.compare-switch .el-switch__label) {
  white-space: nowrap !important;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 220px;
  /* 保证滑块区域有足够的基础宽度 */
}

.offset-slider {
  margin-left: 8px;
}

.flex-slider {
  flex: 1;
  min-width: 100px;
}

.ctrl-text {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  white-space: nowrap;
}

.ctrl-val {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  min-width: 40px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.ctrl-val.is-positive {
  color: #ef4444;
}

.ctrl-val.is-negative {
  color: #22c55e;
}

/* 🌟 大幅缩小图例选择框的宽度 */
.legend-select {
  width: 110px;
  flex-shrink: 0;
}

.chart-card {
  width: 100%;
}

/* 移动端适配保持不变 */
@media (max-width: 768px) {
  .chart-container {
    padding: 16px;
    margin: 16px auto 40px;
  }

  .bi-toolbar {
    flex-direction: column;
    padding: 12px;
    gap: 12px;
    justify-content: flex-start;
  }

  .toolbar-group {
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 12px;
  }

  .group-label {
    border-right: none;
    padding-right: 0;
    width: 100%;
    margin-bottom: 6px;
  }

  .slider-wrapper {
    width: 100%;
    justify-content: space-between;
  }

  .offset-slider {
    margin-left: 0;
    margin-top: 8px;
  }

  .compare-switch {
    width: 100%;
    margin-bottom: 8px;
  }

  .legend-select {
    width: 100%;
    margin-bottom: 12px;
  }
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  box-shadow: -1px 0 0 0 #0bc2d6 !important;
}

:deep(.el-radio-button__inner:hover) {
  color: #0bc2d6 !important;
}

:deep(.el-slider__bar) {
  background-color: #0bc2d6 !important;
}

:deep(.el-slider__button) {
  border-color: #0bc2d6 !important;
  border-width: 2px !important;
}
</style>