const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');
const trimLeadingDotSlash = (value = '') => value.replace(/^\.\//, '');

const dataBaseUrl = trimTrailingSlash(process.env.VUE_APP_DATA_BASE_URL || '');
const mapBaseUrl = trimTrailingSlash(process.env.VUE_APP_MAP_BASE_URL || dataBaseUrl);
const localDataBaseUrl = trimTrailingSlash(process.env.VUE_APP_LOCAL_DATA_BASE_URL || '/json');
const defaultDataSourceMode = String(process.env.VUE_APP_DATA_SOURCE_MODE || '').trim().toLowerCase();
const DATA_SOURCE_QUERY_KEY = 'dataSource';
const DATA_SOURCE_STORAGE_KEY = 'tangdata:data-source-mode';

function normalizeMode(value = '') {
  const mode = String(value || '').trim().toLowerCase();
  if (mode === 'local' || mode === 'cloud') return mode;
  return '';
}

function getRuntimeDataSourceMode() {
  if (typeof window === 'undefined') {
    return normalizeMode(defaultDataSourceMode);
  }

  const queryMode = normalizeMode(new URLSearchParams(window.location.search).get(DATA_SOURCE_QUERY_KEY));
  if (queryMode) {
    window.localStorage.setItem(DATA_SOURCE_STORAGE_KEY, queryMode);
    return queryMode;
  }

  const storedMode = normalizeMode(window.localStorage.getItem(DATA_SOURCE_STORAGE_KEY));
  if (storedMode) return storedMode;

  return normalizeMode(defaultDataSourceMode);
}

export function getCurrentDataSourceMode() {
  return getRuntimeDataSourceMode() || 'cloud';
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
