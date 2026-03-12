<template>
  <div class="echart-container">
    
    <div class="page-header" :class="{ 'is-centered': !$slots.nav }">
      
      <div class="nav-area" v-if="$slots.nav">
        <slot name="nav"></slot>
      </div>

      <div class="global-segment-wrapper" v-if="internalShowToggles">
        <el-radio-group v-model="viewMode" class="custom-segment" @change="handleViewModeUpdate">
          <el-radio-button label="monthly">月度</el-radio-button>
          <el-radio-button label="yearly">年度</el-radio-button>
        </el-radio-group>
      </div>
      
    </div>

    <ChartContainer 
      v-for="chart in chartsToRender" 
      :key="chart.id" 
      :chart="chart" 
      :returnData="returnData"
      :config="config" 
      :viewMode="viewMode" 
    />
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
.echart-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* =========================================================
   🧠 智能头部容器样式 (核心！)
========================================================= */
.page-header {
  width: 95%;
  max-width: 1500px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 默认：导航在左，按钮在右 */
  gap: 16px; /* 防止导航和按钮挤在一起 */
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: transparent;
}

/* 当没有传入导航栏时，触发居中样式 */
.page-header.is-centered {
  justify-content: center;
}

/* 导航区域：占据剩余弹性空间，保证内部可以横向滚动 */
.nav-area {
  flex: 1 1 auto;
  min-width: 0; /* 极其重要：防止 flex 子项被超长导航撑爆 */
}

/* 按钮区域：死死抱住自己的宽度，绝不被压缩 */
.global-segment-wrapper {
  flex: 0 0 auto;
}

/* =========================================================
   🔘 经典 Segment 按钮样式还原 
========================================================= */
.custom-segment {
  margin-top: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 14px; 
  background: #fff;
}

.custom-segment :deep(.el-radio-button__inner) {
  height: 40px !important; 
  padding: 0 24px !important;
  font-size: 14px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  line-height: normal !important;
  transition: all 0.2s ease;
  background-color: #ffffff !important;
  color: #64748b !important;
  border: 1px solid #e2e8f0 !important;
}

.custom-segment :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 14px 0 0 14px !important; 
  border-right: 0 !important;
}
.custom-segment :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 14px 14px 0 !important;
  border-left: 0 !important;
}

.custom-segment :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  color: #ffffff !important;
  box-shadow: -1px 0 0 0 #0bc2d6 !important;
}
.custom-segment :deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner:hover) {
  color: #0bc2d6 !important;
}

/* =========================================================
   📱 移动端自适应
========================================================= */
@media (max-width: 768px) {
  .page-header {
    /* 手机端横向空间极小，如果在同一行会被严重挤压 */
    /* 因此在手机端改为上下堆叠：导航在上，按钮居中在下 */
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    margin: 0 0 5px 0;
    padding: 6px 0;
    background: rgba(248, 250, 252, 0.9);
    backdrop-filter: blur(8px);
  }

  .nav-area {
    width: 100%;
  }

  .custom-segment {
    margin-top: 0px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 14px;
    background: #fff;
  }

  .custom-segment :deep(.el-radio-button__inner) {
    height: 28px !important;
    padding: 0 20px !important;
    font-size: 13px !important;
  }
  .custom-segment :deep(.el-radio-button:first-child .el-radio-button__inner) {
    border-radius: 10px 0 0 10px !important;
  }
  .custom-segment :deep(.el-radio-button:last-child .el-radio-button__inner) {
    border-radius: 0 10px 10px 0 !important;
  }
}
</style>