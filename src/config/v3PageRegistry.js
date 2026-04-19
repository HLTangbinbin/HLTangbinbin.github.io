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

function chartRef(chartKey, extra = {}) {
  return {
    chartKey,
    chartType: 'line',
    seriesLayout: 'indicator',
    ...extra
  };
}

function regionChartRef(chartKey, extra = {}) {
  return chartRef(chartKey, {
    seriesLayout: 'region',
    ...extra
  });
}

function metricChartRef(id, title, englishKeys, extra = {}) {
  return {
    id,
    title,
    englishKeys,
    chartType: 'line',
    seriesLayout: 'indicator',
    ...extra
  };
}

function pieAll(extra = {}) {
  return {
    pieConfig: {
      enabled: true,
      pies: [
        {
          trigger: 'all-series',
          ...extra
        }
      ]
    }
  };
}

function pieFirst(extra = {}) {
  return {
    pieConfig: {
      enabled: true,
      pies: [
        {
          trigger: 'first-series',
          ...extra
        }
      ]
    }
  };
}

function pieIndexes(triggerMetricIndexes = [], extra = {}) {
  return {
    pieConfig: {
      enabled: true,
      pies: [
        {
          triggerMetricIndexes,
          ...extra
        }
      ]
    }
  };
}

const WH_POPULATION_METRICS = [
  'registered_population_at_year_end',
  'resident_population'
];
const WH_NEW_HOUSE_MONTHLY_DISTRICT_METRICS = [
  'jiang_an_district_new_home_transaction_volume_yd',
  'jiang_han_district_new_home_transaction_volume_yd',
  'qiao_kou_district_new_home_transaction_volume_yd',
  'han_yang_district_new_home_transaction_volume_yd',
  'wu_chang_district_new_home_transaction_volume_yd',
  'qing_shan_district_new_home_transaction_volume_yd',
  'hong_shan_district_new_home_transaction_volume_yd',
  'dong_xi_hu_district_new_home_transaction_volume_yd',
  'han_nan_district_new_home_transaction_volume_yd',
  'cai_dian_district_new_home_transaction_volume_yd',
  'jiang_xia_district_new_home_transaction_volume_yd',
  'huang_pi_district_new_home_transaction_volume_yd',
  'xin_zhou_district_new_home_transaction_volume_yd',
  'east_lake_high_tech_zone_new_home_transaction_volume_yd',
  'economic_development_zone_new_home_transaction_volume_yd',
  'yangtze_river_new_area_new_home_transaction_volume_yd'
];
const CITY_BUDGET_OVERVIEW_METRICS = [
  'local_general_public_budget_revenue_hm_yuan',
  'local_general_public_budget_expenditure_hm_yuan',
  'city_budget_deficit'
];
const CITY_REAL_ESTATE_INVEST_METRICS = [
  'real_estate_development_investment_hm_yuan',
  'real_estate_development_residential_investment_hm_yuan',
  'real_estate_development_office_building_investment_hm_yuan'
];
const PROVINCE_MEDICAL_METRICS = {
  institution: 'hospital_count',
  bedPer10k: 'per_10k_people_medical_institutions_bed_count',
  bedCount: 'medical_and_health_institutions_bed_count_tenk_beds'
};
const NATION_GDP_METRICS = [
  'gross_national_income',
  'gross_domestic_product',
  'value_added_of_primary_industry_hm_yuan',
  'value_added_of_secondary_industry_hm_yuan',
  'value_added_of_tertiary_industry_hm_yuan',
  'per_capita_gross_domestic_product_yuan'
];
const PROVINCE_MARRIAGE_METRICS = [
  'marriage_registrations_tenk_couples',
  'marriage_registrations_first_marriage_registrants_tenk_people',
  'divorce_registrations_tenk_couples'
];
const PROVINCE_SOCIAL_SECURITY_METRICS = [
  'urban_employees_basic_pension_insurance_cumulative_balance',
  'basic_medical_insurance_fund_cumulative_balance'
];
const NATION_TOTAL_POPULATION_METRICS = [
  'nian_mo_total_population_tenk_people_total_nd',
  'male_population_tenk_people',
  'female_population_tenk_people',
  'urban_population_tenk_people',
  'rural_population_tenk_people'
];
const NATION_POPULATION_AGE_STRUCTURE_METRICS = [
  'aged_0_to_14_population_tenk_people',
  'aged_15_to_64_population_tenk_people',
  'aged_65_and_above_population_tenk_people'
];
const NATION_POPULATION_DEPENDENCY_METRICS = [
  'zong_dependency_ratio_percent',
  'shao_er_dependency_ratio_percent',
  'lao_nian_dependency_ratio_percent'
];
const NATION_BIRTH_DEATH_GROWTH_METRICS = [
  'birth_rate',
  'death_rate',
  'natural_population_growth_rate'
];
const NATION_BIRTH_DEATH_POPULATION_METRICS = [
  'birth_population',
  'death_population',
  'zi_ran_zeng_zhang_population'
];
const NATION_POPULATION_SAMPLE_AGE_METRICS = [
  'population_in_population_sample_survey',
  'aged_0_to_4_population_sample',
  'aged_5_to_9_population_sample',
  'aged_10_to_14_population_sample',
  'aged_15_to_19_population_sample',
  'aged_20_to_24_population_sample',
  'aged_25_to_29_population_sample',
  'aged_30_to_34_population_sample',
  'aged_35_to_39_population_sample',
  'aged_40_to_44_population_sample',
  'aged_45_to_49_population_sample',
  'aged_50_to_54_population_sample',
  'aged_55_to_59_population_sample',
  'aged_60_to_64_population_sample',
  'aged_65_to_69_population_sample',
  'aged_75_to_79_population_sample',
  'aged_80_to_84_population_sample',
  'aged_85_to_89_population_sample',
  'aged_90_to_94_population_sample',
  'aged_95_and_above_population_sample'
];
const NATION_POPULATION_SAMPLE_SEX_RATIO_METRICS = [
  'sex_ratio_nv_equals_100_population_sample_survey',
  'aged_0_to_4_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_5_to_9_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_10_to_14_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_15_to_19_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_20_to_24_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_25_to_29_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_30_to_34_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_35_to_39_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_40_to_44_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_45_to_49_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_50_to_54_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_55_to_59_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_60_to_64_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_65_to_69_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_70_to_74_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_75_to_79_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_80_to_84_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_85_to_89_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_90_to_94_sex_ratio_nv_equals_100_population_sample_survey',
  'aged_95_and_above_sex_ratio_nv_equals_100_population_sample_survey'
];
const NATION_POPULATION_SAMPLE_EDUCATION_METRICS = [
  'age_6_plus_population_sample',
  'age_6_plus_male_sample',
  'age_6_plus_female_sample',
  'age_6_plus_never_attended_school_population_sample',
  'age_6_plus_never_attended_school_male_sample',
  'age_6_plus_never_attended_school_female_sample',
  'age_6_plus_primary_school_population_sample',
  'age_6_plus_primary_school_male_sample',
  'age_6_plus_primary_school_female_sample',
  'age_6_plus_junior_high_school_population_sample',
  'age_6_plus_junior_high_school_male_sample',
  'age_6_plus_junior_high_school_female_sample',
  'age_6_plus_high_school_population_sample',
  'age_6_plus_high_school_male_population_sample',
  'age_6_plus_high_school_female_population_sample',
  'age_6_plus_college_and_above_population_sample',
  'age_6_plus_college_and_above_male_sample',
  'age_6_plus_college_and_above_female_sample'
];
const NATION_BUDGET_REVENUE_METRICS = [
  'national_general_public_budget_revenue_hm_yuan_nd',
  'central_general_public_budget_revenue_hm_yuan',
  'local_general_public_budget_revenue_hm_yuan'
];
const NATION_BUDGET_EXPENDITURE_METRICS = [
  'national_general_public_budget_expenditure_hm_yuan_nd',
  'central_general_public_budget_expenditure_hm_yuan',
  'local_general_public_budget_expenditure_hm_yuan'
];
const NATION_BUDGET_DEFICIT_METRICS = [
  'national_general_public_budget_deficit_hm_yuan',
  'central_general_public_budget_deficit_hm_yuan',
  'local_general_public_budget_deficit_hm_yuan'
];
const NATION_BUDGET_INCOME_ITEM_METRICS = [
  'national_general_public_budget_revenue_hm_yuan_budget_items_nd',
  'national_tax_revenue_hm_yuan',
  'national_domestic_value_added_tax_hm_yuan',
  'national_domestic_consumption_tax_hm_yuan',
  'national_qi_ye_income_tax_hm_yuan',
  'national_count_people_income_tax_hm_yuan',
  'national_imported_goods_value_added_tax_consumption_tax_hm_yuan',
  'national_export_goods_vat_and_consumption_tax_rebate',
  'national_vehicle_purchase_tax_hm_yuan',
  'national_stamp_tax_hm_yuan',
  'national_securities_trading_stamp_tax_hm_yuan',
  'national_resource_tax_hm_yuan',
  'national_deed_tax_hm_yuan',
  'national_tobacco_tax_hm_yuan',
  'national_urban_maintenance_construction_tax_hm_yuan',
  'national_property_tax_hm_yuan',
  'national_farmland_occupation_tax_hm_yuan',
  'national_tu_di_value_added_tax_hm_yuan',
  'national_vehicle_vessel_tax_hm_yuan',
  'national_vessel_tonnage_tax',
  'national_urban_land_use_tax',
  'national_business_tax',
  'national_fa_mo_revenue_hm_yuan',
  'national_zhuan_xiang_revenue_hm_yuan',
  'national_non_tax_revenue_hm_yuan',
  'national_qi_ta_revenue_hm_yuan',
  'national_qi_ta_tax_revenue_hm_yuan'
];
const NATION_BUDGET_EXPENDITURE_ITEM_METRICS = [
  'national_general_public_budget_expenditure_hm_yuan_budget_items_nd',
  'fiscal_general_public_services_expenditure_hm_yuan',
  'fiscal_foreign_affairs_expenditure_hm_yuan',
  'fiscal_national_defense_expenditure_hm_yuan',
  'fiscal_armed_police_expenditure_hm_yuan',
  'fiscal_public_security_expenditure_hm_yuan',
  'fiscal_education_expenditure_hm_yuan',
  'fiscal_science_technology_expenditure_hm_yuan',
  'fiscal_healthcare_expenditure_hm_yuan',
  'fiscal_social_security_employment_expenditure_hm_yuan',
  'fiscal_agriculture_forestry_water_affairs_expenditure_hm_yuan',
  'fiscal_transportation_expenditure_hm_yuan',
  'fiscal_urban_rural_community_affairs_expenditure_hm_yuan',
  'fiscal_culture_sports_media_expenditure_hm_yuan',
  'fiscal_environmental_protection_expenditure_hm_yuan',
  'fiscal_foreign_aid_expenditure_hm_yuan',
  'fiscal_vehicle_purchase_tax_expenditure_hm_yuan',
  'national_fiscal_post_earthquake_reconstruction_expenditure',
  'national_fiscal_other_expenditure'
];
const NATION_SCHOOL_COUNT_METRICS = [
  'kindergarten_count',
  'regular_primary_school_count',
  'vocational_secondary_school_count',
  'junior_high_school_count',
  'regular_high_school_count',
  'regular_secondary_school_count',
  'higher_education_institution_count'
];
const NATION_TEACHER_COUNT_METRICS = [
  'preschool_education_full_time_teacher_count',
  'primary_school_stage_full_time_teacher_count',
  'vocational_secondary_school_full_time_teacher_count',
  'junior_secondary_stage_full_time_teacher_count',
  'regular_high_school_full_time_teacher_count',
  'regular_secondary_school_full_time_teacher_count',
  'higher_education_full_time_teacher_count'
];
const NATION_ENROLLMENT_METRICS = [
  'preschool_education_enrollment_count_tenk_people',
  'regular_primary_school_enrollment_count_tenk_people',
  'regular_junior_high_school_enrollment_count_tenk_people',
  'regular_high_school_enrollment_count_tenk_people',
  'junior_college_enrollment_count',
  'regular_undergraduate_enrollment_count',
  'masters_enrollment_count_tenk_people',
  'doctoral_enrollment_count_tenk_people'
];
const NATION_STUDENTS_METRICS = [
  'preschool_education_student_count_tenk_people',
  'regular_primary_school_student_count_tenk_people',
  'regular_junior_high_school_student_count_tenk_people',
  'regular_high_school_student_count_tenk_people',
  'junior_college_student_count',
  'regular_undergraduate_student_count',
  'masters_student_count_tenk_people',
  'doctoral_student_count_tenk_people'
];
const NATION_GRADUATES_METRICS = [
  'preschool_education_graduate_count_tenk_people',
  'regular_primary_school_graduate_count_tenk_people',
  'regular_junior_high_school_graduate_count_tenk_people',
  'regular_high_school_graduate_count_tenk_people',
  'junior_college_graduate_count',
  'regular_undergraduate_graduate_count',
  'masters_graduate_count_tenk_people',
  'doctoral_graduate_count_tenk_people'
];
const NATION_MEDICAL_COUNT_METRICS = [
  'hospital_count',
  'medical_and_health_institutions_count'
];
const NATION_MEDICAL_PER_CAPITA_METRICS = [
  'per_10k_people_have_health_technicians_count_people',
  'per_10k_people_medical_and_health_institutions_bed_count'
];
const NATION_MARRIAGE_METRICS = [
  'marriage_registrations_tenk_couples',
  'marriage_registrations_first_marriage_registrants_tenk_people',
  'marriage_registrations_zai_hun_people_count_tenk_people',
  'divorce_registrations_tenk_couples',
  'birth_population'
];
const NATION_RETAIL_MONTHLY_METRICS = {
  current: ['total_retail_sales_current_value'],
  cumulative: ['total_retail_sales_cum_value']
};
const NATION_MONEY_SUPPLY_MONTHLY_GROWTH_METRICS = [
  'cash_in_circulation_m0_supply_yoy_growth',
  'money_m1_supply_yoy_growth',
  'money_and_quasi_money_m2_supply_yoy_growth'
];
const NATION_MONEY_SUPPLY_MONTHLY_LEVEL_METRICS = [
  'cash_in_circulation_m0_supply_period_end_value',
  'money_m1_supply_period_end_value',
  'money_and_quasi_money_m2_supply_period_end_value'
];
const NATION_MONEY_SUPPLY_LEVEL_METRICS = [
  'cash_in_circulation_m0_supply',
  'money_m1_supply',
  'money_and_quasi_money_m2_supply'
];
const NATION_MONEY_SUPPLY_GROWTH_METRICS = [
  'cash_in_circulation_m0_supply_yoy_growth_rate',
  'money_m1_supply_yoy_growth_rate',
  'money_and_quasi_money_m2_supply_yoy_growth_rate'
];
const NATION_STOCK_MARKET_METRICS = [
  'shanghai_shenzhen_stock_market_stocks_total_share_capital',
  'shanghai_shenzhen_stock_market_circulating_share_capital',
  'shanghai_shenzhen_stock_market_stocks_market_capitalization',
  'shanghai_shenzhen_stock_market_stocks_circulating_market_value',
  'shanghai_shenzhen_stock_market_stocks_transaction_volume',
  'shanghai_shenzhen_stock_market_stocks_transaction_value'
];
const NATION_BOND_FUND_FUTURES_METRICS = [
  'exchange_market_bonds_transaction_value_hm_yuan',
  'exchange_market_bonds_spot_transaction_value_hm_yuan',
  'exchange_market_bonds_repo_transaction_value_hm_yuan',
  'corporate_bonds_issuance_hm_yuan',
  'securities_investment_fund_count',
  'securities_investment_fund_scale',
  'securities_investment_fund_transaction_value',
  'futures_total_transaction_volume_ten_thousand_lots',
  'futures_total_transaction_value_hundred_million_yuan'
];
const NATION_EXPORT_BY_COUNTRY_METRICS = [
  'china_exports_to_united_states_total_ten_thousand_usd',
  'china_exports_to_canada_total_ten_thousand_usd',
  'china_exports_to_united_kingdom_total_ten_thousand_usd',
  'china_exports_to_france_total_ten_thousand_usd',
  'china_exports_to_germany_total_ten_thousand_usd',
  'china_exports_to_russia_total_ten_thousand_usd',
  'china_exports_to_south_korea_total_ten_thousand_usd',
  'china_exports_to_japan_total_ten_thousand_usd',
  'china_exports_to_india_total_ten_thousand_usd'
];
const NATION_IMPORT_BY_COUNTRY_METRICS = [
  'china_imports_from_united_states_total_ten_thousand_usd',
  'china_imports_from_canada_total_ten_thousand_usd',
  'china_imports_from_united_kingdom_total_ten_thousand_usd',
  'china_imports_from_france_total_ten_thousand_usd',
  'china_imports_from_germany_total_ten_thousand_usd',
  'china_imports_from_russia_total_ten_thousand_usd',
  'china_imports_from_south_korea_total_ten_thousand_usd',
  'china_imports_from_japan_total_ten_thousand_usd',
  'china_imports_from_india_total_ten_thousand_usd'
];

