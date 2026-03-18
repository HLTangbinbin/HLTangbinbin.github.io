<template>
  <div class="dashboard-global-wrapper">
    
    <div class="view-mode-container" v-if="internalShowToggles">
      <el-radio-group v-model="viewMode" class="custom-segment" @change="handleViewModeUpdate">
        <el-radio-button label="monthly">月度</el-radio-button>
        <el-radio-button label="yearly">年度</el-radio-button>
      </el-radio-group>
    </div>

    <div class="charts-flow">
      <ChartContainer 
        v-for="chart in chartsToRender" 
        :key="chart.id" 
        :chart="chart" 
        :returnData="returnData"
        :config="config" 
        :viewMode="viewMode" 
      />
    </div>

  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'; 
import ChartContainer from './ChartContainer.vue';

export default {
  name: 'ChartPage',
  components: { ChartContainer },
  props: {
    chartMetaList: { type: Array, required: true },
    returnData: { type: Object, required: true },
    config: { type: Object, default: () => ({}) },
    showToggles: { type: Boolean, default: true }
  },
  setup(props) {
    const viewMode = ref('monthly');

    const internalShowToggles = computed(() => {
      if (!props.showToggles) return false;
      const dbCodes = new Set(props.chartMetaList.map(c => c.dbCode));
      return dbCodes.has('yd') && dbCodes.has('nd');
    });

    const defaultViewMode = () => {
      const dbCodes = new Set(props.chartMetaList.map(c => c.dbCode));
      if (dbCodes.has('yd')) return 'monthly';
      if (dbCodes.has('nd')) return 'yearly';
      return 'monthly';
    };
    
    viewMode.value = defaultViewMode();

    watch(() => props.chartMetaList, () => {
      viewMode.value = defaultViewMode();
    });

    const filteredCharts = computed(() => {
      if (!internalShowToggles.value) return props.chartMetaList;
      return props.chartMetaList.filter(c =>
        viewMode.value === 'monthly' ? c.dbCode === 'yd' : c.dbCode === 'nd'
      );
    });

    const chartsToRender = computed(() => {
      return filteredCharts.value.filter(chart => {
        const sj = props.returnData?.sj?.[chart.dbCode];
        return Array.isArray(sj) && sj.length > 0;
      });
    });

    const handleViewModeUpdate = (newMode) => {
      viewMode.value = newMode;
    };

    return {
      viewMode,
      internalShowToggles,
      chartsToRender,
      handleViewModeUpdate
    };
  }
};
</script>

<style scoped>
/* 核心：替换发闷的深灰，采用高级玻璃拟态 */
.dashboard-global-wrapper {
  width: 98%;
  max-width: 1500px;
  margin: 0 auto;
  background-color: #ffffff;
  /* 毛玻璃效果，透出底层全局背景色 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); 
  border-radius: 20px;
  padding: 20px; 
  box-sizing: border-box;
  /* 纯白高光边框 + 内发光，质感拉满 */
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4), 0 4px 20px rgba(0, 0, 0, 0.02);
}

.charts-flow {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-mode-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px; 
}

.custom-segment {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 阴影也稍微调柔和 */
  border-radius: 14px; 
  background: #fff;
}

.custom-segment :deep(.el-radio-button__inner) {
  height: 36px !important; 
  padding: 0 32px !important;
  font-size: 15px !important;
  font-weight: bold !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  transition: all 0.2s ease;
  background-color: #ffffff !important;
  color: #64748b !important;
  border: 1px solid transparent !important; 
}

.custom-segment :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 14px 0 0 14px !important; 
}
.custom-segment :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 14px 14px 0 !important;
}

.custom-segment :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0bc2d6 !important;
  color: #ffffff !important;
  border-color: #0bc2d6 !important;
  box-shadow: 0 2px 6px rgba(11, 194, 214, 0.35) !important;
}

@media (max-width: 768px) {
  .dashboard-global-wrapper {
    width: 98%;
    padding: 12px;
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.6); /* 移动端可以稍微白一点点 */
  }
  .view-mode-container {
    margin-bottom: 12px;
  }
  .custom-segment :deep(.el-radio-button__inner) {
    height: 28px !important;
    padding: 0 20px !important;
    font-size: 12px !important;
  }
  .custom-segment :deep(.el-radio-button:first-child .el-radio-button__inner) {
    border-radius: 12px 0 0 12px !important;
  }
  .custom-segment :deep(.el-radio-button:last-child .el-radio-button__inner) {
    border-radius: 0 12px 12px 0 !important;
  }
}
</style>