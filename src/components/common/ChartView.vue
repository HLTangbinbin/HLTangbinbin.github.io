<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, MapChart } from 'echarts/charts';
import { TitleComponent, GridComponent, TooltipComponent, LegendComponent, TimelineComponent, VisualMapComponent, GeoComponent} from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import debounce from 'lodash-es/debounce';
import { logger } from '@/utils/Logger';

echarts.use([TitleComponent, GridComponent, TooltipComponent, LegendComponent, BarChart, LineChart, PieChart, CanvasRenderer, SVGRenderer, TimelineComponent, VisualMapComponent, GeoComponent, MapChart]);

export default {
  name: 'ChartView',
  props: {
    option: { type: Object, required: true },
    chartId: { type: String, required: true },
    pieConfig: { type: Object, default: () => ({}) },
    initSelectAll: { type: Boolean, default: true }
  },
  emits: ['legendStateChange'],
  setup(props, { expose, emit }) {
    const chartContainer = ref(null);
    let chartInstance = null;
    let resizeHandler = null;

    // 暴露给父组件的方法
    const toggleAllLegends = (selectAll) => {
      if (!chartInstance) return;
      const legends = chartInstance.getOption().legend?.[0]?.data || [];
      legends.forEach(name => {
        chartInstance.dispatchAction({
          type: selectAll ? 'legendSelect' : 'legendUnSelect',
          name
        });
      });
    };
    expose({ toggleAllLegends });

    const initChart = () => {
      if (!chartContainer.value || !props.option?.series?.length) return;

      if (chartInstance && !chartInstance.isDisposed()) {
        updateChart(props.option);
        return;
      }

      // 修改后：强制开启 SVG 矢量渲染 🚀
      chartInstance = echarts.init(chartContainer.value, null, { renderer: 'svg' });
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

      // 绑定图例点击事件
      chartInstance.on('legendselectchanged', (params) => {
        const allSelected = Object.values(params.selected).every(v => v === true);
        const noneSelected = Object.values(params.selected).every(v => v === false);
        if (allSelected) emit('legendStateChange', true);
        else if (noneSelected) emit('legendStateChange', false);
      });

      // 🌟 性能优化核心：缓存上一次悬停的索引
      let lastYearIndex = -1;
      
      chartInstance.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo?.[0];
        if (!xAxisInfo) return;


        const yearIndex = xAxisInfo.value;
        if (yearIndex === lastYearIndex) return; 
        lastYearIndex = yearIndex;

        const pieConfig = props.pieConfig;
        if (!pieConfig?.enabled || !Array.isArray(pieConfig.pies)) return;

        const seriesData = props.option?.series?.filter(s => s.type !== 'pie') || [];

        pieConfig.pies.forEach((pie, idx) => {
          const targetSeries = seriesData.filter(s => pie.triggerZbCodes.includes(s.zbCode));
          const pieData = targetSeries.map(series => ({
            name: series.name,
            value: Array.isArray(series.data) ? series.data[yearIndex] : 0
          }));
          logger.debug("updateAxisPointer调用");
          chartInstance.setOption({
            series: [{
              id: `pie_${idx}`,
              data: pieData,
              label: {
                formatter: params => {
                  // 动态获取当前屏幕宽度，<= 768px 认为是移动端
                  const isMobile = window.innerWidth <= 768;
                  if (isMobile) {
                    // 移动端：在名称和百分比之间加入 \n 实现换行
                    return `${params.name}\n(${params.percent}%)`;
                  } else {
                    // PC 端：保持原样单行显示
                    return `${params.name}(${params.percent}%)`;
                  }
                },
              },
            }]
          });
        });
      });

      if (!resizeHandler) {
        resizeHandler = debounce(() => {
          chartInstance?.resize();
        }, 200);
        window.addEventListener('resize', resizeHandler);
      }
    };

    const updateChart = (newOption) => {
      if (!chartInstance || chartInstance.isDisposed()) {
        initChart();
        return;
      }
      if (!newOption?.series?.length) return;
      logger.debug('updateChart方法调用')
      // 使用增量更新，提高性能
      chartInstance.setOption(newOption, true, true);
    };

    // 🌟 修复点：使用 async/await 处理 nextTick 🌟
    onMounted(async () => {
      await nextTick();
      initChart();
    });

    watch(() => props.option, updateChart, { deep: false });

    onBeforeUnmount(() => {
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler.cancel();
      }
      chartInstance?.dispose();
      chartInstance = null;
    });

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