import { params_province } from '@/config/apiParams.js';


const PROVINCE_CODES = [
  '110000', '120000',
  '310000', '320000', '330000', '370000',
  '410000', '420000', '430000', '440000',
  '500000', '510000',];

/// 中国大陆 31 个省级行政区完整 code 列表
const ALL_PROVINCE_CODES = [{"code":"110000","cname":"北京市"},{"code":"120000","cname":"天津市"},{"code":"130000","cname":"河北省"},{"code":"140000","cname":"山西省"},{"code":"150000","cname":"内蒙古自治区"},{"code":"210000","cname":"辽宁省"} ,
  {"code":"220000","cname":"吉林省"},{"code":"230000","cname":"黑龙江省"},{"code":"310000","cname":"上海市"},{"code":"320000","cname":"江苏省"},{"code":"330000","cname":"浙江省"},{"code":"340000","cname":"安徽省"} ,
  {"code":"350000","cname":"福建省"},{"code":"360000","cname":"江西省"},{"code":"370000","cname":"山东省"},{"code":"410000","cname":"河南省"},{"code":"420000","cname":"湖北省"},{"code":"430000","cname":"湖南省"} ,
  {"code":"440000","cname":"广东省"},{"code":"450000","cname":"广西壮族自治区"},{"code":"460000","cname":"海南省"},{"code":"500000","cname":"重庆市"},{"code":"510000","cname":"四川省"},{"code":"520000","cname":"贵州省"} ,
  {"code":"530000","cname":"云南省"},{"code":"540000","cname":"西藏自治区"},{"code":"610000","cname":"陕西省"},{"code":"620000","cname":"甘肃省"},{"code":"630000","cname":"青海省"},{"code":"640000","cname":"宁夏回族自治区"},{"code":"650000","cname":"新疆维吾尔自治区"}]

// 🌟 同步计算：过滤出除了核心省份之外的其余省份
export const ADD_PROVINCE_CODES = ALL_PROVINCE_CODES.filter(
  city => !PROVINCE_CODES.includes(city.code)
);

export const ProvincialEducationCharts = {
  source: {
    localJson: `${process.env.VUE_APP_DATA_BASE_URL}/province.json`,
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
     localJson: `${process.env.VUE_APP_DATA_BASE_URL}/province.json`,
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
     localJson: `${process.env.VUE_APP_DATA_BASE_URL}/province.json`,
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
     localJson: `${process.env.VUE_APP_DATA_BASE_URL}/province.json`,
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
     localJson: `${process.env.VUE_APP_DATA_BASE_URL}/province.json`, // ✅ 替换为实际路径
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
     localJson: `${process.env.VUE_APP_DATA_BASE_URL}/province.json`,
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
     localJson: `${process.env.VUE_APP_DATA_BASE_URL}/province.json`,
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
     localJson: `${process.env.VUE_APP_DATA_BASE_URL}/province.json`,
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



