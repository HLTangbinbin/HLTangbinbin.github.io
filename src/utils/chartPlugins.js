import { calculateLinearRegression, fitMarriageBirthDynamic } from './analysisEngine.js';
import { getChartThemeTokens } from './theme.js';

export const ComparePlugin = (option, ctx) => {
  const xAxisData = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'];
  const yearMap = {};

  ctx.filteredYears.forEach((dateStr, dateIndex) => {
    if (!dateStr || dateStr.length < 6) return;
    const year = dateStr.substring(0, 4);
    const monthIdx = parseInt(dateStr.substring(4, 6), 10) - 1;

    if (!yearMap[year]) yearMap[year] = {};

    ctx.seriesData.forEach(series => {
      if (!yearMap[year][series.name]) yearMap[year][series.name] = new Array(12).fill(null);
      const safeValue = series.data[dateIndex] !== undefined ? series.data[dateIndex] : null;
      yearMap[year][series.name][monthIdx] = safeValue;
    });
  });

  const availableYears = Object.keys(yearMap).sort((a, b) => b - a);
  const selectedYearsRaw = availableYears.slice(0, ctx.params.compareYearCount);
  const selectedYears = selectedYearsRaw.sort((a, b) => a - b);

  const newSeries = [];
  const legendData = [];

  const focusLegend = ctx.params.linkedLegend || ctx.params.selectedLegend;
  let targetSeriesData = ctx.seriesData;
  if (ctx.seriesData.length > 1) {
    if (focusLegend) {
      targetSeriesData = ctx.seriesData.filter(s => s.name === focusLegend);
      if (targetSeriesData.length === 0) targetSeriesData = [ctx.seriesData[0]];
    } else {
      // 同比模式下默认聚焦首个指标，避免“指标 x 年份”同时铺开造成图例混乱
      targetSeriesData = [ctx.seriesData[0]];
    }
  }

  const isSingleSeries = targetSeriesData.length === 1;

  selectedYears.forEach(year => {
    targetSeriesData.forEach(series => {
      const seriesName = isSingleSeries ? year : `${series.name} (${year})`;
      legendData.push(seriesName);
      newSeries.push({
        name: seriesName,
        type: 'line',
        connectNulls: false,
        symbolSize: 6,
        data: yearMap[year][series.name] || new Array(12).fill(null)
      });
    });
  });

  option.xAxis = { type: 'category', boundaryGap: false, data: xAxisData, axisLabel: { interval: 0 } };
  option.series = newSeries;
  option.legend.data = legendData;
  return option;
};

export const SmartAnalysisPlugin = (option, ctx) => {
  const theme = getChartThemeTokens();
  const futureSteps = ctx.params.isYearlyCompare ? 0 : 3;

  if (futureSteps > 0 && ctx.filteredYears.length > 0) {
    const isMonthly = ctx.params.dbCode === 'yd' || ctx.params.viewMode === 'monthly';
    let current = String(ctx.filteredYears[ctx.filteredYears.length - 1]);
    for (let i = 0; i < futureSteps; i++) {
      if (isMonthly) {
        let y = parseInt(current.substring(0, 4));
        let m = parseInt(current.substring(4, 6));
        m++;
        if (m > 12) { m = 1; y++; }
        current = `${y}${m.toString().padStart(2, '0')}`;
      } else {
        current = String(parseInt(current) + 1);
      }
      ctx.filteredYears.push(current);
    }
    if (!ctx.params.isYearlyCompare) {
      if (Array.isArray(option.xAxis)) option.xAxis[0].data = ctx.filteredYears;
      else if (option.xAxis.type === 'category') option.xAxis.data = ctx.filteredYears;
      else option.yAxis.data = ctx.filteredYears;
    }
  }

  const trendLines = [];
  const focusedLegend = ctx.params.linkedLegend || ctx.params.selectedLegend;

  option.series.forEach(s => {
    if (s.type === 'line' || s.type === 'bar') {
      if (focusedLegend && s.name !== focusedLegend && option.series.length > 1) return;

      const trendData = calculateLinearRegression(s.data, futureSteps);
      const meta = trendData._metadata;
      const themeColor = s.itemStyle?.color || theme.accent;

      trendLines.push({
        name: s.name + ' (趋势)',
        type: 'line',
        data: trendData,
        isTrendline: true,
        lineStyle: { type: 'dashed', width: 2, opacity: 0.8 },
        itemStyle: { color: themeColor },
        symbol: 'none',
        tooltip: { valueFormatter: value => value + ' (拟合)' },
        z: 5
      });

      if (futureSteps > 0 && meta) {
        trendLines.push({
          name: `${s.name} (预测下限)`,
          type: 'line',
          data: meta.lowerBand,
          isTrendline: true,
          hideInLegend: true,
          stack: `conf-band-${s.name}`,
          lineStyle: { opacity: 0 },
          symbol: 'none',
          tooltip: { show: false },
          silent: true
        });

        trendLines.push({
          name: `${s.name} (预测区间)`,
          type: 'line',
          data: meta.bandDiff,
          isTrendline: true,
          hideInLegend: true,
          stack: `conf-band-${s.name}`,
          lineStyle: { opacity: 0 },
          areaStyle: { color: themeColor, opacity: 0.25 },
          symbol: 'none',
          tooltip: { show: false },
          silent: true
        });
      }

      if (meta && meta.anomalies.length > 0) {
        s.markPoint = {
          symbol: 'pin',
          symbolSize: 45,
          itemStyle: { color: '#ef4444', shadowBlur: 10, shadowColor: 'rgba(239,68,68,0.4)' },
          label: { color: theme.textInverse, fontSize: 10, formatter: '异常' },
          data: meta.anomalies.map(a => ({ coord: [a.x, a.y], name: '异常点', value: a.diff }))
        };
      }
    }
  });

  option.series = [...option.series, ...trendLines];
  return option;
};

