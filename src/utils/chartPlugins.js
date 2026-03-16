import { calculateLinearRegression, fitMarriageBirthDynamic } from './analysisEngine.js';

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

  let targetSeriesData = ctx.seriesData;
  if (ctx.params.selectedLegend && ctx.seriesData.length > 1) {
    targetSeriesData = ctx.seriesData.filter(s => s.name === ctx.params.selectedLegend);
    if (targetSeriesData.length === 0) targetSeriesData = [ctx.seriesData[0]];
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
  const focusedLegend = ctx.params.selectedLegend;

  option.series.forEach(s => {
    if (s.type === 'line' || s.type === 'bar') {
      if (focusedLegend && s.name !== focusedLegend && option.series.length > 1) return;

      const trendData = calculateLinearRegression(s.data, futureSteps);
      const meta = trendData._metadata;
      const themeColor = s.itemStyle?.color || '#0bc2d6';

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
          label: { color: '#fff', fontSize: 10, formatter: '异常' },
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

  option.color = option.color || ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
  const futureSteps = (ctx.params.enableSmartAnalysis && !ctx.params.isYearlyCompare) ? 3 : 0;
  const targetIndex = Math.max(0, ctx.filteredYears.length - 1 - futureSteps);
  const legendData = option.legend?.data || [];

  ctx.params.pieConfig.pies.forEach((pie, idx) => {
    const targetSeries = option.series.filter(s => pie.triggerZbCodes.includes(s.zbCode) && !s.isTrendline);
    const pieData = [];

    targetSeries.forEach(series => {
      if (Array.isArray(series.data)) {
        const rawVal = series.data[targetIndex];
        const val = typeof rawVal === 'object' && rawVal !== null ? rawVal.value : rawVal;
        if (val !== null && val !== undefined && val !== '-' && val !== '') {
          pieData.push({ name: series.name, value: Number(val) });
        }
      }
    });

    if (pieData.length === 0) return;

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
      data: pieData,
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
export const MapTimelinePlugin = (option, ctx) => {
  // 如果当前不是地图模式，直接放行原有的柱状图/折线图配置
  if (ctx.params.chartType !== 'map') return option;

  const { mapType, mapTimelineData, metricName, unit } = ctx.params;
  const { years, timelineData } = mapTimelineData;

  if (years.length === 0) return option;

  // 计算全局最大最小值，用于统一的 VisualMap（热力色带）
  let allValues = [];
  timelineData.forEach(td => {
      allValues = allValues.concat(td.data.map(item => item.value));
  });
  const maxVal = allValues.length ? Math.max(...allValues) : 100;
  const minVal = allValues.length ? Math.min(...allValues) : 0;

  // 抛弃原有的 option，重构为 Timeline 结构的 Option
  const mapOption = {
    baseOption: {
      timeline: {
        axisType: 'category',
        autoPlay: true,           // 自动播放，高逼格 BI 必备
        playInterval: 1500,       // 每 1.5 秒切换一年
        data: years,
        bottom: 10,
        left: 30,
        right: 30,
        label: { formatter: '{value} 年' }
      },
      title: {
        text: `${metricName} 地域演进`,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 18, color: '#333' }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (!params.name) return '';
          const val = params.value !== undefined ? params.value : '暂无数据';
          return `${params.name}<br/>${metricName}: <strong>${val}</strong> ${unit}`;
        }
      },
      visualMap: {
        min: minVal,
        max: maxVal,
        left: 'left',
        bottom: '15%',
        text: ['高', '低'],
        calculable: true,
        // 大唐统计局御用热力配色：从浅蓝到深红的渐变
        inRange: { color: ['#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027'] }
      },
      geo: {
        map: mapType,
        roam: true, // 允许鼠标缩放和平移
        zoom: 1.1,
        itemStyle: {
          areaColor: '#f3f4f6', // 无数据区域的底色
          borderColor: '#ffffff'
        },
        emphasis: { itemStyle: { areaColor: '#d1d5db' } }
      },
      series: [
        {
          name: metricName,
          type: 'map',
          geoIndex: 0, // 关联到上面的 geo 配置
          data: []
        }
      ]
    },
    // 将每年切片数据塞入 options 数组
    options: timelineData.map(td => ({
      title: { text: `${metricName} 地域演进 (${td.year})` },
      series: [{ data: td.data }]
    }))
  };

  return mapOption;
};