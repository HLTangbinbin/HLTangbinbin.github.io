// src/config/navConfig.js

export const navConfig = [
  {
    path: '/WH',
    label: '武汉',
    children: [
      { path: 'WHNewHouse', label: '新房' },
      { path: 'WHSecondHandHouse', label: '二手房' },
      { path: 'WHGDP', label: 'GDP' },
      { path: 'WHPopulation', label: '人口' },
      { path: 'WHFinance', label: '财政' },
      {
        path: 'WHRealEstate',
        label: '房地产',
        children: [
          { path: 'WHRealEstateInvest', label: '投资' },
          { path: 'WHRealEstateSell', label: '销售' }
        ]
      },
      { path: 'WHEducation', label: '教育' },
      { path: 'WHMedical', label: '医疗' },
    ]
  },
  {
    path: '/FirstTierCity',
    label: '城市',
    children: [
      { path: 'CityGDP', label: 'GDP' },
      { path: 'CityPopulation', label: '人口' },
      { path: 'CityFinance', label: '财政' },
      {
        path: 'CityRealEstate',
        label: '房地产',
        children: [
          { path: 'CityRealEstateInvest', label: '投资' },
          { path: 'CityRealEstateSell', label: '销售' },
          { path: 'CityRealEstatePriceIndices', label: '指数' }
        ]
      },
      { path: 'CityEducation', label: '教育' },
      { path: 'CityMedical', label: '医疗' }
    ]
  },
  {
    path: '/MajorProvincial',
    label: '省市',
    children: [
      { path: 'ProvincialGDP', label: 'GDP' },
      { path: 'ProvincialPopulation', label: '人口' },
      { path: 'ProvincialFinance', label: '财政' },
      {
        path: 'ProvincialRealEstate',
        label: '房地产',
        children: [
          { path: 'ProvincialRealEstateInvest', label: '投资' },
          { path: 'ProvincialRealEstateSell', label: '销售' }
        ]
      },
      { path: 'ProvincialEducation', label: '教育' },
      { path: 'ProvincialMedical', label: '医疗' },
      { path: 'ProvincialLiving', label: '生活' }
    ]
  },
  {
    path: '/NationWide',
    label: '全国',
    children: [
      { path: 'GrossDomesticProduct', label: 'GDP' },
      {
        path: 'PopulationCorrelation',
        label: '人口',
        children: [
          { path: 'PopulationBasic', label: '普查' },
          { path: 'PopulationSpot', label: '抽样' }
        ]
      },
      { path: 'NationalFinance', label: '财政' },
      {
        path: 'RealEstate',
        label: '房地产',
        children: [
          { path: 'RealEstateInvest', label: '投资' },
          { path: 'RealEstateSell', label: '销售' }
        ]
      },
      {
        path: 'EducationSector',
        label: '教育',
        children: [
          { path: 'EducationSchool', label: '学校' },
          { path: 'EducationTeacher', label: '教师' },
          { path: 'EducationStudent', label: '学生' }
        ]
      },
      { path: 'MedicalTreatment', label: '医疗' },
      { path: 'MarriageStatus', label: '婚姻' },
      { path: 'SocialRetailgoods', label: '社零' },
      {
        path: 'FinancialIndustry',
        label: '金融',
        children: [
          { path: 'FinancialCurrency', label: '货币' },
          { path: 'FinancialSocialFinancing', label: '社融' },
          { path: 'FinancialSecurity', label: '证券' },
          { path: 'FinancialInsurance', label: '保险' }
        ]
      },
      { path: 'ForeignTrade', label: '外贸' },
      { path: 'IndicesData', label: '指数' },
      { path: 'TouristIndustry', label: '旅游' },
      { path: 'AccommodationAndCateringIndustry', label: '餐宿' },
      { path: 'LivingStandards', label: '生活' },
      { path: 'TransportationAndTelecommunications', label: '交通' },
      { path: 'ProvidentFund', label: '公积金' }
    ]
  }
];