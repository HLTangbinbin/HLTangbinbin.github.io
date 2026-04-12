import { RUNTIME_CONFIG } from '@/config/runtimeConfig.js';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');
const trimLeadingDotSlash = (value = '') => value.replace(/^\.\//, '');

const dataBaseUrl = trimTrailingSlash(process.env.VUE_APP_DATA_BASE_URL || '');
const mapBaseUrl = trimTrailingSlash(process.env.VUE_APP_MAP_BASE_URL || dataBaseUrl);
const localDataBaseUrl = trimTrailingSlash(process.env.VUE_APP_LOCAL_DATA_BASE_URL || '/json');
const defaultDataSourceMode = String(RUNTIME_CONFIG.dataSourceMode || process.env.VUE_APP_DATA_SOURCE_MODE || '').trim().toLowerCase();

function normalizeMode(value = '') {
  const mode = String(value || '').trim().toLowerCase();
  if (mode === 'local' || mode === 'cloud') return mode;
  return '';
}

export function getCurrentDataSourceMode() {
  return normalizeMode(defaultDataSourceMode) || 'cloud';
}

export function resolveDataJsonUrl(path = '') {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;

  const normalizedPath = trimLeadingDotSlash(path);
  const mode = getCurrentDataSourceMode();
  const baseUrl = mode === 'local' ? localDataBaseUrl : dataBaseUrl;

  return baseUrl ? `${baseUrl}/${normalizedPath}` : path;
}

export function resolveMapAssetUrl(path = '') {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return mapBaseUrl ? `${mapBaseUrl}/${path.replace(/^\//, '')}` : path;
}
