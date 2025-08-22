<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';
import { logger } from '@/utils/Logger.js';

export default {
  name: 'ChartView',
  props: {
    option: {
      type: Object,
      required: true
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  emits: ['legendselectchanged'],
  setup(props, { emit }) {
    const chartContainer = ref(null);
    const chartInstance = ref(null);

    // 基础配置
    const getBaseOption = () => ({
      animation: true,
      tooltip: { trigger: 'axis' },
      legend: {
        selectedMode: 'multiple',
        selector: false,
        left: 'center',
        top: '5%'
      },
      grid: { containLabel: true }
    });

    // 处理图例选择事件 - 关键修复
    const handleLegendSelect = (params) => {
      if (params?.selected) {
        // 获取图表实例的配置
        const option = chartInstance.value.getOption();
        // 创建名称映射
        const nameMap = {};
        option.series.forEach(series => {
          nameMap[series.name] = series.originalName;
        });

        // 转换状态为原始名称
        const convertedSelected = {};
        Object.entries(params.selected).forEach(([name, selected]) => {
          if (nameMap[name]) {
            convertedSelected[nameMap[name]] = selected;
          }
        });

        // 通知父组件
        emit('legendselectchanged', {
          selected: convertedSelected
        });
      }
    };

    // 应用配置到图表
    const applyOption = (option) => {
      if (!chartInstance.value) return;

      try {
        // 创建安全配置副本
        const safeOption = JSON.parse(JSON.stringify(option));
        
        // 确保系列有效
        safeOption.series = Array.isArray(safeOption.series) 
          ? safeOption.series.filter(s => s && s.type) 
          : [];

        // 直接使用传入的图例状态
        const mergedOption = {
          ...getBaseOption(),
          ...safeOption,
          legend: {
            ...safeOption.legend,
            selectedMode: 'multiple',
            selector: false,
            selected: safeOption.legend?.selected || {}
          }
        };
        // 应用配置
        chartInstance.value.setOption(mergedOption, {
          notMerge: false,
          lazyUpdate: true
        });

        chartInstance.value.resize();
      } catch (e) {
        logger.error('[ChartView] 配置应用失败:', e);
        recoveryFallback();
      }
    };

    // 应急恢复
    const recoveryFallback = () => {
      if (!chartInstance.value) return;
      try {
        chartInstance.value.setOption(getBaseOption(), {
          notMerge: true
        });
      } catch (e) {
        logger.error('应急恢复失败:', e);
      }
    };

    // 初始化图表
    const initChart = () => {
      if (!chartContainer.value) {
        logger.error('[ChartView] 容器元素未找到');
        return;
      }

      try {
        // 销毁旧实例
        if (chartInstance.value) {
          chartInstance.value.dispose();
        }
        
        // 创建新实例
        chartInstance.value = echarts.init(chartContainer.value, null, {
          renderer: 'canvas',
          useDirtyRect: true
        });

        // 设置事件监听
        chartInstance.value.on('legendselectchanged', handleLegendSelect);
        
        // 添加错误监听器
        chartInstance.value.on('error', (error) => {
          logger.error('ECharts 内部错误:', error);
        });

        // 应用初始配置
        applyOption(props.option);
      } catch (e) {
        logger.error('[ChartView] 初始化失败:', e);
      }
    };

    // 调整大小
    const handleResize = () => {
      chartInstance.value?.resize();
    };
    
    // 防抖调整大小
    const debouncedResize = debounce(handleResize, 300);

    // 监听配置变化
    watch(() => props.option, (newOption) => {
      if (!newOption) return;
      applyOption(newOption);
    }, { deep: true });

    // 生命周期钩子
    onMounted(() => {
      initChart();
      window.addEventListener('resize', debouncedResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', debouncedResize);
      debouncedResize.cancel();
      chartInstance.value?.dispose();
    });

    // 暴露方法
    const getChartInstance = () => chartInstance.value;

    return {
      chartContainer,
      getChartInstance,
      handleResize
    };
  }
};
</script>

<style scoped>
.chart-view {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
}
</style>