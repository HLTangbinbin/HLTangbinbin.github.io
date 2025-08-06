<template>
  <div class="chart-card">
    <ChartView :option="chartOption" class="chart-wrapper" />
  </div>
</template>

<script>
import ChartView from './ChartView.vue';
import { getCommonChartOption } from '@/utils/CommonUtil.js';

export default {
  components: { ChartView },
  props: {
    chart: Object,
    returnData: Object,
    config: Object,
    chartType: String, // 'bar' 或 'line'
    yearLimit: {
      type: Number,
      default: 10
    }
  },
  computed: {
    adjustedLegendTop() {
      const baseTop = this.chart.legendTop || '15%';

      // 处理字符串百分比
      if (window.innerWidth <= 768) { // 移动端
        if (typeof baseTop === 'string' && baseTop.endsWith('%')) {
          const num = parseFloat(baseTop);
          return (num / 3) + '%'; // 缩小为原来的三分之一
        }
        if (typeof baseTop === 'number') {
          return baseTop / 3; // 数值缩小
        }
        return '5%'; // 默认值
      }
      // PC端正常返回
      return baseTop;
    },

    chartOption() {
      const params = {
        // 只取必要字段，避免污染
        title: this.chart.title,
        subtitle: this.chart.subtitle,
        dbCode: this.chart.dbCode,
        typeArr: this.chart.typeArr,
        unit: this.chart.unit,
        exceptName: this.chart.exceptName,
        legendTop: this.adjustedLegendTop,
        gridTop: this.chart.gridTop,
        echrtId: this.chart.id,
        chartType: this.chartType,
        min: this.chart.min,
        max: this.chart.max,
        yearLimit: this.yearLimit,
        
      };

      const cityCodeArr = this.config?.cityCodeArr || [];
      const option = getCommonChartOption(params, this.chart.typeArr, this.returnData, cityCodeArr, this.yearLimit);

      if (option.title) delete option.title; // 防止重复标题显示

      return option;
    }
  }
};
</script>

<style scoped>
.chart-card {
  width: 95%;
  height: 600px;
  margin: 0 auto;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>