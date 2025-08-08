import { params_city } from '@/utils/CommonUtil.js';

export const CityEducationCharts = {

    source: {
        localJson: './json/city.json',
        apiParams: params_city,
        cityCodeArr: ['110000', '310000', '440100', '440300', '330100', '510100', '420100', '320100', '500000', '610100', '410100', '340100', '430100'],
    },
    charts: [
        {
            id: 'EC',
            title: '普通本专科在校学生数(万人)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0801'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '5%',
            gridTop: '25%',
            unit: ''
        }

    ]
};

export const CityFinanceCityCharts = {
    source: {
        localJson: './json/city.json',
        apiParams: params_city,
        cityCodeArr: [
            '110000', '310000', '440100', '440300', '330100',
            '510100', '420100', '320100', '500000', '610100',
            '410100', '340100', '430100'
        ]
    },
    charts: [
        {
            id: 'FIY',
            title: '地方财政收入(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0401'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '5%',
            gridTop: '30%',
            unit: ''
        },
        {
            id: 'FOY',
            title: '地方财政支出(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0402'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '5%',
            gridTop: '30%',
            unit: ''
        },
        {
            id: 'FDY',
            title: '住户存款余额(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0403'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '5%',
            gridTop: '30%',
            unit: ''
        }
    ]
};

export const CityGDPCharts = {

    source: {
        localJson: './json/city.json',
        apiParams: params_city,
        cityCodeArr: [
            '110000', '310000', '440100', '440300', '330100',
            '510100', '420100', '320100', '500000', '610100',
            '410100', '340100', '430100'
        ]
    },
    charts: [
        {
            id: 'GDP',
            title: '一线城市GDP(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0101'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '增加值',
            legendTop: '5%',
            gridTop: '25%',
            unit: ''
        }

    ]
};

export const CityMedicalCharts = {

    source: {
        localJson: './json/city.json',
        apiParams: params_city,
        cityCodeArr: [
            '110000', '310000', '440100', '440300', '330100',
            '510100', '420100', '320100', '500000', '610100',
            '410100', '340100', '430100'
        ]
    },
    charts: [
        {
            id: 'MC',
            title: '医院数(个)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0802'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '5%',
            gridTop: '25%',
            unit: ''
        }

    ]
};

export const CityPopulationCharts = {

    source: {
        localJson: './json/city.json',
        apiParams: params_city,
        cityCodeArr: [
            '110000', '310000', '440100', '440300', '330100',
            '510100', '420100', '320100', '500000', '610100',
            '410100', '340100', '430100'
        ]
    },
    charts: [
        {
            id: 'PL',
            title: '年末户籍人口(万人)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0201'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '人口',
            legendTop: '5%',
            gridTop: '25%',
            unit: ''
        }

    ]
};

export const CityRealEstateInvestCharts = {

    source: {
        localJson: './json/city.json',
        apiParams: params_city,
        cityCodeArr: [
            '110000', '310000', '440100', '440300', '330100',
            '510100', '420100', '320100', '500000', '610100',
            '410100', '340100', '430100'
        ]
    },
    charts: [
        {
            id: 'EI',
            title: '房地产开发投资额(亿元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0303'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '5%',
            gridTop: '25%',
            unit: ''
        }

    ]
};

export const CityRealEstateSellCharts = {

    source: {
        localJson: './json/city.json',
        apiParams: params_city,
        cityCodeArr: [
            '110000', '310000', '440100', '440300', '330100',
            '510100', '420100', '320100', '500000', '610100',
            '410100', '340100', '430100'
        ]
    },
    charts: [
        {
            id: 'ES-SAY',
            title: '住宅商品房销售面积(万平方米)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A030A'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '商品房销售面积(万平方米)',
            legendTop: '5%',
            gridTop: '25%',
            unit: ''
        },
        {
            id: 'ES-SY',
            title: '住宅商品房平均销售价格(元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A030C'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '商品房平均销售价格(元)',
            legendTop: '5%',
            gridTop: '25%',
            unit: ''
        },

    ]
};

export const CityRealEstatePriceIndicesCharts = {

    source: {
        localJson: './json/city.json',
        apiParams: params_city,
        cityCodeArr: [
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
            legendTop: '5%',
            gridTop: '25%',
            unit: '',
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
            legendTop: '5%',
            gridTop: '25%',
            unit: '',
        },

    ]
};

