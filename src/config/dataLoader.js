// utils/dataLoader.js
import { sendRequest } from '@/utils/CommonUtil.js';
import { logger } from '@/utils/Logger.js';

// 缓存对象
const dataCache = {};
// 预加载队列
const preloadQueue = new Set();
// 预加载状态
const preloadStatus = new Map();

// 缓存配置
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5分钟过期
  MAX_SIZE: 50, // 最大缓存条目数
  PRELOAD_DELAY: 1000, // 预加载延迟
};

// 性能监控
const performanceMetrics = {
  loadTimes: {},
  cacheHits: 0,
  cacheMisses: 0,
};

export async function loadChartData({ localJson, apiParams }, options = {}) {
  const { 
    forceRefresh = false,
    timeout = 30000 
  } = options;
  
  const isLocal = process.env.VUE_APP_REQUEST_IS_LOCAL === 'true';
  const cacheKey = isLocal ? localJson : JSON.stringify(apiParams);

  // 检查缓存
  if (!forceRefresh && dataCache[cacheKey]) {
    const { data, time } = dataCache[cacheKey];
    if (Date.now() - time < CACHE_CONFIG.TTL) {
      performanceMetrics.cacheHits++;
      // logger.debug(`缓存命中: ${cacheKey}`);
      return data;
    }
  }

  performanceMetrics.cacheMisses++;

  // 如果正在预加载中，等待完成
  if (preloadQueue.has(cacheKey)) {
    logger.debug(`等待预加载完成: ${cacheKey}`);
    return new Promise((resolve, reject) => {
      const checkStatus = () => {
        if (dataCache[cacheKey]) {
          resolve(dataCache[cacheKey].data);
        } else if (preloadStatus.get(cacheKey) === 'error') {
          reject(new Error('预加载失败'));
        } else {
          setTimeout(checkStatus, 100);
        }
      };
      checkStatus();
    });
  }

  const startTime = performance.now();
  
  try {
    let result;
    
    if (isLocal) {
      // 添加超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(localJson, { 
        signal: controller.signal,
        // 添加缓存控制
        cache: 'force-cache'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`状态码错误: ${response.status}`);
      result = await response.json();
    } else {
      result = await sendRequest(apiParams);
    }

    // 更新缓存
    updateCache(cacheKey, result);
    
    // 记录性能指标
    const loadTime = performance.now() - startTime;
    performanceMetrics.loadTimes[cacheKey] = loadTime;
    
    logger.info(`数据加载完成: ${cacheKey}, 耗时: ${loadTime.toFixed(2)}ms`);
    
    return result;
  } catch (error) {
    const loadTime = performance.now() - startTime;
    logger.error(`数据加载失败: ${cacheKey}, 耗时: ${loadTime.toFixed(2)}ms`, error);
    throw error;
  }
}

// 智能预加载
export async function smartPreload(configs, options = {}) {
  const { 
    immediate = false, 
    maxConcurrent = 3 
  } = options;
  
  if (immediate) {
    // 立即预加载高优先级数据
    const highPriorityConfigs = configs.filter(config => 
      config.priority === 'high' || config.path === window.location.pathname
    );
    
    if (highPriorityConfigs.length > 0) {
      logger.info('立即预加载高优先级数据');
      await Promise.all(
        highPriorityConfigs.map(config => 
          loadChartData(config.source, { priority: 'high' })
        )
      );
    }
  }

  // 延迟预加载其他数据
  setTimeout(async () => {
    const remainingConfigs = configs.filter(config => 
      !preloadQueue.has(config.source.localJson || JSON.stringify(config.source.apiParams))
    );

    // 分批预加载，避免并发过多
    for (let i = 0; i < remainingConfigs.length; i += maxConcurrent) {
      const batch = remainingConfigs.slice(i, i + maxConcurrent);
      await Promise.allSettled(
        batch.map(config => {
          const cacheKey = config.source.localJson || JSON.stringify(config.source.apiParams);
          preloadQueue.add(cacheKey);
          preloadStatus.set(cacheKey, 'loading');
          
          return loadChartData(config.source, { 
            priority: 'low', 
            preload: true 
          }).finally(() => {
            preloadQueue.delete(cacheKey);
            preloadStatus.delete(cacheKey);
          });
        })
      );
      
      // 批次间延迟
      if (i + maxConcurrent < remainingConfigs.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    logger.info('预加载完成');
  }, CACHE_CONFIG.PRELOAD_DELAY);
}

// 缓存管理
function updateCache(key, data) {
  // 清理过期缓存
  const now = Date.now();
  Object.keys(dataCache).forEach(k => {
    if (now - dataCache[k].time > CACHE_CONFIG.TTL) {
      delete dataCache[k];
    }
  });

  // 限制缓存大小
  if (Object.keys(dataCache).length >= CACHE_CONFIG.MAX_SIZE) {
    const oldestKey = Object.keys(dataCache).reduce((a, b) => 
      dataCache[a].time < dataCache[b].time ? a : b
    );
    delete dataCache[oldestKey];
  }

  dataCache[key] = { data, time: now };
}

// 获取性能指标
export function getPerformanceMetrics() {
  return {
    ...performanceMetrics,
    cacheSize: Object.keys(dataCache).length,
    preloadQueueSize: preloadQueue.size,
  };
}

// 清理缓存
export function clearCache(pattern = null) {
  if (pattern) {
    Object.keys(dataCache).forEach(key => {
      if (key.includes(pattern)) {
        delete dataCache[key];
      }
    });
  } else {
    Object.keys(dataCache).forEach(key => delete dataCache[key]);
  }
  logger.info('缓存已清理');
}