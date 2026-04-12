function normalizePointMap(values = []) {
  return new Map(
    (Array.isArray(values) ? values : [])
      .map((item) => [String(item?.date ?? '').trim(), item?.value])
      .filter(([date]) => date)
  );
}

function buildDifferenceSeries(totalSeries = [], partSeries = []) {
  const partSeriesByRegion = new Map(
    (Array.isArray(partSeries) ? partSeries : []).map((item) => [String(item?.regionKey || '').trim(), item])
  );

  return (Array.isArray(totalSeries) ? totalSeries : []).map((totalItem) => {
    const regionKey = String(totalItem?.regionKey || '').trim();
    const partItem = partSeriesByRegion.get(regionKey);
    const totalPoints = normalizePointMap(totalItem?.data);
    const partPoints = normalizePointMap(partItem?.data);
    const timeline = Array.from(new Set([...totalPoints.keys(), ...partPoints.keys()]))
      .sort((a, b) => Number(a.replace('-', '')) - Number(b.replace('-', '')));

    const data = timeline.map((date) => {
      const totalValue = Number(totalPoints.get(date) ?? 0);
      const partValue = Number(partPoints.get(date) ?? 0);
      return {
        date,
        value: Number.isFinite(totalValue - partValue) ? totalValue - partValue : null
      };
    });

    return {
      regionKey,
      regionName: totalItem?.regionName || partItem?.regionName || regionKey,
      data
    };
  });
}

function ensureDerivedDataset(raw, targetKey, totalKey, partKey, options = {}) {
  if (!raw?.datasets || raw.datasets[targetKey] || !raw.datasets[totalKey] || !raw.datasets[partKey]) return;

  const totalDataset = raw.datasets[totalKey];
  raw.datasets[targetKey] = {
    ...totalDataset,
    id: targetKey,
    key: targetKey,
    metricKey: targetKey,
    englishKey: targetKey,
    derived: true,
    name: options.name || totalDataset.name,
    displayName: options.displayName || totalDataset.displayName,
    showName: options.displayName || options.name || totalDataset.displayName || totalDataset.name,
    chartKeys: Array.from(new Set([...(totalDataset.chartKeys || []), ...(raw.datasets[partKey]?.chartKeys || [])])),
    pageKeys: Array.from(new Set([...(totalDataset.pageKeys || []), ...(raw.datasets[partKey]?.pageKeys || [])])),
    series: buildDifferenceSeries(totalDataset.series, raw.datasets[partKey].series)
  };
}

function ensureAliasedDataset(raw, targetKey, sourceKey, options = {}) {
  if (!raw?.datasets || raw.datasets[targetKey] || !raw.datasets[sourceKey]) return;

  const sourceDataset = raw.datasets[sourceKey];
  raw.datasets[targetKey] = {
    ...sourceDataset,
    id: targetKey,
    key: targetKey,
    metricKey: targetKey,
    englishKey: targetKey,
    derived: true,
    name: options.name || sourceDataset.name,
    displayName: options.displayName || sourceDataset.displayName,
    showName: options.displayName || options.name || sourceDataset.showName || sourceDataset.displayName || sourceDataset.name
  };
}

