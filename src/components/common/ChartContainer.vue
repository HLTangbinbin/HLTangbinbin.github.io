<template>
  <div class="chart-container">
    <div class="bi-toolbar">

      <div v-if="allowModeChange" class="toolbar-group mode-group">
        <div class="group-label"><i class="el-icon-date"></i> 类型</div>
        <el-radio-group :model-value="viewMode" @update:model-value="handleModeChange" :size="controlSize"
          class="no-shrink">
          <el-radio-button label="monthly">月度</el-radio-button>
          <el-radio-button label="yearly">年度</el-radio-button>
        </el-radio-group>
      </div>

      <div class="toolbar-group view-group">
        <div class="group-label"><i class="el-icon-data-analysis"></i> 图表</div>
        <el-radio-group v-model="chartTypeModel" :size="controlSize" class="chart-type-radio no-shrink">
          <el-radio-button label="bar">柱状</el-radio-button>
          <el-radio-button label="hbar">条形</el-radio-button>
          <el-radio-button label="line">折线</el-radio-button>
        </el-radio-group>
        <el-button :size="controlSize" class="no-shrink btn-toggle-all"
          :type="legendAllSelected ? 'primary' : 'default'" :plain="!legendAllSelected" @click="toggleAllLegends">
          {{ legendAllSelected ? '一键未选' : '一键全选' }}
        </el-button>
      </div>

      <div class="toolbar-group flex-fill dim-group">
        <div class="group-label"><i class="el-icon-time"></i> 维度</div>

        <el-switch v-if="showCompareToggle" v-model="isYearlyCompare" active-text="同环比" inactive-text="连续"
          class="compare-switch no-shrink" :size="controlSize" />

        <div class="slider-wrapper">
          <span class="ctrl-text no-shrink">{{ isYearlyCompare ? '时间' : '时间' }}</span>
          <el-slider v-model="yearLimit" :min="1" :max="30" :step="1" class="flex-slider" />
          <span class="ctrl-val no-shrink">{{ yearLimit }}{{ isYearlyCompare ? '' : '' }}</span>
        </div>
      </div>

      <div v-if="showLegendSelector || showOffsetControls" class="toolbar-group target-group">
        <div class="group-label"><i class="el-icon-set-up"></i> {{ showOffsetControls ? '高级' : '目标' }}</div>

        <el-select v-if="showLegendSelector" v-model="selectedLegend" :size="controlSize" placeholder="指标"
          class="legend-select no-shrink">
          <el-option v-for="legend in legendList" :key="legend" :label="legend" :value="legend" />
        </el-select>

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
  // 🌟 定义 emits，允许子组件修改父组件的 viewMode
  emits: ['update:viewMode'],
  props: {
    chart: { type: Object, required: true },
    returnData: { type: Object, required: true, default: () => ({}) },
    config: { type: Object, default: () => ({}) },
    viewMode: { type: String, default: 'monthly' },
    // 🌟 新增 prop：决定是否在这个图表顶部显示“月度/年度”切换
    allowModeChange: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
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

    // PC 端默认用大尺寸 ('default' 或 'large')，手机端(<=768)强制用 'small'
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

      return getCommonChartOption({
        data: props.returnData,
        title: props.chart.title || '默认标题',
        subtitle: props.chart.subtitle || '',
        zbcodeArr: props.chart.zbcodeArr || [],
        cityCodeArr: props.config.cityCodeArr || [],
        dbCode: props.chart.dbCode || (props.viewMode === 'monthly' ? 'yd' : 'nd'),
        unit: props.chart.unit || '',
        exceptName: props.chart.exceptName || '',
        legendTop: props.chart.legendTop,
        gridTop: props.chart.gridTop,
        chartType: currentChartType.value,
        yearLimit: actualDataLimit,
        compareYearCount: yearLimit.value,
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
      legendNames.value = newOption?.originalLegendData || newOption?.legend?.data || [];
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

    const handleModeChange = (newMode) => {
      emit('update:viewMode', newMode);
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
      showOffsetControls, controlSize, toggleAllLegends, handleModeChange
    };
  }
};
</script>

<style scoped>
/* =========================================================
   🌟 1. 整体容器与基础布局
========================================================= */
.chart-container {
  width: 95%;
  max-width: 1500px;
  margin: 20px auto 40px;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}

/* PC 端：一行居中显示，拒绝松散，绝不换行，允许原生下拉框溢出 */
.bi-toolbar {
  display: flex;
  flex-wrap: nowrap !important;
  align-items: center;
  justify-content: center; 
  gap: 16px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  overflow: visible !important; 
  width: 100%;
  box-sizing: border-box;
}

/* 模块级约束：锁定最低高度，彻底防止切换时的 Y 轴跳动 */
.toolbar-group {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  gap: 12px;
  flex: 0 1 auto;
  min-width: 0;
  white-space: nowrap;
  min-height: 44px; /* 防跳动核心 */
  overflow-y: hidden !important; /* 防跳动核心 */
}

/* =========================================================
   🌟 2. 内部控件：尺寸、间距与文字排版
========================================================= */
/* 滑块模块：PC端限制最大宽度，绝不无限拉伸霸占屏幕 */
.dim-group, .flex-fill {
  flex: 1 1 auto;
  max-width: 480px; 
  min-width: 250px;
}

/* 滑块容器与滑块本体：紧凑间距，取消多余 margin */
.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 8px; 
  flex: 1 1 auto;
  min-width: 0;
}
.flex-slider {
  flex: 1 1 auto;
  min-width: 40px;
  margin: 0; /* 消除多余边距 */
}

