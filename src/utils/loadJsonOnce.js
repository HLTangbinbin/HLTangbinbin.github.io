// utils/loadJsonOnce.js

/**
 * 纯网络层 JSON 加载器，缓存策略统一收敛到 dataLoader。
 * @param {string} path - JSON 文件相对路径（例如 /json/nation.json）
 * @returns {Promise<Object>} - 解析后的 JSON 对象
 */
export async function loadJsonOnce(path) {
  if (!path) {
    throw new Error('loadJsonOnce: 路径不能为空');
  }

  const isLocalJson = /^\/json\//.test(path);
  const fetchOptions = isLocalJson
    ? { cache: 'no-store' }
    : {};

  const response = await fetch(path, fetchOptions);
  if (!response.ok) {
    throw new Error(`加载失败: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
