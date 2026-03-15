import { params_province } from '@/config/apiParams.js';
import provinceData from '../../public/json/province.json';

const PROVINCE_CODES = [
    '110000', '120000', 
    '310000', '320000', '330000', '370000',
    '410000', '420000', '430000', '440000', 
    '500000', '510000',];
    
    // 🌟 2. 防御性读取：获取 JSON 中的全量省份数组
    const allProvinces = Array.isArray(provinceData) 
      ? provinceData 
      : (provinceData.reg || provinceData.default?.reg || []);
    
    // 🌟 3. 自动计算：过滤出除了核心省份之外的其余省份 (约 25 个)
    export const ADD_PROVINCE_CODES = allProvinces.filter(
      prov => !PROVINCE_CODES.includes(prov.code)
    );

export const ProvincialEducationCharts = {
    source: {
        localJson: './json/province.json', // ✅ 替换为你实际放置的路径
        apiParams: params_province,         // ✅ 替换为你的请求参数
        cityCodeArr: PROVINCE_CODES,
        needAddCityCodeArr: ADD_PROVINCE_CODES
    },
    charts: [
        {
            id: 'ZS',
            title: '普通高等学校本科招生数(万人)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0M0103'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            pieConfig: {
              enabled: true,
              pies: [
                {
                  triggerZbCodes: ['A0M0103'],
                }
              ]
            }

        },
        {
            id: 'ZX',
            title: '普通高等学校本科在校学生数(万人)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0M0106'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            pieConfig: {
              enabled: true,
              pies: [
                {
                  triggerZbCodes: ['A0M0106'],
                }
              ]
            }

        },
        {
            id: 'BY',
            title: '普通高等学校本科毕业生数(万人)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0M010C'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            pieConfig: {
              enabled: true,
              pies: [
                {
                  triggerZbCodes: ['A0M010C'],
                }
              ]
            }

        }
    ]
};

export const ProvincialFinanceCharts = {
    source: {
        localJson: './json/province.json',
        apiParams: params_province,
        cityCodeArr: PROVINCE_CODES,
        needAddCityCodeArr: ADD_PROVINCE_CODES
    },
    charts: [
        {
            id: 'FIY',
            title: '地方财政收入(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A080101'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            pieConfig: {
              enabled: true,
              pies: [
                {
                  triggerZbCodes: ['A080101'],
                }
              ]
            }

        },
        {
            id: 'FOY',
            title: '地方财政支出(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A080201'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            pieConfig: {
              enabled: true,
              pies: [
                {
                  triggerZbCodes: ['A080201'],
                }
              ]
            }

        },
        {
            id: 'FDT',
            title: '地方财政赤字(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A080301'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        }
    ]
};

export const ProvincialGDPCharts = {

    source: {
        localJson: './json/province.json',
        apiParams: params_province,
        cityCodeArr: PROVINCE_CODES,
        needAddCityCodeArr: ADD_PROVINCE_CODES
    },
    charts: [
        {
            id: 'GDP',
            title: '各省市GDP(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A020101'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            pieConfig: {
              enabled: true,
              pies: [
                {
                  triggerZbCodes: ['A020101'],
                }
              ]
            }
        }

    ]
};

export const ProvincialMedicalCharts = {

    source: {
        localJson: './json/province.json',
        apiParams: params_province,
        cityCodeArr: PROVINCE_CODES,
        needAddCityCodeArr: ADD_PROVINCE_CODES
    },
    charts: [
        {
            id: 'HP',
            title: '医院数(个)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0O0102'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        },
        {
            id: 'BP',
            title: '每万人医疗机构床位数(个)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0O0604'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
        }

    ]
};

export const ProvincialPopulationCharts = {
  source: {
    localJson: './json/province.json', // ✅ 替换为实际路径
    apiParams: params_province,         // ✅ 替换为你在 CommonUtil.js 中定义的请求参数
        cityCodeArr: PROVINCE_CODES,
        needAddCityCodeArr: ADD_PROVINCE_CODES
  },
  charts: [
    {
      id: 'PP',
      title: '年末常住人口(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A030101'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '人口',
      pieConfig: {
        enabled: true,
        pies: [
          {
            triggerZbCodes: ['A030101'],
          }
        ]
      }
    },
    {
      id: 'PRB',
      title: '人口出生率',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A030201'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',
      unit: ''
    },
    {
      id: 'PRD',
      title: '人口死亡率',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A030202'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',
      unit: '',
    },
    {
      id: 'PRI',
      title: '人口自然增长率',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A030203'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',
      unit: ''
    }
  ]
};

export const ProvincialRealEstateInvestCharts = {

    source: {
        localJson: './json/province.json',
        apiParams: params_province,
        cityCodeArr: PROVINCE_CODES,
        needAddCityCodeArr: ADD_PROVINCE_CODES
    },
    charts: [
        {
            id: 'EI',
            title: '住宅商品房开发投资额(亿元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A050D02'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            pieConfig: {
              enabled: true,
              pies: [
                {
                  triggerZbCodes: ['A050D02'],
                }
              ]
            }

        }

    ]
};

export const ProvincialRealEstateSellCharts = {

    source: {
        localJson: './json/province.json',
        apiParams: params_province,
        cityCodeArr: PROVINCE_CODES,
        needAddCityCodeArr: ADD_PROVINCE_CODES
    },
    charts: [
        {
            id: 'ES-SAY',
            title: '住宅商品房销售面积(万平方米)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A050H02'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            pieConfig: {
              enabled: true,
              pies: [
                {
                  triggerZbCodes: ['A050H02'],
                }
              ]
            }

        },
        {
            id: 'ES-SY',
            title: '住宅商品房平均销售价格(元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A050J02'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        },

    ]
};


export const ProvincialLivingCharts = {

    source: {
        localJson: './json/province.json',
        apiParams: params_province,
        cityCodeArr: PROVINCE_CODES
    },
    charts: [
        {
            id: 'FDY',
            title: '居民人均可支配收入(元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0A0101'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        }

    ]
};



