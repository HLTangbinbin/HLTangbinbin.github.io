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

function metricChartRef(id, title, metricIds, extra = {}) {
  return {
    id,
    title,
    metricIds,
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

const WH_POPULATION_METRICS = ['city_registered_population', 'city_resident_population'];
const CITY_BUDGET_OVERVIEW_METRICS = [
  'city_budget_income_nd:35aeb374f06c48f1b293917b06ccc27d',
  'city_budget_expenditure_nd:340d5501921e432b865f275363665dc7',
  'city_budget_deficit'
];
const CITY_REAL_ESTATE_INVEST_METRICS = [
  'city_real_estate_dev_investment_nd:bbf7ec6da3054ee1af4fc830ffa15dfd',
  'city_residential_dev_investment_nd:5868f06c7e3e454f88b4798f01c902e8',
  'city_office_dev_investment_nd:2a94954713584f0280055fe2633223b7'
];
const PROVINCE_MEDICAL_METRICS = {
  institution: 'province_hospital_count_nd:c131f882f421408f9c0bf61d968ae561',
  bedPer10k: 'province_bed_count_per_10k_nd:393831aacb9c4f428f2acb470d8c86af',
  bedCount: 'province_bed_count_nd:ab89e8e6902e46c1b36ab2711decba39'
};
const PROVINCE_MARRIAGE_METRICS = [
  'province_marriage_count_nd:0474017afd2642fcb5f74e1bdd6ffbb3',
  'province_first_marriage_count_nd:7ec2dbf6a94d40aab2b7554b1bee11bd',
  'province_divorce_count_nd:57e418060e6649a3844bada609eb2a7b'
];
const PROVINCE_SOCIAL_SECURITY_METRICS = [
  'province_pension_balance_nd:e5644730c4dc4f2c92d0d9c53ac2cbf5',
  'province_medical_insurance_balance_nd:7abcf209e6224eeebdd86cb4d368c7de'
];
const NATION_TOTAL_POPULATION_METRICS = [
  'nation_population_total_nd:806083491dbe46a08995783945a30b9d',
  'nation_population_total_nd:b808a4131bd041c4abc87b52385cd578',
  'nation_population_total_nd:30d59b42875145c696883366172bb3d1',
  'nation_population_total_nd:07e1e3444cd34c43b4fd749f060bba5f',
  'nation_population_total_nd:2dd9894936d448fcb88605863d90d85c'
];
const NATION_POPULATION_AGE_METRICS = [
  'nation_population_age_structure_nd:067f5f3ec585402e9f31037e5f27eb17',
  'nation_population_age_structure_nd:a6051fc22d394d81b2007dc7c7c761fa',
  'nation_population_age_structure_nd:c2627d8e6b5843bfa3372bacdf858804',
  'nation_population_age_structure_nd:0d2db39cd5424f5fbca859052413f4ad',
  'nation_population_age_structure_nd:93c00898dbeb4aff881fa97723901739',
  'nation_population_age_structure_nd:9d77e24ce8c94679937b07188f4e7fbc'
];
const NATION_BUDGET_REVENUE_METRICS = [
  'nation_budget_income_nd:da99cb5e78da41489ec0dc077c1dceff',
  'nation_budget_income_nd:28ddf14044bd4edb851ec68e3ea2ee24',
  'nation_budget_income_nd:1e8d2201d7e44b439c160f38cd6eb8c3'
];
const NATION_BUDGET_EXPENDITURE_METRICS = [
  'nation_budget_expenditure_nd:244b4498c31447d4a48a43b16e65e7ea',
  'nation_budget_expenditure_nd:e6eed1bddd3945b2b2ecc3d358701192',
  'nation_budget_expenditure_nd:42c519a0f77741d2a26fdbe4bc96f3ef'
];
const NATION_BUDGET_DEFICIT_METRICS = [
  'nation_finance_deficit_total',
  'nation_finance_deficit_central',
  'nation_finance_deficit_local'
];
const NATION_BUDGET_INCOME_ITEM_METRICS = [
  'nation_budget_main_income_items_nd:6878278c17814b8cb424867b3c0cf8a0',
  'nation_budget_main_income_items_nd:dd298501e2ff4e6f9d05a27a185dc8e8',
  'nation_budget_main_income_items_nd:04e1ba1dede544698f7da5673c2d04a0',
  'nation_budget_main_income_items_nd:ecf5011a5832489a9459e2ac8c7441a4'
];
const NATION_BUDGET_EXPENDITURE_ITEM_METRICS = [
  'nation_budget_main_expenditure_items_nd:95d720d41c5e4093951e72c4389f4fb4',
  'nation_budget_main_expenditure_items_nd:77edd61f29414b6394b73f5d82d08442',
  'nation_budget_main_expenditure_items_nd:f404ab723b7f4825adbf0eeee9413f6d',
  'nation_budget_main_expenditure_items_nd:dd945af5782a4b9e9c0381b2600a2a3d',
  'nation_budget_main_expenditure_items_nd:a982e05e978447089e65dd73f28ef768',
  'nation_budget_main_expenditure_items_nd:eedbbe37e38842399d77eae80c9c574a',
  'nation_budget_main_expenditure_items_nd:63ef7fda1ce445ca97e812a8f883b9a3',
  'nation_budget_main_expenditure_items_nd:49178bd55add44ef83b6d46ba6355d12',
  'nation_budget_main_expenditure_items_nd:d0a97c5bef354ad0b2c349eb7ae7216a',
  'nation_budget_main_expenditure_items_nd:051ee69d584f418e9af576d5025e56d4',
  'nation_budget_main_expenditure_items_nd:5020c72baa2d40e88f7af3e213624dd8',
  'nation_budget_main_expenditure_items_nd:649ab3bfde6a4adaa2afa519b603e2a4',
  'nation_budget_main_expenditure_items_nd:3be9cb5ab4a8493ab91047f4ffc781cb',
  'nation_budget_main_expenditure_items_nd:8a9127d5440e4934b66c699befb161bd',
  'nation_budget_main_expenditure_items_nd:68fd476365fa41abb31301fdd7136de5',
  'nation_budget_main_expenditure_items_nd:a8fae3ab2d4643f6ad299edb526e4262',
  'nation_budget_main_expenditure_items_nd:6fd381d5994f452a82c20861fc624079'
];
const NATION_SCHOOL_COUNT_METRICS = [
  'nation_school_count_nd:d050b7d822fa4519a84631b8e6491e56',
  'nation_school_count_nd:204e3ad025e44296949d027d0994f224',
  'nation_school_count_nd:c11c73b8c61041688bc0b0c6caa9f402',
  'nation_school_count_nd:3031225a48554c34b6be6c6c67cb54ae',
  'nation_school_count_nd:31f7fa3300964e129534c93ebdb27b54',
  'nation_school_count_nd:4ecc4952511543ec96365617f801c58c',
  'nation_school_count_nd:ef856fcf8e5c4634949f895ca51c0e5e',
  'nation_school_count_nd:ef144502d27a4b7e8bb55c776ca02f50'
];
const NATION_TEACHER_COUNT_METRICS = [
  'nation_teacher_count_nd:8ae214507ab34a5898ce8b321bf07a9b',
  'nation_teacher_count_nd:c3c301aa0d334ed29076e589b93eb74d',
  'nation_teacher_count_nd:4ffef95e7352462eb57c423652c302f3',
  'nation_teacher_count_nd:f1e8369a04ce4794a402d21568767a3e',
  'nation_teacher_count_nd:0ac14953782045a88034409ab7a8fde0',
  'nation_teacher_count_nd:1ce51192c3f04845b1ec50a49ae68de5',
  'nation_teacher_count_nd:db9e304f776a45789d9d230b50937f85',
  'nation_teacher_count_nd:948d9aeef0df4b598732dde268d173fc'
];
const NATION_ENROLLMENT_METRICS = [
  'nation_student_enrollment_nd:320e8d02bd144e78b7c2b317330eeaa7',
  'nation_student_enrollment_nd:ffa67f6d40104ba7b38b4e0ca4ed29c4',
  'nation_student_enrollment_nd:5d1186dfd08844af9c5caf714d03d297',
  'nation_student_enrollment_nd:0873625da3284141a4fd9179c28c72e6',
  'nation_student_enrollment_nd:5aceb409e13045d9b3e4e5023d619998',
  'nation_student_enrollment_nd:2bb48e6b946e404986a9572aaff4c968',
  'nation_student_enrollment_nd:e480d7eeb3914a8291c89f3aed394b8e',
  'nation_student_enrollment_nd:ded9455ec09040659fa0798b899fc58d'
];
const NATION_STUDENTS_METRICS = [
  'nation_students_nd:9bc3158d1625473880850ff91040de24',
  'nation_students_nd:3b57e38ca40f4bca9092f119922b43b3',
  'nation_students_nd:977bc78bde0a4144a729dec62d208481',
  'nation_students_nd:498b7f1263f64afbb317c30361116c6a',
  'nation_students_nd:b86710fff7184d599d2e3bf169eaf23d',
  'nation_students_nd:9c27c39b017f42a18e1c35dc5554302c',
  'nation_students_nd:3114a320f0934db0abd6a9b3dd9bc432',
  'nation_students_nd:201a74d94c0149d587400d779fb0605a'
];
const NATION_GRADUATES_METRICS = [
  'nation_graduates_nd:311631a8642941edb80864738895a588',
  'nation_graduates_nd:19d2395b818345afb277086cf961cc52',
  'nation_graduates_nd:e85b803aa52849ad909202a57a7dd9be',
  'nation_graduates_nd:5ad8292e71864e1b918fb344ed19e801',
  'nation_graduates_nd:2d6f90c3011d49f4ba23a162e841da27',
  'nation_graduates_nd:4d9a96bf2e3d4e21bc55bcd594529eb3',
  'nation_graduates_nd:6a65c69a09914090b91f4027e37db17a',
  'nation_graduates_nd:fb87c9bbe7c44203917e49678f838fbd'
];
const NATION_MEDICAL_COUNT_METRICS = [
  'nation_health_institutions_nd:789787dae3f5401da40983aadcfde804',
  'nation_health_institutions_nd:ecc1c2212e8a4beaa36f503cd602ceea'
];
const NATION_MEDICAL_PER_CAPITA_METRICS = [
  'nation_beds_per_10k_nd:6ebf312939884be7bed111a26a35df87',
  'nation_beds_per_10k_nd:0d532653fd904bbcaafee9a6b00af195'
];
const NATION_MARRIAGE_METRICS = [
  'nation_marriage_nd:5e0866382c3b452c9b7b2e86d3095a78',
  'nation_marriage_nd:c39dfcdb699c423d839d4551ccfa21c8',
  'nation_marriage_nd:f4484230fc8c4d048264f1ea4404795f',
  'nation_marriage_nd:93cab04607d241158bfc2d9375bc8f55',
  'nation_birth_population'
];
const NATION_RETAIL_MONTHLY_METRICS = {
  current: ['nation_retail_sales_yd:1142a3a03e9045959e606a21822641ac'],
  cumulative: ['nation_retail_sales_yd:260a1794443b43dd93a59928b12f38af']
};
const NATION_MONEY_SUPPLY_MONTHLY_GROWTH_METRICS = [
  'nation_money_supply_yd:db7891fb8f3c4eb2a4d71a9955eba8c7',
  'nation_money_supply_yd:640401d3351b4b868dea28f89f410a54',
  'nation_money_supply_yd:e03f2232631f41cd9d754a7d7feb4a81'
];
const NATION_STOCK_MARKET_METRICS = [
  'nation_securities_market_nd:d6c362e7dd5b454c8052b4e1bc2ae827',
  'nation_securities_market_nd:e0ade27d80c34d329682405f1de2196e',
  'nation_securities_market_nd:5810b4ecf0624f809466f0142a9fd93c',
  'nation_securities_market_nd:91e826760a9a428eb244b22c78f8e5f4',
  'nation_securities_market_nd:863c1cd763be4ac1aa37202824a85562',
  'nation_securities_market_nd:b80a17221fb34dd894e9136a3717a6ba'
];
const NATION_BOND_FUND_FUTURES_METRICS = [
  'nation_securities_market_nd:0a9d1acaddc24b7eaa4e934df0bce9c4',
  'nation_securities_market_nd:57046d7f7a1a4f03acbeaa9e43ce89cb',
  'nation_securities_market_nd:5439aaf98b984a32b762761d9c120f5e',
  'nation_securities_market_nd:5aaf020f740c47a282d5918613256112',
  'nation_securities_market_nd:3c35acbb60a34cdf8b990eeb81a1731a',
  'nation_securities_market_nd:f7a238191e9f49e88f0056d1ed84e7a6',
  'nation_securities_market_nd:82c943ef8af547d394064b863c0d4847',
  'nation_securities_market_nd:25f399c6a214401fac5a736ab6612b1e',
  'nation_securities_market_nd:efa10ca36fc642c1bec08025ff68e486'
];
const NATION_EXPORT_BY_COUNTRY_METRICS = [
  'nation_export_by_country_nd:aea84c6b0e2c479a8045d6dce99b9ed1',
  'nation_export_by_country_nd:5614220711e44c7aa2b5920f7b97ae0d',
  'nation_export_by_country_nd:9bd2c853b10443e3b7426144ac4fcb6d',
  'nation_export_by_country_nd:5655eedaf59f423397a6faff984a0165',
  'nation_export_by_country_nd:c76a9dbb03d844e687d85612fbc2eb5c',
  'nation_export_by_country_nd:8a409e836cdf4d5aa4a9b4f8236c7d3f',
  'nation_export_by_country_nd:a1230afa4dd246dbaa7285da907cdc92'
];

export const v3PageRegistry = {
  WHNewHouse: {
    source: createDataSource('wh'),
    charts: [
      chartRef('wh_new_house_yearly_total'),
      chartRef('wh_new_house_monthly_total'),
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
        'wh_second_house_monthly_total'
      ], { dbCode: 'yd' }),
      metricChartRef('wh_second_house_monthly_price', '武汉二手房成交价格', [
        'wh_second_house_monthly_price'
      ], { dbCode: 'yd' }),
      metricChartRef('wh_second_house_market_changes', '武汉二手房市场变化', [
        'wh_second_house_monthly_price_drop_listing_count',
        'wh_second_house_monthly_price_rise_listing_count',
        'wh_second_house_monthly_new_listing_count',
        'wh_second_house_monthly_viewer_count'
      ], { dbCode: 'yd' })
    ]
  },
  WHGDP: {
    source: createDataSource('wh'),
    charts: [chartRef('wh_gdp')]
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
      regionChartRef('city_resident_population', pieFirst()),
      regionChartRef('city_registered_population', pieFirst())
    ]
  },
  CityFinance: {
    source: createDataSource('city', { cityCodeArr: CITY_CODES, needAddCityCodeArr_yd: ADD_CITY_CODES_YD, needAddCityCodeArr_nd: ADD_CITY_CODES_ND }),
    charts: [
      regionChartRef('city_budget_income', pieFirst()),
      regionChartRef('city_budget_expenditure', pieFirst()),
      regionChartRef('city_budget_deficit'),
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
      regionChartRef('province_budget_deficit')
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
    charts: [chartRef('nation_gdp', pieIndexes([2, 3, 4]))]
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
      chartRef('nation_birth_death_growth'),
      chartRef('nation_birth_death_population'),
      metricChartRef('nation_population_age', '年龄结构与抚养比', NATION_POPULATION_AGE_METRICS, {
        dbCode: 'nd',
        ...pieIndexes([0, 1, 2])
      })
    ]
  },
  PopulationSpot: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_pop_sample_age', pieAll({
        topN: 10,
        mergeOthersLabel: '其他年龄段'
      })),
      chartRef('nation_pop_sample_sex_ratio', pieAll({
        topN: 10,
        mergeOthersLabel: '其他年龄段'
      })),
      chartRef('nation_pop_sample_education', pieAll({
        mergeOthersLabel: '其他分组'
      }))
    ]
  },
  NationalFinance: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_budget_monthly_value', '财政收入/支出累计值', [
        'nation_budget_income_yd:d615e8de42114feb9169f027e6c2dcc6',
        'nation_budget_expenditure_yd:cbb9b066b0e84cad93d249388b258a81'
      ], { dbCode: 'yd' }),
      metricChartRef('nation_budget_monthly_growth', '财政收入/支出累计增长', [
        'nation_budget_income_yd:03e60611a6be446099bef411599bceb0',
        'nation_budget_expenditure_yd:8dc84fd764df46a294e54a7662b1a38a'
      ], { dbCode: 'yd' }),
      metricChartRef('nation_budget_income_by_level', '全国、中央、地方财政收入', NATION_BUDGET_REVENUE_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_budget_expenditure_by_level', '全国、中央、地方财政支出', NATION_BUDGET_EXPENDITURE_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_budget_deficit_by_level', '全国、中央、地方财政赤字', NATION_BUDGET_DEFICIT_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_budget_income_items', '全国财政收入各项目', NATION_BUDGET_INCOME_ITEM_METRICS, { dbCode: 'nd' }),
      metricChartRef('nation_budget_expenditure_items', '全国财政支出各项目', NATION_BUDGET_EXPENDITURE_ITEM_METRICS, { dbCode: 'nd' })
    ]
  },
  RealEstateInvest: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_real_estate_investment_total'),
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
      chartRef('nation_new_home_sales_area_total'),
      chartRef('nation_new_home_sales_amount_total'),
      chartRef('nation_new_home_avg_price_total'),
      metricChartRef('nation_residential_sales_value', '商品住宅销售面积、销售额累计值', [
        'nation_residential_sales_area_yd:d324a9c4f1a34dd2b38a85e979a54554',
        'nation_residential_sales_amount_yd:375ffa7283dd458c9a3bcb1f4929537e'
      ], { dbCode: 'yd' }),
      metricChartRef('nation_residential_sales_growth', '商品住宅销售面积、销售额累计增长', [
        'nation_residential_sales_area_yd:206c52536182472aae8e01b52aaeb201',
        'nation_residential_sales_amount_yd:2de1944906984790bc41d58d7c0cb885'
      ], { dbCode: 'yd' })
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
      metricChartRef('nation_healthcare_per_10k', '每万人医院和机构指标', NATION_MEDICAL_PER_CAPITA_METRICS, { dbCode: 'nd' })
    ]
  },
  MarriageStatus: {
    source: createDataSource('nation'),
    charts: [
      metricChartRef('nation_marriage_overview', '结婚/初婚/再婚/离婚/出生人口', NATION_MARRIAGE_METRICS, {
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
      chartRef('nation_retail_sales'),
      metricChartRef('nation_retail_sales_current', '社会消费品总额当期值', NATION_RETAIL_MONTHLY_METRICS.current, { dbCode: 'yd' }),
      metricChartRef('nation_retail_sales_cumulative', '社会消费品总额累计值', NATION_RETAIL_MONTHLY_METRICS.cumulative, { dbCode: 'yd' })
    ]
  },
  FinancialCurrency: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_gold_fx_reserve'),
      chartRef('nation_money_supply_levels'),
      chartRef('nation_money_supply_growth'),
      chartRef('nation_money_supply'),
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
      chartRef('nation_trade_total_monthly', {
        id: 'nation_trade_total_monthly_value',
        title: '进出口当期值/累计值',
        metricDisplayNameIncludes: ['当期值', '累计值']
      }),
      chartRef('nation_trade_total_monthly', {
        id: 'nation_trade_total_monthly_growth',
        title: '进出口同比增长/累计增长',
        metricDisplayNameIncludes: ['同比增长', '累计增长']
      })
    ]
  },
  IndicesData: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_cpi_mom'),
      metricChartRef('nation_ppi_index', '工业出厂价格指数', ['nation_ppi_mom_yd:e64079bae9064aebad1c4c5fe0c8a6ef'], { dbCode: 'yd' }),
      chartRef('nation_pmi')
    ]
  },
  AccommodationAndCateringIndustry: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_hotel_catering_employees'),
      chartRef('nation_hotel_catering_legal_entities'),
      chartRef('nation_hotel_catering_turnover')
    ]
  },
  LivingStandards: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_income', pieAll()),
      chartRef('nation_engel'),
      chartRef('nation_gini')
    ]
  },
  TransportationAndTelecommunications: {
    source: createDataSource('nation'),
    charts: [
      chartRef('nation_freight_volume', {
        id: 'nation_freight_volume_value',
        title: '货物运输量当期值/累计值',
        metricDisplayNameIncludes: ['当期值', '累计值']
      }),
      chartRef('nation_freight_volume', {
        id: 'nation_freight_volume_growth',
        title: '货物运输量同比增长/累计增长',
        metricDisplayNameIncludes: ['同比增长', '累计增长']
      }),
      chartRef('nation_passenger_volume', {
        id: 'nation_passenger_volume_value',
        title: '旅客运输量当期值/累计值',
        metricDisplayNameIncludes: ['当期值', '累计值']
      }),
      chartRef('nation_passenger_volume', {
        id: 'nation_passenger_volume_growth',
        title: '旅客运输量同比增长/累计增长',
        metricDisplayNameIncludes: ['同比增长', '累计增长']
      })
    ]
  }
};