function applyDerivedDatasets(raw) {
  ensureAliasedDataset(raw, 'city_budget_deficit', 'local_general_public_budget_deficit', {
    name: '地方一般公共预算赤字',
    displayName: '地方一般公共预算赤字 (亿元)'
  });
  ensureAliasedDataset(raw, 'province_budget_deficit', 'local_fiscal_yi_ban_yu_suan_deficit', {
    name: '地方财政一般预算赤字',
    displayName: '地方财政一般预算赤字 (亿元)'
  });
  ensureAliasedDataset(raw, 'national_general_public_budget_deficit_hm_yuan', 'fiscal_deficit', {
    name: '全国一般公共预算赤字',
    displayName: '全国一般公共预算赤字 (亿元)'
  });
  ensureAliasedDataset(raw, 'central_general_public_budget_deficit_hm_yuan', 'central_fiscal_deficit', {
    name: '中央一般公共预算赤字',
    displayName: '中央一般公共预算赤字 (亿元)'
  });
  ensureAliasedDataset(raw, 'local_general_public_budget_deficit_hm_yuan', 'local_fiscal_deficit', {
    name: '地方一般公共预算赤字',
    displayName: '地方一般公共预算赤字 (亿元)'
  });

  ensureDerivedDataset(raw, 'city_budget_deficit', 'local_general_public_budget_expenditure_hm_yuan', 'local_general_public_budget_revenue_hm_yuan', {
    name: '地方一般公共预算赤字',
    displayName: '地方一般公共预算赤字 (亿元)'
  });
  ensureDerivedDataset(raw, 'province_budget_deficit', 'local_fiscal_general_public_budget_expenditure_hm_yuan', 'local_fiscal_general_public_budget_revenue_hm_yuan', {
    name: '地方财政一般预算赤字',
    displayName: '地方财政一般预算赤字 (亿元)'
  });
  ensureDerivedDataset(raw, 'national_general_public_budget_deficit_hm_yuan', 'national_general_public_budget_expenditure_hm_yuan_budget_expenditure_nd', 'national_general_public_budget_revenue_hm_yuan_budget_income_nd', {
    name: '全国一般公共预算赤字',
    displayName: '全国一般公共预算赤字 (亿元)'
  });
  ensureDerivedDataset(raw, 'central_general_public_budget_deficit_hm_yuan', 'central_general_public_budget_expenditure_hm_yuan', 'central_general_public_budget_revenue_hm_yuan', {
    name: '中央一般公共预算赤字',
    displayName: '中央一般公共预算赤字 (亿元)'
  });
  ensureDerivedDataset(raw, 'local_general_public_budget_deficit_hm_yuan', 'local_general_public_budget_expenditure_hm_yuan', 'local_general_public_budget_revenue_hm_yuan', {
    name: '地方一般公共预算赤字',
    displayName: '地方一般公共预算赤字 (亿元)'
  });
  ensureDerivedDataset(raw, 'nation_hotel_catering_catering_employees', 'nation_hotel_catering_employees_combined', 'nation_hotel_catering_metric_hs_07', {
    name: '餐饮业年末从业人数',
    displayName: '餐饮业年末从业人数 (人)'
  });
  ensureDerivedDataset(raw, 'nation_hotel_catering_catering_legal_entities', 'nation_hotel_catering_legal_entities_combined', 'nation_hotel_catering_metric_hs_06', {
    name: '餐饮业法人企业数',
    displayName: '餐饮业法人企业数 (个)'
  });
}

function toNumberPeriod(value) {
  return Number(String(value || '').replace('-', ''));
}

function sortPeriods(periods = []) {
  return [...periods].map((item) => String(item)).sort((a, b) => toNumberPeriod(a) - toNumberPeriod(b));
}

function normalizePointArray(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((item) => ({
      date: String(item?.date ?? '').trim(),
      value: item?.value
    }))
    .filter((item) => item.date);
}

function inferPeriod(value) {
  const text = String(value || '').trim();
  if (/^\d{6}$/.test(text)) return 'yd';
  if (/^\d{4}$/.test(text)) return 'nd';
  return '';
}

function resolveDatasetPeriod(indicator = {}) {
  const declaredPeriods = Array.isArray(indicator?.periods)
    ? indicator.periods.map((item) => String(item).trim()).filter(Boolean)
    : [];
  if (declaredPeriods.length === 1) return declaredPeriods[0];

  const firstDate = indicator?.series
    ?.flatMap((item) => Array.isArray(item?.data) ? item.data : [])
    ?.find((item) => item?.date)?.date;

  return inferPeriod(firstDate);
}

function getPeriodAliases(period) {
  const normalized = String(period || '').trim();
  if (!normalized) return [];
  if (normalized === 'yd') return ['yd', 'monthly', 'month'];
  if (normalized === 'nd') return ['nd', 'yearly', 'year'];
  if (normalized === 'jd') return ['jd', 'quarterly', 'quarter'];
  return [normalized];
}

function buildMetricLabelAliases(indicator = {}, period = '') {
  const labels = [
    indicator?.title,
    indicator?.showName,
    indicator?.displayName,
    indicator?.name
  ]
    .map((item) => String(item || '').trim())
    .filter(Boolean);

  if (!labels.length) return [];

  const aliases = new Set(labels);
  const periodAliases = getPeriodAliases(period);

  labels.forEach((label) => {
    periodAliases.forEach((periodAlias) => {
      aliases.add(`${periodAlias}:${label}`);
      aliases.add(`${label}:${periodAlias}`);
    });
  });

  return Array.from(aliases);
}

