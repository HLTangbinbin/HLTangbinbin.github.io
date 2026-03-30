const moduleLoaders = {
  WH: () => import('@/config/chartMetaWH.js'),
  City: () => import('@/config/chartMetaCity.js'),
  Provincial: () => import('@/config/chartMetaProvince.js'),
  NationFinance: () => import('@/config/nation/finance.js'),
  NationEducation: () => import('@/config/nation/education.js'),
  NationDemographics: () => import('@/config/nation/demographics.js'),
  NationIndustry: () => import('@/config/nation/industry.js'),
};

const routeRegistry = {
  WHNewHouse: ['WH', 'WHNewHouseCharts'],
  WHSecondHandHouse: ['WH', 'WHSecondHouseCharts'],
  WHGDP: ['WH', 'WHGDPCharts'],
  WHPopulation: ['WH', 'WHPopulationCharts'],
  WHFinance: ['WH', 'WHFinanceCharts'],
  WHRealEstateInvest: ['WH', 'WHRealEstateInvestCharts'],
  WHRealEstateSell: ['WH', 'WHRealEstateSellCharts'],
  WHEducation: ['WH', 'WHEducationCharts'],
  WHMedical: ['WH', 'WHMedicalCharts'],

  CityGDP: ['City', 'CityGDPCharts'],
  CityPopulation: ['City', 'CityPopulationCharts'],
  CityFinance: ['City', 'CityFinanceCityCharts'],
  CityRealEstateInvest: ['City', 'CityRealEstateInvestCharts'],
  CityRealEstateSell: ['City', 'CityRealEstateSellCharts'],
  CityRealEstatePriceIndices: ['City', 'CityRealEstatePriceIndicesCharts'],
  CityEducation: ['City', 'CityEducationCharts'],
  CityMedical: ['City', 'CityMedicalCharts'],

  ProvincialGDP: ['Provincial', 'ProvincialGDPCharts'],
  ProvincialPopulation: ['Provincial', 'ProvincialPopulationCharts'],
  ProvincialFinance: ['Provincial', 'ProvincialFinanceCharts'],
  ProvincialRealEstateInvest: ['Provincial', 'ProvincialRealEstateInvestCharts'],
  ProvincialRealEstateSell: ['Provincial', 'ProvincialRealEstateSellCharts'],
  ProvincialEducation: ['Provincial', 'ProvincialEducationCharts'],
  ProvincialMedical: ['Provincial', 'ProvincialMedicalCharts'],
  ProvincialLiving: ['Provincial', 'ProvincialLivingCharts'],

  GrossDomesticProduct: ['NationIndustry', 'GDPCharts'],
  PopulationBasic: ['NationDemographics', 'PopulationBasicCharts'],
  PopulationSpot: ['NationDemographics', 'PopulationSpotCharts'],
  NationalFinance: ['NationFinance', 'NationalFinanceCharts'],
  RealEstateInvest: ['NationIndustry', 'RealEstateInvestCharts'],
  RealEstateSell: ['NationIndustry', 'RealEstateSaleCharts'],
  EducationSchool: ['NationEducation', 'EducationSchoolCharts'],
  EducationTeacher: ['NationEducation', 'EducationTeacherCharts'],
  EducationStudent: ['NationEducation', 'EducationStudentCharts'],
  MedicalTreatment: ['NationDemographics', 'MedicalCharts'],
  MarriageStatus: ['NationDemographics', 'MarriageCharts'],
  SocialRetailgoods: ['NationIndustry', 'SocialRetailgoodsCharts'],
  FinancialCurrency: ['NationFinance', 'FinancialCurrencyCharts'],
  FinancialSocialFinancing: ['NationFinance', 'FinancialSocialFinancingCharts'],
  FinancialSecurity: ['NationFinance', 'FinancialSecurityCharts'],
  FinancialInsurance: ['NationFinance', 'FinancialInsuranceCharts'],
  ForeignTrade: ['NationIndustry', 'ForeignTradeCharts'],
  IndicesData: ['NationIndustry', 'IndicesCharts'],
  TouristIndustry: ['NationIndustry', 'TouristIndustryCharts'],
  AccommodationAndCateringIndustry: ['NationIndustry', 'AccommodationAndCateringIndustryCharts'],
  LivingStandards: ['NationDemographics', 'LivingStandardsCharts'],
  TransportationAndTelecommunications: ['NationIndustry', 'TransportationAndTelecommunicationsCharts'],
};

const moduleCache = new Map();

async function loadModule(namespace) {
  if (!moduleCache.has(namespace)) {
    const loader = moduleLoaders[namespace];
    if (!loader) {
      throw new Error(`未知图表模块: ${namespace}`);
    }
    moduleCache.set(namespace, loader());
  }

  return moduleCache.get(namespace);
}

export function getRouteChartKey(routePath = '') {
  return routePath.split('/').filter(Boolean).pop() || '';
}

export function hasChartRoute(routeKey) {
  return Boolean(routeRegistry[routeKey]);
}

export async function resolveChartConfig(routeKey) {
  const meta = routeRegistry[routeKey];
  if (!meta) return null;

  const [namespace, exportName] = meta;
  const moduleRef = await loadModule(namespace);
  return moduleRef?.[exportName] || null;
}

export function getRegisteredChartRoutes() {
  return Object.keys(routeRegistry);
}
