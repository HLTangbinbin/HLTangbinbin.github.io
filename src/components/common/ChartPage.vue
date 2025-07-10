<template>
  <div class="echart-container">
    <!-- ✅ 切换按钮（按需显示） -->
    <div v-if="internalShowToggles" class="switch-buttons">
      <div class="buttons-group">
        <button
          :class="['datatype-button', { 'is-active': viewMode === 'monthly' }]"
          @click="viewMode = 'monthly'"
        >
          月度
        </button>
        <button
          :class="['datatype-button', { 'is-active': viewMode === 'yearly' }]"
          @click="viewMode = 'yearly'"
        >
          年度
        </button>
      </div>
    </div>

    <!-- ✅ 图表类型切换按钮 -->
    <div class="buttons-group">
      <button
        :class="['echarttype-button', { 'is-active': chartType === 'bar' }]"
        @click="chartType = 'bar'"
      >
        柱状图
      </button>
      <button
        :class="['echarttype-button', { 'is-active': chartType === 'line' }]"
        @click="chartType = 'line'"
      >
        折线图
      </button>
    </div>

    <!-- ✅ 图表区域 -->
    <ChartView
      v-for="chart in chartsToRender"
      :key="chart.id"
      :option="getOption(chart)"
      class="chart-wrapper"
    />
  </div>
</template>

<script>
import ChartView from "./ChartView.vue";
import { getCommonChartOption } from "@/utils/CommonUtil.js";

export default {
  components: { ChartView },
  props: {
    chartMetaList: {
      type: Array,
      default: () => [],
    },
    returnData: {
      type: Object,
      default: () => ({}),
    },
    showToggles: {
      type: Boolean,
      default: true, // 外部控制是否允许切换按钮
    },
    config: {
      type: Object,
      default: () => ({}), // ✅ 新增
    }
    
  },
  data() {
    return {
      viewMode: "monthly",
      chartType: "bar", // 默认图表类型
    };
  },
  created() {
    this.viewMode = this.defaultViewMode;
  },
  computed: {
    // ✅ 内部控制是否显示切换按钮
    internalShowToggles() {
      if (!this.showToggles) return false;
      const dbCodes = new Set(this.chartMetaList.map((c) => c.dbCode));
      return dbCodes.has("yd") && dbCodes.has("nd");
    },

    // ✅ 判断默认的 viewMode（优先月度）
    defaultViewMode() {
      const dbCodes = new Set(this.chartMetaList.map((c) => c.dbCode));
      if (dbCodes.has("yd")) return "monthly";
      if (dbCodes.has("nd")) return "yearly";
      return "monthly";
    },

    // ✅ 当前筛选后图表（根据 viewMode）
    filteredCharts() {
      if (!this.internalShowToggles) return this.chartMetaList;
      return this.chartMetaList.filter((c) =>
        this.viewMode === "monthly" ? c.dbCode === "yd" : c.dbCode === "nd"
      );
    },

    // ✅ 当前真正要渲染的图表（有数据）
    chartsToRender() {
      if (!this.returnData?.dataList?.sj) return [];
      return this.filteredCharts.filter((chart) => {
        const sj = this.returnData.dataList.sj[chart.dbCode];
        return Array.isArray(sj) && sj.length > 0;
      });
    },
  },
  methods: {
    getOption(chart) {
      const params = {
        ...chart,
        chartType: this.chartType,
        echrtId: chart.id,
      };
    const cityCodeArr = this.config?.cityCodeArr || [];
    return getCommonChartOption(params, chart.typeArr, this.returnData, cityCodeArr);
    },
  },
};
</script>

<style scoped>
.echart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto 0;   /* ✅ 顶部 20px，左右自动居中 */
  width: 95%;
}

.switch-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.buttons-group {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
}

.datatype-button {
  padding: 10px 25px;
  font-size: 14px;
  margin: 0 20px;
  border: none;
  border-radius: 30px;
  background-color: #ccc;
  color: #fff;
  cursor: pointer;
}

.echarttype-button {
  padding: 10px 16px;
  font-size: 14px;
  margin: 0 20px;
  border: none;
  border-radius: 20px;
  background-color: #ccc;
  color: #fff;
  cursor: pointer;
}

.is-active {
  background-color: #0bc2d6;
}

.chart-wrapper {
  width: 100%;
  height: 600px;
  margin-bottom: 24px;
}
</style>