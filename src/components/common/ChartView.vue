<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { TitleComponent,GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { logger } from '@/utils/Logger.js';
import debounce from 'lodash-es/debounce';

echarts.use([TitleComponent,GridComponent, TooltipComponent, LegendComponent, BarChart, LineChart, PieChart,CanvasRenderer]);

export default {
  name: 'ChartView',
  props: {
    option: { type: Object, required: true },
    chartId: { type: String, required: true }, // 从 ChartContainer 传入
    pieConfig: { type: Object, default: () => ({}) },
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
      // 饼状图联动事件
      chartInstance.on('updateAxisPointer', function (event) {
        // 在 setup() 或 initChart() 里
        const seriesData = props.option?.series?.filter(s => s.type !== 'pie') || [];

        const xAxisInfo = event.axesInfo?.[0];
        if (!xAxisInfo) return;

        const yearIndex = xAxisInfo.value; // 对应 filteredYears 的索引
        const pieConfig = props.pieConfig;
        if (!pieConfig?.enabled || !Array.isArray(pieConfig.pies)) return; // ✅ 没有饼图直接返回

        pieConfig?.pies.forEach((pie, idx) => {
          const targetSeries = seriesData.filter(s => pie.triggerZbCodes.includes(s.zbCode));


          // 创建饼图数据：使用最后一年的数据
          const pieData = targetSeries.map(series => {
            // 获取最后一个年份的数据
            const lastValue = Array.isArray(series.data) ? series.data[yearIndex] : 0;
            return {
              name: series.name,
              value: lastValue  // 使用具体数值，不是整个data数组
            };
          });

          chartInstance.setOption({
            series: [{
              id: `pie_${idx}`,
              data: pieData,
              label: {
                formatter: params => `${params.name}\n ${params.value} \n(${params.percent}%)`
              },
            }]
          });
        });
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
      logger.debug('updateChart方法调用')
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