<template>
  <div class="chart-container">
    <div class="bi-toolbar">

      <div class="toolbar-group view-group">
        <div class="group-label"><i class="el-icon-menu"></i> 操作</div>

        <el-radio-group v-model="chartTypeModel" :size="controlSize" class="chart-type-radio no-shrink">
          <el-radio-button label="bar">柱状</el-radio-button>
          <el-radio-button label="hbar">条形</el-radio-button>
          <el-radio-button label="line">折线</el-radio-button>
        </el-radio-group>

        <div v-if="showCompareToggle" class="split-line"></div>
        <el-radio-group v-if="showCompareToggle" v-model="isYearlyCompare" :size="controlSize" class="no-shrink">
          <el-radio-button :label="false">连续</el-radio-button>
          <el-radio-button :label="true">同比</el-radio-button>
        </el-radio-group>

        <div class="split-line"></div>

        <el-button :size="controlSize" class="no-shrink btn-toggle-all"
          :type="legendAllSelected ? 'primary' : 'default'" :plain="!legendAllSelected" @click="toggleAllLegends">
          {{ legendAllSelected ? '一键未选' : '一键全选' }}
        </el-button>
      </div>

      <div class="toolbar-group flex-fill dim-group">
        <div class="group-label"><i class="el-icon-s-data"></i> 选择</div>

        <el-select v-if="showLegendSelector" v-model="selectedLegend" :size="controlSize" placeholder="指标"
          class="legend-select no-shrink">
          <el-option v-for="legend in legendList" :key="legend" :label="legend" :value="legend" />
        </el-select>

        <div class="slider-wrapper">
          <el-slider v-model="yearLimit" :min="1" :max="30" :step="1" class="flex-slider" />
          <span class="ctrl-val no-shrink">{{ yearLimit }}</span>
        </div>

        <div v-if="showOffsetControls" class="slider-wrapper offset-slider">
          <span class="ctrl-text no-shrink">偏移</span>
          <el-slider v-model="offsetValue" :min="-30" :max="30" :step="1" class="flex-slider" />
          <span class="ctrl-val no-shrink" :class="{ 'is-positive': offsetValue > 0, 'is-negative': offsetValue < 0 }">
            {{ offsetValue > 0 ? '+' : '' }}{{ offsetValue }}
          </span>
        </div>
      </div>

    </div>

    <div class="chart-card" :style="{ height: chartHeight + 'px' }">
      <ChartView ref="chartRef" :option="chartOption" :chartId="chart.id" :initSelectAll="legendAllSelected"
        :pieConfig="isYearlyCompare ? null : chart.pieConfig" @legendStateChange="legendAllSelected = $event" />
    </div>
  </div>
</template>

<script>
// 🌟 JS 逻辑几乎 100% 保持你上一版的完美代码
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick} from 'vue';
import ChartView from './ChartView.vue';
import { getCommonChartOption } from '@/utils/CommonUtil.js';