export const v3PageRegistry = {
  WHNewHouse: {
    source: createDataSource('wh'),
    charts: [
      chartRef('wh_new_house_yearly_total'),
      chartRef('wh_new_house_monthly_total'),
      metricChartRef('wh_new_house_monthly_by_district', '武汉各区域新房月成交量', WH_NEW_HOUSE_MONTHLY_DISTRICT_METRICS, {
        dbCode: 'yd',
        legendTop: '90px',
        gridTop: '320px',
        ...pieAll({
          topN: 8,
          mergeOthersLabel: '其他区域',
          center: ['50%', '190px'],
          radius: '16%'
        })
      }),
      chartRef('wh_new_house_yearly_by_district', {
        legendTop: '90px',
        gridTop: '320px',
        ...pieAll({
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
      chartRef('wh_second_house_yearly_total'),
      metricChartRef('wh_second_house_monthly_total', '武汉二手房成交量', [
        'second_hand_housing_transaction_volume'
      ], { dbCode: 'yd' }),
      metricChartRef('wh_second_house_monthly_price', '武汉二手房成交价格', [
        'second_hand_housing_transaction_price'
      ], { dbCode: 'yd' }),
      metricChartRef('wh_second_house_market_changes', '武汉二手房市场变化', [
        'second_hand_housing_price_drop_listing_count',
        'second_hand_housing_price_rise_listing_count',
        'second_hand_housing_new_listing_count',
        'second_hand_housing_viewer_count'
      ], { dbCode: 'yd' })
    ]
  },
  WHGDP: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [regionChartRef('city_gdp', { regionCodes: ['420100'] })]
  },
  WHPopulation: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [
      metricChartRef('wh_population', '武汉人口', WH_POPULATION_METRICS, {
        dbCode: 'nd',
        regionCodes: ['420100']
      })
    ]
  },
  WHFinance: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [
      metricChartRef('wh_budget_overview', '公共预算收支', CITY_BUDGET_OVERVIEW_METRICS, {
        dbCode: 'nd',
        regionCodes: ['420100']
      }),
      regionChartRef('city_household_deposit_balance', { regionCodes: ['420100'] })
    ]
  },
  WHRealEstateInvest: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [
      metricChartRef('wh_real_estate_invest', '房地产开发投资', CITY_REAL_ESTATE_INVEST_METRICS, {
        dbCode: 'nd',
        regionCodes: ['420100']
      })
    ]
  },
  WHRealEstateSell: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [
      regionChartRef('city_residential_sales_area', { regionCodes: ['420100'] }),
      regionChartRef('city_residential_avg_price', { regionCodes: ['420100'] })
    ]
  },
  WHEducation: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [regionChartRef('city_college_students', { regionCodes: ['420100'] })]
  },
  WHMedical: {
    source: createDataSource('city', { cityCodeArr: ['420100'] }),
    charts: [regionChartRef('city_hospital_count', { regionCodes: ['420100'] })]
  },

  CityGDP: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [regionChartRef('city_gdp', pieFirst())]
  },
  CityPopulation: {
    source: createDataSource('city', { cityCodeArr: CITY_POPULATION_CODES }),
    charts: [
      regionChartRef('city_registered_population', pieFirst()),
      metricChartRef('city_resident_population', '重点城市常住人口', ['resident_population'], {
        dbCode: 'nd',
        seriesLayout: 'region',
        ...pieFirst()
      })
    ]
  },
  CityFinance: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [
      regionChartRef('city_budget_income', pieFirst()),
      regionChartRef('city_budget_expenditure', pieFirst()),
      metricChartRef('city_budget_deficit_region', '重点城市地方一般公共预算赤字', ['city_budget_deficit'], {
        dbCode: 'nd',
        seriesLayout: 'region'
      }),
      regionChartRef('city_household_deposit_balance', pieFirst())
    ]
  },
  CityRealEstateInvest: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [
      regionChartRef('city_residential_dev_investment', pieFirst())
    ]
  },
  CityRealEstateSell: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [
      regionChartRef('city_residential_sales_area', pieFirst()),
      regionChartRef('city_residential_avg_price')
    ]
  },
  CityRealEstatePriceIndices: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [
      regionChartRef('city_new_house_price_mom'),
      regionChartRef('city_second_hand_house_price_mom')
    ]
  },
  CityConsumption: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [regionChartRef('city_retail_sales', pieFirst())]
  },
  CityEducation: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [regionChartRef('city_college_students', pieFirst())]
  },
  CityMedical: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [regionChartRef('city_hospital_count', pieFirst())]
  },

  ProvincialGDP: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [regionChartRef('province_gdp', pieFirst())]
  },
  ProvincialPopulation: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChartRef('province_total_population', pieFirst()),
      regionChartRef('province_birth_rate'),
      regionChartRef('province_death_rate'),
      regionChartRef('province_natural_growth_rate')
    ]
  },
  ProvincialFinance: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChartRef('province_budget_income', pieFirst()),
      regionChartRef('province_budget_expenditure', pieFirst()),
      metricChartRef('province_budget_deficit_region', '重点省市地方财政一般预算赤字', ['province_budget_deficit'], {
        dbCode: 'nd',
        seriesLayout: 'region'
      })
    ]
  },
  ProvincialRealEstateInvest: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChartRef('province_residential_dev_investment', pieFirst())
    ]
  },
  ProvincialRealEstateSell: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChartRef('province_residential_sales_area', pieFirst()),
      regionChartRef('province_residential_sales_amount', pieFirst()),
      regionChartRef('province_residential_avg_price')
    ]
  },
  ProvincialConsumption: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [regionChartRef('province_retail_sales', pieFirst())]
  },
  ProvincialTransportation: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChartRef('province_traffic_infrastructure', pieFirst()),
      regionChartRef('province_passenger_volume', pieFirst()),
      regionChartRef('province_accident_count', pieFirst())
    ]
  },
  ProvincialEducation: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      regionChartRef('province_college_school_count', pieFirst()),
      regionChartRef('province_college_enrollment', pieFirst()),
      regionChartRef('province_college_students', pieFirst()),
      regionChartRef('province_college_graduates', pieFirst())
    ]
  },
  ProvincialMedical: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      metricChartRef('province_health_institutions', '医疗机构数', [PROVINCE_MEDICAL_METRICS.institution], { dbCode: 'nd', seriesLayout: 'region' }),
      metricChartRef('province_beds_per_10k', '每万人医疗机构床位数', [PROVINCE_MEDICAL_METRICS.bedPer10k], { dbCode: 'nd', seriesLayout: 'region' })
    ]
  },
  ProvincialLiving: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [regionChartRef('province_disposable_income', pieFirst())]
  },
  ProvincialMarriage: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      metricChartRef('province_marriage_count', '结婚登记', [PROVINCE_MARRIAGE_METRICS[0]], { dbCode: 'nd', seriesLayout: 'region' }),
      metricChartRef('province_divorce_count', '离婚登记', [PROVINCE_MARRIAGE_METRICS[2]], { dbCode: 'nd', seriesLayout: 'region' }),
      metricChartRef('province_first_marriage_count', '初婚人数', [PROVINCE_MARRIAGE_METRICS[1]], { dbCode: 'nd', seriesLayout: 'region' })
    ]
  },
  ProvincialSocialSecurity: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [
      metricChartRef('province_pension_balance', '养老保险累计结余', [PROVINCE_SOCIAL_SECURITY_METRICS[0]], { dbCode: 'nd', seriesLayout: 'region' }),
      metricChartRef('province_medical_insurance_balance', '医疗保险累计结余', [PROVINCE_SOCIAL_SECURITY_METRICS[1]], { dbCode: 'nd', seriesLayout: 'region' })
    ]
  },
  ProvincialSafety: {
    source: createDataSource('province', { cityCodeArr: PROVINCE_CODES, needAddCityCodeArr: ADD_PROVINCE_CODES }),
    charts: [regionChartRef('province_accident_count', pieFirst())]
  },

  GrossDomesticProduct: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_gdp_metrics', 'GDP及三次产业', NATION_GDP_METRICS, {
        dbCode: 'nd',
        ...pieIndexes([2, 3, 4])
      })
    ]
  },
  PopulationBasic: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_total_population_combined', '总人口', NATION_TOTAL_POPULATION_METRICS, {
        dbCode: 'nd',
        legendTop: '90px',
        gridTop: '340px',
        pieConfig: {
          enabled: true,
          pies: [
            {
              triggerMetricIndexes: [1, 2],
              center: ['28%', '200px'],
              radius: '16%'
            },
            {
              triggerMetricIndexes: [3, 4],
              center: ['72%', '200px'],
              radius: '16%'
            }
          ]
        }
      }),
      metricChartRef('nation_birth_death_growth_metrics', '出生率/死亡率/自然增长率', NATION_BIRTH_DEATH_GROWTH_METRICS, {
        dbCode: 'nd'
      }),
      metricChartRef('nation_birth_death_population_clean', '出生/死亡/自然增长人口', NATION_BIRTH_DEATH_POPULATION_METRICS, {
        dbCode: 'nd'
      }),
      metricChartRef('nation_population_age_structure', '年龄指标', NATION_POPULATION_AGE_STRUCTURE_METRICS, {
        dbCode: 'nd',
        ...pieIndexes([0, 1, 2])
      }),
      metricChartRef('nation_population_dependency_ratio', '抚养比指标', NATION_POPULATION_DEPENDENCY_METRICS, {
        dbCode: 'nd'
      })
    ]
  },
  PopulationSpot: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_population_sample_age_metrics', '人口数（人口抽样调查）', NATION_POPULATION_SAMPLE_AGE_METRICS, {
        dbCode: 'nd',
        ...pieAll({
          topN: 10,
          mergeOthersLabel: '其他年龄段'
        })
      }),
      metricChartRef('nation_population_sample_sex_ratio_metrics', '性别比（人口抽样调查）', NATION_POPULATION_SAMPLE_SEX_RATIO_METRICS, {
        dbCode: 'nd',
        ...pieAll({
          topN: 10,
          mergeOthersLabel: '其他年龄段'
        })
      }),
      metricChartRef('nation_population_sample_education_metrics', '受教育情况（人口抽样调查）', NATION_POPULATION_SAMPLE_EDUCATION_METRICS, {
        dbCode: 'nd',
        ...pieAll({
          mergeOthersLabel: '其他分组'
        })
      })
    ]
  },
  NationalFinance: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_budget_monthly_value', '财政收入/支出累计值', [
        'fiscal_revenue_cum_value_hm_yuan',
        'fiscal_expenditure_excl_debt_principal_cum_value'
      ], { dbCode: 'yd' }),
      metricChartRef('nation_budget_monthly_growth', '财政收入/支出累计增长', [
        'fiscal_revenue_cum_growth_pct',
        'fiscal_expenditure_excl_debt_principal_cum_growth'
      ], { dbCode: 'yd' }),
      metricChartRef('nation_budget_income_by_level', '全国、中央、地方财政收入', NATION_BUDGET_REVENUE_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_budget_expenditure_by_level', '全国、中央、地方财政支出', NATION_BUDGET_EXPENDITURE_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_budget_deficit_by_level', '全国、中央、地方财政赤字', NATION_BUDGET_DEFICIT_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_budget_income_items', '全国财政收入各项目', NATION_BUDGET_INCOME_ITEM_METRICS, {
        dbCode: 'nd',
        ...pieAll({
          topN: 10,
          mergeOthersLabel: '其他项目'
        })
      }),
      metricChartRef('nation_budget_expenditure_items', '全国财政支出各项目', NATION_BUDGET_EXPENDITURE_ITEM_METRICS, {
        dbCode: 'nd',
        ...pieAll({
          topN: 10,
          mergeOthersLabel: '其他项目'
        })
      })
    ]
  },
  RealEstateInvest: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_real_estate_investment_total', { dbCode: 'nd', viewModes: ['yearly'] }),
      chartRef('nation_real_estate_investment', {
        id: 'nation_real_estate_investment_value',
        title: '房地产投资累计值',
        metricDisplayNameIncludes: ['累计值']
      }),
      chartRef('nation_real_estate_investment', {
        id: 'nation_real_estate_investment_growth',
        title: '房地产投资累计增长',
        metricDisplayNameIncludes: ['累计增长']
      })
    ]
  },
  RealEstateSell: {
    source: createDataSource('nation'),
    charts: [
      chartRef('new_commercial_housing_sales_area', { dbCode: 'nd', viewModes: ['yearly'] }),
      chartRef('new_commercial_housing_sales_amount', { dbCode: 'nd', viewModes: ['yearly'] }),
      chartRef('nation_new_home_avg_price_total', { dbCode: 'nd', viewModes: ['yearly'] }),
      metricChartRef('nation_residential_sales_area_cumulative', '商品住宅销售面积累计值', [
        'residential_housing_sales_area_cum_value_tenk_sqm'
      ], { dbCode: 'yd', viewModes: ['monthly'] }),
      metricChartRef('nation_residential_sales_amount_cumulative', '商品住宅销售额累计值', [
        'residential_housing_sales_amount_cum_value_hm_yuan'
      ], { dbCode: 'yd', viewModes: ['monthly'] }),
      metricChartRef('nation_residential_sales_area_growth', '商品住宅销售面积累计增长', [
        'residential_housing_sales_area_cum_growth_pct'
      ], { dbCode: 'yd', viewModes: ['monthly'] }),
      metricChartRef('nation_residential_sales_amount_growth', '商品住宅销售额累计增长', [
        'residential_housing_sales_amount_cum_growth_pct'
      ], { dbCode: 'yd', viewModes: ['monthly'] })
    ]
  },
  EducationSchool: {
    source: createDataSource('nation'),
    charts: [metricChartRef('nation_school_count', '各级学校数', NATION_SCHOOL_COUNT_METRICS, { dbCode: 'nd' })]
  },
  EducationTeacher: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_teacher_count', '各级学校专任教师数', NATION_TEACHER_COUNT_METRICS, { dbCode: 'nd' }),
      chartRef('nation_student_teacher_ratio')
    ]
  },
  EducationStudent: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_college_enrollment', '各级教育招生数', NATION_ENROLLMENT_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_college_students', '各级教育在校学生数', NATION_STUDENTS_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_college_graduates', '各级教育毕业生数', NATION_GRADUATES_METRICS, { dbCode: 'nd' })
    ]
  },
  MedicalTreatment: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_healthcare_count', '医院和机构数量', NATION_MEDICAL_COUNT_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_healthcare_per_10k', '每万人卫生技术员数和每万人卫生机构床位数', NATION_MEDICAL_PER_CAPITA_METRICS, { dbCode: 'nd' })
    ]
  },
  MarriageStatus: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_marriage_overview', '结离婚人数', NATION_MARRIAGE_METRICS, {
        dbCode: 'nd',
        legendTop: '90px',
        gridTop: '320px',
        pieConfig: {
          enabled: true,
          pies: [
            {
              triggerMetricIndexes: [1, 2],
              center: ['50%', '190px'],
              radius: '16%'
            }
          ]
        }
      })
    ]
  },
  SocialRetailgoods: {
    source: createDataSource('nation'),
    charts: [
      chartRef('total_retail_sales_of_consumer_goods'),
      metricChartRef('nation_retail_sales_current', '社会消费品总额当期值', NATION_RETAIL_MONTHLY_METRICS.current, { dbCode: 'yd' }),
      metricChartRef('nation_retail_sales_cumulative', '社会消费品总额累计值', NATION_RETAIL_MONTHLY_METRICS.cumulative, { dbCode: 'yd' })
    ]
  },
  FinancialCurrency: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_gold_fx_reserve'),
      metricChartRef('nation_money_supply_levels_annual', 'M0 / M1 / M2 供应量', NATION_MONEY_SUPPLY_LEVEL_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_money_supply_growth_annual', 'M0 / M1 / M2 同比增长', NATION_MONEY_SUPPLY_GROWTH_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_money_supply_monthly_levels', 'M0 / M1 / M2 期末值', NATION_MONEY_SUPPLY_MONTHLY_LEVEL_METRICS, { dbCode: 'yd' }),
      metricChartRef('nation_money_supply_monthly_growth', 'M0 / M1 / M2 供应量增长', NATION_MONEY_SUPPLY_MONTHLY_GROWTH_METRICS, { dbCode: 'yd' })
    ]
  },
  FinancialSocialFinancing: {
    source: createDataSource('nation'),
    charts: [chartRef('nation_social_financing')]
  },
  FinancialSecurity: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_stock_market', '股票市场', NATION_STOCK_MARKET_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_bond_fund_futures', '债券基金与期货', NATION_BOND_FUND_FUTURES_METRICS, { dbCode: 'nd' })
    ]
  },
  FinancialInsurance: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_insurance_assets', pieAll()),
      chartRef('nation_insurance_income_claims')
    ]
  },
  ForeignTrade: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_trade_nd'),
      metricChartRef('nation_export_by_country', '中国向各国出口', NATION_EXPORT_BY_COUNTRY_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_import_by_country', '中国从各国进口', NATION_IMPORT_BY_COUNTRY_METRICS, { dbCode: 'nd' }),
      chartRef('nation_trade_total_monthly', {
        id: 'nation_trade_total_monthly_current_value',
        title: '进出口当期值',
        metricDisplayNameIncludes: ['当期值']
      }),
      chartRef('nation_trade_total_monthly', {
        id: 'nation_trade_total_monthly_cumulative_value',
        title: '进出口累计值',
        metricDisplayNameIncludes: ['累计值']
      }),
      chartRef('nation_trade_total_monthly', {
        id: 'nation_trade_total_monthly_yoy_growth',
        title: '进出口同比增长',
        metricDisplayNameIncludes: ['同比增长']
      }),
      chartRef('nation_trade_total_monthly', {
        id: 'nation_trade_total_monthly_cumulative_growth',
        title: '进出口累计增长',
        metricDisplayNameIncludes: ['累计增长']
      })
    ]
  },
  IndicesData: {
    source: createDataSource('nation'),
    charts: [
      chartRef('consumer_price_index_month_over_month'),
      metricChartRef('nation_ppi_index', '工业出厂价格指数', ['gong_ye_sheng_chan_zhe_chu_chang_jia_ge_zhi_count_month_over_month_100'], { dbCode: 'yd' }),
      chartRef('nation_pmi')
    ]
  },
  AccommodationAndCateringIndustry: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_hotel_catering_employees', {
        metricDisplayNameIncludes: ['从业人数']
      }),
      chartRef('nation_hotel_catering_legal_entities', {
        metricDisplayNameIncludes: ['法人企业数']
      }),
      chartRef('nation_hotel_catering_turnover', {
        metricDisplayNameIncludes: ['营业额']
      })
    ]
  },
  LivingStandards: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_income', pieAll()),
      chartRef('nation_engel'),
      chartRef('resident_per_capita_disposable_income_gini_coefficient')
    ]
  },
  TransportationAndTelecommunications: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_freight_volume', {
        id: 'nation_freight_volume_current_value',
        title: '货物运输量当期值',
        metricDisplayNameIncludes: ['当期值']
      }),
      chartRef('nation_freight_volume', {
        id: 'nation_freight_volume_cumulative_value',
        title: '货物运输量累计值',
        metricDisplayNameIncludes: ['累计值']
      }),
      chartRef('nation_passenger_volume', {
        id: 'nation_freight_volume_yoy_growth',
        title: '货物运输量同比增长',
        metricDisplayNameIncludes: ['同比增长']
      }),
      chartRef('nation_passenger_volume', {
        id: 'nation_freight_volume_cumulative_growth',
        title: '货物运输量累计增长',
        metricDisplayNameIncludes: ['累计增长']
      }),
      chartRef('nation_passenger_volume', {
        id: 'nation_passenger_volume_current_value',
        title: '旅客运输量当期值',
        metricDisplayNameIncludes: ['当期值']
      }),
      chartRef('nation_passenger_volume', {
        id: 'nation_passenger_volume_cumulative_value',
        title: '旅客运输量累计值',
        metricDisplayNameIncludes: ['累计值']
      }),
      chartRef('nation_passenger_volume', {
        id: 'nation_passenger_volume_yoy_growth',
        title: '旅客运输量同比增长',
        metricDisplayNameIncludes: ['同比增长']
      }),
      chartRef('nation_passenger_volume', {
        id: 'nation_passenger_volume_cumulative_growth',
        title: '旅客运输量累计增长',
        metricDisplayNameIncludes: ['累计增长']
      })
    ]
  }
};
