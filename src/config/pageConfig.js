import { navConfig } from '@/config/navConfig.js';

export function definePageConfig(config = {}) {
  return normalizePageConfig(config);
}

export function normalizePageConfig(config = {}, context = {}) {
  if (!config || typeof config !== 'object') {
    throw new Error('页面配置必须为对象');
  }

  const source = config.source || {};
  const charts = Array.isArray(config.charts) ? config.charts : [];
  const legacyPage = config.page || {};
  const inferredMeta = inferPageMeta(charts, context);

  return {
    ...config,
    source,
    charts,
    page: {
      id: legacyPage.id || context.routeKey || '',
      routeKey: context.routeKey || legacyPage.routeKey || '',
      title: legacyPage.title || inferredMeta.title,
      description: legacyPage.description || inferredMeta.description,
      tags: Array.isArray(legacyPage.tags) ? legacyPage.tags : [],
      breadcrumb: Array.isArray(legacyPage.breadcrumb) ? legacyPage.breadcrumb : inferredMeta.breadcrumb,
      defaultViewMode: legacyPage.defaultViewMode || inferDefaultViewMode(charts),
      availableDbCodes: legacyPage.availableDbCodes || Array.from(new Set(charts.map(chart => chart.dbCode).filter(Boolean))),
      metricsCount: legacyPage.metricsCount || countMetricCodes(charts),
      chartCount: legacyPage.chartCount || charts.length
    }
  };
}

function inferPageMeta(charts, context) {
  const breadcrumb = resolveRouteLabels(context.routePath);
  const title = breadcrumb[breadcrumb.length - 1] || charts[0]?.title || context.routeKey || '未命名页面';
  const description = charts[0]?.subtitle || '';

  return {
    title,
    description,
    breadcrumb
  };
}

function inferDefaultViewMode(charts = []) {
  const dbCodes = new Set(charts.map(chart => chart.dbCode).filter(Boolean));
  if (dbCodes.has('yd')) return 'monthly';
  if (dbCodes.has('nd')) return 'yearly';
  return 'monthly';
}

function countMetricCodes(charts = []) {
  return new Set(
    charts.flatMap(chart => Array.isArray(chart.zbcodeArr) ? chart.zbcodeArr : [])
  ).size;
}

function resolveRouteLabels(path = '') {
  for (const level1 of navConfig) {
    const level1Path = normalizePath(level1.path);
    if (!path.startsWith(level1Path)) continue;

    const level1Labels = [level1.label];
    const level2Children = Array.isArray(level1.children) ? level1.children : [];

    for (const level2 of level2Children) {
      const level2Path = normalizePath(`${level1Path}/${level2.path}`);
      if (!path.startsWith(level2Path)) continue;

      const level2Labels = [...level1Labels, level2.label];
      const level3Children = Array.isArray(level2.children) ? level2.children : [];

      for (const level3 of level3Children) {
        const level3Path = normalizePath(`${level2Path}/${level3.path}`);
        if (path.startsWith(level3Path)) {
          return [...level2Labels, level3.label];
        }
      }

      return level2Labels;
    }

    return level1Labels;
  }

  return [];
}

function normalizePath(value) {
  return String(value || '').replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}
