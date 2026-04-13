import { resolveDataJsonUrl } from '@/config/dataSource.js';
import { logger } from '@/utils/Logger.js';
import { loadJsonOnce } from '@/utils/loadJsonOnce.js'; 
import { normalizeStatData } from '@/utils/statDataAdapter.js';

const dataCache = new Map();

const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, 
  MAX_SIZE: 50, 
  PRELOAD_DELAY: 1000, 
};

const performanceMetrics = {
  loadTimes: {},
  cacheHits: 0,
  cacheMisses: 0,
};

export async function loadChartData({ localJson }, options = {}) {
  const { forceRefresh = false } = options;
  const jsonUrl = resolveDataJsonUrl(localJson);
  const cacheKey = jsonUrl;
  const now = Date.now();

  if (!cacheKey) {
    throw new Error('缺少 JSON 数据源路径配置');
  }

  pruneExpiredCache(now);

  if (!forceRefresh && dataCache.has(cacheKey)) {
    const cachedEntry = dataCache.get(cacheKey);
    if (cachedEntry?.data && cachedEntry.expiresAt > now) {
      performanceMetrics.cacheHits++;
      touchCacheEntry(cacheKey, cachedEntry);
      return cachedEntry.data;
    }
    if (cachedEntry?.promise) {
      performanceMetrics.cacheHits++;
      touchCacheEntry(cacheKey, cachedEntry);
      return cachedEntry.promise;
    }
  }

  performanceMetrics.cacheMisses++;
  const startTime = performance.now();
  const pendingPromise = loadJsonOnce(jsonUrl)
    .then((rawData) => normalizeStatData(rawData))
    .then((result) => {
      const loadTime = performance.now() - startTime;
      performanceMetrics.loadTimes[cacheKey] = loadTime;
      updateCache(cacheKey, result);
      logger.info(`数据加载完成: ${cacheKey}, 耗时: ${loadTime.toFixed(2)}ms`);
      return result;
    })
    .catch((error) => {
      dataCache.delete(cacheKey);
      logger.error(`数据加载失败: ${cacheKey}`, error);
      throw error;
    });

  dataCache.set(cacheKey, {
    promise: pendingPromise,
    expiresAt: now + CACHE_CONFIG.TTL,
    time: now
  });

  return pendingPromise;
}

export async function smartPreload(configs, options = {}) {
  const { immediate = false, maxConcurrent = 3 } = options;
  
  if (immediate) {
    const highPriorityConfigs = configs.filter(config => 
      config.priority === 'high' || config.path === window.location.hash.replace('#', '')
    );
    if (highPriorityConfigs.length > 0) {
      await Promise.all(
        highPriorityConfigs.map(config => loadChartData(config.source, { priority: 'high' }))
      );
    }
  }

  setTimeout(async () => {
    const remainingConfigs = configs.filter((config) => {
      const cacheKey = resolveDataJsonUrl(config.source.localJson);
      if (!cacheKey || !dataCache.has(cacheKey)) return true;
      const cachedEntry = dataCache.get(cacheKey);
      return !(cachedEntry?.data || cachedEntry?.promise);
    });

    for (let i = 0; i < remainingConfigs.length; i += maxConcurrent) {
      const batch = remainingConfigs.slice(i, i + maxConcurrent);
      await Promise.allSettled(
        batch.map(config => loadChartData(config.source, { priority: 'low', preload: true }))
      );
      if (i + maxConcurrent < remainingConfigs.length) await new Promise(resolve => setTimeout(resolve, 200));
    }
  }, CACHE_CONFIG.PRELOAD_DELAY);
}

function updateCache(key, data) {
  const now = Date.now();
  pruneExpiredCache(now);
  dataCache.delete(key);
  dataCache.set(key, {
    data,
    expiresAt: now + CACHE_CONFIG.TTL,
    time: now
  });
  pruneOverflowCache();
}

export function getPerformanceMetrics() {
  const preloadQueueSize = Array.from(dataCache.values()).filter((entry) => entry?.promise && !entry?.data).length;
  return { ...performanceMetrics, cacheSize: dataCache.size, preloadQueueSize };
}

export function clearCache(pattern = null) {
  if (pattern) {
    Array.from(dataCache.keys()).forEach(key => {
      if (key.includes(pattern)) dataCache.delete(key);
    });
  } else {
    dataCache.clear();
  }
}

function touchCacheEntry(key, entry) {
  dataCache.delete(key);
  dataCache.set(key, {
    ...entry,
    time: Date.now()
  });
}

function pruneExpiredCache(now = Date.now()) {
  Array.from(dataCache.entries()).forEach(([key, entry]) => {
    if (!entry) {
      dataCache.delete(key);
      return;
    }
    if (entry.data && entry.expiresAt <= now) {
      dataCache.delete(key);
    }
  });
}

function pruneOverflowCache() {
  while (dataCache.size > CACHE_CONFIG.MAX_SIZE) {
    const oldestKey = dataCache.keys().next().value;
    if (oldestKey === undefined) break;
    dataCache.delete(oldestKey);
  }
}
