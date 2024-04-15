<template>
    <div>
      <h2>社融数据</h2>
      <div ref="chart" style="width: 600px; height: 400px;"></div>
      <button @click="toggleChartType">切换图表类型</button>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        chart: null,
        isBarChart: true
      };
    },
    mounted() {
      this.chart = echarts.init(this.$refs.chart);
      this.loadData();
    },
    methods: {
      loadData() {
        // 根据需要加载本地 JSON 文件数据并绘制图表
      },
      toggleChartType() {
        this.isBarChart = !this.isBarChart;
        this.chart.setOption({
          series: [{
            type: this.isBarChart ? 'bar' : 'line'
          }]
        });
      }
    }
  };
  </script>
  