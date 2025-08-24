// src/router/lazyLoader.js

import { logger } from "@/utils/Logger";

/**
 * 动态按路径加载 Vue 页面组件
 * @param  {...string} segments - 组件路径段，例如 ['WH', 'WHGDP']
 * @returns {Function} - 懒加载组件函数
 */

// 组件缓存
const componentCache = new Map();

// 预加载队列
const preloadQueue = new Set();

// 静态导入映射 - 解决webpack动态导入问题
const componentMap = {

  
  // WH 模块
  'WH/WH': () => import('../components/WH/WH.vue'),
  'WH/WHNewHouse': () => import('../components/WH/WHNewHouse.vue'),
  'WH/WHSecondHandHouse': () => import('../components/WH/WHSecondHandHouse.vue'),
  'WH/WHGDP': () => import('../components/WH/WHGDP.vue'),
  'WH/WHPopulation': () => import('../components/WH/WHPopulation.vue'),
  'WH/WHFinance': () => import('../components/WH/WHFinance.vue'),
  'WH/WHRealEstate': () => import('../components/WH/WHRealEstate.vue'),
  'WH/WHRealEstateInvest': () => import('../components/WH/WHRealEstateInvest.vue'),
  'WH/WHRealEstateSell': () => import('../components/WH/WHRealEstateSell.vue'),
  'WH/WHEducation': () => import('../components/WH/WHEducation.vue'),
  'WH/WHMedical': () => import('../components/WH/WHMedical.vue'),
  
  // FirstTierCity 模块
  'FirstTierCity/FirstTierCity': () => import('../components/FirstTierCity/FirstTierCity.vue'),
  'FirstTierCity/CityGDP': () => import('../components/FirstTierCity/CityGDP.vue'),
  'FirstTierCity/CityPopulation': () => import('../components/FirstTierCity/CityPopulation.vue'),
  'FirstTierCity/CityFinance': () => import('../components/FirstTierCity/CityFinance.vue'),
  'FirstTierCity/CityRealEstate': () => import('../components/FirstTierCity/CityRealEstate.vue'),
  'FirstTierCity/CityRealEstateInvest': () => import('../components/FirstTierCity/CityRealEstateInvest.vue'),
  'FirstTierCity/CityRealEstateSell': () => import('../components/FirstTierCity/CityRealEstateSell.vue'),
  'FirstTierCity/CityRealEstatePriceIndices': () => import('../components/FirstTierCity/CityRealEstatePriceIndices.vue'),
  'FirstTierCity/CityEducation': () => import('../components/FirstTierCity/CityEducation.vue'),
  'FirstTierCity/CityMedical': () => import('../components/FirstTierCity/CityMedical.vue'),
  
  // MajorProvincial 模块
  'MajorProvincial/MajorProvincial': () => import('../components/MajorProvincial/MajorProvincial.vue'),
  'MajorProvincial/ProvincialGDP': () => import('../components/MajorProvincial/ProvincialGDP.vue'),
  'MajorProvincial/ProvincialPopulation': () => import('../components/MajorProvincial/ProvincialPopulation.vue'),
  'MajorProvincial/ProvincialFinance': () => import('../components/MajorProvincial/ProvincialFinance.vue'),
  'MajorProvincial/ProvincialRealEstate': () => import('../components/MajorProvincial/ProvincialRealEstate.vue'),
  'MajorProvincial/ProvincialRealEstateInvest': () => import('../components/MajorProvincial/ProvincialRealEstateInvest.vue'),
  'MajorProvincial/ProvincialRealEstateSell': () => import('../components/MajorProvincial/ProvincialRealEstateSell.vue'),
  'MajorProvincial/ProvincialEducation': () => import('../components/MajorProvincial/ProvincialEducation.vue'),
  'MajorProvincial/ProvincialMedical': () => import('../components/MajorProvincial/ProvincialMedical.vue'),
  'MajorProvincial/ProvincialLiving': () => import('../components/MajorProvincial/ProvincialLiving.vue'),
  
  // NationWide 模块
  'NationWide/NationWide': () => import('../components/NationWide/NationWide.vue'),
  'NationWide/GrossDomesticProduct': () => import('../components/NationWide/GrossDomesticProduct.vue'),
  'NationWide/PopulationCorrelation': () => import('../components/NationWide/PopulationCorrelation.vue'),
  'NationWide/NationalFinance': () => import('../components/NationWide/NationalFinance.vue'),
  'NationWide/RealEstate': () => import('../components/NationWide/RealEstate.vue'),
  'NationWide/RealEstateInvest': () => import('../components/NationWide/RealEstateInvest.vue'),
  'NationWide/RealEstateSell': () => import('../components/NationWide/RealEstateSell.vue'),
  'NationWide/EducationSector': () => import('../components/NationWide/EducationSector.vue'),
  'NationWide/MedicalTreatment': () => import('../components/NationWide/MedicalTreatment.vue'),
  'NationWide/MarriageStatus': () => import('../components/NationWide/MarriageStatus.vue'),
  'NationWide/SocialRetailgoods': () => import('../components/NationWide/SocialRetailgoods.vue'),
  'NationWide/FinancialIndustry': () => import('../components/NationWide/FinancialIndustry.vue'),
  'NationWide/ForeignTrade': () => import('../components/NationWide/ForeignTrade.vue'),
  'NationWide/IndicesData': () => import('../components/NationWide/IndicesData.vue'),
  'NationWide/TouristIndustry': () => import('../components/NationWide/TouristIndustry.vue'),
  'NationWide/AccommodationAndCateringIndustry': () => import('../components/NationWide/AccommodationAndCateringIndustry.vue'),
  'NationWide/LivingStandards': () => import('../components/NationWide/LivingStandards.vue'),
  'NationWide/ProvidentFund': () => import('../components/NationWide/ProvidentFund.vue'),

};

