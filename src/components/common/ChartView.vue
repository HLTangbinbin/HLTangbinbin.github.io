
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

echarts.use([GridComponent, TooltipComponent, LegendComponent, BarChart, LineChart, CanvasRenderer]);

export default {
  name: 'ChartView',
  props: {
    option: { type: Object, required: true },
    initSelectAll: { type: Boolean, default: true }
  },
  emits: ['legendStateChange'],   // ✅ 新增
  setup(props, { expose, emit }) {
    const chartContainer = ref(null);
    let chartInstance = null;
    let resizeHandler = null;

    const initChart = () => {
      if (!chartContainer.value || !props.option?.series?.length) return;

      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }
      chartInstance = echarts.init(chartContainer.value);

      chartInstance.setOption(props.option, true);

      // 初始化 legend 状态（全选 / 全不选）
      const legends = chartInstance.getOption().legend?.[0]?.data || [];
      legends.forEach(name => {
        chartInstance.dispatchAction({
          type: props.initSelectAll ? 'legendSelect' : 'legendUnSelect',
          name
        });
      });

      // ✅ 监听 legend 手动选择事件
      chartInstance.on('legendselectchanged', (params) => {
        const allSelected = Object.values(params.selected).every(v => v === true);
        const noneSelected = Object.values(params.selected).every(v => v === false);

        // 全部选中 → 按钮状态 true
        // 全部未选 → 按钮状态 false
        // 其它情况不改变父状态（保持中间态逻辑）
        if (allSelected) {
          emit('legendStateChange', true);
        } else if (noneSelected) {
          emit('legendStateChange', false);
        }
      });

      resizeHandler = debounce(() => chartInstance?.resize(), 200);
      window.addEventListener('resize', resizeHandler);
    };

    const updateChart = (newOption) => {
      if (!chartInstance) {
        initChart();
        return;
      }
      if (!newOption?.series?.length) return;
      logger.debug('更新了chart')
      chartInstance.setOption(newOption, false);
    };

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

    onMounted(initChart);
    watch(() => props.option, updateChart, { deep: true });
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
