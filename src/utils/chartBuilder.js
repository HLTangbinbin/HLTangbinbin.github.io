import { selectDataFromArr, offsetArray, selectMapTimelineData } from './dataEngine.js';
import { ComparePlugin, SmartAnalysisPlugin, PiePlugin, BirthPredictionPlugin, LegendFilterPlugin, MapTimelinePlugin } from './chartPlugins.js';
import { getChartThemeTokens } from './theme.js';
import { getDefaultRegionCode, getIndicator, getRegionItems, getRegionName } from './statDataAdapter.js';

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeIndicatorLabel(indicator, indicatorKey, exceptName = '') {
  const displayName = String(indicator?.displayName || '').trim();
  const fallbackName = String(indicator?.name || '').trim();
  let label = displayName || fallbackName || indicatorKey || '指标';

  // Keep the legend concise by dropping trailing "(unit)" in displayName.
  label = label.replace(/\s*\([^)]*\)\s*$/u, '').trim();

  if (exceptName && typeof exceptName === 'string') {
    const safePattern = new RegExp(escapeRegExp(exceptName), 'gu');
    label = label.replace(safePattern, '').trim() || label;
  }

  return label;
}

function ensureUniqueSeriesName(baseName, indicatorKey, usedNames) {
  const normalizedBase = String(baseName || '指标').trim() || '指标';
  const currentCount = usedNames.get(normalizedBase) || 0;
  usedNames.set(normalizedBase, currentCount + 1);
  if (currentCount === 0) return normalizedBase;

  const suffix = String(indicatorKey || '')
    .split('_')
    .slice(-2)
    .join('_') || indicatorKey || currentCount + 1;
  return `${normalizedBase} [${suffix}]`;
}

function longestCommonPrefix(values = []) {
  if (!values.length) return '';
  let prefix = values[0] || '';
  for (let index = 1; index < values.length; index += 1) {
    const current = values[index] || '';
    let cursor = 0;
    while (cursor < prefix.length && cursor < current.length && prefix[cursor] === current[cursor]) {
      cursor += 1;
    }
    prefix = prefix.slice(0, cursor);
    if (!prefix) break;
  }
  return prefix;
}

function longestCommonSuffix(values = []) {
  if (!values.length) return '';
  const reversed = values.map((item) => String(item || '').split('').reverse().join(''));
  const reversedPrefix = longestCommonPrefix(reversed);
  return reversedPrefix.split('').reverse().join('');
}

function trimSharedParts(values = []) {
  if (values.length < 2) return values;
  const normalized = values.map((item) => String(item || '').trim());
  const prefix = longestCommonPrefix(normalized);
  const suffix = longestCommonSuffix(normalized);
  const safePrefix = prefix.length >= 2 ? prefix : '';
  const safeSuffix = suffix.length >= 2 ? suffix : '';

  return normalized.map((label) => {
    let compact = label;
    if (safePrefix && compact.startsWith(safePrefix)) {
      compact = compact.slice(safePrefix.length);
    }
    if (safeSuffix && compact.endsWith(safeSuffix)) {
      compact = compact.slice(0, compact.length - safeSuffix.length);
    }
    compact = compact.replace(/^[\s:：、，,;；\-_/()（）]+|[\s:：、，,;；\-_/()（）]+$/gu, '').trim();
    return compact.length >= 2 ? compact : label;
  });
}

class ChartBuilder {
  constructor(params) {
    this.params = params;
    this.plugins = [];
    this.ctx = this.initContext();
    this.option = this.buildBaseOption();
  }

