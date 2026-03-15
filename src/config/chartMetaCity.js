import { params_city } from '@/config/apiParams.js';
// 请把原来的 import 替换成这句：
import cityData from '../../public/json/city.json';

// 北京(110000) 上海(310000) 广州(440100) 深圳(440300) 杭州(330100) 成都(510100) 南京(320100)  武汉(420100) 重庆(500000) 天津(120000)
// 长沙(430100)  西安(610100) 郑州(410100) 合肥(340100)

const CITY_CODES = ['110000',  '310000', '440100', '440300', '330100', '510100', '320100', '420100', '500000', '120000', 
   '430100',  '610100', '410100', '340100', ] 

   // 2. 国家统计局标准的 36 个大中城市 (除了核心14城，还剩22个)
const NBS_36_CITIES = [
    '110000', '120000', '130100', '140100', '150100', '210100', '210200', 
    '220100', '230100', '310000', '320100', '330100', '330200', '340100', 
    '350100', '350200', '360100', '370100', '370200', '410100', '420100', 
    '430100', '440100', '440300', '450100', '460100', '500000', '510100', 
    '520100', '530100', '540100', '610100', '620100', '630100', '640100', '650100'
  ];

// 3. 稳妥读取70城的全量数组
const all70Cities = Array.isArray(cityData) ? cityData : (cityData.reg || cityData.default?.reg || []);

// 🌟 4. 分别计算月度池 (70-14=56) 和 年度池 (36-14=22)
export const ADD_CITY_CODES_YD = all70Cities.filter(
  city => !CITY_CODES.includes(city.code)
);

export const ADD_CITY_CODES_ND = all70Cities.filter(
  city => !CITY_CODES.includes(city.code) && NBS_36_CITIES.includes(city.code)
);

export const CityEducationCharts = {

    source: {
        localJson: './json/city.json',
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
        localJson: './json/city.json',
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
        localJson: './json/city.json',
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
        localJson: './json/city.json',
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
        localJson: './json/city.json',
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
        localJson: './json/city.json',
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
        localJson: './json/city.json',
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
        localJson: './json/city.json',
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

