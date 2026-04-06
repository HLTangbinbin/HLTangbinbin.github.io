import { normalizePageConfig } from '@/config/pageConfig.js';
import { v3PageRegistry } from '@/config/v3PageRegistry.js';

function defineRouteConfig(page = {}) {
  return { page };
}

const routeRegistry = {
  WHNewHouse: defineRouteConfig({
    title: '新房',
    description: '聚合武汉新房成交量与分区域表现。',
    tags: ['武汉', '房地产']
  }),
  WHSecondHandHouse: defineRouteConfig({
    title: '二手房',
    description: '聚合武汉二手房成交量与分区域表现。',
    tags: ['武汉', '房地产']
  }),
  WHGDP: defineRouteConfig({
    title: 'GDP',
    description: '查看武汉 GDP 总量与产业结构。',
    tags: ['武汉', '经济']
  }),
  WHPopulation: defineRouteConfig({
    title: '人口',
    description: '查看武汉户籍与常住人口变化。',
    tags: ['武汉', '人口']
  }),
  WHFinance: defineRouteConfig({
    title: '财政',
    description: '查看武汉地方财政收支与结构。',
    tags: ['武汉', '财政']
  }),
  WHRealEstateInvest: defineRouteConfig({
    title: '投资',
    description: '查看武汉房地产开发投资表现。',
    tags: ['武汉', '房地产']
  }),
  WHRealEstateSell: defineRouteConfig({
    title: '销售',
    description: '查看武汉住宅销售面积与价格。',
    tags: ['武汉', '房地产']
  }),
  WHEducation: defineRouteConfig({
    title: '教育',
    description: '查看武汉高等教育相关指标。',
    tags: ['武汉', '教育']
  }),
  WHMedical: defineRouteConfig({
    title: '医疗',
    description: '查看武汉医疗机构基础指标。',
    tags: ['武汉', '医疗']
  }),

  CityGDP: defineRouteConfig({
    title: 'GDP',
    description: '查看重点城市 GDP 对比。',
    tags: ['城市', '经济']
  }),
  CityPopulation: defineRouteConfig({
    title: '人口',
    description: '查看重点城市人口规模对比。',
    tags: ['城市', '人口']
  }),
  CityFinance: defineRouteConfig({
    title: '财政',
    description: '查看重点城市财政收支对比。',
    tags: ['城市', '财政']
  }),
  CityRealEstateInvest: defineRouteConfig({
    title: '投资',
    description: '查看重点城市房地产开发投资对比。',
    tags: ['城市', '房地产']
  }),
  CityRealEstateSell: defineRouteConfig({
    title: '销售',
    description: '查看重点城市房地产销售表现。',
    tags: ['城市', '房地产']
  }),
  CityRealEstatePriceIndices: defineRouteConfig({
    title: '指数',
    description: '查看重点城市房价指数变化。',
    tags: ['城市', '房地产']
  }),
  CityEducation: defineRouteConfig({
    title: '教育',
    description: '查看重点城市教育资源指标。',
    tags: ['城市', '教育']
  }),
  CityMedical: defineRouteConfig({
    title: '医疗',
    description: '查看重点城市医疗资源指标。',
    tags: ['城市', '医疗']
  }),

  ProvincialGDP: defineRouteConfig({
    title: 'GDP',
    description: '查看重点省市 GDP 对比。',
    tags: ['省市', '经济']
  }),
  ProvincialPopulation: defineRouteConfig({
    title: '人口',
    description: '查看重点省市人口规模对比。',
    tags: ['省市', '人口']
  }),
  ProvincialFinance: defineRouteConfig({
    title: '财政',
    description: '查看重点省市财政收支对比。',
    tags: ['省市', '财政']
  }),
  ProvincialRealEstateInvest: defineRouteConfig({
    title: '投资',
    description: '查看重点省市房地产开发投资表现。',
    tags: ['省市', '房地产']
  }),
  ProvincialRealEstateSell: defineRouteConfig({
    title: '销售',
    description: '查看重点省市房地产销售表现。',
    tags: ['省市', '房地产']
  }),
  ProvincialEducation: defineRouteConfig({
    title: '教育',
    description: '查看重点省市教育资源指标。',
    tags: ['省市', '教育']
  }),
  ProvincialMedical: defineRouteConfig({
    title: '医疗',
    description: '查看重点省市医疗资源指标。',
    tags: ['省市', '医疗']
  }),
  ProvincialLiving: defineRouteConfig({
    title: '生活',
    description: '查看重点省市居民生活相关指标。',
    tags: ['省市', '生活']
  }),

  GrossDomesticProduct: defineRouteConfig({
    title: 'GDP',
    description: '查看全国 GDP 总量与结构。',
    tags: ['全国', '经济']
  }),
  PopulationBasic: defineRouteConfig({
    title: '普查',
    description: '查看全国人口普查核心指标。',
    tags: ['全国', '人口']
  }),
  PopulationSpot: defineRouteConfig({
    title: '抽样',
    description: '查看全国人口抽样调查指标。',
    tags: ['全国', '人口']
  }),
  NationalFinance: defineRouteConfig({
    title: '财政',
    description: '查看全国财政收支与结构。',
    tags: ['全国', '财政']
  }),
  RealEstateInvest: defineRouteConfig({
    title: '投资',
    description: '查看全国房地产投资表现。',
    tags: ['全国', '房地产']
  }),
  RealEstateSell: defineRouteConfig({
    title: '销售',
    description: '查看全国房地产销售表现。',
    tags: ['全国', '房地产']
  }),
  EducationSchool: defineRouteConfig({
    title: '学校',
    description: '查看全国学校数量与结构。',
    tags: ['全国', '教育']
  }),
  EducationTeacher: defineRouteConfig({
    title: '教师',
    description: '查看全国教师规模与结构。',
    tags: ['全国', '教育']
  }),
  EducationStudent: defineRouteConfig({
    title: '学生',
    description: '查看全国学生规模与结构。',
    tags: ['全国', '教育']
  }),
  MedicalTreatment: defineRouteConfig({
    title: '医疗',
    description: '查看全国医疗资源与服务指标。',
    tags: ['全国', '医疗']
  }),
  MarriageStatus: defineRouteConfig({
    title: '婚姻',
    description: '查看全国婚姻登记与离婚情况。',
    tags: ['全国', '人口']
  }),
  SocialRetailgoods: defineRouteConfig({
    title: '社零',
    description: '查看全国社会消费品零售总额变化。',
    tags: ['全国', '消费']
  }),
  FinancialCurrency: defineRouteConfig({
    title: '货币',
    description: '查看全国货币供应量与储备指标。',
    tags: ['全国', '金融']
  }),
  FinancialSocialFinancing: defineRouteConfig({
    title: '社融',
    description: '查看全国社会融资规模指标。',
    tags: ['全国', '金融']
  }),
  FinancialSecurity: defineRouteConfig({
    title: '证券',
    description: '查看全国证券市场相关指标。',
    tags: ['全国', '金融']
  }),
  FinancialInsurance: defineRouteConfig({
    title: '保险',
    description: '查看全国保险业核心指标。',
    tags: ['全国', '金融']
  }),
  ForeignTrade: defineRouteConfig({
    title: '外贸',
    description: '查看全国外贸进出口表现。',
    tags: ['全国', '贸易']
  }),
  IndicesData: defineRouteConfig({
    title: '指数',
    description: '查看全国价格与景气指数。',
    tags: ['全国', '指数']
  }),
  TouristIndustry: defineRouteConfig({
    title: '旅游',
    description: '查看全国旅游行业核心指标。',
    tags: ['全国', '服务业']
  }),
  AccommodationAndCateringIndustry: defineRouteConfig({
    title: '餐宿',
    description: '查看全国住宿餐饮行业指标。',
    tags: ['全国', '服务业']
  }),
  LivingStandards: defineRouteConfig({
    title: '生活',
    description: '查看全国居民生活水平指标。',
    tags: ['全国', '民生']
  }),
  TransportationAndTelecommunications: defineRouteConfig({
    title: '交通',
    description: '查看全国交通与通信相关指标。',
    tags: ['全国', '基础设施']
  }),
};

export function getRouteChartKey(routePath = '') {
  return routePath.split('/').filter(Boolean).pop() || '';
}

export function hasChartRoute(routeKey) {
  return Boolean(routeRegistry[routeKey]);
}

export async function resolveChartConfig(routeKey, routePath = '') {
  const meta = routeRegistry[routeKey];
  if (!meta) return null;
  const rawConfig = v3PageRegistry[routeKey] || null;
  if (!rawConfig) return null;

  return normalizePageConfig({
    ...rawConfig,
    page: {
      ...meta.page,
      ...rawConfig.page
    }
  }, {
    routeKey,
    routePath
  });
}

export function getRegisteredChartRoutes() {
  return Object.keys(routeRegistry);
}