  initContext() {
    const {
      data,
      indicatorKeys = [],
      regionCodes = [],
      dbCode = 'nd',
      unit = '',
      exceptName = '',
      chartType = 'bar',
      yearLimit,
      enableBirthOffset = false,
      selectedLegend,
      offsetValue = 0,
      seriesLayout = 'indicator',
      regionLabelMap = new Map()
    } = this.params;

    if (chartType === 'map') {
        const mainIndicatorKey = indicatorKeys[0];
        const mapTimelineData = selectMapTimelineData(data, mainIndicatorKey, dbCode, yearLimit);
        this.params.mapTimelineData = mapTimelineData;
        const indicator = getIndicator(data, mainIndicatorKey);
        this.params.metricName = exceptName || indicator?.name || '指标';
        this.params.unit = indicator?.unit || '';

        return { 
          isMapContext: true, 
          seriesData: [], 
          filteredYears: [],
          marriageArr: [],
          birthArr: [],
          params: this.params 
        };
      }


    let marriageArr = [], birthArr = [], seriesData = [];
    let filteredYears = [];

    if (seriesLayout !== 'region') {
      const singleRegionCode = regionCodes.length === 1 ? regionCodes[0] : '';
      const pendingSeries = [];
      indicatorKeys.forEach((indicatorKey) => {
        const indicator = getIndicator(data, indicatorKey);
        if (!indicator) return;

        const cname = normalizeIndicatorLabel(indicator, indicatorKey, exceptName);
        const baseName = `${cname}${unit}`;
        let result = selectDataFromArr(data, indicatorKey, dbCode, singleRegionCode, yearLimit);
        let valueArr = result.map(item => item.value);
        let dateArr = result.map(item => item.date);

        if (enableBirthOffset && indicatorKey.includes('marriage')) marriageArr = valueArr;
        else if (enableBirthOffset && indicatorKey.includes('birth')) {
          birthArr = valueArr;
          valueArr = offsetArray(valueArr, yearLimit, -1);
        } else if (chartType === 'line' && baseName === selectedLegend) {
          valueArr = offsetArray(valueArr, Math.min(yearLimit, valueArr.length), offsetValue);
        }

        pendingSeries.push({
          baseName,
          zbCode: indicatorKey,
          type: chartType,
          data: valueArr,
          date: dateArr,
          emphasis: { focus: 'series' }
        });
        if (!filteredYears.length) {
          filteredYears = dateArr;
        }
      });

      const compactNames = trimSharedParts(pendingSeries.map((item) => item.baseName));
      const usedSeriesNames = new Map();
      seriesData = pendingSeries.map((item, index) => ({
        ...item,
        name: ensureUniqueSeriesName(compactNames[index] || item.baseName, item.zbCode, usedSeriesNames)
      }));
    } else {
      const mainIndicatorKey = indicatorKeys[0];
      const allRegions = getRegionItems(data);
      const targetRegionCodes = regionCodes.length ? regionCodes : Object.keys(allRegions).filter((code) => code !== '100000');
      // 多地区对比（城市 city.json、省市 province.json 等，凡 seriesLayout === 'region' 均走此分支）：
      // 不能对「每个地区单独 slice(-yearLimit)」再合并时间轴，否则各地「最近 N 条」对应的日历范围不一致，
      // 会出现某几年只有个别地区有值、改滑动年份后同一日历年又「全员有值」的错位。
      // 正确做法：各地区先取全量序列，合并为统一时间轴后，再对时间轴整体 slice(-yearLimit)。
      const perRegionLimit = 0;
      targetRegionCodes.forEach((regionCode) => {
        const name = regionLabelMap.get(regionCode) || getRegionName(data, regionCode) || '';
        let result = selectDataFromArr(data, mainIndicatorKey, dbCode, regionCode, perRegionLimit) || [];
        if (!result.length) return;
        seriesData.push({ name, zbCode: mainIndicatorKey, type: chartType, data: result.map(i => i.value), date: result.map(i => i.date), emphasis: { focus: 'series' } });
      });

      if (seriesData.length) {
        const mergedTimeline = Array.from(new Set(
          seriesData.flatMap((series) => Array.isArray(series.date) ? series.date : [])
        )).sort(comparePeriods);

        let timeline = mergedTimeline;
        if (yearLimit && mergedTimeline.length > yearLimit) {
          timeline = mergedTimeline.slice(-yearLimit);
        }

        filteredYears = timeline;
        seriesData = seriesData.map((series) => {
          const pointMap = new Map((series.date || []).map((date, index) => [String(date), series.data[index] ?? null]));
          return {
            ...series,
            date: timeline,
            data: timeline.map((date) => (pointMap.has(String(date)) ? pointMap.get(String(date)) : null))
          };
        });
      }
    }

    if (!seriesData.length && indicatorKeys.length) {
      const fallbackRegionCode = getDefaultRegionCode(data, indicatorKeys[0]);
      const fallback = selectDataFromArr(data, indicatorKeys[0], dbCode, fallbackRegionCode, yearLimit);
      if (fallback.length) {
        seriesData.push({
          name: regionLabelMap.get(fallbackRegionCode) || getRegionName(data, fallbackRegionCode),
          zbCode: indicatorKeys[0],
          type: chartType,
          data: fallback.map((item) => item.value),
          date: fallback.map((item) => item.date),
          emphasis: { focus: 'series' }
        });
        if (!filteredYears.length) {
          filteredYears = fallback.map((item) => item.date);
        }
      }
    }

    return { params: this.params, seriesData, filteredYears: filteredYears.length ? filteredYears : (seriesData[0]?.date || []), marriageArr, birthArr };
  }

