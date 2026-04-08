import { cityRegionList, provinceRegionList } from '@/config/regionLists.js';
import { createDataSource } from '@/config/dataFiles.js';

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

function regionPieConfig(indicatorKey, extra = {}) {
  return {
    pieConfig: {
      enabled: true,
      pies: [
        {
          triggerIndicatorKeys: [indicatorKey],
          topN: 8,
          mergeOthersLabel: '其他',
          ...extra
        }
      ]
    }
  };
}

function indicatorPieConfig(indicatorKeys, extra = {}) {
  return {
    pieConfig: {
      enabled: true,
      pies: [
        {
          triggerIndicatorKeys: indicatorKeys,
          ...extra
        }
      ]
    }
  };
}

export const v3PageRegistry = {
  WHNewHouse: {
    source: createDataSource('wh'),
    charts: [
      chart('wh-new-house-year', '新房成交年度走势', ['wh_new_house_yearly_total'], 'nd'),
      chart('wh-new-house-month', '新房成交月度走势', ['wh_new_house_monthly_total'], 'yd'),
      chart('wh-new-house-district-month', '新房分区域月度走势', [
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
      ], 'yd', {
        legendTop: '90px',
        gridTop: '320px',
        ...indicatorPieConfig([
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
        ], {
          topN: 8,
          mergeOthersLabel: '其他区域',
          center: ['50%', '190px'],
          radius: '16%'
        })
      }),
      chart('wh-new-house-district-year', '新房分区域年度走势', [
        'wh_new_house_yearly_jiang_an',
        'wh_new_house_yearly_jiang_han',
        'wh_new_house_yearly_qiao_kou',
        'wh_new_house_yearly_han_yang',
        'wh_new_house_yearly_qing_shan',
        'wh_new_house_yearly_wu_chang',
        'wh_new_house_yearly_hong_shan',
        'wh_new_house_yearly_dong_xi_hu',
        'wh_new_house_yearly_dong_hu_high_tech',
        'wh_new_house_yearly_economic_development',
        'wh_new_house_yearly_chang_jiang_new_area',
        'wh_new_house_yearly_jiang_xia',
        'wh_new_house_yearly_huang_pi',
        'wh_new_house_yearly_cai_dian',
        'wh_new_house_yearly_xin_zhou',
        'wh_new_house_yearly_han_nan'
      ], 'nd', {
        legendTop: '90px',
        gridTop: '320px',
        ...indicatorPieConfig([
          'wh_new_house_yearly_jiang_an',
          'wh_new_house_yearly_jiang_han',
          'wh_new_house_yearly_qiao_kou',
          'wh_new_house_yearly_han_yang',
          'wh_new_house_yearly_qing_shan',
          'wh_new_house_yearly_wu_chang',
          'wh_new_house_yearly_hong_shan',
          'wh_new_house_yearly_dong_xi_hu',
          'wh_new_house_yearly_dong_hu_high_tech',
          'wh_new_house_yearly_economic_development',
          'wh_new_house_yearly_chang_jiang_new_area',
          'wh_new_house_yearly_jiang_xia',
          'wh_new_house_yearly_huang_pi',
          'wh_new_house_yearly_cai_dian',
          'wh_new_house_yearly_xin_zhou',
          'wh_new_house_yearly_han_nan'
        ], {
          topN: 8,
          mergeOthersLabel: '其他区域',
          center: ['50%', '190px'],
          radius: '16%'
        })
      })
    ]
  },
  WHSecondHandHouse: {
    source: createDataSource('wh'),
    charts: [
      chart('wh-second-year', '二手房成交年度走势', ['wh_second_house_yearly_total'], 'nd'),
      chart('wh-second-month', '二手房成交月度走势', ['wh_second_house_monthly_total'], 'yd'),
      chart('wh-second-price', '二手房成交均价', ['wh_second_house_monthly_price'], 'yd'),
      chart('wh-second-activity', '二手房挂牌活跃度', [
        'wh_second_house_monthly_new_listing_count',
        'wh_second_house_monthly_viewer_count',
        'wh_second_house_monthly_price_rise_listing_count',
        'wh_second_house_monthly_price_drop_listing_count'
      ], 'yd')
    ]
  },
  WHGDP: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [regionChart('wh-gdp', '地区生产总值', ['city_gdp'], 'nd', { regionCodes: ['420100'] })]
  },
  WHPopulation: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [
      chart('wh-population', '常住人口与年末户籍人口', ['city_resident_population', 'city_registered_population'], 'nd')
    ]
  },
  WHFinance: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [
      regionChart('wh-budget-overview', '财政收支与赤字', ['city_budget_income', 'city_budget_expenditure', 'city_budget_deficit'], 'nd', { regionCodes: ['420100'], seriesLayout: 'indicator' }),
      regionChart('wh-household-deposit', '住户存款余额', ['city_household_deposit_balance'], 'nd', { regionCodes: ['420100'] })
    ]
  },
  WHRealEstateInvest: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [regionChart('wh-invest', '房地产开发住宅投资额', ['city_residential_dev_investment'], 'nd', { regionCodes: ['420100'] })]
  },
  WHRealEstateSell: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [
      regionChart('wh-sales-area', '商品房销售面积', ['city_residential_sales_area'], 'nd', { regionCodes: ['420100'] }),
      regionChart('wh-avg-price', '商品房平均销售价格', ['city_residential_avg_price'], 'nd', { regionCodes: ['420100'] })
    ]
  },
  WHEducation: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [regionChart('wh-college-students', '普通本专科在校学生数', ['city_college_students'], 'nd', { regionCodes: ['420100'] })]
  },
  WHMedical: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [regionChart('wh-hospital-count', '医院数', ['city_hospital_count'], 'nd', { regionCodes: ['420100'] })]
  },

  CityGDP: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [regionChart('city-gdp', '地区生产总值', ['city_gdp'], 'nd', regionPieConfig('city_gdp'))]
  },
  CityPopulation: {
    source: createDataSource('city', { cityCodeArr: CITY_POPULATION_CODES }),
    charts: [
      regionChart('city-resident-population', '常住人口', ['city_resident_population'], 'nd', regionPieConfig('city_resident_population')),
      regionChart('city-population', '年末户籍人口', ['city_registered_population'], 'nd', regionPieConfig('city_registered_population'))
    ]
  },
  CityFinance: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [
      regionChart('city-budget-income', '地方一般公共预算收入', ['city_budget_income'], 'nd', regionPieConfig('city_budget_income')),
      regionChart('city-budget-expenditure', '地方一般公共预算支出', ['city_budget_expenditure'], 'nd', regionPieConfig('city_budget_expenditure')),
      regionChart('city-budget-deficit', '地方一般公共预算赤字', ['city_budget_deficit'], 'nd'),
      regionChart('city-deposit', '住户存款余额', ['city_household_deposit_balance'], 'nd', regionPieConfig('city_household_deposit_balance'))
    ]
  },
  CityRealEstateInvest: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [regionChart('city-invest', '房地产开发住宅投资额', ['city_residential_dev_investment'], 'nd', regionPieConfig('city_residential_dev_investment'))]
  },
  CityRealEstateSell: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [
      regionChart('city-sales-area', '商品房销售面积', ['city_residential_sales_area'], 'nd', regionPieConfig('city_residential_sales_area')),
      regionChart('city-avg-price', '商品房平均销售价格', ['city_residential_avg_price'], 'nd')
    ]
  },
  CityRealEstatePriceIndices: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [
      regionChart('city-new-house-mom', '新建商品住宅价格指数(上月=100)', ['city_new_house_price_mom'], 'yd'),
      regionChart('city-second-hand-mom', '二手房住宅价格指数(上月=100)', ['city_second_hand_house_mom_yd_01'], 'yd')
    ]
  },
  CityEducation: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [regionChart('city-college-students', '普通本专科在校学生数', ['city_college_students'], 'nd', regionPieConfig('city_college_students'))]
  },
  CityMedical: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [regionChart('city-hospital-count', '医院数', ['city_hospital_count'], 'nd', regionPieConfig('city_hospital_count'))]
  },

  ProvincialGDP: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [regionChart('province-gdp', '地区生产总值', ['province_gdp'], 'nd', regionPieConfig('province_gdp'))]
  },
  ProvincialPopulation: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChart('province-total-population', '年末常住人口', ['province_total_population'], 'nd', regionPieConfig('province_total_population')),
      regionChart('province-birth-rate', '人口出生率', ['province_birth_rate'], 'nd'),
      regionChart('province-death-rate', '人口死亡率', ['province_death_rate'], 'nd'),
      regionChart('province-natural-growth', '人口自然增长率', ['province_natural_growth_rate'], 'nd')
    ]
  },
  ProvincialFinance: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChart('province-budget-income', '地方财政一般预算收入', ['province_budget_income'], 'nd', regionPieConfig('province_budget_income')),
      regionChart('province-budget-expenditure', '地方财政一般预算支出', ['province_budget_expenditure'], 'nd', regionPieConfig('province_budget_expenditure')),
      regionChart('province-budget-deficit', '地方财政一般预算赤字', ['province_budget_deficit'], 'nd')
    ]
  },
  ProvincialRealEstateInvest: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChart('province-invest-year', '房地产开发住宅投资额', ['province_residential_dev_investment'], 'nd', regionPieConfig('province_residential_dev_investment')),
      regionChart('province-invest-value', '住宅投资累计值', ['province_residential_investment_value'], 'yd', regionPieConfig('province_residential_investment_value')),
      regionChart('province-invest-growth', '住宅投资累计增长', ['province_residential_investment_growth'], 'yd')
    ]
  },
  ProvincialRealEstateSell: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChart('province-sales-area-year', '房屋销售面积', ['province_residential_sales_area'], 'nd', regionPieConfig('province_residential_sales_area')),
      regionChart('province-avg-price-year', '商品房平均销售价格', ['province_residential_avg_price'], 'nd'),
      regionChart('province-sales-area-value', '房屋销售面积累计值', ['province_residential_sales_area_value'], 'yd', regionPieConfig('province_residential_sales_area_value')),
      regionChart('province-sales-area-growth', '房屋销售面积累计增长', ['province_residential_sales_area_growth'], 'yd'),
      regionChart('province-sales-amount-value', '商品房销售额累计值', ['province_residential_sales_amount_value'], 'yd', regionPieConfig('province_residential_sales_amount_value')),
      regionChart('province-sales-amount-growth', '商品房销售额累计增长', ['province_residential_sales_amount_growth'], 'yd')
    ]
  },
  ProvincialEducation: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChart('province-college-enrollment', '普通高等学校本科招生数', ['province_college_enrollment'], 'nd', regionPieConfig('province_college_enrollment')),
      regionChart('province-college-students', '普通高等学校本科在校学生数', ['province_college_students'], 'nd', regionPieConfig('province_college_students')),
      regionChart('province-college-graduates', '普通高等学校本科毕(结)业生数', ['province_college_graduates'], 'nd', regionPieConfig('province_college_graduates'))
    ]
  },
  ProvincialMedical: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChart('province-hospital-count', '医院数', ['province_hospital_count'], 'nd', regionPieConfig('province_hospital_count')),
      regionChart('province-bed-count', '每万人医疗机构床位数', ['province_bed_count_per_10k'], 'nd')
    ]
  },
  ProvincialLiving: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [regionChart('province-income', '全体居民人均可支配收入', ['province_disposable_income'], 'nd', regionPieConfig('province_disposable_income'))]
  },

  GrossDomesticProduct: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-gdp-overview', '国内生产总值', ['nation_gdp', 'nation_gdp_primary', 'nation_gdp_secondary', 'nation_gdp_tertiary', 'nation_gdp_per_capita'], 'nd', indicatorPieConfig(['nation_gdp_primary', 'nation_gdp_secondary', 'nation_gdp_tertiary']))
    ]
  },
  PopulationBasic: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-total-population', '人口', ['nation_total_population', 'nation_population_male', 'nation_population_female', 'nation_population_urban', 'nation_population_rural'], 'nd', {
        legendTop: '90px',
        gridTop: '340px',
        pieConfig: {
          enabled: true,
          pies: [
            {
              triggerIndicatorKeys: ['nation_population_male', 'nation_population_female'],
              center: ['28%', '200px'],
              radius: '16%'
            },
            {
              triggerIndicatorKeys: ['nation_population_urban', 'nation_population_rural'],
              center: ['72%', '200px'],
              radius: '16%'
            }
          ]
        }
      }),
      chart('nation-birth-death-growth', '人口率', ['nation_birth_rate', 'nation_death_rate', 'nation_natural_growth_rate'], 'nd'),
      chart('nation-birth-death-count', '人口增长', ['nation_birth_population', 'nation_death_population', 'nation_natural_growth_population'], 'nd'),
      chart('nation-age-structure', '人口年龄结构', ['nation_age_structure_02', 'nation_age_structure_03', 'nation_age_structure_04'], 'nd', indicatorPieConfig(['nation_age_structure_02', 'nation_age_structure_03', 'nation_age_structure_04'])),
      chart('nation-dependency-ratio', '人口抚养比', ['nation_age_structure_05', 'nation_age_structure_06', 'nation_age_structure_07'], 'nd')
    ]
  },
  PopulationSpot: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-pop-sample-age', '人口抽样调查年龄结构', ['nation_pop_sample_age_02', 'nation_pop_sample_age_03', 'nation_pop_sample_age_04', 'nation_pop_sample_age_05', 'nation_pop_sample_age_06', 'nation_pop_sample_age_07', 'nation_pop_sample_age_08', 'nation_pop_sample_age_09', 'nation_pop_sample_age_10', 'nation_pop_sample_age_11', 'nation_pop_sample_age_12', 'nation_pop_sample_age_13', 'nation_pop_sample_age_14', 'nation_pop_sample_age_15', 'nation_pop_sample_age_17', 'nation_pop_sample_age_18', 'nation_pop_sample_age_19', 'nation_pop_sample_age_20', 'nation_pop_sample_age_21'], 'nd', indicatorPieConfig(['nation_pop_sample_age_02', 'nation_pop_sample_age_03', 'nation_pop_sample_age_04', 'nation_pop_sample_age_05', 'nation_pop_sample_age_06', 'nation_pop_sample_age_07', 'nation_pop_sample_age_08', 'nation_pop_sample_age_09', 'nation_pop_sample_age_10', 'nation_pop_sample_age_11', 'nation_pop_sample_age_12', 'nation_pop_sample_age_13', 'nation_pop_sample_age_14', 'nation_pop_sample_age_15', 'nation_pop_sample_age_17', 'nation_pop_sample_age_18', 'nation_pop_sample_age_19', 'nation_pop_sample_age_20', 'nation_pop_sample_age_21'], { topN: 10, mergeOthersLabel: '其他年龄段' })),
      chart('nation-pop-sample-sex-ratio', '人口抽样调查性别比(女=100)', ['nation_pop_sample_sex_ratio_01', 'nation_pop_sample_sex_ratio_02', 'nation_pop_sample_sex_ratio_03', 'nation_pop_sample_sex_ratio_04', 'nation_pop_sample_sex_ratio_05', 'nation_pop_sample_sex_ratio_06', 'nation_pop_sample_sex_ratio_07', 'nation_pop_sample_sex_ratio_08', 'nation_pop_sample_sex_ratio_09', 'nation_pop_sample_sex_ratio_10', 'nation_pop_sample_sex_ratio_11', 'nation_pop_sample_sex_ratio_12', 'nation_pop_sample_sex_ratio_13', 'nation_pop_sample_sex_ratio_14', 'nation_pop_sample_sex_ratio_15', 'nation_pop_sample_sex_ratio_16', 'nation_pop_sample_sex_ratio_17', 'nation_pop_sample_sex_ratio_18', 'nation_pop_sample_sex_ratio_19', 'nation_pop_sample_sex_ratio_20', 'nation_pop_sample_sex_ratio_21'], 'nd', indicatorPieConfig(['nation_pop_sample_sex_ratio_02', 'nation_pop_sample_sex_ratio_03', 'nation_pop_sample_sex_ratio_04', 'nation_pop_sample_sex_ratio_05', 'nation_pop_sample_sex_ratio_06', 'nation_pop_sample_sex_ratio_07', 'nation_pop_sample_sex_ratio_08', 'nation_pop_sample_sex_ratio_09', 'nation_pop_sample_sex_ratio_10', 'nation_pop_sample_sex_ratio_11', 'nation_pop_sample_sex_ratio_12', 'nation_pop_sample_sex_ratio_13', 'nation_pop_sample_sex_ratio_14', 'nation_pop_sample_sex_ratio_15', 'nation_pop_sample_sex_ratio_16', 'nation_pop_sample_sex_ratio_17', 'nation_pop_sample_sex_ratio_18', 'nation_pop_sample_sex_ratio_19', 'nation_pop_sample_sex_ratio_20', 'nation_pop_sample_sex_ratio_21'], { topN: 10, mergeOthersLabel: '其他年龄段' })),
      chart('nation-pop-sample-education', '人口抽样调查受教育程度', ['nation_pop_sample_education_01', 'nation_pop_sample_education_02', 'nation_pop_sample_education_03', 'nation_pop_sample_education_04', 'nation_pop_sample_education_05', 'nation_pop_sample_education_06', 'nation_pop_sample_education_07', 'nation_pop_sample_education_08', 'nation_pop_sample_education_09', 'nation_pop_sample_education_10', 'nation_pop_sample_education_11', 'nation_pop_sample_education_12', 'nation_pop_sample_education_13', 'nation_pop_sample_education_14', 'nation_pop_sample_education_15', 'nation_pop_sample_education_16', 'nation_pop_sample_education_17', 'nation_pop_sample_education_18'], 'nd', indicatorPieConfig(['nation_pop_sample_education_04', 'nation_pop_sample_education_07', 'nation_pop_sample_education_10', 'nation_pop_sample_education_13', 'nation_pop_sample_education_16'], { mergeOthersLabel: '其他分组' }))
    ]
  },
  NationalFinance: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-budget-income-yearly', '财政收入', ['nation_budget_income_total', 'nation_budget_income_central', 'nation_budget_income_local'], 'nd'),
      chart('nation-budget-expenditure-yearly', '财政支出', ['nation_budget_expenditure_total', 'nation_budget_expenditure_central', 'nation_budget_expenditure_local'], 'nd'),
      chart('nation-budget-deficit-yearly', '财政赤字', ['nation_finance_deficit_total', 'nation_finance_deficit_central', 'nation_finance_deficit_local'], 'nd'),
      chart('nation-budget-monthly-value', '财政收入与支出累计值', ['nation_budget_income_yd_01', 'nation_budget_expenditure_yd_01'], 'yd'),
      chart('nation-budget-monthly-growth', '财政收入与支出累计增长', ['nation_budget_income_yd_02', 'nation_budget_expenditure_yd_02'], 'yd'),
      chart('nation-budget-main-income-items', '国家财政主要收入项目', [
        'nation_national_administrative_fees',
        'nation_national_business_tax',
        'nation_national_confiscation_income',
        'nation_national_customs_duty',
        'nation_national_deed_tax',
        'nation_national_domestic_consumption_tax',
        'nation_national_domestic_vat',
        'nation_national_enterprise_income_tax',
        'nation_national_farmland_occupation_tax',
        'nation_national',
        'nation_national_land_appreciation_tax',
        'nation_national_non_tax_revenue',
        'nation_national_other_income',
        'nation_national_other_tax_revenue',
        'nation_national_personal_income_tax',
        'nation_national_property_tax',
        'nation_national_resource_tax',
        'nation_national_special_revenue',
        'nation_national_stamp_tax',
        'nation_national_tax_revenue',
        'nation_national_tobacco_tax',
        'nation_national_tonnage_tax',
        'nation_national_urban_land_use_tax',
        'nation_national_urban_maintenance_construction_tax',
        'nation_national_vehicle_purchase_tax',
        'nation_national_vehicle_vessel_tax'
      ], 'nd', indicatorPieConfig([
        'nation_national_administrative_fees',
        'nation_national_business_tax',
        'nation_national_confiscation_income',
        'nation_national_customs_duty',
        'nation_national_deed_tax',
        'nation_national_domestic_consumption_tax',
        'nation_national_domestic_vat',
        'nation_national_enterprise_income_tax',
        'nation_national_farmland_occupation_tax',
        'nation_national',
        'nation_national_land_appreciation_tax',
        'nation_national_non_tax_revenue',
        'nation_national_other_income',
        'nation_national_other_tax_revenue',
        'nation_national_personal_income_tax',
        'nation_national_property_tax',
        'nation_national_resource_tax',
        'nation_national_special_revenue',
        'nation_national_stamp_tax',
        'nation_national_tax_revenue',
        'nation_national_tobacco_tax',
        'nation_national_tonnage_tax',
        'nation_national_urban_land_use_tax',
        'nation_national_urban_maintenance_construction_tax',
        'nation_national_vehicle_purchase_tax',
        'nation_national_vehicle_vessel_tax'
      ], { topN: 8, mergeOthersLabel: '其他' })),
      chart('nation-budget-main-expenditure-items', '国家财政主要支出项目', [
        'nation_national_budget_agriculture_forestry_water_expenditure',
        'nation_national_budget_armed_police_expenditure',
        'nation_national_budget_culture_sports_media_expenditure',
        'nation_national_budget_defense_expenditure',
        'nation_national_budget_education_expenditure',
        'nation_national_budget_environmental_protection_expenditure',
        'nation_national_budget_foreign_affairs_expenditure',
        'nation_national_budget_foreign_aid_expenditure',
        'nation_national_budget_general_public_services_expenditure',
        'nation_national_budget_healthcare_expenditure',
        'nation_national_budget_other_expenditure',
        'nation_national_budget_post_earthquake_reconstruction_expenditure',
        'nation_national_budget_public_safety_expenditure',
        'nation_national_budget_science_technology_expenditure',
        'nation_national_budget_social_security_employment_expenditure',
        'nation_national_budget_transport_expenditure',
        'nation_national_budget_urban_rural_community_expenditure',
        'nation_national_budget_vehicle_purchase_tax_expenditure'
      ], 'nd', indicatorPieConfig([
        'nation_national_budget_agriculture_forestry_water_expenditure',
        'nation_national_budget_armed_police_expenditure',
        'nation_national_budget_culture_sports_media_expenditure',
        'nation_national_budget_defense_expenditure',
        'nation_national_budget_education_expenditure',
        'nation_national_budget_environmental_protection_expenditure',
        'nation_national_budget_foreign_affairs_expenditure',
        'nation_national_budget_foreign_aid_expenditure',
        'nation_national_budget_general_public_services_expenditure',
        'nation_national_budget_healthcare_expenditure',
        'nation_national_budget_other_expenditure',
        'nation_national_budget_post_earthquake_reconstruction_expenditure',
        'nation_national_budget_public_safety_expenditure',
        'nation_national_budget_science_technology_expenditure',
        'nation_national_budget_social_security_employment_expenditure',
        'nation_national_budget_transport_expenditure',
        'nation_national_budget_urban_rural_community_expenditure',
        'nation_national_budget_vehicle_purchase_tax_expenditure'
      ], { topN: 8, mergeOthersLabel: '其他' })),
    ]
  },
  RealEstateInvest: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-investment', '房地产开发投资额', ['nation_real_estate_investment_total'], 'nd'),
      chart('nation-investment-monthly-value', '房地产开发投资累计值', [
        'nation_real_estate_investment_yd_01',
        'nation_real_estate_investment_yd_03',
        'nation_real_estate_investment_yd_05',
        'nation_real_estate_investment_yd_07'
      ], 'yd'),
      chart('nation-investment-monthly-growth', '房地产开发投资累计增长', [
        'nation_real_estate_investment_yd_02',
        'nation_real_estate_investment_yd_04',
        'nation_real_estate_investment_yd_06',
        'nation_real_estate_investment_yd_08'
      ], 'yd')
    ]
  },
  RealEstateSell: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-sales-area', '住宅商品房销售面积', ['nation_new_home_sales_area_residential'], 'nd'),
      chart('nation-sales-amount', '住宅商品房销售额', ['nation_new_home_sales_amount_residential'], 'nd'),
      chart('nation-sales-price', '住宅商品房销售价格', ['nation_new_home_avg_price_residential'], 'nd'),
      chart('nation-sales-area-monthly-value', '商品住宅销售面积累计值', ['nation_residential_sales_area_yd_01'], 'yd'),
      chart('nation-sales-area-monthly-growth', '商品住宅销售面积累计增长', ['nation_residential_sales_area_yd_02'], 'yd'),
      chart('nation-sales-amount-monthly-value', '商品住宅销售额累计值', ['nation_residential_sales_amount_yd_01'], 'yd'),
      chart('nation-sales-amount-monthly-growth', '商品住宅销售额累计增长', ['nation_residential_sales_amount_yd_02'], 'yd')
    ]
  },
  EducationSchool: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-school-count', '学校数量', ['nation_kindergarten_count', 'nation_primary_school_count', 'nation_junior_high_school_count', 'nation_regular_high_school_count', 'nation_postgraduate_institution_count'], 'nd')
    ]
  },
  EducationTeacher: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-teacher-count', '教师数量', ['nation_kindergarten_teacher_count', 'nation_primary_school_teacher_count', 'nation_junior_high_school_teacher_count', 'nation_regular_high_school_teacher_count', 'nation_postgraduate_teacher_count'], 'nd')
    ]
  },
  EducationStudent: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-enrollment', '各学段招生数', ['nation_preschool_enrollment', 'nation_primary_enrollment', 'nation_junior_high_enrollment', 'nation_regular_high_enrollment', 'nation_junior_college_enrollment', 'nation_undergraduate_enrollment', 'nation_master_enrollment', 'nation_doctoral_enrollment'], 'nd'),
      chart('nation-college-students', '各学段在校学生数', ['nation_preschool_students', 'nation_primary_students', 'nation_junior_high_students', 'nation_regular_high_students', 'nation_junior_college_students', 'nation_undergraduate_students', 'nation_master_students', 'nation_doctoral_students'], 'nd'),
      chart('nation-college-graduates', '各学段毕业生数', ['nation_preschool_graduates', 'nation_primary_graduates', 'nation_junior_high_graduates', 'nation_regular_high_graduates', 'nation_junior_college_graduates', 'nation_undergraduate_graduates', 'nation_master_graduates', 'nation_doctoral_graduates'], 'nd')
    ]
  },
  MedicalTreatment: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-health-institutions', '医疗卫生机构数', ['nation_health_institutions'], 'nd'),
      chart('nation-hospital-count', '医院数', ['nation_hospital_count'], 'nd'),
      chart('nation-health-beds', '每万人口医疗卫生机构床位数', ['nation_health_beds_per_10k'], 'nd'),
      chart('nation-health-staff', '卫生人员与技术人员', ['nation_health_skilled_workers', 'nation_health_technicians'], 'nd'),
      chart('nation-health-professionals', '执业医师与注册护士', ['nation_physicians', 'nation_registered_nurses'], 'nd'),
      chart('nation-health-per-capita', '每万人医护资源', ['nation_health_technicians_per_10k', 'nation_registered_nurses_per_10k'], 'nd')
    ]
  },
  MarriageStatus: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-marriage', '婚姻登记与出生人口', ['nation_marriage_count', 'nation_divorce_count', 'nation_birth_population'], 'nd'),
      chart('nation-marriage-structure', '初婚与再婚人数', ['nation_first_marriage_inland', 'nation_remarriage_inland'], 'nd', indicatorPieConfig(['nation_first_marriage_inland', 'nation_remarriage_inland']))
    ]
  },
  SocialRetailgoods: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-retail-total', '社会消费品零售总额', ['nation_retail_sales'], 'nd'),
      chart('nation-retail-total-monthly-value', '社会消费品零售总额当期值', [
        'nation_retail_sales_yd_01',
        'nation_retail_sales_yd_03',
        'nation_retail_sales_yd_05',
        'nation_retail_sales_yd_07'
      ], 'yd', indicatorPieConfig([
        'nation_retail_sales_yd_01',
        'nation_retail_sales_yd_05'
      ], {
        center: ['50%', '190px'],
        radius: '16%'
      })),
      chart('nation-retail-total-monthly-growth', '社会消费品零售总额同比增长', [
        'nation_retail_sales_yd_02',
        'nation_retail_sales_yd_04',
        'nation_retail_sales_yd_06',
        'nation_retail_sales_yd_08'
      ], 'yd')
    ]
  },
  FinancialCurrency: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-gold-fx-reserve', '黄金与外汇储备', ['nation_gold_reserve', 'nation_fx_reserve'], 'nd'),
      chart('nation-money-supply', '货币供应量(年末余额)', ['nation_money_supply_m0_balance', 'nation_money_supply_m1_balance', 'nation_money_supply_m2_balance'], 'nd'),
      chart('nation-money-supply-growth', 'M0/M1/M2 同比增长', ['nation_money_supply_m0_growth', 'nation_money_supply_m1_growth', 'nation_money_supply_m2_growth'], 'nd'),
      chart('nation-money-supply-monthly-balance', 'M0/M1/M2 月末余额', [
        'nation_money_supply_yd_05',
        'nation_money_supply_yd_03',
        'nation_money_supply_yd_01'
      ], 'yd'),
      chart('nation-money-supply-monthly-growth', 'M0/M1/M2 月度同比增长', [
        'nation_money_supply_yd_06',
        'nation_money_supply_yd_04',
        'nation_money_supply_yd_02'
      ], 'yd')
    ]
  },
  FinancialSocialFinancing: {
    source: createDataSource('nation'),
    charts: [chart('nation-social-financing', '社会融资规模增量', ['nation_social_financing_increment'], 'nd')]
  },
  FinancialSecurity: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-security-turnover', '成交金额与融资规模', ['nation_shanghai_composite_index', 'nation_social_financing_corporate_bonds'], 'nd'),
      chart('nation-security-bond-fund', '债券基金相关指标', ['nation_shenzhen_composite_index', 'nation_social_financing_undiscounted_bankers_acceptance'], 'nd')
    ]
  },
  FinancialInsurance: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-insurance-premium', '保险保费收入与赔付支出', ['nation_insurance_original_premium_income', 'nation_insurance_property_premium_income', 'nation_insurance_life_premium_income', 'nation_insurance_claims_paid'], 'nd'),
      chart('nation-insurance-assets-structure', '保险业资产结构', ['nation_insurance_life_company_assets', 'nation_insurance_property_company_assets', 'nation_insurance_reinsurance_company_assets', 'nation_insurance_asset_management_company_assets', 'nation_insurance_other_company_assets'], 'nd', indicatorPieConfig(['nation_insurance_life_company_assets', 'nation_insurance_property_company_assets', 'nation_insurance_reinsurance_company_assets', 'nation_insurance_asset_management_company_assets', 'nation_insurance_other_company_assets']))
    ]
  },
  ForeignTrade: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-trade-total', '货物进出口总额（人民币）', ['nation_trade_total_rmb', 'nation_export_total_rmb', 'nation_import_total_rmb', 'nation_trade_balance_rmb'], 'nd'),
      chart('nation-trade-total-usd', '货物进出口总额（美元）', ['nation_trade_total_usd', 'nation_export_total_usd', 'nation_import_total_usd', 'nation_trade_balance_usd'], 'nd'),
      chart('nation-trade-total-monthly', '进出口总额(月度)', [
        'nation_trade_total_yd_01',
        'nation_trade_total_yd_03',
        'nation_trade_total_yd_05',
        'nation_trade_total_yd_07'
      ], 'yd'),
      chart('nation-trade-detail-monthly', '出口/进口/顺差(月度)', [
        'nation_trade_total_yd_09',
        'nation_trade_total_yd_11',
        'nation_trade_total_yd_13'
      ], 'yd')
    ]
  },
  IndicesData: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-cpi-mom', '居民消费价格指数(上月=100)', ['nation_cpi_mom_yd_01'], 'yd'),
      chart('nation-ppi-mom', '工业生产者出厂价格指数(上月=100)', ['nation_ppi_mom_yd_01', 'nation_ppi_mom_yd_02', 'nation_ppi_mom_yd_03'], 'yd'),
      chart('nation-pmi', '采购经理指数', ['nation_pmi_manufacturing_yd_01', 'nation_pmi_non_manufacturing_yd_01', 'nation_pmi_composite_yd_01'], 'yd')
    ]
  },
  TouristIndustry: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-tourism-visitors', '旅游人数与入境情况', ['nation_domestic_visitors_total', 'nation_inbound_visitors_total', 'nation_inbound_foreign_visitors', 'nation_inbound_hmt_visitors', 'nation_inbound_taiwan_visitors'], 'nd'),
      chart('nation-tourism-spending', '旅游花费', ['nation_domestic_tourism_spending_total', 'nation_domestic_tourism_spending_per_capita', 'nation_international_tourism_forex_revenue'], 'nd'),
      chart('nation-tourism-industry', '旅游相关行业', ['nation_hotel_catering_star_hotels', 'nation_hotel_catering_travel_agencies'], 'nd')
    ]
  },
  AccommodationAndCateringIndustry: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-hospitality-turnover', '住宿与餐饮营业额', ['nation_hotel_catering_lodging_turnover', 'nation_hotel_catering_catering_turnover'], 'nd'),
      chart('nation-hospitality-employees', '住宿与餐饮年末从业人数', ['nation_hotel_catering_lodging_employees', 'nation_hotel_catering_catering_employees'], 'nd'),
      chart('nation-hospitality-entities', '住宿与餐饮法人企业数', ['nation_hotel_catering_lodging_legal_entities', 'nation_hotel_catering_catering_legal_entities'], 'nd'),
      chart('nation-hospitality-scale', '住宿与餐饮经营规模', ['nation_hotel_catering_room_count', 'nation_hotel_catering_lodging_beds', 'nation_hotel_catering_lodging_catering_floor_area', 'nation_hotel_catering_catering_business_floor_area'], 'nd')
    ]
  },
  LivingStandards: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-income', '居民收入', ['nation_income_total', 'nation_income_urban', 'nation_income_rural'], 'nd', indicatorPieConfig(['nation_income_urban', 'nation_income_rural'])),
      chart('nation-income-urban-rural', '城镇与农村收入分项', ['nation_income_urban', 'nation_income_rural'], 'nd', indicatorPieConfig(['nation_income_urban', 'nation_income_rural'])),
      chart('nation-engel', '总/城镇/农村恩格尔系数', ['nation_engel_total', 'nation_engel_urban', 'nation_engel_rural'], 'nd'),
      chart('nation-gini', '基尼系数', ['nation_gini'], 'nd')
    ]
  },
  TransportationAndTelecommunications: {
    source: createDataSource('nation'),
    charts: [
      chart('nation-freight-volume', '货物运输量(当期值)', [
        'nation_freight_volume_yd_05',
        'nation_freight_volume_yd_09',
        'nation_freight_volume_yd_13',
        'nation_freight_volume_yd_17'
      ], 'yd', indicatorPieConfig([
        'nation_freight_volume_yd_05',
        'nation_freight_volume_yd_09',
        'nation_freight_volume_yd_13',
        'nation_freight_volume_yd_17'
      ], {
        center: ['50%', '190px'],
        radius: '16%'
      })),
      chart('nation-passenger-volume', '旅客运输量(当期值)', [
        'nation_passenger_volume_yd_05',
        'nation_passenger_volume_yd_09',
        'nation_passenger_volume_yd_13',
        'nation_passenger_volume_yd_17'
      ], 'yd', indicatorPieConfig([
        'nation_passenger_volume_yd_05',
        'nation_passenger_volume_yd_09',
        'nation_passenger_volume_yd_13',
        'nation_passenger_volume_yd_17'
      ], {
        center: ['50%', '190px'],
        radius: '16%'
      }))
    ]
  }
};
