<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { logger } from '@/utils/Logger';

// 全局图表实例池，用于复用
const chartInstancePool = new Map();
const MAX_POOL_SIZE = 20;

export default {
  name: 'ChartView',
  props: {
    option: {
      type: Object,
      required: true
    },
    debug: { // 可在父组件临时传 debug=true 打开更多日志
      type: Boolean,
      default: false
    },
    // 新增性能优化选项
    performance: {
      type: Object,
      default: () => ({
        enableVirtualization: true,
        enableThrottle: true,
        throttleDelay: 16, // 60fps
        enableLazyUpdate: true,
        enableResizeOptimization: true,
      })
    }
  },
  setup(props) {
    const chartContainer = ref(null);
    let chartInstance = null;
    let resizeObserver = null;
    let initCount = 0;
    let disposeCount = 0;
    let setOptionCount = 0;
    let resizeThrottleTimer = null;
    let lastResizeTime = 0;

    const log = (...args) => {
      if (props.debug) {
        logger.debug('[ChartView]', ...args);
      }
    };

    // 从实例池获取或创建图表实例
    const getChartInstance = () => {
      for (const [key, instance] of chartInstancePool.entries()) {
        if (!instance.inUse) {
          instance.inUse = true;
          chartInstancePool.delete(key);

          // 清空实例并重新初始化
          const dom = chartContainer.value;
          instance.dispose(); // 销毁旧实例
          const newInstance = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: true,
            useCoarsePointer: true,
          });
          return newInstance;
        }
      }
      return null;
    };

    // 将实例放回池中
    const returnToPool = (instance) => {
      if (!instance || chartInstancePool.size >= MAX_POOL_SIZE) {
        // 池已满，直接销毁
        if (instance) {
          instance.dispose();
        }
        return;
      }

      // 清理实例状态
      instance.clear();
      instance.inUse = false;
      instance.container = null;

      // 生成唯一key
      const key = `chart_${Date.now()}_${Math.random()}`;
      chartInstancePool.set(key, instance);
    };

    const initChart = () => {
      if (!chartContainer.value) return;

      // 尝试从池中获取实例
      chartInstance = getChartInstance();

      if (!chartInstance) {
        initCount++;
        logger.time(`echarts-init-${initCount}`);

        // 创建新实例时使用性能优化配置
        chartInstance = echarts.init(chartContainer.value, null, {
          renderer: 'canvas', // 使用canvas渲染器，性能更好
          useDirtyRect: true, // 启用脏矩形优化
          useCoarsePointer: true, // 启用粗指针优化
        });

        logger.timeEnd(`echarts-init-${initCount}`);
        log(`init #${initCount} (container):`, chartContainer.value);

        // 优化resize监听
        if (props.performance.enableResizeOptimization) {
          window.addEventListener('resize', handleResizeOptimized);
        } else {
          window.addEventListener('resize', resizeChart);
        }

        // 使用ResizeObserver优化容器大小变化监听
        if (window.ResizeObserver) {
          resizeObserver = new ResizeObserver(() => {
            if (chartInstance && props.performance.enableThrottle) {
              handleResizeOptimized();
            } else if (chartInstance) {
              chartInstance.resize();
            }
          });
          resizeObserver.observe(chartContainer.value);
        }
      }

      // 首次初始化后，如果已有 option 立即 setOption 一次
      if (props.option && Object.keys(props.option).length > 0) {
        applyOption(props.option);
      }
    };

    // 优化的resize处理
    const handleResizeOptimized = () => {
      const now = Date.now();
      if (now - lastResizeTime < props.performance.throttleDelay) {
        if (resizeThrottleTimer) {
          clearTimeout(resizeThrottleTimer);
        }
        resizeThrottleTimer = setTimeout(() => {
          if (chartInstance) {
            chartInstance.resize();
            lastResizeTime = Date.now();
          }
        }, props.performance.throttleDelay);
      } else {
        if (chartInstance) {
          chartInstance.resize();
          lastResizeTime = now;
        }
      }
    };

    const applyOption = (opt) => {
      if (!chartInstance) return;

      setOptionCount++;
      const label = `echarts-setOption-${setOptionCount}`;
      logger.time(label);

      try {
        // 使用性能优化选项
        const setOptionParams = [opt, false]; // notMerge = false

        if (props.performance.enableLazyUpdate) {
          setOptionParams.push(true); // lazyUpdate = true
        }

        chartInstance.setOption(...setOptionParams);

        // 如果启用了虚拟化，延迟更新
        if (props.performance.enableVirtualization && opt.series) {
          nextTick(() => {
            if (chartInstance) {
              chartInstance.resize();
            }
          });
        }
      } catch (e) {
        logger.error('[ChartView] setOption error', e);
      }

      logger.timeEnd(label);
      log(`setOption count=${setOptionCount}`);
    };

    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    onMounted(async () => {
      await nextTick();
      log('onMounted');
      initChart();
    });

    watch(
      () => props.option,
      (newOption) => {
        if (newOption && Object.keys(newOption).length > 0) {
          // 给出更多日志：测量从 watch 到 setOption 的时间
          const t0 = performance.now();
          applyOption(newOption);
          const t1 = performance.now();
          log(`watch->applyOption elapsed ${(t1 - t0).toFixed(1)} ms`);
        }
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      if (resizeThrottleTimer) {
        clearTimeout(resizeThrottleTimer);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (chartInstance) {
        disposeCount++;
        log(`dispose #${disposeCount}`);

        // 将实例放回池中而不是销毁
        returnToPool(chartInstance);
        chartInstance = null;
      }

      // 清理事件监听
      window.removeEventListener('resize', handleResizeOptimized);
      window.removeEventListener('resize', resizeChart);
    });

    return {
      chartContainer,
    };
  },
};
</script>

<style scoped>
.chart-view {
  width: 100%;
  height: 100%;
}
</style>