const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');
const trimLeadingDotSlash = (value = '') => value.replace(/^\.\//, '');

const dataBaseUrl = trimTrailingSlash(process.env.VUE_APP_DATA_BASE_URL || '');
const mapBaseUrl = trimTrailingSlash(process.env.VUE_APP_MAP_BASE_URL || dataBaseUrl);
const explicitMode = process.env.VUE_APP_DATA_SOURCE;

export function getDataSourceMode() {
  if (explicitMode === 'local' || explicitMode === 'remote' || explicitMode === 'api') {
    return explicitMode;
  }

  if (dataBaseUrl) {
    return 'remote';
  }

  return process.env.VUE_APP_REQUEST_IS_LOCAL === 'true' ? 'local' : 'api';
}

export function resolveDataJsonUrl(path = '') {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (getDataSourceMode() === 'local' || !dataBaseUrl) return path;
  return `${dataBaseUrl}/${trimLeadingDotSlash(path)}`;
}

export function resolveMapAssetUrl(path = '') {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (getDataSourceMode() === 'local' || !mapBaseUrl) return path;
  return `${mapBaseUrl}/${path.replace(/^\//, '')}`;
}
