import { getTimelinePoints, getSeriesPoints } from './statDataAdapter.js';

export const sortYearMonths = (date1, date2) => {
  const normalize = (value) => Number(String(value || '').replace('-', ''));
  return normalize(date1) - normalize(date2);
};

const selectDataCache = new WeakMap();
const MAX_SELECT_CACHE_SIZE = 300;

const setSelectCache = (cacheMap, cacheKey, value) => {
  if (cacheMap.has(cacheKey)) {
    cacheMap.delete(cacheKey);
  }
  cacheMap.set(cacheKey, value);
  if (cacheMap.size > MAX_SELECT_CACHE_SIZE) {
    const oldestKey = cacheMap.keys().next().value;
    if (oldestKey !== undefined) {
      cacheMap.delete(oldestKey);
    }
  }
};

export const selectDataFromArr = (dataset, indicatorKey, viewCode = 'nd', regionCode = '', yearLimit = 10) => {
  if (!dataset || typeof dataset !== 'object') return [];

  const cacheKey = `${viewCode}|${indicatorKey}|${regionCode || 'root'}|${yearLimit || 0}`;
  let scopedCache = selectDataCache.get(dataset);
  if (!scopedCache) {
    scopedCache = new Map();
    selectDataCache.set(dataset, scopedCache);
  }

  if (scopedCache.has(cacheKey)) {
    return scopedCache.get(cacheKey);
  }

  const result = getSeriesPoints(dataset, indicatorKey, viewCode, regionCode, yearLimit);
  setSelectCache(scopedCache, cacheKey, result);
  return result;
};

export const offsetArray = (arr, yearLimit, offset) => {
  if (!Array.isArray(arr)) return arr;
  if (offset < 0) {
    const absOffset = Math.min(-offset, arr.length);
    return [...arr.slice(absOffset), ...Array(absOffset).fill(null)];
  }
  if (offset > 0) {
    const totalLength = yearLimit + offset;
    const paddedArr = [...Array(Math.max(0, totalLength - arr.length)).fill(null), ...arr];
    return paddedArr.slice(0, yearLimit);
  }
  return arr;
};

export const selectMapTimelineData = (dataset, indicatorKey, viewCode = 'nd', yearLimit = 10) => {
  const timeline = getTimelinePoints(dataset, indicatorKey, viewCode, yearLimit);
  return {
    years: timeline.map((item) => item.date),
    timelineData: timeline.map((item) => ({
      year: item.date,
      data: item.data.map((entry) => {
        let name = entry.name || '';
        if (name && !/[省市区州盟县]$/.test(name)) {
          name += '市';
        }
        return {
          name,
          value: entry.value,
          cityCode: entry.regionCode
        };
      })
    }))
  };
};
