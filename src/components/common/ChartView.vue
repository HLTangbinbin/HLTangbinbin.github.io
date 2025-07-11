<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
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
    let resizeObserver = null;

    const initChart = () => {
      if (!chartContainer.value) return;

      // 如果已有实例，先销毁
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }

      // 初始化echarts实例
      chartInstance = echarts.init(chartContainer.value);

      if (props.option && Object.keys(props.option).length > 0) {
        chartInstance.setOption(props.option);
      }

      // 监听窗口resize，自动调整图表大小
      window.addEventListener('resize', resizeChart);

      // 使用ResizeObserver监听容器尺寸变化
      resizeObserver = new ResizeObserver(() => {
        if (chartInstance) {
          chartInstance.resize();
        }
      });
      resizeObserver.observe(chartContainer.value);
    };

    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    onMounted(async () => {
      await nextTick();
      initChart();
    });

    watch(
      () => props.option,
      (newOption) => {
        if (chartInstance && newOption && Object.keys(newOption).length > 0) {
          chartInstance.setOption(newOption, true);
        }
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart);
      if (resizeObserver && chartContainer.value) {
        resizeObserver.unobserve(chartContainer.value);
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }
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
  height: 100%; /* 继承外层容器高度 */
}
</style>