  buildBaseOption() {
    const { title, subtitle, isHorizontal, legendAllSelected, linkedLegend, gridTop = '140px', legendTop = '70px', unit = '', isMobile, titleTop = '15px', isYearlyCompare = false } = this.params;
    const theme = getChartThemeTokens();
    
    const valueAxisConfig = {
      type: 'value', scale: true,
      min: (v) => v.min - (v.max - v.min) * 0.1,
      max: (v) => v.max + (v.max - v.min) * 0.1,
      axisLine: { lineStyle: { color: theme.borderStrong } },
      splitLine: { lineStyle: { color: theme.borderDefault, type: 'dashed' } },
      axisLabel: { color: theme.textMuted, formatter: (v) => v.toFixed(Math.abs(v) >= 1 ? 2 : 3) + unit },
    };
    const categoryAxisConfig = {
      type: 'category',
      data: [...this.ctx.filteredYears],
      axisLine: { lineStyle: { color: theme.borderStrong } },
      axisTick: { lineStyle: { color: theme.borderStrong } },
      axisLabel: { color: theme.textMuted }
    };

    const baseLegendData = this.ctx.seriesData.map(s => s.name);
    const linkedSelectedMap = linkedLegend && baseLegendData.includes(linkedLegend)
      ? baseLegendData.reduce((acc, name) => ({ ...acc, [name]: name === linkedLegend }), {})
      : baseLegendData.reduce((acc, name) => ({ ...acc, [name]: !!legendAllSelected }), {});

    const clonedSeries = this.ctx.seriesData.map((seriesItem) => ({
      ...seriesItem,
      data: Array.isArray(seriesItem.data) ? [...seriesItem.data] : seriesItem.data,
      date: Array.isArray(seriesItem.date) ? [...seriesItem.date] : seriesItem.date
    }));

    return {
      backgroundColor: 'transparent',
      color: theme.palette,
      title: {
        text: title, subtext: subtitle, left: 'center', top: titleTop, itemGap: 22,
        textStyle: { fontSize: isMobile ? 14 : 18, color: theme.textPrimary, fontWeight: 700 },
        subtextStyle: { color: theme.textSecondary, fontWeight: 'bold', fontSize: isMobile ? 12 : 13, width: window.innerWidth * 0.8, overflow: 'breakAll' }
      },
      tooltip: {
        trigger: 'axis', confine: true, enterable: !isMobile, alwaysShowContent: false,
        triggerOn: 'mousemove|click',
        backgroundColor: theme.bgCard,
        borderColor: theme.borderDefault,
        borderWidth: 1,
        textStyle: { color: theme.textPrimary },
        extraCssText: 'max-height: 450px; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.12); padding-right: 15px; border-radius: 10px;',
        formatter: this.getAdvancedTooltipFormatter()
      },
      legend: { 
        type: 'scroll', left: 'center', top: legendTop, 
        data: baseLegendData, 
        textStyle: { color: theme.textSecondary },
        selected: linkedSelectedMap
      },
      grid: { left: '1%', right: '1%', top: gridTop, bottom: isYearlyCompare ? '10%' : '4%', containLabel: true },
      xAxis: isHorizontal ? valueAxisConfig : categoryAxisConfig,
      yAxis: isHorizontal ? categoryAxisConfig : valueAxisConfig,
      series: clonedSeries
    };
  }

