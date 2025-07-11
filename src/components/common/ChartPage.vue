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
      :config="config" />
  </div>
</template>

<script>
import ChartContainer from './ChartContainer.vue';

export default {
  components: { ChartContainer },
  props: {
    chartMetaList: Array,
    returnData: Object,
    config: Object,
    showToggles: { type: Boolean, default: true },
  },
  data() {
    return {
      viewMode: 'monthly',
    };
  },
  computed: {
    internalShowToggles() {
      if (!this.showToggles) return false;
      const dbCodes = new Set(this.chartMetaList.map((c) => c.dbCode));
      return dbCodes.has('yd') && dbCodes.has('nd');
    },
    defaultViewMode() {
      const dbCodes = new Set(this.chartMetaList.map((c) => c.dbCode));
      if (dbCodes.has('yd')) return 'monthly';
      if (dbCodes.has('nd')) return 'yearly';
      return 'monthly';
    },
    filteredCharts() {
      if (!this.internalShowToggles) return this.chartMetaList;
      return this.chartMetaList.filter((c) =>
        this.viewMode === 'monthly' ? c.dbCode === 'yd' : c.dbCode === 'nd'
      );
    },
    chartsToRender() {
      return this.filteredCharts.filter((chart) => {
        const sj = this.returnData?.dataList?.sj?.[chart.dbCode];
        return Array.isArray(sj) && sj.length > 0;
      });
    },
  },
  created() {
    this.viewMode = this.defaultViewMode;
  },
};
</script>

<style scoped>
.segment-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 30px;
}

.segment-wrapper {
  position: relative;
  display: flex;
  width: 200px;
  height: 45px;
  background-color: #fff;
  border-radius: 999px;
  padding: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  /* ✅ 外部阴影更明显 */
}

/* 背景高亮滑块 */
.segment-bg {
  position: absolute;
  top: 2px;
  bottom: 2px;
  width: 50%;
  border-radius: 999px;
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

/* 按钮本体 */
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
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.25s ease;
}

.segment-button.active {
  color: #fff;
}


</style>