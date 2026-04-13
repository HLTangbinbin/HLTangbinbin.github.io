import { selectDataFromArr, offsetArray, selectMapTimelineData } from './dataEngine.js';
import { ComparePlugin, SmartAnalysisPlugin, PiePlugin, BirthPredictionPlugin, LegendFilterPlugin, MapTimelinePlugin } from './chartPlugins.js';
import { getChartThemeTokens } from './theme.js';
import { getDefaultRegionCode, getIndicator, getRegionItems, getRegionName } from './statDataAdapter.js';

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const INDICATOR_LABEL_OVERRIDES = {
  nation_shanghai_composite_index: '上证综合指数',
  nation_shenzhen_composite_index: '深证综合指数',
  nation_kindergarten_count: '学前',
  nation_primary_school_count: '普通小学',
  nation_junior_high_school_count: '普通初中',
  nation_regular_high_school_count: '普通高中',
  nation_postgraduate_institution_count: '本专科院校',
  nation_kindergarten_teacher_count: '学前',
  nation_primary_school_teacher_count: '普通小学',
  nation_junior_high_school_teacher_count: '普通初中',
  nation_regular_high_school_teacher_count: '普通高中',
  nation_postgraduate_teacher_count: '本专科院校',
  nation_hotel_catering_metric_hs_06: '住宿业法人企业数',
  nation_hotel_catering_metric_hs_07: '住宿业年末从业人数',
  nation_hotel_catering_metric_hs_08: '住宿业营业额',
  nation_hotel_catering_catering_legal_entities: '餐饮业法人企业数',
  nation_hotel_catering_catering_employees: '餐饮业年末从业人数',
  nation_hotel_catering_catering_turnover: '餐饮业营业额',
  nation_trade_total_rmb: '进出口总额（人民币）',
  nation_export_total_rmb: '出口总额（人民币）',
  nation_import_total_rmb: '进口总额（人民币）',
  nation_trade_balance_rmb: '进出口差额（人民币）',
  nation_trade_total_usd: '进出口总额（美元）',
  nation_export_total_usd: '出口总额（美元）',
  nation_import_total_usd: '进口总额（美元）',
  nation_trade_balance_usd: '进出口差额（美元）',
  nation_social_financing_corporate_bonds: '非金融企业境内股票融资规模',
  nation_social_financing_undiscounted_bankers_acceptance: '企业债券融资规模',
  nation_income_total: '居民人均可支配收入增速',
  nation_income_urban: '城镇居民人均可支配收入相关增速',
  nation_income_rural: '农村居民人均可支配收入相关增速',
  cumulative_value_of_residential_commercial_housing_sales_area: '面积',
  cumulative_value_of_residential_commercial_housing_sales_amount: '销售额',
  cumulative_growth_of_residential_commercial_housing_sales_area: '面积',
  cumulative_growth_of_residential_commercial_housing_sales_amount: '销售额'
};

function looksLikeMachineLabel(label) {
  const text = String(label || '').trim();
  if (!text) return false;
  return /^[a-z0-9_]+$/u.test(text) || /^nation_[a-z0-9_]+$/u.test(text) || /^city_[a-z0-9_]+$/u.test(text) || /^province_[a-z0-9_]+$/u.test(text);
}

function normalizeIndicatorLabel(indicator, indicatorKey, exceptName = '') {
  const overrideLabel = INDICATOR_LABEL_OVERRIDES[indicatorKey];
  const displayName = String(indicator?.displayName || '').trim();
  const fallbackName = String(indicator?.name || '').trim();
  let label = overrideLabel || (looksLikeMachineLabel(displayName) ? fallbackName : displayName) || fallbackName || indicatorKey || '指标';

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
    if (!compact && safePrefix && safeSuffix) {
      return '全部';
    }
    return compact.length >= 2 ? compact : label;
  });
}

