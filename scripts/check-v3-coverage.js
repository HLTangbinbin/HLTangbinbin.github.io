const fs = require('fs');
const path = require('path');
const dataFiles = require('../src/config/dataFiles.json');

const cityRegionList = [
  { code: '110000', cname: '北京' }, { code: '120000', cname: '天津' }, { code: '130100', cname: '石家庄' }, { code: '130200', cname: '唐山' },
  { code: '130300', cname: '秦皇岛' }, { code: '140100', cname: '太原' }, { code: '150100', cname: '呼和浩特' }, { code: '150200', cname: '包头' },
  { code: '210100', cname: '沈阳' }, { code: '210200', cname: '大连' }, { code: '210600', cname: '丹东' }, { code: '210700', cname: '锦州' },
  { code: '220100', cname: '长春' }, { code: '220200', cname: '吉林' }, { code: '230100', cname: '哈尔滨' }, { code: '231000', cname: '牡丹江' },
  { code: '310000', cname: '上海' }, { code: '320100', cname: '南京' }, { code: '320200', cname: '无锡' }, { code: '320300', cname: '徐州' },
  { code: '321000', cname: '扬州' }, { code: '330100', cname: '杭州' }, { code: '330200', cname: '宁波' }, { code: '330300', cname: '温州' },
  { code: '330700', cname: '金华' }, { code: '340100', cname: '合肥' }, { code: '340300', cname: '蚌埠' }, { code: '340800', cname: '安庆' },
  { code: '350100', cname: '福州' }, { code: '350200', cname: '厦门' }, { code: '350500', cname: '泉州' }, { code: '360100', cname: '南昌' },
  { code: '360400', cname: '九江' }, { code: '360700', cname: '赣州' }, { code: '370100', cname: '济南' }, { code: '370200', cname: '青岛' },
  { code: '370600', cname: '烟台' }, { code: '370800', cname: '济宁' }, { code: '410100', cname: '郑州' }, { code: '410300', cname: '洛阳' },
  { code: '410400', cname: '平顶山' }, { code: '420100', cname: '武汉' }, { code: '420500', cname: '宜昌' }, { code: '420600', cname: '襄阳' },
  { code: '430100', cname: '长沙' }, { code: '430600', cname: '岳阳' }, { code: '430700', cname: '常德' }, { code: '440100', cname: '广州' },
  { code: '440200', cname: '韶关' }, { code: '440300', cname: '深圳' }, { code: '440800', cname: '湛江' }, { code: '441300', cname: '惠州' },
  { code: '450100', cname: '南宁' }, { code: '450300', cname: '桂林' }, { code: '450500', cname: '北海' }, { code: '460100', cname: '海口' },
  { code: '460200', cname: '三亚' }, { code: '500000', cname: '重庆' }, { code: '510100', cname: '成都' }, { code: '510500', cname: '泸州' },
  { code: '511300', cname: '南充' }, { code: '520100', cname: '贵阳' }, { code: '520300', cname: '遵义' }, { code: '530100', cname: '昆明' },
  { code: '532900', cname: '大理' }, { code: '540100', cname: '拉萨' }, { code: '610100', cname: '西安' }, { code: '620100', cname: '兰州' },
  { code: '630100', cname: '西宁' }, { code: '640100', cname: '银川' }, { code: '650100', cname: '乌鲁木齐' }
];

const provinceRegionList = [
  { code: '110000', cname: '北京市' }, { code: '120000', cname: '天津市' }, { code: '130000', cname: '河北省' }, { code: '140000', cname: '山西省' },
  { code: '150000', cname: '内蒙古自治区' }, { code: '210000', cname: '辽宁省' }, { code: '220000', cname: '吉林省' }, { code: '230000', cname: '黑龙江省' },
  { code: '310000', cname: '上海市' }, { code: '320000', cname: '江苏省' }, { code: '330000', cname: '浙江省' }, { code: '340000', cname: '安徽省' },
  { code: '350000', cname: '福建省' }, { code: '360000', cname: '江西省' }, { code: '370000', cname: '山东省' }, { code: '410000', cname: '河南省' },
  { code: '420000', cname: '湖北省' }, { code: '430000', cname: '湖南省' }, { code: '440000', cname: '广东省' }, { code: '450000', cname: '广西壮族自治区' },
  { code: '460000', cname: '海南省' }, { code: '500000', cname: '重庆市' }, { code: '510000', cname: '四川省' }, { code: '520000', cname: '贵州省' },
  { code: '530000', cname: '云南省' }, { code: '540000', cname: '西藏自治区' }, { code: '610000', cname: '陕西省' }, { code: '620000', cname: '甘肃省' },
  { code: '630000', cname: '青海省' }, { code: '640000', cname: '宁夏回族自治区' }, { code: '650000', cname: '新疆维吾尔自治区' }
];

