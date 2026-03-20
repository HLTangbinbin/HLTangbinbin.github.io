import { params_city } from '@/config/apiParams.js';


// ==========================================
// 北京(110000) 上海(310000) 广州(440100) 深圳(440300) 杭州(330100) 成都(510100) 南京(320100)  武汉(420100) 重庆(500000) 天津(120000)
// 长沙(430100)  西安(610100) 郑州(410100) 合肥(340100)

export const CITY_CODES = ['110000', '310000', '440100', '440300', '330100', '510100', '320100', '420100', '500000', '120000', '430100', '610100', '410100', '340100']; 

// 国家统计局标准的 36 个大中城市
export const NBS_36_CITIES = [
    '110000', '120000', '130100', '140100', '150100', '210100', '210200', 
    '220100', '230100', '310000', '320100', '330100', '330200', '340100', 
    '350100', '350200', '360100', '370100', '370200', '410100', '420100', 
    '430100', '440100', '440300', '450100', '460100', '500000', '510100', 
    '520100', '530100', '540100', '610100', '620100', '630100', '640100', '650100'
];

// ⚠️ 架构师优化：
// 国家统计局 70 个大中城市完整 code 列表
const ALL_70_CITIES_CODES = [
    '110000', '120000', '130100', '130200', '130300', '140100', '150100', '150200', '210100', '210200', 
    '210600', '210700', '220100', '220200', '230100', '231000', '310000', '320100', '320200', '320300', 
    '321000', '330100', '330200', '330300', '330700', '340100', '340300', '340800', '350100', '350200', 
    '350500', '360100', '360400', '360700', '370100', '370200', '370600', '370800', '410100', '410300', 
    '410400', '420100', '420500', '420600', '430100', '430600', '430700', '440100', '440200', '440300', 
    '440800', '441300', '450100', '450300', '450500', '460100', '460200', '500000', '510100', '510500', 
    '511300', '520100', '520300', '530100', '532900', '540100', '610100', '620100', '630100', '640100', 
    '650100'
];

// 这样计算既是同步的（不会报错），又完全不依赖打包时的 city.json
export const ADD_CITY_CODES_YD = ALL_70_CITIES_CODES.filter(
  code => !CITY_CODES.includes(code)
);

export const ADD_CITY_CODES_ND = ALL_70_CITIES_CODES.filter(
  code => !CITY_CODES.includes(code) && NBS_36_CITIES.includes(code)
);

export const CityEducationCharts = {

    source: {
        localJson: `${process.env.VUE_APP_DATA_BASE_URL}/city.json`,
        apiParams: params_city,
        cityCodeArr: CITY_CODES,
        needAddCityCodeArr_yd: ADD_CITY_CODES_YD, // 组件在看月度图表时会自动用这个 (56城)
        needAddCityCodeArr_nd: ADD_CITY_CODES_ND  // 组件在看年度图表时会自动用这个 (22城)
    },
    charts: [
        {
            id: 'EC',
            title: '普通本专科在校学生数(万人)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0801'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        }

    ]
};

export const CityFinanceCityCharts = {
    source: {
        localJson: `${process.env.VUE_APP_DATA_BASE_URL}/city.json`,
        apiParams: params_city,
        cityCodeArr: CITY_CODES,
        needAddCityCodeArr_yd: ADD_CITY_CODES_YD, // 组件在看月度图表时会自动用这个 (56城)
        needAddCityCodeArr_nd: ADD_CITY_CODES_ND  // 组件在看年度图表时会自动用这个 (22城)
    },
    charts: [
        {
            id: 'FIY',
            title: '地方财政收入(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0401'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        },
        {
            id: 'FOY',
            title: '地方财政支出(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0402'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        },
        {
            id: 'FDT',
            title: '地方财政赤字(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0404'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        },
        {
            id: 'FDY',
            title: '住户存款余额(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0403'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        }
    ]
};

