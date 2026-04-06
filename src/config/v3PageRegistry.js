import { cityRegionList, provinceRegionList } from '@/config/regionLists.js';

const CITY_CODES = ['110000', '310000', '440100', '440300', '330100', '510100', '320100', '420100', '500000', '120000', '430100', '610100', '410100', '340100'];
const CITY_POPULATION_CODES = ['110000', '310000', '440100', '440300', '330100', '510100', '420100', '320100', '500000', '610100', '410100', '340100', '430100'];
const NBS_36_CITIES = [
  '110000', '120000', '130100', '140100', '150100', '210100', '210200',
  '220100', '230100', '310000', '320100', '330100', '330200', '340100',
  '350100', '350200', '360100', '370100', '370200', '410100', '420100',
  '430100', '440100', '440300', '450100', '460100', '500000', '510100',
  '520100', '530100', '540100', '610100', '620100', '630100', '640100', '650100'
];
const ADD_CITY_CODES_YD = cityRegionList.filter((city) => !CITY_CODES.includes(city.code));
const ADD_CITY_CODES_ND = cityRegionList.filter((city) => !CITY_CODES.includes(city.code) && NBS_36_CITIES.includes(city.code));

const PROVINCE_CODES = ['110000', '120000', '310000', '320000', '330000', '370000', '410000', '420000', '430000', '440000', '500000', '510000'];
const ADD_PROVINCE_CODES = provinceRegionList.filter((prov) => !PROVINCE_CODES.includes(prov.code));

function chart(id, title, indicatorKeys, dbCode, extra = {}) {
  return {
    id,
    title,
    indicatorKeys,
    dbCode,
    chartType: 'line',
    seriesLayout: 'indicator',
    ...extra
  };
}

function regionChart(id, title, indicatorKeys, dbCode, extra = {}) {
  return chart(id, title, indicatorKeys, dbCode, {
    seriesLayout: 'region',
    ...extra
  });
}