const CITY_CODES = ['110000', '310000', '440100', '440300', '330100', '510100', '320100', '420100', '500000', '120000', '430100', '610100', '410100', '340100'];
const CITY_POPULATION_CODES = ['110000', '310000', '440100', '440300', '330100', '510100', '420100', '320100', '500000', '610100', '410100', '340100', '430100'];
const NBS_36_CITIES = ['110000', '120000', '130100', '140100', '150100', '210100', '210200', '220100', '230100', '310000', '320100', '330100', '330200', '340100', '350100', '350200', '360100', '370100', '370200', '410100', '420100', '430100', '440100', '440300', '450100', '460100', '500000', '510100', '520100', '530100', '540100', '610100', '620100', '630100', '640100', '650100'];
const ADD_CITY_CODES_YD = cityRegionList.filter((city) => !CITY_CODES.includes(city.code));
const ADD_CITY_CODES_ND = cityRegionList.filter((city) => !CITY_CODES.includes(city.code) && NBS_36_CITIES.includes(city.code));
const PROVINCE_CODES = ['110000', '120000', '310000', '320000', '330000', '370000', '410000', '420000', '430000', '440000', '500000', '510000'];
const ADD_PROVINCE_CODES = provinceRegionList.filter((prov) => !PROVINCE_CODES.includes(prov.code));
const CITY_JSON = `./${dataFiles.city}`;
const PROVINCE_JSON = `./${dataFiles.province}`;

function chart(id, title, indicatorKeys, dbCode, extra = {}) {
  return { id, title, indicatorKeys, dbCode, chartType: 'line', seriesLayout: 'indicator', ...extra };
}
function regionChart(id, title, indicatorKeys, dbCode, extra = {}) {
  return chart(id, title, indicatorKeys, dbCode, { seriesLayout: 'region', ...extra });
}

