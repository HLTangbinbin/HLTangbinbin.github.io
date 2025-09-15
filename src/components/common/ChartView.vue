<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { TitleComponent,GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { logger } from '@/utils/Logger.js';
import debounce from 'lodash-es/debounce';

echarts.use([TitleComponent,GridComponent, TooltipComponent, LegendComponent, BarChart, LineChart, CanvasRenderer]);

export default {
  name: 'ChartView',
  props: {
    option: { type: Object, required: true },
    chartId: { type: String, required: true }, // 从 ChartContainer 传入
    initSelectAll: { type: Boolean, default: true }
  },
  emits: ['legendStateChange'],
  setup(props, { expose, emit }) {
    const chartContainer = ref(null);
    let chartInstance = null;
    let resizeHandler = null;

    const initChart = () => {
      if (!chartContainer.value || !props.option?.series?.length) return;

      const startTime = performance.now();

      // 如果实例已存在且未销毁，直接更新
      if (chartInstance && !chartInstance.isDisposed()) {
        updateChart(props.option);
        return;
      }

      // 创建新实例
      chartInstance = echarts.init(chartContainer.value);
      chartInstance.setOption(props.option, true);

      // 初始化图例状态
      const legends = chartInstance.getOption().legend?.[0]?.data || [];
      if (legends.length > 0) {
        legends.forEach(name => {
          chartInstance.dispatchAction({
            type: props.initSelectAll ? 'legendSelect' : 'legendUnSelect',
            name
          });
        });
      }

      // 绑定事件（只绑定一次）
      chartInstance.on('legendselectchanged', (params) => {
        const allSelected = Object.values(params.selected).every(v => v === true);
        const noneSelected = Object.values(params.selected).every(v => v === false);

        if (allSelected) emit('legendStateChange', true);
        else if (noneSelected) emit('legendStateChange', false);
      });

      // 绑定窗口大小调整事件
      if (!resizeHandler) {
        resizeHandler = debounce(() => {
          if (chartInstance && !chartInstance.isDisposed()) {
            chartInstance.resize();
          }
        }, 200);
        window.addEventListener('resize', resizeHandler);
      }

      const endTime = performance.now();
      logger.debug(`[Chart ${props.chartId}] 图表初始化耗时: ${Math.round(endTime - startTime)}ms`);
    };

    const updateChart = (newOption) => {
      if (!chartInstance || chartInstance.isDisposed()) {
        initChart();
        return;
      }
      if (!newOption?.series?.length) return;

      // 使用增量更新，提高性能
      chartInstance.setOption(newOption, false, true);
    };

    const toggleAllLegends = (selectAll) => {
      if (!chartInstance) return;
      const legends = chartInstance.getOption().legend?.[0]?.data || [];
      const startTime = performance.now();
      legends.forEach(name => {
        chartInstance.dispatchAction({
          type: selectAll ? 'legendSelect' : 'legendUnSelect',
          name
        });
      });
      const endTime = performance.now();
      logger.debug(`[Chart ${props.chartId}] toggleAllLegends耗时: ${Math.round(endTime - startTime)}ms`);
    };

    onMounted(() => {
      nextTick(() => initChart());
    });

    // 使用浅监听，避免深度监听的性能开销
    watch(() => props.option, updateChart, { deep: false });

    onBeforeUnmount(() => {
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler.cancel();
      }
      chartInstance?.dispose();
      chartInstance = null;
    });

    expose({ toggleAllLegends });

    return { chartContainer };
  }
};
</script>

<style scoped>
.chart-view {
  width: 100%;
  height: 100%;
}
</style>