function buildIndex(dataset) {
  const regionEntries = new Map();
  const timeEntries = new Map();
  const viewPeriodIndex = new Map();
  const pageMap = new Map(Object.entries(dataset.pages || {}));
  const metricKeyAliases = new Map();
  const metricTitleAliases = new Map();
  const metricTitleAliasConflicts = new Set();

  function addMetricAlias(key, englishKey) {
    const normalizedKey = String(key || '').trim();
    const normalizedEnglishKey = String(englishKey || '').trim();
    if (!normalizedKey || !normalizedEnglishKey) return;
    if (!metricKeyAliases.has(normalizedKey)) {
      metricKeyAliases.set(normalizedKey, normalizedEnglishKey);
    }
  }

  function addMetricTitleAlias(alias, englishKey) {
    const normalizedAlias = String(alias || '').trim();
    const normalizedEnglishKey = String(englishKey || '').trim();
    if (!normalizedAlias || !normalizedEnglishKey || metricKeyAliases.has(normalizedAlias) || metricTitleAliasConflicts.has(normalizedAlias)) {
      return;
    }

    const existingEnglishKey = metricTitleAliases.get(normalizedAlias);
    if (!existingEnglishKey) {
      metricTitleAliases.set(normalizedAlias, normalizedEnglishKey);
      return;
    }

    if (existingEnglishKey !== normalizedEnglishKey) {
      metricTitleAliases.delete(normalizedAlias);
      metricTitleAliasConflicts.add(normalizedAlias);
    }
  }

  Object.entries(dataset.metrics || {}).forEach(([englishKey, metric]) => {
    const keys = [
      englishKey,
      metric?.key,
      metric?.englishKey
    ]
      .map((item) => String(item || '').trim())
      .filter(Boolean);

    keys.forEach((key) => addMetricAlias(key, englishKey));
    buildMetricLabelAliases(metric, metric?.period || metric?.periods?.[0]).forEach((alias) => addMetricTitleAlias(alias, englishKey));
  });

  Object.entries(dataset.datasets || {}).forEach(([datasetKey, indicator]) => {
    const period = resolveDatasetPeriod(indicator);
    const keys = [
      datasetKey,
      indicator?.key,
      indicator?.metricKey,
      indicator?.englishKey
    ]
      .map((item) => String(item || '').trim())
      .filter(Boolean);

    keys.forEach((key) => addMetricAlias(key, datasetKey));
    buildMetricLabelAliases(indicator, period).forEach((alias) => addMetricTitleAlias(alias, datasetKey));
  });

  Object.entries(dataset.pages || {}).forEach(([pageKey, page]) => {
    const period = String(page?.period || '').trim();
    if (!period) return;
    if (!viewPeriodIndex.has(period)) {
      viewPeriodIndex.set(period, []);
    }
    viewPeriodIndex.get(period).push({ key: pageKey, ...page });
  });

  Object.entries(dataset.datasets || {}).forEach(([indicatorKey, indicator]) => {
    const period = resolveDatasetPeriod(indicator);
    (indicator?.series || []).forEach((seriesItem) => {
      const regionCode = String(seriesItem?.regionKey || '').trim();
      const regionName = String(seriesItem?.regionName || '').trim();

      if (regionCode && !regionEntries.has(regionCode)) {
        regionEntries.set(regionCode, {
          key: regionCode,
          code: regionCode,
          name: regionName || regionCode
        });
      }

      normalizePointArray(seriesItem?.data).forEach((point) => {
        const timePeriod = period || inferPeriod(point.date);
        const key = `${timePeriod || 'unknown'}:${point.date}`;
        if (!timeEntries.has(key)) {
          timeEntries.set(key, {
            key: point.date,
            name: point.date,
            period: timePeriod,
            indicatorKey
          });
        }
      });
    });
  });

  return {
    regionMap: regionEntries,
    timeMap: timeEntries,
    viewPeriodIndex,
    pageMap,
    metricKeyAliases,
    metricTitleAliases
  };
}

export function normalizeStatData(raw = {}) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('统计数据为空，无法解析。');
  }

  const hasDatasets = raw.datasets && typeof raw.datasets === 'object';
  const hasEnglishDatasets = raw.englishDatasets && typeof raw.englishDatasets === 'object';
  if (!hasDatasets && !hasEnglishDatasets) {
    throw new Error('统计数据缺少 datasets / englishDatasets 核心字段。');
  }

  applyDerivedDatasets(raw);

  if (!raw.__index) {
    Object.defineProperty(raw, '__index', {
      value: buildIndex(raw),
      enumerable: false,
      configurable: false,
      writable: false
    });
  }

  return raw;
}

export function getIndicator(dataset, indicatorKey) {
  const normalized = normalizeStatData(dataset);
  const resolvedKey = resolveIndicatorKey(normalized, indicatorKey);
  return normalized.datasets?.[resolvedKey] || null;
}

export function getSeries(dataset, indicatorKey) {
  return getIndicator(dataset, indicatorKey)?.series || [];
}