/* 标题、文字与数值排版 */
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
.no-shrink { flex-shrink: 0 !important; }
.compare-switch { --el-switch-on-color: #0bc2d6; flex-shrink: 0; }
.ctrl-text { font-size: 14px; font-weight: 500; color: #475569; flex-shrink: 0; }

/* 数值：靠左对齐，紧贴滑块，防止距离太远 */
.ctrl-val {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  min-width: 24px; /* 缩小基础宽度 */
  text-align: left; /* 紧贴滑块核心 */
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.ctrl-val.is-positive { color: #ef4444; }
.ctrl-val.is-negative { color: #22c55e; }

/* 目标下拉框与防遮挡 */
.target-group { flex-shrink: 0 !important; }
.legend-select { width: 140px; flex-shrink: 0 !important; }
.chart-card { width: 100%; position: relative; z-index: 0 !important; }

/* =========================================================
   🌟 3. 移动端适配 (窄屏下的极致展现)
========================================================= */
@media (max-width: 768px) {
  .chart-container { padding: 12px; margin: 10px auto 30px; }
  
  /* 竖向排列大模块 */
  .bi-toolbar {
    flex-direction: column !important;
    padding: 10px;
    gap: 10px;
    align-items: stretch;
  }

  /* 模块内部坚决不换行，允许横向滑动 */
  .toolbar-group {
    width: 100%;
    padding: 8px 10px;
    gap: 10px;
    flex-wrap: nowrap !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .toolbar-group::-webkit-scrollbar { display: none; }

  /* 标题调整 */
  .group-label {
    font-size: 14px;
    border-right: 1px solid #e2e8f0;
    padding-right: 10px;
    width: auto;
    margin-bottom: 0;
  }

  /* 手机端解除 480px 限制，自然铺满屏幕 */
  .dim-group, .flex-fill { max-width: 100%; }

  /* 🌟 移动端大幅增加滑块的最小宽度，防止拖拽困难 */
  .slider-wrapper { min-width: 180px; flex: 1 0 auto; }
  .flex-slider { min-width: 80px; }

  .legend-select { width: auto; flex: 1; margin-bottom: 0; }
}

/* =========================================================
   🌟 4. Element Plus 全局组件重置与“核武器”级暴力拦截
========================================================= */

/* ---------------- 4.1 Radio Button (视图切换按钮) ---------------- */
:deep(.el-radio-button__inner) {
  font-size: 14px !important;
  padding: 8px 16px !important;
  line-height: 1 !important; /* 🌟 强制行高统一 */
  height: auto !important; /* 🌟 解除框架隐藏的固定高度 */
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  box-sizing: border-box !important;
}
/* ⚠️ 终极拦截：只要没被选中，统统死死锁成深灰色！不管它是拿到了焦点还是什么状态，全部压制防变蓝！ */
:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner) {
  color: #64748b !important; 
  background-color: #ffffff !important; 
  box-shadow: none !important; 
}
:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner:hover) {
  color: #0bc2d6 !important;
}
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  color: #ffffff !important;
  box-shadow: -1px 0 0 0 #0bc2d6 !important;
}

/* ---------------- 4.2 Button (一键全选/未选) ---------------- */
/* 统一和单选按钮一模一样的内边距和字号，使其高度完美一致 */
.btn-toggle-all {
  font-size: 14px !important;
  padding: 8px 16px !important; 
  line-height: 1 !important; /* 🌟 强制行高统一 */
  height: auto !important; /* 🌟 核心：击碎 PC 端 size="large" 带来的 40px 固定高度！ */
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  box-sizing: border-box !important;
}
/* 覆盖所有状态的蓝色 */
:deep(.el-button--primary.btn-toggle-all),
:deep(.el-button--primary.btn-toggle-all:hover),
:deep(.el-button--primary.btn-toggle-all:focus),
:deep(.el-button--primary.btn-toggle-all:active) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  color: #ffffff !important;
}
:deep(.el-button--default.btn-toggle-all:hover),
:deep(.el-button--default.btn-toggle-all:focus) {
  color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  background-color: #f0fcfd !important; 
}

/* ---------------- 4.3 Switch (同环比开关) ---------------- */
:deep(.el-switch) {
  display: inline-flex;
  align-items: center;
  height: 24px; 
}
/* 锁定文字颜色为深灰，绝不跟随开关变蓝 */
:deep(.el-switch__label),
:deep(.el-switch__label.is-active) {
  white-space: nowrap !important;
  display: inline-block;
  font-size: 14px;
  color: #475569 !important; 
  font-weight: 500;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* ---------------- 4.4 Slider (时间跨度滑块) ---------------- */
:deep(.el-slider__bar) { background-color: #0bc2d6 !important; }
:deep(.el-slider__button) { border-color: #0bc2d6 !important; border-width: 2px !important; width: 16px; height: 16px; }
</style>