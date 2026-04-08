import * as echarts from 'echarts/core';
import axios from 'axios'; // 使用你项目中已有的 axios
import { resolveMapAssetUrl } from '@/config/dataSource.js';
import { DATA_FILES } from '@/config/dataFiles.js';
import { logger } from './Logger';

// 智能判断当前图表该用哪张底图 (保留原有逻辑)
export const resolveMapType = (localJsonPath) => {
  if (!localJsonPath) return null;
  if (localJsonPath.includes(DATA_FILES.province)) return 'province';
  return null;
};

const mapLoaders = {
  province: () => axios.get(resolveMapAssetUrl(`/${DATA_FILES.geoProvince}`)).then((res) => res.data)
};
const mapRegisterPromiseMap = new Map();

export const ensureMapRegistered = async (mapType) => {
  if (!mapType || !mapLoaders[mapType]) return false;
  if (echarts.getMap(mapType)) return true;

  if (!mapRegisterPromiseMap.has(mapType)) {
    const registerPromise = mapLoaders[mapType]()
      .then((mapJson) => {
        if (!echarts.getMap(mapType)) {
          echarts.registerMap(mapType, mapJson);
        }
        return true;
      })
      .catch((error) => {
        logger.error(`❌ 底图加载失败(${mapType})，请检查地图资源地址或服务器文件是否可访问:`, error);
        return false;
      })
      .finally(() => {
        mapRegisterPromiseMap.delete(mapType);
      });
    mapRegisterPromiseMap.set(mapType, registerPromise);
  }

  return mapRegisterPromiseMap.get(mapType);
};

// 🌟 架构升级：异步并发加载底图
export const registerAllMaps = async () => {
  await Promise.all(Object.keys(mapLoaders).map((mapType) => ensureMapRegistered(mapType)));
};