export const v3PageRegistry = {
  WHNewHouse: {
    source: { localJson: './wh.json' },
    charts: [
      chart('wh-new-house-year', '武汉新房成交年度走势', ['wh_new_house_yearly_total'], 'nd'),
      chart('wh-new-house-month', '武汉新房成交月度走势', ['wh_new_house_monthly_total'], 'yd'),
      chart('wh-new-house-district', '武汉新房分区域月度走势', [
        'wh_new_house_monthly_jiang_an',
        'wh_new_house_monthly_jiang_han',
        'wh_new_house_monthly_qiao_kou',
        'wh_new_house_monthly_han_yang',
        'wh_new_house_monthly_qing_shan',
        'wh_new_house_monthly_wu_chang',
        'wh_new_house_monthly_hong_shan',
        'wh_new_house_monthly_dong_xi_hu',
        'wh_new_house_monthly_dong_hu_high_tech',
        'wh_new_house_monthly_economic_development',
        'wh_new_house_monthly_chang_jiang_new_area',
        'wh_new_house_monthly_jiang_xia',
        'wh_new_house_monthly_huang_pi',
        'wh_new_house_monthly_cai_dian',
        'wh_new_house_monthly_xin_zhou',
        'wh_new_house_monthly_han_nan'
      ], 'yd', { legendTop: '90px', gridTop: '140px' })
    ]
  },
  WHSecondHandHouse: {
    source: { localJson: './wh.json' },
    charts: [
      chart('wh-second-year', '武汉二手房成交年度走势', ['wh_second_house_yearly_total'], 'nd'),
      chart('wh-second-month', '武汉二手房成交月度走势', ['wh_second_house_monthly_total'], 'yd'),
      chart('wh-second-price', '武汉二手房挂牌均价', ['wh_second_house_monthly_price'], 'yd'),
      chart('wh-second-activity', '武汉二手房挂牌活跃度', [
        'wh_second_house_monthly_new_listing_count',
        'wh_second_house_monthly_viewer_count',
        'wh_second_house_monthly_price_rise_listing_count',
        'wh_second_house_monthly_price_drop_listing_count'
      ], 'yd')
    ]
  },
  WHGDP: {
    source: { localJson: './city.json', cityCodeArr: ['420100'] },
    charts: [regionChart('wh-gdp', '武汉地区生产总值', ['city_gdp'], 'nd', { regionCodes: ['420100'] })]
  },
  WHPopulation: {
    source: { localJson: './city.json', cityCodeArr: ['420100'] },
    charts: [regionChart('wh-population', '武汉年末户籍人口', ['city_registered_population'], 'nd', { regionCodes: ['420100'] })]
  },
  WHFinance: {
    source: { localJson: './city.json', cityCodeArr: ['420100'] },
    charts: [
      regionChart('wh-budget-income', '武汉地方一般公共预算收入', ['city_budget_income'], 'nd', { regionCodes: ['420100'] }),
      regionChart('wh-budget-expenditure', '武汉地方一般公共预算支出', ['city_budget_expenditure'], 'nd', { regionCodes: ['420100'] }),
      regionChart('wh-budget-deficit', '武汉地方一般公共预算赤字', ['city_budget_deficit'], 'nd', { regionCodes: ['420100'] }),
      regionChart('wh-household-deposit', '武汉住户存款余额', ['city_household_deposit_balance'], 'nd', { regionCodes: ['420100'] })
    ]
  },
  WHRealEstateInvest: {
    source: { localJson: './city.json', cityCodeArr: ['420100'] },
    charts: [regionChart('wh-invest', '武汉房地产开发住宅投资额', ['city_residential_dev_investment'], 'nd', { regionCodes: ['420100'] })]
  },
  WHRealEstateSell: {
    source: { localJson: './city.json', cityCodeArr: ['420100'] },
    charts: [
      regionChart('wh-sales-area', '武汉住宅商品房销售面积', ['city_residential_sales_area'], 'nd', { regionCodes: ['420100'] }),
      regionChart('wh-avg-price', '武汉住宅商品房平均销售价格', ['city_residential_avg_price'], 'nd', { regionCodes: ['420100'] })
    ]
  },
  WHEducation: {
    source: { localJson: './city.json', cityCodeArr: ['420100'] },
    charts: [regionChart('wh-college-students', '武汉普通本专科在校学生数', ['city_college_students'], 'nd', { regionCodes: ['420100'] })]
  },
  WHMedical: {
    source: { localJson: './city.json', cityCodeArr: ['420100'] },
    charts: [regionChart('wh-hospital-count', '武汉医院数', ['city_hospital_count'], 'nd', { regionCodes: ['420100'] })]
  },

  CityGDP: {
    source: { localJson: './city.json', cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND },
    charts: [regionChart('city-gdp', '重点城市地区生产总值', ['city_gdp'], 'nd')]
  },
  CityPopulation: {
    source: { localJson: './city.json', cityCodeArr: CITY_POPULATION_CODES },
    charts: [regionChart('city-population', '重点城市年末户籍人口', ['city_registered_population'], 'nd')]
  },
  CityFinance: {
    source: { localJson: './city.json', cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND },
    charts: [
      regionChart('city-budget-income', '重点城市地方一般公共预算收入', ['city_budget_income'], 'nd'),
      regionChart('city-budget-expenditure', '重点城市地方一般公共预算支出', ['city_budget_expenditure'], 'nd'),
      regionChart('city-budget-deficit', '重点城市地方一般公共预算赤字', ['city_budget_deficit'], 'nd'),
      regionChart('city-deposit', '重点城市住户存款余额', ['city_household_deposit_balance'], 'nd')
    ]
  },
  CityRealEstateInvest: {
    source: { localJson: './city.json', cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND },
    charts: [regionChart('city-invest', '重点城市房地产开发住宅投资额', ['city_residential_dev_investment'], 'nd')]
  },
  CityRealEstateSell: {
    source: { localJson: './city.json', cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND },
    charts: [
      regionChart('city-sales-area', '重点城市住宅商品房销售面积', ['city_residential_sales_area'], 'nd'),
      regionChart('city-avg-price', '重点城市住宅商品房平均销售价格', ['city_residential_avg_price'], 'nd')
    ]
  },
  CityRealEstatePriceIndices: {
    source: { localJson: './city.json', cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND },
    charts: [
      regionChart('city-new-house-mom', '新建商品住宅价格指数(上月=100)', ['city_new_house_price_mom'], 'yd'),
      regionChart('city-new-house-yoy', '新建商品住宅价格指数(上年同月=100)', ['city_new_house_price_yoy'], 'yd'),
      regionChart('city-second-hand-yoy', '二手住宅价格指数(上年同月=100)', ['city_second_hand_house_price_yoy'], 'yd'),
      regionChart('city-second-hand-mom', '二手住宅价格指数(待复核项)', ['city_second_hand_house_price_mom_unverified'], 'yd')
    ]
  },
  CityEducation: {
    source: { localJson: './city.json', cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND },
    charts: [regionChart('city-college-students', '重点城市普通本专科在校学生数', ['city_college_students'], 'nd')]
  },
  CityMedical: {
    source: { localJson: './city.json', cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND },
    charts: [regionChart('city-hospital-count', '重点城市医院数', ['city_hospital_count'], 'nd')]
  },

  ProvincialGDP: {
    source: { localJson: './province.json', cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES },
    charts: [regionChart('province-gdp', '重点省市地区生产总值', ['province_gdp'], 'nd')]
  },
  ProvincialPopulation: {
    source: { localJson: './province.json', cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES },
    charts: [
      regionChart('province-total-population', '重点省市年末常住人口', ['province_total_population'], 'nd'),
      regionChart('province-birth-rate', '重点省市人口出生率', ['province_birth_rate'], 'nd'),
      regionChart('province-death-rate', '重点省市人口死亡率', ['province_death_rate'], 'nd'),
      regionChart('province-natural-growth', '重点省市人口自然增长率', ['province_natural_growth_rate'], 'nd')
    ]
  },
  ProvincialFinance: {
    source: { localJson: './province.json', cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES },
    charts: [
      regionChart('province-budget-income', '重点省市地方财政一般预算收入', ['province_budget_income'], 'nd'),
      regionChart('province-budget-expenditure', '重点省市地方财政一般预算支出', ['province_budget_expenditure'], 'nd'),
      regionChart('province-budget-deficit', '重点省市地方财政一般预算赤字', ['province_budget_deficit'], 'nd')
    ]
  },
  ProvincialRealEstateInvest: {
    source: { localJson: './province.json', cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES },
    charts: [
      regionChart('province-invest-year', '重点省市房地产开发住宅投资额', ['province_residential_dev_investment'], 'nd'),
      regionChart('province-invest-value', '重点省市住宅投资累计值', ['province_residential_investment_value'], 'yd'),
      regionChart('province-invest-growth', '重点省市住宅投资累计增长', ['province_residential_investment_growth'], 'yd')
    ]
  },
  ProvincialRealEstateSell: {
    source: { localJson: './province.json', cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES },
    charts: [
      regionChart('province-sales-area-year', '重点省市住宅商品房销售面积', ['province_residential_sales_area'], 'nd'),
      regionChart('province-avg-price-year', '重点省市住宅商品房平均销售价格', ['province_residential_avg_price'], 'nd'),
      regionChart('province-sales-area-value', '重点省市住宅销售面积累计值', ['province_residential_sales_area_value'], 'yd'),
      regionChart('province-sales-area-growth', '重点省市住宅销售面积累计增长', ['province_residential_sales_area_growth'], 'yd'),
      regionChart('province-sales-amount-value', '重点省市住宅销售额累计值', ['province_residential_sales_amount_value'], 'yd'),
      regionChart('province-sales-amount-growth', '重点省市住宅销售额累计增长', ['province_residential_sales_amount_growth'], 'yd')
    ]
  },
  ProvincialEducation: {
    source: { localJson: './province.json', cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES },
    charts: [
      regionChart('province-college-enrollment', '重点省市普通高等学校本科招生数', ['province_college_enrollment'], 'nd'),
      regionChart('province-college-students', '重点省市普通高等学校本科在校学生数', ['province_college_students'], 'nd'),
      regionChart('province-college-graduates', '重点省市普通高等学校本科毕(结)业生数', ['province_college_graduates'], 'nd')
    ]
  },
  ProvincialMedical: {
    source: { localJson: './province.json', cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES },
    charts: [
      regionChart('province-hospital-count', '重点省市医院数', ['province_hospital_count'], 'nd'),
      regionChart('province-bed-count', '重点省市每万人医疗机构床位数', ['province_bed_count_per_10k'], 'nd')
    ]
  },
  ProvincialLiving: {
    source: { localJson: './province.json', cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES },
    charts: [regionChart('province-income', '重点省市全体居民人均可支配收入', ['province_disposable_income'], 'nd')]
  },

  GrossDomesticProduct: {
    source: { localJson: './nation.json' },
    charts: [chart('nation-gdp', 'GDP与国民总收入', ['nation_gni', 'nation_gdp', 'nation_gdp_per_capita'], 'nd')]
  },
  PopulationBasic: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-total-population', '总人口', ['nation_total_population'], 'nd'),
      chart('nation-birth-death-growth', '出生率/死亡率/自然增长率', ['nation_birth_rate', 'nation_death_rate', 'nation_natural_growth_rate'], 'nd')
    ]
  },
  PopulationSpot: {
    source: { localJson: './nation.json' },
    charts: []
  },
  NationalFinance: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-budget-income', '国家财政预算收入', ['nation_budget_income_total', 'nation_budget_income_central', 'nation_budget_income_local'], 'nd'),
      chart('nation-budget-expenditure', '国家财政预算支出', ['nation_budget_expenditure_total', 'nation_budget_expenditure_central', 'nation_budget_expenditure_local'], 'nd')
    ]
  },
  RealEstateInvest: {
    source: { localJson: './nation.json' },
    charts: [chart('nation-investment', '房地产开发投资情况', ['nation_real_estate_investment_total'], 'nd')]
  },
  RealEstateSell: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-sales-area', '商品住宅销售面积', ['nation_new_home_sales_area_total'], 'nd'),
      chart('nation-sales-amount', '商品住宅销售额', ['nation_new_home_sales_amount_total'], 'nd')
    ]
  },
  EducationSchool: {
    source: { localJson: './nation.json' },
    charts: [chart('nation-school-count', '普通高等学校数', ['nation_college_count'], 'nd')]
  },
  EducationTeacher: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-teacher-count', '普通高等学校专任教师数', ['nation_college_teacher_count'], 'nd'),
      chart('nation-student-teacher-ratio', '生师比', ['nation_primary_student_teacher_ratio'], 'nd')
    ]
  },
  EducationStudent: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-college-enrollment', '高等教育招生数', ['nation_junior_college_enrollment'], 'nd'),
      chart('nation-college-students', '高等教育在校学生数', ['nation_higher_education_students'], 'nd'),
      chart('nation-college-graduates', '高等教育毕业生数', ['nation_higher_education_graduates'], 'nd')
    ]
  },
  MedicalTreatment: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-health-institutions', '医疗卫生机构/医院数', ['nation_health_institutions_total'], 'nd'),
      chart('nation-health-workers', '卫生人员数', ['nation_health_workers_total', 'nation_health_technicians'], 'nd')
    ]
  },
  MarriageStatus: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-marriage', '婚姻登记', ['nation_marriage_count', 'nation_divorce_count'], 'nd'),
      chart('nation-marriage-structure', '初婚与再婚人数', ['nation_first_marriage_inland', 'nation_remarriage_inland'], 'nd'),
      chart('nation-divorce-rate', '粗离婚率', ['nation_crude_divorce_rate'], 'nd')
    ]
  },
  SocialRetailgoods: {
    source: { localJson: './nation.json' },
    charts: []
  },
  FinancialCurrency: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-gold-reserve', '黄金储备', ['nation_gold_reserve'], 'nd'),
      chart('nation-money-supply', '货币供应量', ['nation_money_supply_year_end_balance'], 'nd')
    ]
  },
  FinancialSocialFinancing: {
    source: { localJson: './nation.json' },
    charts: [chart('nation-social-financing', '社会融资规模增量', ['nation_social_financing_increment'], 'nd')]
  },
  FinancialSecurity: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-stock-market-cap', '股票总市值', ['nation_stock_market_cap', 'nation_stock_float_market_cap'], 'nd'),
      chart('nation-stock-turnover', '股票成交规模', ['nation_stock_turnover_amount', 'nation_stock_turnover_volume'], 'nd'),
      chart('nation-bond-turnover', '债券成交规模', ['nation_exchange_bond_turnover_amount', 'nation_exchange_bond_repo_turnover_amount'], 'nd')
    ]
  },
  FinancialInsurance: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-insurance-premium', '保险保费收入', ['nation_insurance_original_premium_income', 'nation_insurance_life_premium_income', 'nation_insurance_property_premium_income'], 'nd'),
      chart('nation-insurance-claims', '保险赔付支出', ['nation_insurance_claims_paid', 'nation_insurance_life_claims_paid', 'nation_insurance_property_claims_paid'], 'nd'),
      chart('nation-insurance-assets', '保险业总资产', ['nation_insurance_total_assets'], 'nd')
    ]
  },
  ForeignTrade: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-trade-total', '货物进出口总额', ['nation_trade_total_rmb', 'nation_trade_total_usd'], 'nd'),
      chart('nation-trade-balance', '货物贸易顺差', ['nation_trade_balance_rmb', 'nation_trade_balance_usd'], 'nd')
    ]
  },
  IndicesData: {
    source: { localJson: './nation.json' },
    charts: []
  },
  TouristIndustry: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-tourism-visitors', '国内旅游人次', ['nation_domestic_visitors'], 'nd'),
      chart('nation-tourism-spending', '国内旅游花费', ['nation_domestic_tourism_spending_total', 'nation_domestic_tourism_spending_per_capita'], 'nd')
    ]
  },
  AccommodationAndCateringIndustry: {
    source: { localJson: './nation.json' },
    charts: []
  },
  LivingStandards: {
    source: { localJson: './nation.json' },
    charts: [
      chart('nation-income', '居民收入', ['nation_income_total', 'nation_income_total_median'], 'nd'),
      chart('nation-engel', '恩格尔系数', ['nation_engel_total'], 'nd'),
      chart('nation-gini', '基尼系数', ['nation_gini'], 'nd')
    ]
  },
  TransportationAndTelecommunications: {
    source: { localJson: './nation.json' },
    charts: []
  }
};
