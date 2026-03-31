const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');
const trimLeadingDotSlash = (value = '') => value.replace(/^\.\//, '');

const dataBaseUrl = trimTrailingSlash(process.env.VUE_APP_DATA_BASE_URL || '');
const mapBaseUrl = trimTrailingSlash(process.env.VUE_APP_MAP_BASE_URL || dataBaseUrl);

export function resolveDataJsonUrl(path = '') {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return dataBaseUrl ? `${dataBaseUrl}/${trimLeadingDotSlash(path)}` : path;
}

export function resolveMapAssetUrl(path = '') {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return mapBaseUrl ? `${mapBaseUrl}/${path.replace(/^\//, '')}` : path;
}