export const CityGDPCharts = {

    source: {
        localJson: `${process.env.VUE_APP_DATA_BASE_URL}/city.json`,
        apiParams: params_city,
        cityCodeArr: CITY_CODES,
        needAddCityCodeArr_yd: ADD_CITY_CODES_YD, // 组件在看月度图表时会自动用这个 (56城)
        needAddCityCodeArr_nd: ADD_CITY_CODES_ND  // 组件在看年度图表时会自动用这个 (22城)
    },
    charts: [
        {
            id: 'GDP',
            title: '一线城市GDP(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0101'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '增加值',

        }

    ]
};

export const CityMedicalCharts = {

    source: {
        localJson: `${process.env.VUE_APP_DATA_BASE_URL}/city.json`,
        apiParams: params_city,
        cityCodeArr: CITY_CODES,
        needAddCityCodeArr_yd: ADD_CITY_CODES_YD, // 组件在看月度图表时会自动用这个 (56城)
        needAddCityCodeArr_nd: ADD_CITY_CODES_ND  // 组件在看年度图表时会自动用这个 (22城)
    },
    charts: [
        {
            id: 'MC',
            title: '医院数(个)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0802'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        }

    ]
};

export const CityPopulationCharts = {

    source: {
        localJson: `${process.env.VUE_APP_DATA_BASE_URL}/city.json`,
        apiParams: params_city,
        // 人口是手动维护的，一些核心城市就可以了
        cityCodeArr: [
            '110000', '310000', '440100', '440300', '330100',
            '510100', '420100', '320100', '500000', '610100',
            '410100', '340100', '430100'
        ]
    },
    charts: [
        {
            id: 'PLA',
            title: '常住人口(万人)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0203'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '人口',

        },
        {
            id: 'PL',
            title: '年末户籍人口(万人)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0201'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '人口',

        }

    ]
};

export const CityRealEstateInvestCharts = {

    source: {
        localJson: `${process.env.VUE_APP_DATA_BASE_URL}/city.json`,
        apiParams: params_city,
        cityCodeArr: CITY_CODES,
        needAddCityCodeArr_yd: ADD_CITY_CODES_YD, // 组件在看月度图表时会自动用这个 (56城)
        needAddCityCodeArr_nd: ADD_CITY_CODES_ND  // 组件在看年度图表时会自动用这个 (22城)
    },
    charts: [
        {
            id: 'EI',
            title: '房地产开发投资额(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0303'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        }

    ]
};

export const CityRealEstateSellCharts = {

    source: {
        localJson: `${process.env.VUE_APP_DATA_BASE_URL}/city.json`,
        apiParams: params_city,
        cityCodeArr: CITY_CODES,
        needAddCityCodeArr_yd: ADD_CITY_CODES_YD, // 组件在看月度图表时会自动用这个 (56城)
        needAddCityCodeArr_nd: ADD_CITY_CODES_ND  // 组件在看年度图表时会自动用这个 (22城)
    },
    charts: [
        {
            id: 'ES-SAY',
            title: '住宅商品房销售面积(万平方米)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A030A'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '商品房销售面积(万平方米)',

        },
        {
            id: 'ES-SY',
            title: '住宅商品房平均销售价格(元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A030C'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '商品房平均销售价格(元)',

        },

    ]
};

export const CityRealEstatePriceIndicesCharts = {

    source: {
        localJson: `${process.env.VUE_APP_DATA_BASE_URL}/city.json`,
        apiParams: params_city,
        cityCodeArr: CITY_CODES,
        needAddCityCodeArr_yd: ADD_CITY_CODES_YD, // 组件在看月度图表时会自动用这个 (56城)
        needAddCityCodeArr_nd: ADD_CITY_CODES_ND  // 组件在看年度图表时会自动用这个 (22城)
    },
    charts: [
        {
            id: 'ES-SAY',
            title: '新建商品住宅销售价格指数(上月=100)',
            subtitle: '',
            period: 'monthly',
            zbcodeArr: ['A010804'],
            dbCode: 'yd',
            chartType: 'bar',
            exceptName: '',
        },
        {
            id: 'ES-SY',
            title: '二手房住宅销售价格指数(上月=100)',
            subtitle: '',
            period: 'monthly',
            zbcodeArr: ['A010807'],
            dbCode: 'yd',
            chartType: 'bar',
            exceptName: '',
        },

    ]
};