export default {
  name: 'ChartContainer',
  components: { ChartView },
  // 🌟 去掉了 emits: ['update:viewMode']
  props: {
    chart: { type: Object, required: true },
    returnData: { type: Object, required: true, default: () => ({}) },
    config: { type: Object, default: () => ({}) },
    viewMode: { type: String, default: 'monthly' },
    // 🌟 去掉了 allowModeChange prop
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

        if (currentChartType.value !== 'line') {
          isYearlyCompare.value = false;
        }
      }
    });

    const windowWidth = ref(window.innerWidth);
    const onResize = () => { windowWidth.value = window.innerWidth; };
    onMounted(() => window.addEventListener('resize', onResize));
    onBeforeUnmount(() => window.removeEventListener('resize', onResize));

    const isMobile = computed(() => windowWidth.value <= 768);
    const isPieActive = computed(() => !isYearlyCompare.value && !!props.chart.pieConfig?.enabled);

    const chartHeight = computed(() => {
      if (isMobile.value) {
        return isPieActive.value ? 420 : 350; 
      } else {
        return isPieActive.value ? 650 : 550; 
      }
    });

    const adaptForMobile = (val, scale = 0.65, min = 10) => {
      if (!val || String(val).includes('%')) return val; 
      let num = parseInt(val);
      if (isNaN(num)) return val;
      return isMobile.value ? Math.max(Math.round(num * scale), min) + 'px' : val;
    };

    const controlSize = computed(() => {
      return windowWidth.value > 768 ? 'large' : 'small';
    });

    const legendList = computed(() => legendNames.value);

    const isMonthlyChart = computed(() => props.chart.dbCode === 'yd' || props.viewMode === 'monthly');

    watch(isMonthlyChart, (isMonthly) => {
      if (!isMonthly) isYearlyCompare.value = false;
    }, { immediate: true });

    const chartOption = computed(() => {
      const actualDataLimit = (isYearlyCompare.value && isMonthlyChart.value) ? 360 : yearLimit.value;
      const hasPieConfig = !!props.chart.pieConfig?.enabled;
      const isPieActiveVal = !isYearlyCompare.value && hasPieConfig;

      let finalTitleTop = isMobile.value ? '10px' : '15px';
      let baseLegendTop = props.chart.legendTop || '50px';
      let finalLegendTop = adaptForMobile(baseLegendTop, 0.85, 30); 
      let finalGridTop;

      if (isPieActiveVal) {
        let baseGridTop = props.chart.gridTop || '280px'; 
        finalGridTop = adaptForMobile(baseGridTop, 0.65, 170); 
      } else {
        if (hasPieConfig) {
          let lTopNum = parseInt(baseLegendTop) || 50;
          let mobileLTop = Math.round(lTopNum * 0.7); 
          let offset = isMobile.value ? 40 : 50; 
          finalGridTop = (isMobile.value ? mobileLTop : lTopNum) + offset + 'px';
        } else {
          let baseGridTop = props.chart.gridTop || '100px';
          finalGridTop = adaptForMobile(baseGridTop, 0.7, 90); 
        }
      }

      return getCommonChartOption({
        data: props.returnData,
        title: props.chart.title || '默认标题',
        subtitle: props.chart.subtitle || '',
        zbcodeArr: props.chart.zbcodeArr || [],
        cityCodeArr: props.config.cityCodeArr || [],
        dbCode: props.chart.dbCode || (props.viewMode === 'monthly' ? 'yd' : 'nd'),
        unit: props.chart.unit || '',
        exceptName: props.chart.exceptName || '',
        titleTop: finalTitleTop,
        legendTop: finalLegendTop,
        gridTop: finalGridTop,
        isMobile: isMobile.value, 
        chartType: currentChartType.value,
        yearLimit: actualDataLimit,
        compareYearCount: yearLimit.value,
        isHorizontal: isHorizontal.value,
        isYearlyCompare: isMonthlyChart.value ? isYearlyCompare.value : false,
        selectedLegend: selectedLegend.value,
        offsetValue: offsetValue.value,
        pieConfig: isPieActiveVal ? props.chart.pieConfig : null,
        enableBirthOffset: props.chart.enableBirthOffset || false,
        enableBirthPrediction: props.chart.enableBirthPrediction || false,
      });
    });

    watch(chartOption, (newOption) => {
      legendNames.value = newOption?.originalLegendData || newOption?.legend?.data || [];
      if (!legendNames.value.includes(selectedLegend.value) && legendNames.value.length > 0) {
        selectedLegend.value = legendNames.value[0];
      }
    }, { immediate: true });

    watch(isYearlyCompare, (isCompare) => {
      if (isCompare) offsetValue.value = 0;
    });

    watch(chartHeight, () => {
      nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    });

    const toggleAllLegends = () => {
      legendAllSelected.value = !legendAllSelected.value;
      if (chartRef.value) chartRef.value.toggleAllLegends(legendAllSelected.value);
    };

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
      showOffsetControls, controlSize, toggleAllLegends
    };
  }
};
</script>

<style scoped>
/* 🌟 完全保持你的原样 CSS 不变 */
.chart-container {
  width: 95%;
  max-width: 1500px;
  margin: 10px auto 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 16px; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}