export const PiePlugin = (option, ctx) => {
  if (!ctx.seriesData || ctx.seriesData.length === 0 || !ctx.filteredYears || ctx.filteredYears.length === 0) return option;

  const theme = getChartThemeTokens();
  option.color = option.color || theme.palette;
  const futureSteps = (ctx.params.enableSmartAnalysis && !ctx.params.isYearlyCompare) ? 3 : 0;
  const targetIndex = Math.max(0, ctx.filteredYears.length - 1 - futureSteps);
  const legendData = option.legend?.data || [];

  ctx.params.pieConfig.pies.forEach((pie, idx) => {
    const triggerKeys = resolvePieTriggerKeys(pie);
    const targetSeries = option.series.filter(s => triggerKeys.includes(s.zbCode) && !s.isTrendline);
    const pieData = [];

    targetSeries.forEach(series => {
      if (Array.isArray(series.data)) {
        const rawVal = getNearestSeriesValue(series.data, targetIndex);
        const val = typeof rawVal === 'object' && rawVal !== null ? rawVal.value : rawVal;
        if (val !== null && val !== undefined && val !== '-' && val !== '' && !Number.isNaN(Number(val))) {
          pieData.push({ name: series.name, value: Number(val) });
        }
      }
    });

    const finalPieData = normalizePieData(pieData, pie);
    if (finalPieData.length === 0) return;

    let r = pie.radius || '20%';
    if (ctx.params.isMobile && typeof r === 'string' && r.endsWith('px')) {
      r = Math.max(Math.round(parseInt(r) * 0.65), 30) + 'px';
    }

    let cx = (pie.center && pie.center[0]) ? pie.center[0] : '50%';
    let cy = (pie.center && pie.center[1]) ? pie.center[1] : '170px';

    if (ctx.params.isMobile && typeof cy === 'string' && cy.endsWith('px')) {
      cy = Math.max(Math.round(parseInt(cy) * 0.75), 90) + 'px';
    } else if (ctx.params.isMobile && typeof cy === 'number') {
      cy = Math.max(Math.round(cy * 0.75), 90);
    }

    option.series.push({
      id: `pie_${idx}`,
      type: 'pie',
      radius: r,
      center: [cx, cy],
      data: finalPieData,
      label: { formatter: p => `${p.name}(${p.percent}%)` },
      emphasis: { focus: 'self' },
      itemStyle: {
        color: (p) => {
          const legendIndex = legendData.indexOf(p.name);
          return (legendIndex !== -1 && option.color[legendIndex]) ? option.color[legendIndex] : option.color[p.dataIndex % option.color.length];
        }
      }
    });
  });

  return option;
};

