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
const ALL_70_CITIES_CODES = [{"code":"110000","cname":"北京"},{"code":"120000","cname":"天津"},{"code":"130100","cname":"石家庄"},{"code":"130200","cname":"唐山"},{"code":"130300","cname":"秦皇岛"},{"code":"140100","cname":"太原"},{"code":"150100","cname":"呼和浩特"} ,
    {"code":"150200","cname":"包头"},{"code":"210100","cname":"沈阳"},{"code":"210200","cname":"大连"},{"code":"210600","cname":"丹东"},{"code":"210700","cname":"锦州"},{"code":"220100","cname":"长春"},{"code":"220200","cname":"吉林"} ,
    {"code":"230100","cname":"哈尔滨"},{"code":"231000","cname":"牡丹江"},{"code":"310000","cname":"上海"},{"code":"320100","cname":"南京"},{"code":"320200","cname":"无锡"},{"code":"320300","cname":"徐州"},{"code":"321000","cname":"扬州"} ,
    {"code":"330100","cname":"杭州"},{"code":"330200","cname":"宁波"},{"code":"330300","cname":"温州"},{"code":"330700","cname":"金华"},{"code":"340100","cname":"合肥"},{"code":"340300","cname":"蚌埠"},{"code":"340800","cname":"安庆"} ,
    {"code":"350100","cname":"福州"},{"code":"350200","cname":"厦门"},{"code":"350500","cname":"泉州"},{"code":"360100","cname":"南昌"},{"code":"360400","cname":"九江"},{"code":"360700","cname":"赣州"},{"code":"370100","cname":"济南"} ,
    {"code":"370200","cname":"青岛"},{"code":"370600","cname":"烟台"},{"code":"370800","cname":"济宁"},{"code":"410100","cname":"郑州"},{"code":"410300","cname":"洛阳"},{"code":"410400","cname":"平顶山"},{"code":"420100","cname":"武汉"} ,
    {"code":"420500","cname":"宜昌"},{"code":"420600","cname":"襄阳"},{"code":"430100","cname":"长沙"},{"code":"430600","cname":"岳阳"},{"code":"430700","cname":"常德"},{"code":"440100","cname":"广州"},{"code":"440200","cname":"韶关"} ,
    {"code":"440300","cname":"深圳"},{"code":"440800","cname":"湛江"},{"code":"441300","cname":"惠州"},{"code":"450100","cname":"南宁"},{"code":"450300","cname":"桂林"},{"code":"450500","cname":"北海"},{"code":"460100","cname":"海口"} ,
    {"code":"460200","cname":"三亚"},{"code":"500000","cname":"重庆"},{"code":"510100","cname":"成都"},{"code":"510500","cname":"泸州"},{"code":"511300","cname":"南充"},{"code":"520100","cname":"贵阳"},{"code":"520300","cname":"遵义"} ,
    {"code":"530100","cname":"昆明"},{"code":"532900","cname":"大理"},{"code":"540100","cname":"拉萨"},{"code":"610100","cname":"西安"},{"code":"620100","cname":"兰州"},{"code":"630100","cname":"西宁"},{"code":"640100","cname":"银川"},{"code":"650100","cname":"乌鲁木齐"}]

// 这样计算既是同步的（不会报错），又完全不依赖打包时的 city.json
export const ADD_CITY_CODES_YD = ALL_70_CITIES_CODES.filter(
    city => !CITY_CODES.includes(city.code)
);
console.log('当前的月度城市',ADD_CITY_CODES_YD)

export const ADD_CITY_CODES_ND = ALL_70_CITIES_CODES.filter(
    city => !CITY_CODES.includes(city.code) && NBS_36_CITIES.includes(city.code)
);
console.log('当前的年度城市',ADD_CITY_CODES_ND)

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

