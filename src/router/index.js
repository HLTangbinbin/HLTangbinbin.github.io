import { createRouter, createWebHashHistory } from 'vue-router';
import { navConfig } from '../config/navConfig';
import { logger } from '@/utils/Logger';

const GenericLayout = () => import('@/components/common/GenericLayout.vue');
const DynamicChartPage = () => import('@/components/common/DynamicChartPage.vue');

// 递归生成路由
function generateRoutes(items, parentPath = '') {
  return items.map(item => {
    const hasChildren = item.children && item.children.length > 0;

    // 处理路径拼接，去掉多余的斜杠，确保给 NavBar 的 basePath 是标准的 /a/b 格式
    const cleanItemPath = item.path.replace(/^\//, '');
    const currentFullPath = parentPath === ''
      ? `/${cleanItemPath}`
      : `${parentPath}/${cleanItemPath}`;

    let componentConfig;

    if (hasChildren) {
      componentConfig = GenericLayout;
    } else {
      // 遇到特殊的公积金图片页单独引入
      if (item.path === 'ProvidentFund') {
        componentConfig = () => import('@/components/SpecialPage/ProvidentFund.vue');
      } else {
        componentConfig = DynamicChartPage;
      }
    }

    const routeNode = {
      path: item.path,
      component: componentConfig,
    };

    if (hasChildren) {
      // 🌟 核心修复点：将当前层级的子菜单数组和路径，直接作为 props 传给 GenericLayout 组件！
      routeNode.props = {
        navItems: item.children,
        currentBasePath: currentFullPath
      };
      
      routeNode.children = generateRoutes(item.children, currentFullPath);
      // 默认重定向到本层级的第一个子路由
      routeNode.redirect = `${currentFullPath}/${item.children[0].path}`;
    }

    return routeNode;
  });
}

const routes = [
  { path: '/', redirect: '/WH' },
  ...generateRoutes(navConfig)
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.afterEach((to, from) => {
  if (from.path !== '/') {
    logger.debug(`路由切换: ${from.path} -> ${to.path}`);
  }
});

export default router;