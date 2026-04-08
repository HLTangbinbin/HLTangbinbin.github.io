import dataFiles from './dataFiles.json';

export const DATA_FILES = dataFiles;

export function getDataFile(key) {
  return DATA_FILES[key] || '';
}

export function getLocalJsonFile(key) {
  const file = getDataFile(key);
  return file ? `./${file}` : '';
}

export function createDataSource(key, extra = {}) {
  return {
    localJson: getLocalJsonFile(key),
    ...extra
  };
}
