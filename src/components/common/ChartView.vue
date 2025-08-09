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
    },
    debug: { // 可在父组件临时传 debug=true 打开更多日志
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const chartContainer = ref(null);
    let chartInstance = null;
    let resizeObserver = null;
    let initCount = 0;
    let disposeCount = 0;
    let setOptionCount = 0;

    const log = (...args) => {
      if (props.debug) {
        console.log('[ChartView]', ...args);
      }
    };

    const initChart = () => {
      if (!chartContainer.value) return;

      if (!chartInstance) {
        initCount++;
        console.time(`echarts-init-${initCount}`);
        chartInstance = echarts.init(chartContainer.value);
        console.timeEnd(`echarts-init-${initCount}`);
        log(`init #${initCount} (container):`, chartContainer.value);

        // resize 监听
        window.addEventListener('resize', resizeChart);

        resizeObserver = new ResizeObserver(() => {
          if (chartInstance) {
            chartInstance.resize();
          }
        });
        resizeObserver.observe(chartContainer.value);
      }

      // 首次初始化后，如果已有 option 立即 setOption 一次
      if (props.option && Object.keys(props.option).length > 0) {
        applyOption(props.option);
      }
    };

    const applyOption = (opt) => {
      if (!chartInstance) return;
      setOptionCount++;
      const label = `echarts-setOption-${setOptionCount}`;
      console.time(label);
      // 第2个参数 notMerge = false 保留合并逻辑（你之前改成 false）
      // 第3个参数 lazyUpdate = true 尽量降低同步更新开销（可观察效果）
      try {
        chartInstance.setOption(opt, false, true);
      } catch (e) {
        console.error('[ChartView] setOption error', e);
      }
      console.timeEnd(label);
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
      disposeCount++;
      console.time(`echarts-dispose-${disposeCount}`);
      window.removeEventListener('resize', resizeChart);

      if (resizeObserver && chartContainer.value) {
        try {
          resizeObserver.unobserve(chartContainer.value);
          resizeObserver.disconnect();
        } catch (e) { /* ignore */ }
        resizeObserver = null;
      }

      if (chartInstance) {
        try {
          chartInstance.dispose();
        } catch (e) { /* ignore */ }
        chartInstance = null;
      }
      console.timeEnd(`echarts-dispose-${disposeCount}`);
      log('onBeforeUnmount, disposeCount=', disposeCount);
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
  height: 100%;
}
</style>