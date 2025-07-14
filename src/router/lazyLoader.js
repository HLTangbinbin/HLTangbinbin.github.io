// src/router/lazyLoader.js

/**
 * 动态按路径加载 Vue 页面组件
 * @param  {...string} segments - 组件路径段，例如 ['WH', 'WHGDP']
 * @returns {Function} - 懒加载组件函数
 */

export default function loadPage(...segments) {
  // 只保留最后一个 segment 作为组件名（如 WHNewHouse）
  const last = segments[segments.length - 1];
  const dir = segments[0].replace(/^\/+/, ''); // 如 'WH'

  // 最终路径：../components/WH/WHNewHouse.vue
  return () => import(`../components/${dir}/${last}.vue`);
}