  getAdvancedTooltipFormatter() {
    const theme = getChartThemeTokens();
    return (params) => {
      if (!params) return '';
      const paramsArray = Array.isArray(params) ? params : [params];

      const validParams = paramsArray.filter(p =>
        p && p.value !== '-' && p.value != null && p.value !== '' &&
        !String(p.seriesName).includes('(预测下限)') &&
        !String(p.seriesName).includes('(预测区间)')
      );

      const sorted = validParams.sort((a, b) => {
        let valA = typeof a.value === 'object' ? a.value?.value : a.value;
        let valB = typeof b.value === 'object' ? b.value?.value : b.value;
        return Number(valB || 0) - Number(valA || 0);
      });

      if (sorted.length === 0) return paramsArray[0]?.axisValue || paramsArray[0]?.name || '';

      const title = sorted[0].axisValue || sorted[0].name || '';
      let result = `<div style="font-size: 14px; margin-bottom: 8px; color: ${theme.textPrimary};">${title}</div>`;

      sorted.forEach(item => {
        let rawValue = typeof item.value === 'object' ? item.value?.value : item.value;
        let val = typeof rawValue === 'number' ? rawValue.toLocaleString() : (rawValue || '-');
        let markerHtml = item.marker || `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color || '#ccc'};"></span>`;

        result += `
          <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="display: flex; align-items: center; color: ${theme.textSecondary}; font-size: 13px;">
              ${markerHtml} 
              <span style="margin-left: 2px;">${item.seriesName || item.name}</span>
            </div>
            <div style="font-weight: 600; color: ${theme.textPrimary}; font-size: 14px; margin-left: 24px; font-variant-numeric: tabular-nums;">
              ${val}
            </div>
          </div>`;

        if (item.data && item.data.formula && item.data.r2) {
          result += `
            <div style="margin-top: 6px; margin-bottom: 10px; padding: 8px 10px; background: ${theme.accentSoft}; border-radius: 6px; border-left: 3px solid ${theme.accent}; font-size: 12px; color: ${theme.textMuted}; font-family: 'Consolas', 'Courier New', monospace; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);">
              <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
                <span>回归方程：</span>
                <span style="color: ${theme.textPrimary}; font-weight: 600;">${item.data.formula}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>拟合优度 (R²)：</span>
                <span style="font-weight: 600;">
                  <span style="color: ${item.data.r2 > 0.8 ? '#10b981' : '#f59e0b'}; margin-right: 6px;">${item.data.r2}</span>
                  ${item.data.status || ''}
                </span>
              </div>
            </div>
          `;
        }
      });
      return result;
    };
  }

  use(plugin) {
    this.plugins.push(plugin);
    return this;
  }

  build() {
    let finalOption = this.option;
    this.plugins.forEach(plugin => {
      finalOption = plugin(finalOption, this.ctx);
    });
    finalOption.originalLegendData = this.ctx.seriesData.map(s => s.name);
    return finalOption;
  }
}

function comparePeriods(a, b) {
  const normalize = (value) => Number(String(value || '').replace('-', ''));
  return normalize(a) - normalize(b);
}

export const buildChartOption = (params) => {
  const builder = new ChartBuilder(params);
  // 注入地图插件
  builder.use(MapTimelinePlugin);
  if (params.isYearlyCompare) builder.use(ComparePlugin);
  else if (params.enableBirthPrediction) builder.use(BirthPredictionPlugin);
  
  if (params.enableSmartAnalysis) builder.use(SmartAnalysisPlugin);
  if (params.pieConfig?.enabled && !params.isYearlyCompare) builder.use(PiePlugin);
  
  builder.use(LegendFilterPlugin); 

  return builder.build();
};
