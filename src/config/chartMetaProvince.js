import { params_province } from '@/utils/CommonUtil.js';

export const ProvincialEducationCharts = {
    source: {
        localJson: '/json/province.json', // ✅ 替换为你实际放置的路径
        apiParams: params_province,         // ✅ 替换为你的请求参数
        cityCodeArr: [                               // ✅ 实际为省级行政区 code
            '110000', '120000', '130000', '140000',
            '150000', '210000', '220000', '230000',
            '310000', '320000', '330000', '340000', '350000', '360000', '370000',
            '410000', '420000', '430000', '440000', '450000', '460000',
            '500000', '510000', '520000', '530000', '540000',
            '610000', '620000', '630000', '640000', '650000'
        ]
    },
    charts: [
        {
            id: 'ZS',
            title: '普通高等学校本科招生数(万人)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0M0103'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '30%',
            unit: ''
        },
        {
            id: 'ZX',
            title: '普通高等学校本科在校学生数(万人)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0M0106'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '30%',
            unit: ''
        },
        {
            id: 'BY',
            title: '普通高等学校本科毕业生数(万人)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0M010C'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '30%',
            unit: ''
        }
    ]
};

export const ProvincialFinanceCharts = {
    source: {
        localJson: '/json/province.json',
        apiParams: params_province,
        cityCodeArr: [                               // ✅ 实际为省级行政区 code
            '110000', '120000', '130000', '140000',
            '150000', '210000', '220000', '230000',
            '310000', '320000', '330000', '340000', '350000', '360000', '370000',
            '410000', '420000', '430000', '440000', '450000', '460000',
            '500000', '510000', '520000', '530000', '540000',
            '610000', '620000', '630000', '640000', '650000'
        ]
    },
    charts: [
        {
            id: 'FIY',
            title: '地方财政收入(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A080101'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '30%',
            unit: ''
        },
        {
            id: 'FOY',
            title: '地方财政支出(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A080201'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '30%',
            unit: ''
        }
    ]
};

export const ProvincialGDPCharts = {

    source: {
        localJson: '/json/province.json',
        apiParams: params_province,
        cityCodeArr: [                               // ✅ 实际为省级行政区 code
            '110000', '120000', '130000', '140000',
            '150000', '210000', '220000', '230000',
            '310000', '320000', '330000', '340000', '350000', '360000', '370000',
            '410000', '420000', '430000', '440000', '450000', '460000',
            '500000', '510000', '520000', '530000', '540000',
            '610000', '620000', '630000', '640000', '650000'
        ]
    },
    charts: [
        {
            id: 'GDP',
            title: '各省市GDP(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A020101'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        }

    ]
};

export const ProvincialMedicalCharts = {

    source: {
        localJson: '/json/province.json',
        apiParams: params_province,
        cityCodeArr: [                               // ✅ 实际为省级行政区 code
            '110000', '120000', '130000', '140000',
            '150000', '210000', '220000', '230000',
            '310000', '320000', '330000', '340000', '350000', '360000', '370000',
            '410000', '420000', '430000', '440000', '450000', '460000',
            '500000', '510000', '520000', '530000', '540000',
            '610000', '620000', '630000', '640000', '650000'
        ]
    },
    charts: [
        {
            id: 'HP',
            title: '医院数(个)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0O0102'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        },
        {
            id: 'BP',
            title: '每万人医疗机构床位数(个)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0O0604'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: '',
            max: '100',
            min: '40'
        }

    ]
};

