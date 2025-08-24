// utils/loadJsonOnce.js

const jsonCache = new Map();

/**
 * 加载本地 JSON 文件，只加载一次，后续返回缓存内容
 * @param {string} path - JSON 文件相对路径（例如 /json/nation/chartMetaNation.json）
 * @returns {Promise<Object>} - 解析后的 JSON 对象
 */
export async function loadJsonOnce(path) {
  if (!path) {
    throw new Error('loadJsonOnce: 路径不能为空');
  }

  if (jsonCache.has(path)) {
    return jsonCache.get(path);
  }

  const loadPromise = fetch(path)
    .then(res => {
      if (!res.ok) {
        throw new Error(`加载失败: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      jsonCache.set(path, data);
      return data;
    })
    .catch(err => {
      jsonCache.delete(path); // 加载失败不缓存，防止死缓存
      throw err;
    });

  // 立即缓存 Promise（防止并发重复请求）
  jsonCache.set(path, loadPromise);
  return loadPromise;
}