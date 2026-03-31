import { resolveDataJsonUrl } from '@/config/dataSource.js';
import { logger } from '@/utils/Logger.js';
import { loadJsonOnce } from '@/utils/loadJsonOnce.js'; 

const dataCache = {};
const preloadQueue = new Set();
const preloadStatus = new Map();

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

  if (!forceRefresh && dataCache[cacheKey]) {
    const { data, time } = dataCache[cacheKey];
    if (Date.now() - time < CACHE_CONFIG.TTL) {
      performanceMetrics.cacheHits++;
      return data;
    }
  }

  performanceMetrics.cacheMisses++;

  if (preloadQueue.has(cacheKey)) {
    return new Promise((resolve, reject) => {
      const checkStatus = () => {
        if (dataCache[cacheKey]) resolve(dataCache[cacheKey].data);
        else if (preloadStatus.get(cacheKey) === 'error') reject(new Error('预加载失败'));
        else setTimeout(checkStatus, 100);
      };
      checkStatus();
    });
  }

  const startTime = performance.now();
  
  try {
    if (!jsonUrl) {
      throw new Error('缺少 JSON 数据源路径配置');
    }

    const result = await loadJsonOnce(jsonUrl);

    updateCache(cacheKey, result);
    
    const loadTime = performance.now() - startTime;
    performanceMetrics.loadTimes[cacheKey] = loadTime;
    
    logger.info(`数据加载完成: ${cacheKey}, 耗时: ${loadTime.toFixed(2)}ms`);
    return result;
  } catch (error) {
    logger.error(`数据加载失败: ${cacheKey}`, error);
    throw error;
  }
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
    const remainingConfigs = configs.filter(config => 
      !preloadQueue.has(resolveDataJsonUrl(config.source.localJson))
    );

    for (let i = 0; i < remainingConfigs.length; i += maxConcurrent) {
      const batch = remainingConfigs.slice(i, i + maxConcurrent);
      await Promise.allSettled(
        batch.map(config => {
          const cacheKey = resolveDataJsonUrl(config.source.localJson);
          preloadQueue.add(cacheKey);
          preloadStatus.set(cacheKey, 'loading');
          
          return loadChartData(config.source, { priority: 'low', preload: true }).finally(() => {
            preloadQueue.delete(cacheKey);
            preloadStatus.delete(cacheKey);
          });
        })
      );
      if (i + maxConcurrent < remainingConfigs.length) await new Promise(resolve => setTimeout(resolve, 200));
    }
  }, CACHE_CONFIG.PRELOAD_DELAY);
}

function updateCache(key, data) {
  const now = Date.now();
  Object.keys(dataCache).forEach(k => {
    if (now - dataCache[k].time > CACHE_CONFIG.TTL) delete dataCache[k];
  });

  if (Object.keys(dataCache).length >= CACHE_CONFIG.MAX_SIZE) {
    const oldestKey = Object.keys(dataCache).reduce((a, b) => dataCache[a].time < dataCache[b].time ? a : b);
    delete dataCache[oldestKey];
  }
  dataCache[key] = { data, time: now };
}

export function getPerformanceMetrics() {
  return { ...performanceMetrics, cacheSize: Object.keys(dataCache).length, preloadQueueSize: preloadQueue.size };
}

export function clearCache(pattern = null) {
  if (pattern) {
    Object.keys(dataCache).forEach(key => {
      if (key.includes(pattern)) delete dataCache[key];
    });
  } else {
    Object.keys(dataCache).forEach(key => delete dataCache[key]);
  }
}
