import { createRouter, createWebHashHistory } from 'vue-router';
import { navConfig } from '../config/navConfig';
import loadPage from './lazyLoader';

function cleanPathForImport(path) {
  return path.startsWith('/') ? path.slice(1) : path;
}

function generateRoutes(config) {
  return config.map(group => {
    const groupPath = group.path;
    const groupImportPath = cleanPathForImport(group.path);

    const children = group.children?.map(child => {
      if (child.children) {
        const childImportPath = cleanPathForImport(child.path);
        return {
          path: child.path,
          component: loadPage(groupImportPath, childImportPath, childImportPath),
          redirect: `${group.path}/${child.path}/${child.children[0].path}`,
          children: child.children.map(sub => ({
            path: sub.path,
            component: loadPage(groupImportPath, childImportPath, sub.path)
          }))
        };
      } else {
        return {
          path: child.path,
          component: loadPage(groupImportPath, child.path, child.path)
        };
      }
    });

    return {
      path: groupPath,
      component: loadPage(groupImportPath, groupImportPath),
      redirect: `${group.path}/${children[0].path}`,
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

export default router;