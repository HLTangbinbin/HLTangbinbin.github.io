const DATA_SCHEMA = 'dt-stats-lite-v1';

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

function buildIndex(dataset) {
  const regionEntries = new Map();
  const timeEntries = new Map();
  const viewPeriodIndex = new Map();
  const pageMap = new Map(Object.entries(dataset.pages || {}));

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
    pageMap
  };
}

export function normalizeStatData(raw = {}) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('统计数据为空，无法解析。');
  }

  if (raw.meta?.schema !== DATA_SCHEMA) {
    throw new Error(`当前前端仅支持 ${DATA_SCHEMA} 数据契约，收到: ${raw.meta?.schema || 'unknown'}`);
  }

  if (!raw.pages || !raw.datasets) {
    throw new Error('统计数据缺少 pages / datasets 核心字段。');
  }

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
  return normalizeStatData(dataset).datasets?.[indicatorKey] || null;
}

export function getSeries(dataset, indicatorKey) {
  return getIndicator(dataset, indicatorKey)?.series || [];
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