export function resolveIndicatorKey(dataset, indicatorKey) {
  const normalized = normalizeStatData(dataset);
  const rawKey = String(indicatorKey || '').trim();
  if (!rawKey) return '';
  return normalized.__index.metricKeyAliases.get(rawKey)
    || normalized.__index.metricTitleAliases.get(rawKey)
    || rawKey;
}

export function getRegionItems(dataset) {
  return Object.fromEntries(normalizeStatData(dataset).__index.regionMap.entries());
}

export function getRegionName(dataset, regionCode) {
  return getRegionItems(dataset)?.[regionCode]?.name || regionCode;
}

export function getTimeItems(dataset) {
  return Object.fromEntries(normalizeStatData(dataset).__index.timeMap.entries());
}

export function getPeriodLabel(dataset, periodKey) {
  return getTimeItems(dataset)?.[periodKey]?.name || periodKey;
}

export function getViewsByPeriod(dataset, period) {
  return normalizeStatData(dataset).__index.viewPeriodIndex.get(period) || [];
}

export function getView(dataset, viewKey) {
  return normalizeStatData(dataset).__index.pageMap.get(viewKey) || null;
}

export function getPeriodsForIndicator(dataset, indicatorKey, period) {
  const indicator = getIndicator(dataset, indicatorKey);
  if (!indicator) return [];

  const datasetPeriod = resolveDatasetPeriod(indicator);
  if (period && datasetPeriod && datasetPeriod !== period) {
    return [];
  }

  const periods = (indicator.series || [])
    .flatMap((item) => normalizePointArray(item?.data).map((point) => point.date))
    .filter(Boolean);

  return sortPeriods(Array.from(new Set(periods)));
}

export function getSeriesValuesByRegion(dataset, indicatorKey) {
  return (getSeries(dataset, indicatorKey) || []).reduce((acc, item) => {
    const regionCode = String(item?.regionKey || '').trim();
    if (!regionCode) return acc;
    acc[regionCode] = normalizePointArray(item?.data);
    return acc;
  }, {});
}

export function getAvailableRegionCodes(dataset, indicatorKey) {
  return Object.keys(getSeriesValuesByRegion(dataset, indicatorKey));
}

export function getDefaultRegionCode(dataset, indicatorKey) {
  const regionCodes = getAvailableRegionCodes(dataset, indicatorKey);
  if (!regionCodes.length) return '';
  if (regionCodes.includes('100000')) return '100000';
  return regionCodes[0];
}

export function getSeriesPoints(dataset, indicatorKey, period, regionCode = '', limit = 10) {
  const regionValuesMap = getSeriesValuesByRegion(dataset, indicatorKey);
  const resolvedRegionCode = regionCode || getDefaultRegionCode(dataset, indicatorKey);
  const regionPoints = normalizePointArray(regionValuesMap?.[resolvedRegionCode] || [])
    .sort((a, b) => toNumberPeriod(a.date) - toNumberPeriod(b.date));
  const periodSet = new Set(getPeriodsForIndicator(dataset, indicatorKey, period));

  let points = regionPoints.filter((item) => !periodSet.size || periodSet.has(item.date));

  if (limit && points.length > limit) {
    points = points.slice(-limit);
  }

  let lastNonEmptyIndex = points.length - 1;
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const value = points[index]?.value;
    if (value !== null && value !== '' && value !== undefined) {
      lastNonEmptyIndex = index;
      break;
    }
  }

  return points
    .slice(0, Math.max(lastNonEmptyIndex + 1, 0))
    .map((item) => ({
      date: item.date,
      value: item.value === null || item.value === '' || item.value === undefined
        ? null
        : (Number.isInteger(Number(item.value)) ? Number(item.value) : Number(Number(item.value).toFixed(Math.abs(Number(item.value)) >= 1 ? 2 : 3)))
    }));
}

export function getTimelinePoints(dataset, indicatorKey, period, limit = 10) {
  const seriesValues = getSeriesValuesByRegion(dataset, indicatorKey);
  const periods = getPeriodsForIndicator(dataset, indicatorKey, period);
  const targetPeriods = limit && periods.length > limit ? periods.slice(-limit) : periods;

  return targetPeriods.map((date) => {
    const data = Object.entries(seriesValues)
      .filter(([regionCode]) => regionCode !== '100000')
      .map(([regionCode, values]) => {
        const point = values.find((item) => item.date === date);
        return {
          regionCode,
          name: getRegionName(dataset, regionCode),
          value: point?.value
        };
      })
      .filter((item) => item.name && item.value !== null && item.value !== '' && item.value !== undefined && !Number.isNaN(Number(item.value)))
      .map((item) => ({
        ...item,
        value: Number(item.value)
      }));

    return { date, data };
  }).filter((item) => item.data.length > 0);
}