const v3PageRegistry = {
  CityGDP: { source: { localJson: CITY_JSON, cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }, charts: [regionChart('city-gdp', '重点城市地区生产总值', ['city_gdp'], 'nd')] },
  CityPopulation: { source: { localJson: CITY_JSON, cityCodeArr: CITY_POPULATION_CODES }, charts: [regionChart('city-population', '重点城市年末户籍人口', ['city_registered_population'], 'nd')] },
  CityFinance: { source: { localJson: CITY_JSON, cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }, charts: [regionChart('city-budget-income', '重点城市地方一般公共预算收入', ['city_budget_income'], 'nd'), regionChart('city-budget-expenditure', '重点城市地方一般公共预算支出', ['city_budget_expenditure'], 'nd'), regionChart('city-budget-deficit', '重点城市地方一般公共预算赤字', ['city_budget_deficit'], 'nd'), regionChart('city-deposit', '重点城市住户存款余额', ['city_household_deposit_balance'], 'nd')] },
  CityRealEstateInvest: { source: { localJson: CITY_JSON, cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }, charts: [regionChart('city-invest', '重点城市房地产开发住宅投资额', ['city_residential_dev_investment'], 'nd')] },
  CityRealEstateSell: { source: { localJson: CITY_JSON, cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }, charts: [regionChart('city-sales-area', '重点城市住宅商品房销售面积', ['city_residential_sales_area'], 'nd'), regionChart('city-avg-price', '重点城市住宅商品房平均销售价格', ['city_residential_avg_price'], 'nd')] },
  CityRealEstatePriceIndices: { source: { localJson: CITY_JSON, cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }, charts: [regionChart('city-new-house-mom', '新建商品住宅价格指数(上月=100)', ['city_new_house_price_mom'], 'yd'), regionChart('city-second-hand-mom', '二手住宅价格指数(上月=100)', ['city_second_hand_house_price_mom'], 'yd')] },
  CityEducation: { source: { localJson: CITY_JSON, cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }, charts: [regionChart('city-college-students', '重点城市普通本专科在校学生数', ['city_college_students'], 'nd')] },
  CityMedical: { source: { localJson: CITY_JSON, cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }, charts: [regionChart('city-hospital-count', '重点城市医院数', ['city_hospital_count'], 'nd')] },
  ProvincialGDP: { source: { localJson: PROVINCE_JSON, cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }, charts: [regionChart('province-gdp', '重点省市地区生产总值', ['province_gdp'], 'nd')] },
  ProvincialPopulation: { source: { localJson: PROVINCE_JSON, cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }, charts: [regionChart('province-total-population', '重点省市年末常住人口', ['province_total_population'], 'nd'), regionChart('province-birth-rate', '重点省市人口出生率', ['province_birth_rate'], 'nd'), regionChart('province-death-rate', '重点省市人口死亡率', ['province_death_rate'], 'nd'), regionChart('province-natural-growth', '重点省市人口自然增长率', ['province_natural_growth_rate'], 'nd')] },
  ProvincialFinance: { source: { localJson: PROVINCE_JSON, cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }, charts: [regionChart('province-budget-income', '重点省市地方财政一般预算收入', ['province_budget_income'], 'nd'), regionChart('province-budget-expenditure', '重点省市地方财政一般预算支出', ['province_budget_expenditure'], 'nd'), regionChart('province-budget-deficit', '重点省市地方财政一般预算赤字', ['province_budget_deficit'], 'nd')] },
  ProvincialRealEstateInvest: { source: { localJson: PROVINCE_JSON, cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }, charts: [regionChart('province-invest-year', '重点省市房地产开发住宅投资额', ['province_residential_dev_investment'], 'nd'), regionChart('province-invest-value', '重点省市住宅投资累计值', ['province_residential_investment_value'], 'yd'), regionChart('province-invest-growth', '重点省市住宅投资累计增长', ['province_residential_investment_growth'], 'yd')] },
  ProvincialRealEstateSell: { source: { localJson: PROVINCE_JSON, cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }, charts: [regionChart('province-sales-area-year', '重点省市住宅商品房销售面积', ['province_residential_sales_area'], 'nd'), regionChart('province-avg-price-year', '重点省市住宅商品房平均销售价格', ['province_residential_avg_price'], 'nd'), regionChart('province-sales-area-value', '重点省市住宅销售面积累计值', ['province_residential_sales_area_value'], 'yd'), regionChart('province-sales-area-growth', '重点省市住宅销售面积累计增长', ['province_residential_sales_area_growth'], 'yd'), regionChart('province-sales-amount-value', '重点省市住宅销售额累计值', ['province_residential_sales_amount_value'], 'yd'), regionChart('province-sales-amount-growth', '重点省市住宅销售额累计增长', ['province_residential_sales_amount_growth'], 'yd')] },
  ProvincialEducation: { source: { localJson: PROVINCE_JSON, cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }, charts: [regionChart('province-college-enrollment', '重点省市普通高等学校本科招生数', ['province_college_enrollment'], 'nd'), regionChart('province-college-students', '重点省市普通高等学校本科在校学生数', ['province_college_students'], 'nd'), regionChart('province-college-graduates', '重点省市普通高等学校本科毕(结)业生数', ['province_college_graduates'], 'nd')] },
  ProvincialMedical: { source: { localJson: PROVINCE_JSON, cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }, charts: [regionChart('province-hospital-count', '重点省市医院数', ['province_hospital_count'], 'nd'), regionChart('province-bed-count', '重点省市每万人医疗机构床位数', ['province_bed_count_per_10k'], 'nd')] },
  ProvincialLiving: { source: { localJson: PROVINCE_JSON, cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }, charts: [regionChart('province-income', '重点省市全体居民人均可支配收入', ['province_disposable_income'], 'nd')] }
};

function loadJson(localJson) {
  const filePath = path.join(process.cwd(), 'public', 'json', path.basename(localJson));
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  applyDerivedDatasets(raw);
  return raw;
}

function normalizePointMap(values = []) {
  return new Map(
    (Array.isArray(values) ? values : [])
      .map((item) => [String(item?.date ?? '').trim(), item?.value])
      .filter(([date]) => date)
  );
}

