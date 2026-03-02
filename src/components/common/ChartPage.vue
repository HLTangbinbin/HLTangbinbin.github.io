<template>
  <div class="echart-container">
    <div v-if="internalShowToggles" class="segment-container">
      <div class="segment-wrapper">
        <div class="segment-bg" :class="viewMode"></div>
        <button class="segment-button" :class="{ active: viewMode === 'monthly' }"
          @click="viewMode = 'monthly'">月度</button>
        <button class="segment-button" :class="{ active: viewMode === 'yearly' }"
          @click="viewMode = 'yearly'">年度</button>
      </div>
    </div>

    <ChartContainer v-for="chart in chartsToRender" :key="chart.id" :chart="chart" :returnData="returnData"
      :config="config" :viewMode="viewMode" />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
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

    return {
      viewMode,
      internalShowToggles,
      chartsToRender
    };
  }
};
</script>

<style scoped>
.segment-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.segment-wrapper {
  position: relative;
  display: flex;
  width: 200px;
  height: 45px;
  background-color: #fff;
  border-radius: 15px;
  padding: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.segment-bg {
  position: absolute;
  top: 2px;
  bottom: 2px;
  width: 50%;
  border-radius: 15px;
  background-color: #0bc2d6;
  transition: left 0.25s ease;
  z-index: 0;
}

.segment-bg.monthly {
  left: 2px;
}

.segment-bg.yearly {
  left: 50%;
}

.segment-button {
  position: relative;
  flex: 1;
  z-index: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  border-radius: 15px;
  cursor: pointer;
  transition: color 0.25s ease;
}

.segment-button.active {
  color: #fff;
}
</style>