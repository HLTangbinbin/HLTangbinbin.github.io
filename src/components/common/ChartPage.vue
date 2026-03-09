<template>
  <div class="echart-container">
    <ChartContainer 
      v-for="(chart, index) in chartsToRender" 
      :key="chart.id" 
      :chart="chart" 
      :returnData="returnData"
      :config="config" 
      :viewMode="viewMode" 
      :allowModeChange="internalShowToggles && index === 0"
      @update:viewMode="handleViewModeUpdate"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'; // 🌟 引入 watch
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
    
    // 初始化默认值
    viewMode.value = defaultViewMode();

    // 🌟 修复 1：监听菜单栏切换！只要数据源一变，立刻把图表打回月度原形！
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
/* 🌟 删除了所有 segment-xxx 相关的冗余样式，页面变得极度清爽 */
.echart-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>