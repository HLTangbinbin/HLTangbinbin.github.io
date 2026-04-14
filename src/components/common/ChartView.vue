<template>
  <div ref="chartContainer" class="chart-view"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, MapChart } from 'echarts/charts';
import { TitleComponent, GridComponent, TooltipComponent, LegendComponent, TimelineComponent, VisualMapComponent, GeoComponent, MarkPointComponent } from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import debounce from 'lodash-es/debounce';
import { ensureMapRegistered } from '@/utils/mapProvider.js';

echarts.use([TitleComponent, GridComponent, TooltipComponent, LegendComponent, MarkPointComponent, BarChart, LineChart, PieChart, CanvasRenderer, SVGRenderer, TimelineComponent, VisualMapComponent, GeoComponent, MapChart]);

export default {
  name: 'ChartView',
  props: {
    option: { type: Object, required: true },
    chartId: { type: String, required: true },
    themeMode: { type: String, default: 'light' },
    pieConfig: { type: Object, default: () => ({}) },
    initSelectAll: { type: Boolean, default: true }
  },
  emits: ['legendStateChange', 'legendSelectionChange', 'dataPointClick'],
  setup(props, { expose, emit }) {
    const chartContainer = ref(null);
    let chartInstance = null;
    let resizeHandler = null;
    let touchStartHandler = null;
    let touchMoveHandler = null;
    let touchEndHandler = null;
    let pieUpdateContext = null;
    let hoveredSeriesName = '';

    const buildOptionWithTooltipHoverState = (option) => {
      const sourceFormatter = option?.tooltip?.formatter;
      if (typeof sourceFormatter !== 'function') return option;

      return {
        ...option,
        tooltip: {
          ...option.tooltip,
          formatter: (params) => {
            const nextParams = Array.isArray(params)
              ? params.map((item) => ({ ...item, __tooltipHovered: !!hoveredSeriesName && item?.seriesName === hoveredSeriesName }))
              : { ...params, __tooltipHovered: !!hoveredSeriesName && params?.seriesName === hoveredSeriesName };
            return sourceFormatter(nextParams);
          }
        }
      };
    };

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

    const hideTooltip = () => {
      if (!chartInstance || chartInstance.isDisposed()) return;
      chartInstance.dispatchAction({ type: 'hideTip' });
      chartInstance.dispatchAction({ type: 'updateAxisPointer', currTrigger: 'leave' });
    };

    const isMobileViewport = () => window.innerWidth <= 768;

    const showTooltipFromTouch = (event) => {
      if (!isMobileViewport() || !chartInstance || chartInstance.isDisposed()) return;
      const touch = event.touches?.[0];
      const container = chartContainer.value;
      if (!touch || !container) return;

      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      // Mobile tooltip should track the finger immediately instead of relying on long-press selection.
      chartInstance.dispatchAction({
        type: 'showTip',
        x,
        y
      });
    };

    const bindMobileTooltipEvents = () => {
      const container = chartContainer.value;
      if (!container) return;

      touchStartHandler = (event) => {
        if (!isMobileViewport()) return;
        event.preventDefault();
        showTooltipFromTouch(event);
      };

      touchMoveHandler = () => {
        if (!isMobileViewport()) return;
        hideTooltip();
      };

      touchEndHandler = () => {
        hideTooltip();
      };

      container.addEventListener('touchstart', touchStartHandler, { passive: false });
      container.addEventListener('touchmove', touchMoveHandler, { passive: true });
      container.addEventListener('touchend', touchEndHandler, { passive: true });
      container.addEventListener('touchcancel', touchEndHandler, { passive: true });
    };

    const unbindMobileTooltipEvents = () => {
      const container = chartContainer.value;
      if (!container) return;
      if (touchStartHandler) container.removeEventListener('touchstart', touchStartHandler);
      if (touchMoveHandler) container.removeEventListener('touchmove', touchMoveHandler);
      if (touchEndHandler) {
        container.removeEventListener('touchend', touchEndHandler);
        container.removeEventListener('touchcancel', touchEndHandler);
      }
      touchStartHandler = null;
      touchMoveHandler = null;
      touchEndHandler = null;
    };

    const getPrimaryCategoryAxisData = (option) => {
      if (!option) return [];
      const xa = option.xAxis;
      const ya = option.yAxis;
      const x0 = Array.isArray(xa) ? xa[0] : xa;
      const y0 = Array.isArray(ya) ? ya[0] : ya;
      if (x0?.type === 'category' && Array.isArray(x0.data)) return x0.data;
      if (y0?.type === 'category' && Array.isArray(y0.data)) return y0.data;
      return Array.isArray(x0?.data) ? x0.data : [];
    };

    const resolveCategoryDataIndex = (pointerValue, categories) => {
      if (!categories?.length) return 0;
      const raw = pointerValue?.value !== undefined ? pointerValue.value : pointerValue;
      if (typeof raw === 'number' && Number.isFinite(raw)) {
        const i = Math.round(raw);
        if (i >= 0 && i < categories.length) return i;
      }
      const str = String(raw ?? '');
      const asNum = Number(str);
      if (Number.isFinite(asNum) && asNum === Math.floor(asNum) && asNum >= 0 && asNum < categories.length) {
        return asNum;
      }
      let idx = categories.findIndex((c) => String(c) === str);
      if (idx >= 0) return idx;
      if (Number.isFinite(asNum)) {
        idx = categories.findIndex((c) => Number(String(c)) === asNum);
        if (idx >= 0) return idx;
      }
      return 0;
    };

    const getNearestSeriesValue = (seriesData, targetIndex) => {
      if (!Array.isArray(seriesData) || seriesData.length === 0) return null;
      const idx = Number.isFinite(targetIndex) ? Math.min(Math.max(0, Math.floor(targetIndex)), seriesData.length - 1) : 0;
      for (let index = idx; index >= 0; index -= 1) {
        const current = seriesData[index];
        const value = typeof current === 'object' && current !== null ? current.value : current;
        if (value !== null && value !== undefined && value !== '' && value !== '-') {
          return current;
        }
      }
      return null;
    };

    const resolvePieTriggerKeys = (pieConfig = {}) => {
      return Array.isArray(pieConfig.triggerEnglishKeys) ? pieConfig.triggerEnglishKeys : [];
    };

    const normalizePieData = (pieData = [], pieConfig = {}) => {
      if (!Array.isArray(pieData) || pieData.length === 0) return [];

      const topN = Number(pieConfig.topN || 0);
      if (!topN || pieData.length <= topN) {
        return pieData;
      }

      const sorted = [...pieData].sort((a, b) => Number(b.value || 0) - Number(a.value || 0));
      const topItems = sorted.slice(0, topN);
      const otherItems = sorted.slice(topN);
      const otherTotal = otherItems.reduce((sum, item) => sum + Number(item.value || 0), 0);

      if (otherTotal <= 0) {
        return topItems;
      }

      return [
        ...topItems,
        {
          name: pieConfig.mergeOthersLabel || '其他',
          value: Number(otherTotal.toFixed(2))
        }
      ];
    };

    const buildPieUpdateContext = (option, pieConfig = {}) => {
      if (!pieConfig?.enabled || !Array.isArray(pieConfig.pies) || !option?.series?.length) {
        return null;
      }

      const categories = getPrimaryCategoryAxisData(option);
      const sourceSeries = option.series.filter(
        (series) => series && series.type !== 'pie' && !series.isTrendline && series.zbCode
      );

      const pies = pieConfig.pies.map((pie, idx) => {
        const triggerKeys = resolvePieTriggerKeys(pie);
        const targetSeries = sourceSeries.filter((series) => triggerKeys.includes(series.zbCode));
        return {
          idx,
          config: pie,
          series: targetSeries
        };
      }).filter((pie) => pie.series.length > 0);

      if (!pies.length) return null;

      return {
        categories,
        pies,
        cache: new Map()
      };
    };

    const buildPieSeriesUpdates = (context, dataIndex) => {
      if (!context?.pies?.length) return [];

      return context.pies.map((pie) => {
        const cacheKey = `${pie.idx}|${dataIndex}`;
        let pieData = context.cache.get(cacheKey);

        if (!pieData) {
          pieData = pie.series
            .map((series) => {
              const rawVal = Array.isArray(series.data) ? getNearestSeriesValue(series.data, dataIndex) : null;
              const value = typeof rawVal === 'object' && rawVal !== null ? rawVal.value : rawVal;
              if (value === null || value === undefined || value === '' || value === '-' || Number.isNaN(Number(value))) {
                return null;
              }
              return {
                name: series.name,
                value: Number(value)
              };
            })
            .filter(Boolean);

          pieData = normalizePieData(pieData, pie.config);
          context.cache.set(cacheKey, pieData);
        }

        return {
          id: `pie_${pie.idx}`,
          data: pieData,
          label: {
            formatter: (params) => {
              const isMobile = window.innerWidth <= 768;
              return isMobile ? `${params.name}\n(${params.percent}%)` : `${params.name}(${params.percent}%)`;
            },
          },
        };
      });
    };

    const initChart = () => {
      if (!chartContainer.value || !props.option?.series?.length) return;

      if (chartInstance && !chartInstance.isDisposed()) {
        updateChart(props.option);
        return;
      }

      const renderer = window.innerWidth <= 768 ? 'svg' : 'canvas';
      chartInstance = echarts.init(chartContainer.value, props.themeMode === 'dark' ? 'dark' : null, { renderer });
      chartInstance.setOption(buildOptionWithTooltipHoverState(props.option), true);
      pieUpdateContext = buildPieUpdateContext(props.option, props.pieConfig);

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
        emit('legendSelectionChange', { ...(params.selected || {}) });
        const allSelected = Object.values(params.selected).every(v => v === true);
        const noneSelected = Object.values(params.selected).every(v => v === false);
        if (allSelected) emit('legendStateChange', true);
        else if (noneSelected) emit('legendStateChange', false);
      });

      chartInstance.on('click', (params) => {
        const legends = props.option?.originalLegendData || props.option?.legend?.data || [];
        let linkValue = '';

        if (params?.seriesType === 'map') {
          linkValue = String(params.name || '').trim();
        } else if (legends.length > 1) {
          linkValue = String(params.seriesName || '').trim();
        }

        if (!linkValue) return;

        emit('dataPointClick', {
          value: linkValue,
          sourceType: params?.seriesType || 'series'
        });
      });

      chartInstance.on('mouseover', (params) => {
        hoveredSeriesName = String(params?.seriesName || '').trim();
      });

      chartInstance.on('mouseout', () => {
        hoveredSeriesName = '';
      });

      chartInstance.getZr().on('click', (event) => {
        if (!event?.target) {
          hideTooltip();
        }
      });

      chartInstance.on('globalout', () => {
        hideTooltip();
      });

      unbindMobileTooltipEvents();
      bindMobileTooltipEvents();

      // 🌟 性能优化核心：缓存上一次悬停的索引
      let lastDataIndex = -1;
      chartInstance.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo?.[0];
        if (!xAxisInfo) return;

        const pieConfig = props.pieConfig;
        if (!pieConfig?.enabled || !Array.isArray(pieConfig.pies)) return;
        if (!pieUpdateContext) return;

        const dataIndex = resolveCategoryDataIndex(xAxisInfo.value, pieUpdateContext.categories);
        if (dataIndex === lastDataIndex) return;
        lastDataIndex = dataIndex;
        const pieSeriesUpdates = buildPieSeriesUpdates(pieUpdateContext, dataIndex);

        if (pieSeriesUpdates.length > 0) {
          chartInstance.setOption({ series: pieSeriesUpdates });
        }
      });

      // 🌟 绝杀拦截器：直接挂载原生事件！
      chartInstance.on('timelineplaychanged', (params) => {
        // playState 为 true 代表用户按下了“播放”键
        if (params.playState) {
          // 获取当前图表的最新配置状态
          const currentOption = chartInstance.getOption();
          if (!currentOption || !currentOption.timeline || currentOption.timeline.length === 0) return;

          const timelineOpt = currentOption.timeline[0];
          const currentIndex = timelineOpt.currentIndex;
          const dataLength = timelineOpt.data.length;

          // 核心判断：如果用户点了播放，但当前已经停在最后一年
          if (currentIndex === dataLength - 1) {
            // 强行把时间轴的指针拨回第一年 (index: 0)
            chartInstance.dispatchAction({
              type: 'timelineChange',
              currentIndex: 0
            });
            // ECharts 收到 playState: true 且 index 变为 0 后，会自动顺畅地往后继续播！
          }
        }
      });

      if (!resizeHandler) {
        resizeHandler = debounce(() => {
          chartInstance?.resize();
        }, 200);
        window.addEventListener('resize', resizeHandler);
      }
    };

    const ensureOptionMapsReady = async (option) => {
      if (!option?.series?.length) return;
      const mapTypes = [...new Set(
        option.series
          .filter((series) => series?.type === 'map' && series?.map)
          .map((series) => series.map)
      )];
      if (!mapTypes.length) return;
      await Promise.all(mapTypes.map((mapType) => ensureMapRegistered(mapType)));
    };

    const updateChart = async (newOption) => {
      await ensureOptionMapsReady(newOption);
      if (!chartInstance || chartInstance.isDisposed()) {
        initChart();
        return;
      }
      if (!newOption?.series?.length) return;
      pieUpdateContext = buildPieUpdateContext(newOption, props.pieConfig);
      // 使用增量更新，提高性能
      chartInstance.setOption(buildOptionWithTooltipHoverState(newOption), true, true);
    };

    // 🌟 修复点：使用 async/await 处理 nextTick 🌟
    onMounted(async () => {
      await nextTick();
      await ensureOptionMapsReady(props.option);
      initChart();
    });

    watch(() => props.option, updateChart, { deep: false });
    watch(() => props.themeMode, async () => {
      if (!chartContainer.value) return;
      if (chartInstance && !chartInstance.isDisposed()) {
        chartInstance.dispose();
        chartInstance = null;
      }
      pieUpdateContext = null;
      await nextTick();
      initChart();
    });

    onBeforeUnmount(() => {
      unbindMobileTooltipEvents();
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler.cancel();
      }
      chartInstance?.dispose();
      chartInstance = null;
      pieUpdateContext = null;
    });

    return { chartContainer };
  }
};
</script>

<style scoped>
.chart-view {
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
</style>
