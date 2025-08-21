<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';

export default {
  props: ['option'],
  setup(props) {
    const chartContainer = ref(null);
    let chartInstance = null;

    const initChart = () => {
      if (!chartContainer.value) {
        console.error('容器元素未找到');
        return;
      }

      // 销毁旧实例
      if (chartInstance) {
        chartInstance.dispose();
      }

      try {
        // 创建实例
        chartInstance = echarts.init(chartContainer.value);
        
        // 设置基础配置（确保至少显示坐标轴）
        const baseOption = {
          xAxis: { type: 'category', data: ['A', 'B', 'C'] },
          yAxis: { type: 'value' },
          series: [{ data: [1, 2, 3], type: 'line' }]
        };
        chartInstance.setOption(baseOption);
        
        // 设置实际配置
        if (props.option) {
          console.log('设置实际配置:', props.option);
          chartInstance.setOption(props.option);
        }
        
        // 立即resize
        chartInstance.resize();
        
        // 调试：打印当前配置
        setTimeout(() => {
          console.log('当前生效配置:', chartInstance.getOption());
        }, 100);
      } catch (e) {
        console.error('图表初始化失败:', e);
      }
    };

    onMounted(() => {
      console.log('图表挂载，开始初始化...');
      initChart();
    });

    watch(() => props.option, (newVal) => {
      console.log('option变化:', newVal);
      if (chartInstance && newVal) {
        chartInstance.setOption(newVal);
      }
    }, { deep: true });

    onBeforeUnmount(() => {
      chartInstance?.dispose();
    });

    return { chartContainer };
  }
};
</script>

<style scoped>
.chart-view {
  width: 100%;
  height: 400px; /* 必须指定高度 */
  min-height: 300px;
}
</style>