export default function loadPage(...segments) {
  // 过滤掉空字符串和undefined
  const validSegments = segments.filter(segment => segment && segment.trim());
  

  if (validSegments.length === 0) {
    throw new Error('loadPage: 至少需要一个有效的路径段');
  }

  // 最后一个segment是组件名
  const last = validSegments[validSegments.length - 1];
  // 第一个segment是主目录
  const dir = validSegments[0].replace(/^\/+/, '');



  // 生成缓存key
  const cacheKey = `${dir}/${last}`;

  // 如果已缓存，直接返回
  if (componentCache.has(cacheKey)) {

    return componentCache.get(cacheKey);
  }

  // 查找静态导入映射
  const importFunction = componentMap[cacheKey];
  if (!importFunction) {
    throw new Error(`Component not found in map: ${cacheKey}`);
  }



  // 创建加载函数
  const loadFunction = () => {
    
    return importFunction()
      .then(module => {
        // 缓存组件
        componentCache.set(cacheKey, module);

        return module;
      })
      .catch(error => {
        logger.error(`Failed to load component: ${cacheKey}`, error);
        throw error;
      });
  };

  // 缓存加载函数
  componentCache.set(cacheKey, loadFunction);
  
  return loadFunction;
}

// 预加载指定路由的组件
export function preloadRoute(path) {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return;

  const dir = segments[0];
  const last = segments[segments.length - 1] || segments[0];
  const cacheKey = `${dir}/${last}`;

  if (preloadQueue.has(cacheKey)) return;
  preloadQueue.add(cacheKey);

  // 延迟预加载，避免阻塞当前操作
  setTimeout(() => {
    try {
      const loadFunction = loadPage(dir, last);
      loadFunction().catch(error => {
        logger.warn(`Preload failed for ${cacheKey}:`, error);
      }).finally(() => {
        preloadQueue.delete(cacheKey);
      });
    } catch (error) {
      logger.warn(`Preload setup failed for ${cacheKey}:`, error);
      preloadQueue.delete(cacheKey);
    }
  }, 100);
}

// 预加载相关路由
export function preloadRelatedRoutes(currentPath) {
  const segments = currentPath.split('/').filter(Boolean);
  if (segments.length === 0) return;

  const dir = segments[0];
  
  // 根据目录动态生成相关的组件名称
  let relatedComponents = [];
  
  if (dir === 'WH') {
    relatedComponents = [
      'WHGDP', 'WHPopulation', 'WHFinance', 'WHEducation', 'WHMedical',
      'WHRealEstate', 'WHNewHouse', 'WHSecondHandHouse'
    ];
  } else if (dir === 'FirstTierCity') {
    relatedComponents = [
      'CityGDP', 'CityPopulation', 'CityFinance', 'CityEducation', 'CityMedical',
      'CityRealEstate'
    ];
  } else if (dir === 'MajorProvincial') {
    relatedComponents = [
      'ProvincialGDP', 'ProvincialPopulation', 'ProvincialFinance', 'ProvincialEducation', 'ProvincialMedical',
      'ProvincialRealEstate', 'ProvincialLiving'
    ];
  } else if (dir === 'NationWide') {
    relatedComponents = [
      'GrossDomesticProduct', 'PopulationCorrelation', 'NationalFinance', 'EducationSector', 'MedicalTreatment',
      'RealEstate', 'MarriageStatus', 'SocialRetailgoods', 'FinancialIndustry', 'ForeignTrade', 'IndicesData',  'TouristIndustry', 'AccommodationAndCateringIndustry', 'LivingStandards', 'ProvidentFund'
      
    ];
  }

  relatedComponents.forEach(component => {
    const cacheKey = `${dir}/${component}`;
    if (!preloadQueue.has(cacheKey) && !componentCache.has(cacheKey)) {
      preloadRoute(`/${dir}/${component}`);
    }
  });
}

// 清理缓存
export function clearComponentCache(pattern = null) {
  if (pattern) {
    for (const [key] of componentCache) {
      if (key.includes(pattern)) {
        componentCache.delete(key);
      }
    }
  } else {
    componentCache.clear();
  }
}