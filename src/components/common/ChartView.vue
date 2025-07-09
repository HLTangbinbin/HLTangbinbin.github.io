<template>
  <!-- 注意 class="chart-view" 一定挂载在最外层容器上 -->
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'ChartView',
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartContainer = ref(null);
    let chartInstance = null;

    const resizeChart = () => {
      if (chartInstance && chartContainer.value) {
        chartInstance.resize();
      }
    };

    onMounted(() => {
      if (!chartContainer.value) {
        console.warn('[ChartView] DOM 未挂载');
        return;
      }

      chartInstance = echarts.init(chartContainer.value);

      if (props.option && Object.keys(props.option).length > 0) {
        chartInstance.setOption(props.option);
      }

      window.addEventListener('resize', resizeChart);
    });

    watch(
      () => props.option,
      (newVal) => {
        if (chartInstance && newVal && Object.keys(newVal).length > 0) {
          chartInstance.setOption(newVal);
        }
      },
      { immediate: true, deep: true }
    );

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }
      window.removeEventListener('resize', resizeChart);
    });

    return {
      chartContainer
    };
  }
};
</script>

<style scoped>
.chart-view {
  width: 100%;
  height: 100%; /* 继承外层 .chart-wrapper 的高度 */
}
</style>