.bi-toolbar {
  display: flex;
  flex-wrap: nowrap !important;
  align-items: center;
  justify-content: center; 
  gap: 16px;
  padding: 5px 5px;
  border-radius: 12px;
  margin-bottom: 5px;
  overflow: visible !important;
  width: 100%;
  box-sizing: border-box;
}

.toolbar-group {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  gap: 12px;
  flex: 0 1 auto;
  min-width: 0;
  white-space: nowrap;
  min-height: 44px; 
  overflow-y: hidden !important; 
}

.group-label {
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 12px;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.split-line {
  width: 1px;
  height: 18px;
  background-color: #cbd5e1;
  margin: 0 4px;
  flex-shrink: 0;
}

.dim-group, .flex-fill {
  flex: 1 1 auto;
  max-width: 700px; 
  min-width: 300px;
}
.target-group { flex-shrink: 0 !important; }
.legend-select { width: 140px; flex-shrink: 0 !important; margin-right: 8px; }

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 8px; 
  flex: 1 1 auto;
  min-width: 0;
}
.offset-slider {
  margin-left: 8px; 
}
.flex-slider { flex: 1 1 auto; min-width: 40px; margin: 0; }

.ctrl-text { font-size: 14px; font-weight: 500; color: #475569; flex-shrink: 0; }
.no-shrink { flex-shrink: 0 !important; }
.ctrl-val {
  font-size: 14px;
  font-weight: 400;
  color: #475569;
  min-width: 24px; 
  margin-left: 10px;
  text-align: left; 
  font-variant-numeric: tabular-nums; 
  flex-shrink: 0;
}
.ctrl-val.is-positive { color: #ef4444; }
.ctrl-val.is-negative { color: #22c55e; }

:deep(.el-slider__bar) { background-color: #0bc2d6 !important; }
:deep(.el-slider__button) { border-color: #0bc2d6 !important; border-width: 2px !important; width: 16px; height: 16px; }

:deep(.el-radio-button__inner), 
.btn-toggle-all {
  height: 36px !important; 
  padding: 0 16px !important; 
  font-size: 14px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  line-height: normal !important; 
  transition: all 0.2s ease;
}

.btn-toggle-all { border-radius: 6px !important; margin-left: 4px; }
:deep(.el-radio-button:first-child .el-radio-button__inner) { border-radius: 6px 0 0 6px !important; }
:deep(.el-radio-button:last-child .el-radio-button__inner) { border-radius: 0 6px 6px 0 !important; }

:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner) {
  color: #64748b !important; 
  background-color: #ffffff !important; 
  box-shadow: none !important; 
}
:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner:hover) { color: #0bc2d6 !important; }
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  color: #ffffff !important;
  box-shadow: -1px 0 0 0 #0bc2d6 !important;
}
:deep(.el-button--primary.btn-toggle-all) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  color: #ffffff !important;
}
:deep(.el-button--default.btn-toggle-all:hover) {
  color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  background-color: #f0fcfd !important; 
}

@media (max-width: 768px) {
  .chart-container { 
    padding: 10px; 
    margin: 10px auto 16px; 
    border-radius: 12px; 
  }
  
  .bi-toolbar {
    flex-direction: column !important;
    padding: 6px; 
    gap: 6px;
    margin-bottom: 0px; 
    align-items: stretch;
  }

  .toolbar-group {
    width: 100%;
    padding: 4px 8px; 
    gap: 6px; 
    min-height: 32px; 
    flex-wrap: nowrap !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .toolbar-group::-webkit-scrollbar { display: none; }

  .group-label { font-size: 13px; padding-right: 6px; }

  .dim-group, .flex-fill { max-width: 100%; }
  
  .legend-select { width: 100px; flex-shrink: 0 !important; margin-right: 4px;}
  .slider-wrapper { min-width: 120px; flex: 1 0 auto; gap: 4px;} 
  .flex-slider { min-width: 50px; }

  :deep(.el-radio-button__inner), 
  .btn-toggle-all {
    height: 26px !important; 
    padding: 0 8px !important; 
    font-size: 12px !important; 
  }

  .split-line { height: 12px; margin: 0 1px; }
}

.chart-card { width: 100%; position: relative; z-index: 0 !important; }
</style>