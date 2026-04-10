import { navConfig } from '@/config/navConfig.js';

export function definePageConfig(config = {}) {
  return normalizePageConfig(config);
}

export function hydratePageConfig(config = {}, dataset, context = {}) {
  const charts = (Array.isArray(config.charts) ? config.charts : [])
    .map((chart) => hydrateChartConfig(chart, dataset))
    .filter(Boolean);

  return normalizePageConfig({
    ...config,
    charts
  }, context);
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
    charts.flatMap((chart) => {
      if (Array.isArray(chart.metricIds) && chart.metricIds.length) return chart.metricIds;
      if (Array.isArray(chart.seriesRefs) && chart.seriesRefs.length) {
        return chart.seriesRefs.map((item) => item?.metricId).filter(Boolean);
      }
      return [];
    })
  ).size;
}

function hydrateChartConfig(chartConfig = {}, dataset = {}) {
  const chartKey = String(chartConfig?.chartKey || '').trim();
  const sourceChart = chartKey ? dataset?.charts?.[chartKey] : null;
  const seriesRefs = resolveChartSeriesRefs(chartConfig, sourceChart, dataset);
  const metricIds = seriesRefs.map((item) => item?.metricId).filter(Boolean);
  if (!metricIds.length) return null;
  const dbCode = chartConfig.dbCode || inferChartDbCode(sourceChart, dataset);
  const pieConfig = normalizePieConfig(chartConfig.pieConfig, metricIds);

  return {
    ...chartConfig,
    id: chartConfig.id || chartKey || metricIds.join('__'),
    chartKey,
    title: chartConfig.title || sourceChart?.title || chartKey || '未命名图表',
    dbCode,
    metricIds,
    seriesRefs,
    datasets: Array.isArray(sourceChart?.datasets) ? sourceChart.datasets : [],
    pieConfig
  };
}

function resolveChartSeriesRefs(chartConfig = {}, sourceChart = null, dataset = {}) {
  const explicitMetricIds = Array.isArray(chartConfig.metricIds)
    ? chartConfig.metricIds.map((item) => String(item || '').trim()).filter(Boolean)
    : [];

  if (explicitMetricIds.length) {
    return explicitMetricIds
      .map((metricId) => resolveMetricRef(metricId, sourceChart, dataset))
      .filter(Boolean);
  }

  const sourceSeriesRefs = Array.isArray(sourceChart?.seriesRefs) ? sourceChart.seriesRefs : [];
  const includes = Array.isArray(chartConfig.metricDisplayNameIncludes) ? chartConfig.metricDisplayNameIncludes : [];
  const excludes = Array.isArray(chartConfig.metricDisplayNameExcludes) ? chartConfig.metricDisplayNameExcludes : [];

  if (!includes.length && !excludes.length) {
    return sourceSeriesRefs;
  }

  return sourceSeriesRefs.filter((item) => {
    const label = String(item?.displayName || item?.name || item?.metricId || '').trim();
    const included = includes.length ? includes.some((pattern) => matchMetricPattern(label, pattern)) : true;
    const excluded = excludes.some((pattern) => matchMetricPattern(label, pattern));
    return included && !excluded;
  });
}

function resolveMetricRef(metricId, sourceChart = null, dataset = {}) {
  const chartSeriesRefs = Array.isArray(sourceChart?.seriesRefs) ? sourceChart.seriesRefs : [];
  const matchedRef = chartSeriesRefs.find((item) => item?.metricId === metricId);
  if (matchedRef) return matchedRef;

  const metric = dataset?.metrics?.[metricId];
  const indicator = dataset?.datasets?.[metricId];
  if (!metric && !indicator) return null;

  return {
    metricId,
    requestKey: metric?.requestKey || indicator?.requestKey || '',
    sourceNodeId: metric?.sourceNodeId || indicator?.sourceNodeId || '',
    queryKey: metric?.queryKey || indicator?.queryKey || '',
    displayName: metric?.displayName || indicator?.displayName || indicator?.name || metricId,
    unit: metric?.unit || indicator?.unit || '',
    aliasKey: metric?.aliasKey || ''
  };
}

function matchMetricPattern(label, pattern) {
  if (!pattern) return false;
  if (pattern instanceof RegExp) return pattern.test(label);
  return label.includes(String(pattern));
}

function inferChartDbCode(chart = {}, dataset = {}) {
  const chartPeriods = (Array.isArray(chart.datasets) ? chart.datasets : [])
    .flatMap((item) => Array.isArray(item?.periods) ? item.periods : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean);

  if (chartPeriods.includes('yd')) return 'yd';
  if (chartPeriods.includes('nd')) return 'nd';
  if (chartPeriods.includes('jd')) return 'jd';

  const metricIds = Array.isArray(chart.seriesRefs) ? chart.seriesRefs.map((item) => item?.metricId).filter(Boolean) : [];
  for (const metricId of metricIds) {
    const periods = dataset?.datasets?.[metricId]?.periods;
    if (Array.isArray(periods) && periods.length) {
      return String(periods[0] || '').trim();
    }
  }

  const fallbackPeriod = String(chart?.period || '').trim();
  return fallbackPeriod === 'mixed' ? '' : fallbackPeriod;
}

function normalizePieConfig(pieConfig, metricIds = []) {
  if (!pieConfig?.enabled || !Array.isArray(pieConfig.pies) || !pieConfig.pies.length) return null;

  const pies = pieConfig.pies
    .map((pie) => {
      const triggerMetricIds = resolvePieMetricIds(pie, metricIds);
      if (!triggerMetricIds.length) return null;
      return {
        ...pie,
        triggerMetricIds
      };
    })
    .filter(Boolean);

  if (!pies.length) return null;
  return {
    ...pieConfig,
    pies
  };
}

function resolvePieMetricIds(pie = {}, metricIds = []) {
  if (Array.isArray(pie.triggerMetricIds) && pie.triggerMetricIds.length) {
    return pie.triggerMetricIds.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (pie.trigger === 'all-series') {
    return metricIds;
  }

  if (pie.trigger === 'first-series') {
    return metricIds.length ? [metricIds[0]] : [];
  }

  if (Array.isArray(pie.triggerMetricIndexes) && pie.triggerMetricIndexes.length) {
    return pie.triggerMetricIndexes
      .map((index) => metricIds[index])
      .filter(Boolean);
  }

  return [];
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