function buildDifferenceSeries(totalSeries = [], partSeries = []) {
  const partSeriesByRegion = new Map(
    (Array.isArray(partSeries) ? partSeries : []).map((item) => [String(item?.regionKey || '').trim(), item])
  );

  return (Array.isArray(totalSeries) ? totalSeries : []).map((totalItem) => {
    const regionKey = String(totalItem?.regionKey || '').trim();
    const partItem = partSeriesByRegion.get(regionKey);
    const totalPoints = normalizePointMap(totalItem?.data);
    const partPoints = normalizePointMap(partItem?.data);
    const timeline = Array.from(new Set([...totalPoints.keys(), ...partPoints.keys()]))
      .sort((a, b) => Number(a.replace('-', '')) - Number(b.replace('-', '')));

    return {
      regionKey,
      regionName: totalItem?.regionName || partItem?.regionName || regionKey,
      data: timeline.map((date) => ({
        date,
        value: Number(totalPoints.get(date) ?? 0) - Number(partPoints.get(date) ?? 0)
      }))
    };
  });
}

function ensureDerivedDataset(raw, targetKey, totalKey, partKey, options = {}) {
  if (!raw?.datasets || raw.datasets[targetKey] || !raw.datasets[totalKey] || !raw.datasets[partKey]) return;

  const totalDataset = raw.datasets[totalKey];
  raw.datasets[targetKey] = {
    ...totalDataset,
    key: targetKey,
    metricKey: targetKey,
    derived: true,
    name: options.name || totalDataset.name,
    displayName: options.displayName || totalDataset.displayName,
    chartKeys: Array.from(new Set([...(totalDataset.chartKeys || []), ...(raw.datasets[partKey]?.chartKeys || [])])),
    pageKeys: Array.from(new Set([...(totalDataset.pageKeys || []), ...(raw.datasets[partKey]?.pageKeys || [])])),
    series: buildDifferenceSeries(totalDataset.series, raw.datasets[partKey].series)
  };
}

function applyDerivedDatasets(raw) {
  ensureDerivedDataset(raw, 'city_budget_deficit', 'city_budget_expenditure', 'city_budget_income', {
    name: '地方一般公共预算赤字',
    displayName: '地方一般公共预算赤字 (亿元)'
  });
  ensureDerivedDataset(raw, 'province_budget_deficit', 'province_budget_expenditure', 'province_budget_income', {
    name: '地方财政一般预算赤字',
    displayName: '地方财政一般预算赤字 (亿元)'
  });
}

function getAvailableRegionCodes(dataset, indicatorKey) {
  const indicator = dataset.datasets?.[indicatorKey];
  if (!indicator) return [];
  return (indicator.series || [])
    .map((item) => item?.regionKey)
    .filter((code) => code && code !== '100000');
}

function getRegionName(localJson, code) {
  const baseList = localJson.includes('province') ? provinceRegionList : cityRegionList;
  return baseList.find((item) => item.code === code)?.cname || code;
}

function buildRows() {
  const rows = [];
  for (const [routeKey, config] of Object.entries(v3PageRegistry)) {
    const dataset = loadJson(config.source.localJson);
    for (const chartItem of config.charts) {
      const defaultRegionCodes = chartItem.seriesLayout === 'region'
        ? (chartItem.regionCodes && chartItem.regionCodes.length ? chartItem.regionCodes : (config.source.cityCodeArr || []))
        : [];
      const availableRegionCodes = Array.from(new Set(
        chartItem.indicatorKeys.flatMap((indicatorKey) => getAvailableRegionCodes(dataset, indicatorKey))
      ));
      const missingRegionCodes = defaultRegionCodes.filter((code) => !availableRegionCodes.includes(code));
      rows.push({
        routeKey,
        chartId: chartItem.id,
        title: chartItem.title,
        dbCode: chartItem.dbCode,
        indicatorKeys: chartItem.indicatorKeys,
        defaultRegions: defaultRegionCodes.map((code) => getRegionName(config.source.localJson, code)),
        availableRegions: availableRegionCodes.map((code) => getRegionName(config.source.localJson, code)),
        missingRegions: missingRegionCodes.map((code) => getRegionName(config.source.localJson, code))
      });
    }
  }
  return rows;
}

const rows = buildRows();
const withMissing = rows.filter((row) => row.missingRegions.length > 0);

console.log(`charts=${rows.length}`);
console.log(`charts_with_missing=${withMissing.length}`);
console.log('');

withMissing.forEach((row) => {
  console.log(`[${row.routeKey}] ${row.title}`);
  console.log(`  dbCode: ${row.dbCode}`);
  console.log(`  indicators: ${row.indicatorKeys.join(', ')}`);
  console.log(`  default: ${row.defaultRegions.join('、') || '-'}`);
  console.log(`  available: ${row.availableRegions.join('、') || '-'}`);
  console.log(`  missing: ${row.missingRegions.join('、') || '-'}`);
  console.log('');
});