function formatChartTitle(title = '', unit = '') {
  const normalizedTitle = String(title || '').trim();
  const normalizedUnit = String(unit || '').trim();
  if (normalizedUnit === '无') return normalizedTitle;
  if (!normalizedTitle || !normalizedUnit) return normalizedTitle;

  const normalizedCompact = normalizedTitle.replace(/\s+/gu, '');
  const unitSuffixes = [`(${normalizedUnit})`, `（${normalizedUnit}）`];
  if (unitSuffixes.some((suffix) => normalizedCompact.endsWith(suffix))) {
    return normalizedTitle;
  }

  return `${normalizedTitle} (${normalizedUnit})`;
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
      englishKeys = [],
      regionCodes = [],
      dbCode = 'nd',
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
        const mainEnglishKey = englishKeys[0];
        const mapTimelineData = selectMapTimelineData(data, mainEnglishKey, dbCode, yearLimit);
        this.params.mapTimelineData = mapTimelineData;
        const indicator = getIndicator(data, mainEnglishKey);
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
      englishKeys.forEach((englishKey) => {
        const indicator = getIndicator(data, englishKey);
        if (!indicator) return;

        const cname = normalizeIndicatorLabel(indicator, englishKey, exceptName);
        const baseName = cname;
        let result = selectDataFromArr(data, englishKey, dbCode, singleRegionCode, yearLimit);
        let valueArr = result.map(item => item.value);
        let dateArr = result.map(item => item.date);

        if (enableBirthOffset && englishKey.includes('marriage')) marriageArr = valueArr;
        else if (enableBirthOffset && englishKey.includes('birth')) {
          birthArr = valueArr;
          valueArr = offsetArray(valueArr, yearLimit, -1);
        } else if (chartType === 'line' && baseName === selectedLegend) {
          valueArr = offsetArray(valueArr, Math.min(yearLimit, valueArr.length), offsetValue);
        }

        pendingSeries.push({
          baseName,
          zbCode: englishKey,
          type: chartType,
          data: valueArr,
          date: dateArr,
          emphasis: { focus: 'series' }
        });
        if (!filteredYears.length) {
          filteredYears = dateArr;
        }
      });

      if (pendingSeries.length) {
        const mergedTimeline = Array.from(new Set(
          pendingSeries.flatMap((series) => Array.isArray(series.date) ? series.date : [])
        )).sort(comparePeriods);

        let timeline = mergedTimeline;
        if (yearLimit && mergedTimeline.length > yearLimit) {
          timeline = mergedTimeline.slice(-yearLimit);
        }

        filteredYears = timeline;
        pendingSeries.forEach((series) => {
          const pointMap = new Map((series.date || []).map((date, index) => [String(date), series.data[index] ?? null]));
          series.date = timeline;
          series.data = timeline.map((date) => (pointMap.has(String(date)) ? pointMap.get(String(date)) : null));
        });
      }

      const compactNames = trimSharedParts(pendingSeries.map((item) => item.baseName));
      const usedSeriesNames = new Map();
      seriesData = pendingSeries.map((item, index) => ({
        ...item,
        name: ensureUniqueSeriesName(compactNames[index] || item.baseName, item.zbCode, usedSeriesNames)
      }));
    } else {
      const mainEnglishKey = englishKeys[0];
      const allRegions = getRegionItems(data);
      const targetRegionCodes = regionCodes.length ? regionCodes : Object.keys(allRegions).filter((code) => code !== '100000');
      // 多地区对比（城市 city.json、省市 province.json 等，凡 seriesLayout === 'region' 均走此分支）：
      // 不能对「每个地区单独 slice(-yearLimit)」再合并时间轴，否则各地「最近 N 条」对应的日历范围不一致，
      // 会出现某几年只有个别地区有值、改滑动年份后同一日历年又「全员有值」的错位。
      // 正确做法：各地区先取全量序列，合并为统一时间轴后，再对时间轴整体 slice(-yearLimit)。
      const perRegionLimit = 0;
      targetRegionCodes.forEach((regionCode) => {
        const name = regionLabelMap.get(regionCode) || getRegionName(data, regionCode) || '';
        let result = selectDataFromArr(data, mainEnglishKey, dbCode, regionCode, perRegionLimit) || [];
        if (!result.length) return;
        seriesData.push({ name, zbCode: mainEnglishKey, type: chartType, data: result.map(i => i.value), date: result.map(i => i.date), emphasis: { focus: 'series' } });
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

    if (!seriesData.length && englishKeys.length) {
      const fallbackRegionCode = getDefaultRegionCode(data, englishKeys[0]);
      const fallback = selectDataFromArr(data, englishKeys[0], dbCode, fallbackRegionCode, yearLimit);
      if (fallback.length) {
        seriesData.push({
          name: regionLabelMap.get(fallbackRegionCode) || getRegionName(data, fallbackRegionCode),
          zbCode: englishKeys[0],
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
    const finalTitle = formatChartTitle(title, unit);
    
    const valueAxisConfig = {
      type: 'value', scale: true,
      min: (v) => v.min - (v.max - v.min) * 0.1,
      max: (v) => v.max + (v.max - v.min) * 0.1,
      axisLine: { lineStyle: { color: theme.borderStrong } },
      splitLine: { lineStyle: { color: theme.borderDefault, type: 'dashed' } },
      axisLabel: { color: theme.textMuted, formatter: (v) => v.toFixed(Math.abs(v) >= 1 ? 2 : 3) },
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
        text: finalTitle, subtext: subtitle, left: 'center', top: titleTop, itemGap: 22,
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