export const ProvincialPopulationCharts = {
  source: {
    localJson: '/json/province.json', // ✅ 替换为实际路径
    apiParams: params_province,         // ✅ 替换为你在 CommonUtil.js 中定义的请求参数
    cityCodeArr: [
      '110000', '120000', '130000', '140000', 
      '150000', '210000', '220000', '230000', 
      '310000', '320000', '330000', '340000', '350000', '360000', '370000', 
      '410000', '420000', '430000', '440000', '450000', '460000',
      '500000', '510000', '520000', '530000', '540000',
      '610000', '620000', '630000', '640000', '650000'
    ]
  },
  charts: [
    {
      id: 'PP',
      title: '年末常住人口(万人)',
      subtitle: '',
      period: 'yearly',
      typeArr: ['A030101'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '人口',
      legendTop: '10%',
      gridTop: '30%',
      unit: ''
    },
    {
      id: 'PRB',
      title: '人口出生率',
      subtitle: '',
      period: 'yearly',
      typeArr: ['A030201'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',
      legendTop: '10%',
      gridTop: '30%',
      unit: ''
    },
    {
      id: 'PRD',
      title: '人口死亡率',
      subtitle: '',
      period: 'yearly',
      typeArr: ['A030202'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',
      legendTop: '10%',
      gridTop: '30%',
      unit: '',
      min: '4'
    },
    {
      id: 'PRI',
      title: '人口自然增长率',
      subtitle: '',
      period: 'yearly',
      typeArr: ['A030203'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',
      legendTop: '10%',
      gridTop: '30%',
      unit: ''
    }
  ]
};

export const ProvincialRealEstateInvestCharts = {

    source: {
        localJson: '/json/province.json',
        apiParams: params_province,
        cityCodeArr: [
            '110000', '120000', '130000', '140000',
            '150000', '210000', '220000', '230000',
            '310000', '320000', '330000', '340000', '350000', '360000', '370000',
            '410000', '420000', '430000', '440000', '450000', '460000',
            '500000', '510000', '520000', '530000', '540000',
            '610000', '620000', '630000', '640000', '650000'
        ]
    },
    charts: [
        {
            id: 'EI',
            title: '住宅商品房开发投资额(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A050D02'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        }

    ]
};

export const ProvincialRealEstateSellCharts = {

    source: {
        localJson: '/json/province.json',
        apiParams: params_province,
        cityCodeArr: [
            '110000', '120000', '130000', '140000',
            '150000', '210000', '220000', '230000',
            '310000', '320000', '330000', '340000', '350000', '360000', '370000',
            '410000', '420000', '430000', '440000', '450000', '460000',
            '500000', '510000', '520000', '530000', '540000',
            '610000', '620000', '630000', '640000', '650000'
        ]
    },
    charts: [
        {
            id: 'ES-SAY',
            title: '住宅商品房销售面积(万平方米)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A050H02'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        },
        {
            id: 'ES-SY',
            title: '住宅商品房平均销售价格(元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A050J02'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        },

    ]
};

export const ProvinceRealEstatePriceIndicesCharts = {

    source: {
        localJson: '/json/province.json',
        apiParams: params_province,
        ProvinceCodeArr: [
            '110000', '310000', '440100', '440300', '330100',
            '510100', '420100', '320100', '500000', '610100',
            '410100', '340100', '430100'
        ]
    },
    charts: [
        {
            id: 'ES-SAY',
            title: '新建商品住宅销售价格指数(上月=100)',
            subtitle: '',
            period: 'monthly',
            typeArr: ['A010804'],
            dbCode: 'yd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: '',
            max: '101',
            min: '98'
        },
        {
            id: 'ES-SY',
            title: '二手房住宅销售价格指数(上月=100)',
            subtitle: '',
            period: 'monthly',
            typeArr: ['A010807'],
            dbCode: 'yd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: '',
            max: '101',
            min: '98'
        },

    ]
};
export const ProvincialLivingCharts = {

    source: {
        localJson: '/json/province.json',
        apiParams: params_province,
        cityCodeArr: [                               // ✅ 实际为省级行政区 code
            '110000', '120000', '130000', '140000',
            '150000', '210000', '220000', '230000',
            '310000', '320000', '330000', '340000', '350000', '360000', '370000',
            '410000', '420000', '430000', '440000', '450000', '460000',
            '500000', '510000', '520000', '530000', '540000',
            '610000', '620000', '630000', '640000', '650000'
        ]
    },
    charts: [
        {
            id: 'FDY',
            title: '居民人均可支配收入(元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0A0101'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        }

    ]
};



