// utils/dataLoader.js
import { sendRequest } from '@/utils/CommonUtil.js';
import { logger } from '@/utils/Logger.js';

/**
 * 加载图表数据（支持远程 API 和本地 JSON 文件）
 * @param {String} localJsonPath - 本地 JSON 路径（相对 public）
 * @param {Object} apiParams - API 请求参数
 * @returns {Promise<Object>} - 返回获取的数据
 */
// 推荐方式：统一接收一个 config 对象参数
export async function loadChartData({ localJson, apiParams }) {
  const isLocal = process.env.VUE_APP_REQUEST_IS_LOCAL === 'true';

  if (isLocal) {
    try {
      const response = await fetch(localJson);
      if (!response.ok) throw new Error(`状态码错误: ${response.status}`);
      return await response.json();

    } catch (error) {
      logger.error('本地数据加载失败:', error);
      throw error;
    }
  } else {
    try {
      const result = await sendRequest(apiParams);
      return result;
    } catch (error) {
      logger.error('接口请求失败:', error);
      throw error;
    }
  }
}