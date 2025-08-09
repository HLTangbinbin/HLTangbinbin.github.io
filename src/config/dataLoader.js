// utils/dataLoader.js
import { sendRequest } from '@/utils/CommonUtil.js';
import { logger } from '@/utils/Logger.js';

// 缓存对象
const dataCache = {};
// 如果需要过期刷新，可以设置 TTL（毫秒），例如 5 分钟
const CACHE_TTL = 0; // 0 表示永不过期

export async function loadChartData({ localJson, apiParams }) {
  const isLocal = process.env.VUE_APP_REQUEST_IS_LOCAL === 'true';
  const cacheKey = isLocal ? localJson : JSON.stringify(apiParams);

  // 检查缓存
  const now = Date.now();
  if (dataCache[cacheKey]) {
    const { data, time } = dataCache[cacheKey];
    if (CACHE_TTL === 0 || now - time < CACHE_TTL) {
      return data;
    }
  }

  if (isLocal) {
    try {
      const response = await fetch(localJson);
      if (!response.ok) throw new Error(`状态码错误: ${response.status}`);
      const jsonData = await response.json();
      dataCache[cacheKey] = { data: jsonData, time: now };
      return jsonData;
    } catch (error) {
      logger.error('本地数据加载失败:', error);
      throw error;
    }
  } else {
    try {
      const result = await sendRequest(apiParams);
      dataCache[cacheKey] = { data: result, time: now };
      return result;
    } catch (error) {
      logger.error('接口请求失败:', error);
      throw error;
    }
  }
}