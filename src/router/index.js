import { createRouter, createWebHashHistory } from 'vue-router';
import { navConfig } from '../config/navConfig';
import loadPage, { preloadRelatedRoutes } from './lazyLoader';
import { logger } from '@/utils/Logger';

function cleanPathForImport(path) {
  return path.startsWith('/') ? path.slice(1) : path;
}

function generateRoutes(config) {
  return config.map(group => {
    const groupPath = group.path;
    const groupImportPath = cleanPathForImport(group.path);
    
    // logger.debug('Generating routes for group:', groupPath, 'importPath:', groupImportPath);

    const children = group.children?.map(child => {
      // logger.debug('Processing child:', child.path, 'in group:', groupPath);
      
      if (child.children) {
        // 处理三级嵌套路由
        const childImportPath = cleanPathForImport(child.path);
        // logger.debug('Creating nested route for:', child.path, 'with component:', loadPage(groupImportPath, childImportPath));
        
        return {
          path: child.path,
          component: loadPage(groupImportPath, childImportPath),
          redirect: `${group.path}/${child.path}/${child.children[0].path}`,
          children: child.children.map(sub => {
            // logger.debug('Creating sub-route for:', sub.path, 'with component:', loadPage(groupImportPath, childImportPath, sub.path));
            return {
              path: sub.path,
              component: loadPage(groupImportPath, childImportPath, sub.path)
            };
          })
        };
      } else {
        // 处理二级路由
        // logger.debug('Creating route for:', child.path, 'with component:', loadPage(groupImportPath, child.path));
        return {
          path: child.path,
          component: loadPage(groupImportPath, child.path)
        };
      }
    });

    return {
      path: groupPath,
      component: loadPage(groupImportPath),
      redirect: children && children.length > 0 ? `${group.path}/${children[0].path}` : undefined,
      children
    };
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

// 路由守卫：预加载相关路由
router.beforeEach((to, from, next) => {
  // 预加载目标路由相关的组件
  if (to.path !== from.path) {
    // 延迟预加载，避免阻塞导航
    setTimeout(() => {
      preloadRelatedRoutes(to.path);
    }, 100);
  }
  
  next();
});

// 路由后置钩子：性能监控
router.afterEach((to, from) => {
  // 记录路由切换性能
  if (from.path !== '/') {
    const navigationTime = performance.now();
    logger.debug(`路由切换: ${from.path} -> ${to.path}, 时间: ${navigationTime.toFixed(2)}ms`);
  }
});

export default router;