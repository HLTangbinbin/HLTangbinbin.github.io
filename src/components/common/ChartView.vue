<!-- ChartView.vue -->
<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { logger } from '@/utils/Logger.js';
import debounce from 'lodash-es/debounce';

// 按需注册 ECharts 组件
echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer
]);

export default {
  name: 'ChartView',
  props: {
    option: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  setup(props) {
    const chartContainer = ref(null);
    let chartInstance = null;
    let resizeHandler = null;

    // 处理图例选择变化
    const handleLegendChange = (params) => {
      if (chartInstance && params && params.selected) {
        if (Object.values(params.selected).every(Boolean)) {
          chartInstance.dispatchAction({ type: 'legendInverseSelect' });
        }
      }
    };

    // 初始化图表 - 确保在 onMounted 中调用
    const initChart = () => {
      if (!chartContainer.value) {
        return;
      }
      
      // 确保有有效数据
      if (!props.option || !props.option.series || props.option.series.length === 0) {

        return;
      }

      // 销毁旧实例
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }

      // 创建新实例
      chartInstance = echarts.init(chartContainer.value, null, {
        renderer: 'canvas',
        width: 'auto',
        height: 'auto'
      });

      // 设置图表配置
      chartInstance.setOption(props.option);
      
      // 绑定事件
      chartInstance.on('legendselectchanged', handleLegendChange);
      
      // 初始化防抖resize
      resizeHandler = debounce(() => {
        if (chartInstance) {
          chartInstance.resize();
        }
      }, 200);
      
      window.addEventListener('resize', resizeHandler);
    };

    // 更新图表
    const updateChart = (newOption) => {
      if (!chartInstance) {
        initChart();
        return;
      }
      
      if (!newOption || !newOption.series || newOption.series.length === 0) {
        return;
      }
      
      chartInstance.setOption(newOption, true);
    };

    // 确保在 DOM 完全挂载后初始化
    onMounted(() => {
      initChart();
    });

    // 监听 option 变化
    watch(() => props.option, (newOption) => {
      logger.debug('option 发生变化，更新图表');
      updateChart(newOption);
    }, { deep: true });

    // 清理工作
    onBeforeUnmount(() => {
      logger.debug('组件即将卸载，清理资源');
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler.cancel();
        resizeHandler = null;
      }
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }
    });

    return {
      updateChart,
      chartContainer // 暴露给模板
    };
  }
};
</script>

<style scoped>
.chart-view {
  width: 100%;
  height: 100%;
  
  position: relative;

}
</style>