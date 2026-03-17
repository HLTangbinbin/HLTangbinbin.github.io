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
// chartPlugins.js 
export const MapTimelinePlugin = (option, ctx) => {
  if (ctx.params.chartType !== 'map') return option;

  const { mapType, mapTimelineData = {}, metricName = '指标', unit = '' } = ctx.params || {};
  const { years = [], timelineData = [] } = mapTimelineData;

  if (years.length === 0 || timelineData.length === 0) return option;

  let allValues = [];
  timelineData.forEach(td => {
    if (Array.isArray(td.data)) {
      allValues = allValues.concat(td.data.map(item => Number(item.value) || 0));
    }
  });
  const maxVal = allValues.length ? Math.max(...allValues) : 100;
  const minVal = allValues.length ? Math.min(...allValues) : 0;

  // 🌟 1. 核心引擎升级：加入“回头看”能力，计算涨跌幅！
  const enrichedOptions = timelineData.map((td, index, arr) => {
    // 💡 提取上一期的数据（如果是第一年，这里就是个空数组）
    const prevData = index > 0 ? arr[index - 1].data : [];

    const validData = td.data.filter(item => item.value !== null && !isNaN(item.value));
    validData.sort((a, b) => b.value - a.value);
    const currentYearMax = validData.length > 0 ? validData[0].value : 1;

    const enrichedData = td.data.map(item => {
      if (item.value === null || isNaN(item.value)) return item;

      const rank = validData.findIndex(v => v.name === item.name) + 1;
      const ratio = ((item.value / currentYearMax) * 100).toFixed(1);

      // 💡 涨跌幅计算逻辑：(本期 - 上期) / 上期 * 100
      let growth = null;
      if (prevData.length > 0) {
        const prevItem = prevData.find(p => p.name === item.name);
        // 确保上一期有数据，且不为 0（防止除以 0 报错）
        if (prevItem && prevItem.value !== null && !isNaN(prevItem.value) && prevItem.value !== 0) {
          growth = (((item.value - prevItem.value) / Math.abs(prevItem.value)) * 100).toFixed(1);
        }
      }

      return { ...item, rank, ratio, growth }; // 把涨跌幅 (growth) 塞进去
    });

    return {
      title: { text: `${metricName} 地域演进 (${td.year})` },
      series: [{
        data: enrichedData,
        label: {
          show: true,
          color: '#333333',
          fontSize: 10,
          formatter: (p) => (p.value !== undefined && p.value !== null && !isNaN(p.value)) ? p.name : ''
        },
        emphasis: { label: { show: true, color: '#000000', fontWeight: 'bold' } }
      }]
    };
  });

  const mapOption = {
    xAxis: { show: false },
    yAxis: { show: false },
    grid: { show: false },
    toolbox: { show: true, right: '5%', top: '5%', feature: { restore: { title: '居中还原' } } },
    timeline: {
      axisType: 'category', autoPlay: false, playInterval: 2000, data: years,
      bottom: 10, left: 30, right: 30, label: { formatter: '{value} 年' }
    },
    title: { text: `${metricName}`, left: 'center', top: 10, textStyle: { fontSize: 18, color: '#333' } },

    // 🌟 2. UI 风格彻底重构：清新商务白底风 + 红涨绿跌
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      borderColor: '#E5E7EB', 
      borderWidth: 1,
      padding: 14,
      extraCssText: 'box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-radius: 8px;', 
      textStyle: { color: '#333' },
      formatter: (params) => {
        if (!params.name || params.value === undefined || isNaN(params.value)) return '';

        const data = params.data || {};
        const rank = data.rank ? `<span style="background: rgba(0, 194, 168, 0.1); color: #00C2A8; padding: 2px 8px; border-radius: 4px; font-weight: bold;">第 ${data.rank} 名</span>` : '-';
        const ratio = data.ratio || 0;

        let growthHtml = '<span style="color: #9CA3AF;">-</span>'; 
        if (data.growth !== null && data.growth !== undefined) {
          const gVal = Number(data.growth);
          if (gVal > 0) {
            growthHtml = `<span style="color: #EF4444; font-weight: bold;">+${gVal}% 🔺</span>`;
          } else if (gVal < 0) {
            growthHtml = `<span style="color: #10B981; font-weight: bold;">${gVal}% 🔻</span>`;
          } else {
            growthHtml = `<span style="color: #6B7280;">持平 -</span>`; 
          }
        }

        return `
          <div style="min-width: 190px; font-family: sans-serif; color: #374151;">
            <div style="font-size: 15px; font-weight: bold; border-bottom: 1px solid #F3F4F6; padding-bottom: 8px; margin-bottom: 10px; color: #111827;">
              ${params.name}
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
              <span style="color: #6B7280;">${metricName}</span>
              <span style="color: #00C2A8; font-weight: bold; font-size: 15px;">${params.value} <span style="font-size: 12px; font-weight: normal;">${unit}</span></span>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
              <span style="color: #6B7280;">较上一期</span>
              ${growthHtml}
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 10px;">
              <span style="color: #6B7280;">本期排名</span>
              ${rank}
            </div>
            
            <div style="display: flex; align-items: center; font-size: 12px;">
              <span style="color: #6B7280; width: 55px;">极值占比</span>
              <div style="flex: 1; margin: 0 8px; height: 6px; background-color: #E5E7EB; border-radius: 3px; overflow: hidden;">
                <div style="width: ${ratio}%; height: 100%; background: #00C2A8; border-radius: 3px; transition: width 0.3s;"></div>
              </div>
              <span style="color: #00C2A8; font-weight: bold; font-size: 12px; width: 35px; text-align: right;">${ratio}%</span>
            </div>
          </div>
        `;
      }
    },

    visualMap: {
      type: 'continuous', min: minVal, max: maxVal * 0.5, left: '5%', bottom: '15%',
      calculable: true, text: ['高', '低'],
      inRange: { color: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026'] }
    },

    series: [
      {
        name: metricName, type: 'map', map: mapType, roam: false, zoom: 1.1, top: '18%',
        itemStyle: { areaColor: '#F3F4F6', borderColor: '#FFFFFF' },
        emphasis: { itemStyle: { areaColor: '#FFD700' } },
        data: []
      }
    ],
    options: enrichedOptions
  };

  return mapOption;
};