const resolvePieTriggerKeys = (pieConfig = {}) => {
  if (Array.isArray(pieConfig.triggerMetricIds) && pieConfig.triggerMetricIds.length > 0) {
    return pieConfig.triggerMetricIds;
  }
  if (Array.isArray(pieConfig.triggerIndicatorKeys) && pieConfig.triggerIndicatorKeys.length > 0) {
    return pieConfig.triggerIndicatorKeys;
  }
  return Array.isArray(pieConfig.triggerZbCodes) ? pieConfig.triggerZbCodes : [];
};

const getNearestSeriesValue = (seriesData, targetIndex) => {
  if (!Array.isArray(seriesData) || seriesData.length === 0) return null;
  const idx = Number.isFinite(targetIndex)
    ? Math.min(Math.max(0, Math.floor(targetIndex)), seriesData.length - 1)
    : 0;
  for (let index = idx; index >= 0; index -= 1) {
    const current = seriesData[index];
    const value = typeof current === 'object' && current !== null ? current.value : current;
    if (value !== null && value !== undefined && value !== '' && value !== '-') {
      return current;
    }
  }
  return null;
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

export const BirthPredictionPlugin = (option, ctx) => {
  if (!ctx.params.enableBirthPrediction || !ctx.marriageArr.length || !ctx.birthArr.length) return option;

  const nextBirth = fitMarriageBirthDynamic(ctx.marriageArr, ctx.birthArr, 20).nextYearPred.pred;

  const newSeries = [];
  option.series.forEach(s => {
    if (s.name.includes('出生')) {
      if (ctx.params.chartType === 'line') {
        const lastIndex = s.data.length - 1;
        const updatedData = [...s.data];
        updatedData[lastIndex] = nextBirth;

        newSeries.push({ ...s, type: 'line', name: '出生人口', data: updatedData.slice(0, lastIndex), lineStyle: { type: 'solid' } });
        newSeries.push({ ...s, type: 'line', name: '出生人口预测', data: updatedData.map((d, i) => (i >= lastIndex - 1 ? d : null)), lineStyle: { color: s.lineStyle?.color || '#5470C6', type: 'dashed' }, symbol: 'circle', symbolSize: 10, connectNulls: true });
      } else {
        newSeries.push({ ...s, type: 'bar' });
        newSeries.push({ ...s, type: 'bar', data: [] });
      }
    } else {
      newSeries.push(s);
    }
  });

  option.series = newSeries;
  return option;
};

export const LegendFilterPlugin = (option) => {
  if (option.series && option.legend) {
    option.legend.data = option.series
      .filter(s => s.name && s.hideInLegend !== true && s.isTrendline !== true)
      .map(s => String(s.name));
  }
  return option;
};

// 新增：地图与时间轴融合插件
// chartPlugins.js 
export const MapTimelinePlugin = (option, ctx) => {
  if (ctx.params.chartType !== 'map') return option;
  const theme = getChartThemeTokens();

  const { mapType, mapTimelineData = {}, metricName = '指标', unit = '' } = ctx.params || {};
  const { years = [], timelineData = [] } = mapTimelineData;

  if (years.length === 0 || timelineData.length === 0) return option;

  // 🌟 UI 探针：检测是否为移动端屏幕 (小于 768px 视为移动端)
  const isMobile = window.innerWidth <= 768;

  // 🌟 1. 扫描所有数据，计算绝对极值与色带翻转逻辑 (已完美修复的底层)
  let allValidValues = [];
  timelineData.forEach(td => {
    if (Array.isArray(td.data)) {
      td.data.forEach(item => {
        if (item.value !== null && item.value !== '' && item.value !== undefined && !isNaN(item.value)) {
          allValidValues.push(Number(item.value));
        }
      });
    }
  });

  let globalMin = 0;
  let globalMax = 100;
  let isNegativeMetric = false;

  if (allValidValues.length > 0) {
    const absoluteMin = Math.min(...allValidValues);
    const absoluteMax = Math.max(...allValidValues);

    globalMin = Math.min(absoluteMin, 0);
    globalMax = Math.max(absoluteMax, 0);

    if (absoluteMax <= 0 && absoluteMin < 0) {
      isNegativeMetric = true;
    }
  }

  let inRangeColors = theme.themeMode === 'dark'
    ? ['#163244', '#1b4760', '#215d7a', '#287594', '#2e8dae', '#35a5c8', '#48bddb']
    : ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026'];
  if (isNegativeMetric) {
    inRangeColors.reverse();
  }

  const mapLabelColor = theme.themeMode === 'dark' ? '#e2e8f0' : theme.textPrimary;
  const mapLabelEmphasisColor = theme.themeMode === 'dark' ? '#f8fafc' : theme.textPrimary;

  // 🌟 2. 组装每年的帧数据
  const enrichedOptions = timelineData.map((td, index, arr) => {
    const prevData = index > 0 ? arr[index - 1].data : [];

    const validData = td.data
      .filter(item => item.value !== null && item.value !== '' && item.value !== undefined && !isNaN(item.value))
      .map(item => ({ ...item, value: Number(item.value) }))
      .sort((a, b) => b.value - a.value);

    const currentYearMax = validData.length > 0 ? validData[0].value : 1;
    const rankMap = new Map(validData.map((item, idx) => [item.name, idx + 1]));
    const prevDataMap = new Map(prevData.map((item) => [item.name, item]));

    const enrichedData = td.data.map(item => {
      // 拦截空数据
      if (item.value === null || item.value === '' || item.value === undefined || isNaN(item.value)) {
        return { name: item.name };
      }

      const val = Number(item.value);
      const rank = rankMap.get(item.name) || 0;
      const ratio = currentYearMax === 0 ? 0 : ((val / currentYearMax) * 100).toFixed(1);

      let growth = null;
      if (prevData.length > 0) {
        const prevItem = prevDataMap.get(item.name);
        if (prevItem && prevItem.value !== null && prevItem.value !== '' && !isNaN(prevItem.value) && Number(prevItem.value) !== 0) {
          growth = (((val - Number(prevItem.value)) / Math.abs(Number(prevItem.value))) * 100).toFixed(1);
        }
      }

      return { ...item, value: val, rank, ratio, growth };
    });

    return {
      title: { text: `${metricName} (${td.year})` },
      series: [{
        data: enrichedData,
        label: {
          show: true, color: mapLabelColor, fontSize: isMobile ? 8 : 10,
          textBorderColor: theme.themeMode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255,255,255,0.7)',
          textBorderWidth: 2,
          formatter: (p) => (!isNaN(p.value) && p.value !== null && p.value !== '') ? p.name : ''
        },
        emphasis: {
          label: {
            show: true,
            color: mapLabelEmphasisColor,
            fontWeight: 'bold',
            textBorderColor: theme.themeMode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255,255,255,0.82)',
            textBorderWidth: 2
          }
        }
      }]
    };
  });

  // 🌟 3. 组装外层配置
  const mapOption = {
    xAxis: { show: false }, yAxis: { show: false }, grid: { show: false },
    toolbox: { show: !isMobile, right: '5%', top: '5%', feature: { restore: { title: '居中还原' } } }, // 移动端隐藏还原按钮省空间

    // 🎨 UI 升级 3：时间轴全面换装“青色 (Cyan)”主题！
    timeline: {
      axisType: 'category', autoPlay: true, loop: false, playInterval: 2000,
      data: years,
      bottom: isMobile ? 0 : 10, left: isMobile ? 10 : 30, right: isMobile ? 10 : 30,
      label: { formatter: '{value} 年', color: theme.textMuted, fontSize: isMobile ? 10 : 12 },
      lineStyle: { color: theme.borderDefault, width: 2 },
      itemStyle: { color: theme.borderDefault, borderColor: theme.borderDefault },
      checkpointStyle: {
        color: theme.accentStrong,
        borderColor: theme.accentSoft,
        borderWidth: 5,
        symbolSize: isMobile ? 10 : 14
      },
      progress: {
        lineStyle: { color: theme.accentStrong, width: 2 },
        itemStyle: { color: theme.accentStrong, borderColor: theme.accentStrong }
      },
      controlStyle: {
        showNextBtn: false, showPrevBtn: false,
        color: theme.textMuted, borderColor: theme.textMuted,
        itemSize: isMobile ? 14 : 20
      }
    },

    title: { text: `${metricName}`, left: 'center', top: isMobile ? 0 : 10, textStyle: { fontSize: isMobile ? 15 : 18, color: theme.textPrimary } },

    // 🎨 UI 升级 2：响应式 visualMap 柱子！
    visualMap: {
      type: 'continuous',
      min: globalMin,
      max: globalMax,
      precision: (globalMax - globalMin) <= 20 ? 2 : 0,
      calculable: true, text: ['高', '低'],
      inRange: { color: inRangeColors },
      // 根据屏幕宽度自动调整热力图柱子的高度和粗细
      itemHeight: isMobile ? 80 : 120,
      itemWidth: isMobile ? 10 : 16,
      left: isMobile ? '2%' : '5%',
      bottom: isMobile ? '10%' : '15%',
      textStyle: { color: theme.textMuted, fontSize: isMobile ? 10 : 12 }
    },

    tooltip: {
      trigger: 'item',
      backgroundColor: theme.bgCard, borderColor: theme.borderDefault, borderWidth: 1, padding: 14,
      extraCssText: 'box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-radius: 8px;',
      textStyle: { color: theme.textPrimary },
      formatter: (params) => {
        if (params.componentType !== 'series') return;
        if (params.value === undefined || params.value === null || params.value === '' || isNaN(params.value)) return '';

        const data = params.data || {};
        const displayValue = parseFloat(Number(params.value).toFixed(2));
        const rank = data.rank ? `<span style="background: ${theme.accentSoft}; color: ${theme.accent}; padding: 2px 8px; border-radius: 4px; font-weight: bold;">第 ${data.rank} 名</span>` : '-';
        const ratio = data.ratio || 0;

        let growthHtml = `<span style="color: ${theme.textMuted};">-</span>`;
        if (data.growth !== null && data.growth !== undefined) {
          const gVal = Number(data.growth);
          if (gVal > 0) growthHtml = `<span style="color: #EF4444; font-weight: bold;">+${gVal}% 🔺</span>`;
          else if (gVal < 0) growthHtml = `<span style="color: #10B981; font-weight: bold;">${gVal}% 🔻</span>`;
          else growthHtml = `<span style="color: ${theme.textMuted};">持平 -</span>`;
        }

        return `
          <div style="min-width: 190px; font-family: sans-serif; color: ${theme.textSecondary};">
            <div style="font-size: 15px; font-weight: bold; border-bottom: 1px solid ${theme.borderDefault}; padding-bottom: 8px; margin-bottom: 10px; color: ${theme.textPrimary};">${params.name}</div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
              <span style="color: ${theme.textMuted};">${metricName}</span>
              <span style="color: ${theme.accentStrong}; font-weight: bold; font-size: 15px;">${displayValue} <span style="font-size: 12px; font-weight: normal;">${unit}</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
              <span style="color: ${theme.textMuted};">较上一年</span>${growthHtml}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 12px;">
              <span style="color: ${theme.textMuted};">当年排名</span>${rank}
            </div>
            <div style="display: flex; align-items: center; font-size: 12px;">
              <span style="color: ${theme.textMuted}; width: 55px;">极值占比</span>
              <div style="flex: 1; margin: 0 8px; height: 6px; background-color: ${theme.borderDefault}; border-radius: 3px; overflow: hidden;">
                <div style="width: ${ratio}%; height: 100%; background: ${theme.accentStrong}; border-radius: 3px; transition: width 0.3s;"></div>
              </div>
              <span style="color: ${theme.accentStrong}; font-weight: bold; font-size: 12px; width: 35px; text-align: right;">${ratio}%</span>
            </div>
          </div>`;
      }
    },

    series: [{
      name: metricName, type: 'map', map: mapType, roam: false,
      zoom: isMobile ? 1.2 : 1.15, // 移动端稍微放大一点地图
      top: isMobile ? '12%' : '15%',
      bottom: isMobile ? '10%' : '15%',
      // 🎨 UI 升级 1：给地图本体加上“立体投影”阴影效果！打破白底单调！
      itemStyle: {
        areaColor: theme.themeMode === 'dark' ? '#182233' : theme.bgCardSoft,
        borderColor: theme.themeMode === 'dark' ? '#334155' : theme.bgCard,
        borderWidth: 1,
        shadowColor: theme.themeMode === 'dark' ? 'rgba(2, 6, 23, 0.32)' : 'rgba(0, 0, 0, 0.12)',
        shadowBlur: 15,
        shadowOffsetY: 8
      },
      emphasis: {
        itemStyle: {
          areaColor: theme.themeMode === 'dark' ? '#2b6f86' : theme.accent,
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 20
        }
      },
      data: []
    }],
    options: enrichedOptions
  };

  return mapOption;
};
