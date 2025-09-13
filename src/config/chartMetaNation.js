import { params_accommodationAndCatering, params_education,params_financialIndustry,params_foreignTrade,params_gdp,params_indices,params_livingStandards,params_marriage,params_medical,params_nationalFinance
  ,params_population,params_realEstate_invest,params_realEstate_sell,params_socialretailgoods,
  params_touristIndustry} from '@/utils/CommonUtil.js';

export const FinancialIndustryCharts = {

    source: {
        localJson: './json/nation.json',
        apiParams: params_financialIndustry
    },
    charts: [
        {
            id: 'FI-CM',
            title: '货币供应量(万亿)',
            subtitle: '',
            period: 'monthly',
            zbcodeArr: ['A0D0105', 'A0D0103', 'A0D0101'],
            dbCode: 'yd',
            chartType: 'bar',
            exceptName: '供应量_期末值(万亿)',

        },
        {
            id: 'FI-CRM',
            title: '货币供应量同比增长(%)',
            subtitle: '',
            period: 'monthly',
            zbcodeArr: ['A0D0102', 'A0D0104', 'A0D0106'],
            dbCode: 'yd',
            chartType: 'bar',
            exceptName: '供应量_同比增长',

        },
        {
            id: 'FI-CY',
            title: '货币供应量结构',
            subtitle: 'M1: M0+企业存款  M2: M1+企业定期+居民存款',
            period: 'yearly',
            zbcodeArr: ['A0L0303', 'A0L0302', 'A0L0301'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '供应量(万亿)',
            legendTop: '100px',
            gridTop: '170px',
            
        },
        {
            id: 'FI-FC',
            title: '黄金与外汇储备(亿美元)',
            subtitle: '',
            period: 'yearly',
            zbcodeArr: ['A0L0401', 'A0L0402'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',

        }
    ]
};

export const EducationSectorCharts = {
  source: {
    localJson: './json/nation.json', // ✅ 根据实际路径调整
    apiParams: params_education // ✅ 替换为你的API参数对象
  },
  charts: [
    {
      id: 'ES-ZS', // 招生数
      title: '招生数(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: [
        'A0M020119', // 学前招生
        'A0M020111', // 小学招生
        'A0M02010U', // 初中招生
        'A0M02010I', // 高中招生
        'A0M020105', // 本专科招生
        'A0M020102'  // 研究生招生
      ],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '招生数',

    },
    {
      id: 'ES-ZX', // 在校学生数
      title: '在校学生数(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: [
        'A0M02021A', // 学前在校
        'A0M020212', // 小学在校
        'A0M02020V', // 初中在校
        'A0M02020J', // 高中在校
        'A0M020205', // 本专科在校
        'A0M020202'  // 研究生在校
      ],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '在校学生数',

    },
    {
      id: 'ES-BY', // 毕业生数
      title: '毕业生数(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: [
        'A0M02031A', // 学前毕业
        'A0M020312', // 小学毕业
        'A0M02030V', // 初中毕业
        'A0M02030J', // 高中毕业
        'A0M020305', // 本专科毕业
        'A0M020302'  // 研究生毕业
      ],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '毕业生数',

    }
  ]
};


export const ForeignTradeCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_foreignTrade
  },
  charts: [
    {
      id: 'FT-IEM',
      title: '货物进出口总额(百万美元)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A080101', 'A080105', 'A080109', 'A08010D'],
      dbCode: 'yd',
      exceptName: '_当期值',

    },
    {
      id: 'FT-IERM',
      title: '货物进出口增长(%)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A080102', 'A080104', 'A080106', 'A080108', 'A08010A', 'A08010C'],
      dbCode: 'yd',
      exceptName: '总值增长',

    },
    {
      id: 'FT-IEY',
      title: '货物进出口总额(百万美元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A060105', 'A060106', 'A060107', 'A060108'],
      dbCode: 'nd',
      exceptName: '(百万美元)',

    },
    {
      id: 'FT-EX',
      title: '中国向各国出口总额(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: [
        'A060502010H', 'A060502010Y', 'A0605020115', 'A0605020313',
        'A060502010C', 'A0605020304', 'A0605020305', 'A060502030A', 'A0605020503'
      ],
      dbCode: 'nd',
      exceptName: '中国向出口总额',

    },
    {
      id: 'FT-IM',
      title: '中国从各国进口总额(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: [
        'A060503010H', 'A060503010Y', 'A0605030115', 'A0605030313',
        'A060503010C', 'A0605030304', 'A0605030305', 'A060503030A', 'A0605030503'
      ],
      dbCode: 'nd',
      exceptName: '中国从进口总额',

    }
  ]
};


export const GDPCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_gdp
  },
  charts: [
    {
      id: 'GDP-GH',
      title: '国民经济核算(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A020102', 'A020103', 'A020104', 'A020105'],
      dbCode: 'nd',
      exceptName: '增加值',

    }
  ]
};


export const IndicesCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_indices
  },
  charts: [
    {
      id: 'ID-PI',
      title: '价格指数',
      subtitle: 'CPI:消费者物价指数 PPI:生产者物价指数 ',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A01010G01', 'A01030G01', 'A01080101', 'A01080701'],
      dbCode: 'yd',
      exceptName: '价格指数',
      legendTop: '100px',
      gridTop: '170px',
    },
    {
      id: 'ID-PM',
      title: '采购经理指数',
      subtitle: 'PMI略大于50,经济前进 PMI略小于50,经济衰退',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A0B0101', 'A0B0201', 'A0B0301'],
      dbCode: 'yd',
      exceptName: '采购经理指数商务活动产出',
      legendTop: '100px',
      gridTop: '170px',
    }
  ]
};


export const LivingStandardsCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_livingStandards
  },
  charts: [
    {
      id: 'LS-IC',
      title: '人均收入数据(万元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: [
        'A0A0101', // 居民人均可支配收入
        'A0A0103', // 中位数
        'A0A0201', // 城镇居民
        'A0A0203', // 城镇中位数
        'A0A0301', // 农村居民
        'A0A0303'  // 农村中位数
      ],
      dbCode: 'nd',
      exceptName: '居民可支配收入',

    },
    {
      id: 'LS-EC',
      title: '恩格尔系数',
      subtitle:
        '大于60%贫穷 50%~60%温饱 40%~50%小康\n' +
        '30%~40%富裕 20%~30%富足 20%以下极其富裕',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0A0H01', 'A0A0H02', 'A0A0H03'],
      dbCode: 'nd',
      exceptName: '恩格尔系数',
      legendTop: '100px',
      gridTop: '170px',

    },
    {
      id: 'LS-GC',
      title: '基尼系数',
      subtitle:
        '0.2~0.29-差距小 ' +
        '0.3~0.39-差距适中 \n' +
        '0.4~0.59-差距大 ' +
        '0.6以上-差距悬殊' ,
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0A0G01'],
      dbCode: 'nd',
      exceptName: '基尼系数',
      legendTop: '100px',
      gridTop: '170px',
    }
  ]
};


export const MarriageCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_marriage
  },
  charts: [
    {
      id: 'MR-MA',
      title: '结离婚登记人数(万对)',
      subtitle: '出生人口向前平移1年，实际为下一年数据',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: [
        'A0P0C01',  // 结婚登记
        'A0P0C06',  // 离婚登记
        'A030109'   // 出生人口
      ],
      dbCode: 'nd',
      exceptName: '居民登记',
      legendTop: '100px',
      gridTop: '170px',  
      enableBirthOffset: true,
      enableBirthPrediction: true

    }
  ]
};


export const MedicalCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_medical
  },
  charts: [
    {
      id: 'MD-AG',
      title: '医疗卫生机构数(个)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0O0101', 'A0O0102', 'A0O0106'],
      dbCode: 'nd',
      exceptName: '卫生机构数',

    },
    {
      id: 'MD-OF',
      title: '医疗卫生人员数(万人)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0O0201', 'A0O0202', 'A0O0204', 'A0O0205'],
      dbCode: 'nd',
      exceptName: '数',

    },
    {
      id: 'MD-BD',
      title: '医疗卫生机构床位数(万张)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0O0501', 'A0O0502', 'A0O0506'],
      dbCode: 'nd',
      exceptName: '卫生机构床位数',

    }
  ]
};


export const NationalFinanceCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_nationalFinance
  },
  charts: [
    {
      id: 'NF-FM',
      title: '国家财政收支累计值(亿元)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A0C0102', 'A0C0202'],
      dbCode: 'yd',
      exceptName: '国家财政(不含债务还本)_累计值',

    },
    {
      id: 'NF-FRM',
      title: '国家财政收支累计增长(%)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A0C0103', 'A0C0203'],
      dbCode: 'yd',
      exceptName: '国家财政(不含债务还本)_累计增长',

    },
    {
      id: 'NF-FY',
      title: '中央与地方财政收支(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A080201', 'A080202', 'A080203', 'A080301', 'A080302', 'A080303', 'A080206', 'A080207', 'A080208'],
      dbCode: 'nd',
      exceptName: '财政',

    },
    {
      id: 'NF-FR',
      title: '国家财政主要收入项目(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: [
        'A08040102', 'A08040103', 'A08040104', 'A08040108',
        'A08040109', 'A0804010G', 'A0804010K', 'A0804010S'
      ],
      dbCode: 'nd',
      exceptName: '国家财政收入',

    },
    {
      id: 'NF-FE',
      title: '国家财政主要支出项目(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: [
        'A08050102', 'A08050105', 'A08050106', 'A08050108',
        'A08050109', 'A0805010B', 'A0805010C', 'A0805010G'
      ],
      dbCode: 'nd',
      exceptName: '国家财政支出',

    }
  ]
};


export const PopulationCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_population
  },
  charts: [
    {
      id: 'PO-PL',
      title: '人口数据(万人)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: [
        'A030101', 'A030102', 'A030103', 'A030104', 'A030105',
        'A030302', 'A030303', 'A030304'
      ],
      dbCode: 'nd',
      exceptName: '人口',

    },
    {
      id: 'PO-PB',
      title: '出生与死亡人口数据(万人)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A030109', 'A030110', 'A03010A'],
      dbCode: 'nd',
      exceptName: '人口',

    },
    {
      id: 'PO-PR',
      title: '人口率',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A030201', 'A030202', 'A030203'],
      dbCode: 'nd',
      exceptName: '人口',
      unit: '(%)'
    },
    {
      id: 'PO-DC',
      title: '人口抚养比',
      subtitle:
        '每100名劳动年龄人口负担多少名非劳动年龄人口',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A030305', 'A030306', 'A030307'],
      dbCode: 'nd',
      exceptName: '', 
      legendTop: '100px',
      gridTop: '170px',  
      unit: '(%)'
    }
  ]
};

export const RealEstateInvestCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_realEstate_invest
  },
  charts: [
    {
      id: 'REI-IM',
      title: '房地产投资累计值(亿元)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A060101', 'A060105', 'A06010D', 'A06010R'],
      dbCode: 'yd',
      exceptName: '房地产投资_累计值',

    },
    {
      id: 'REI-IRM',
      title: '房地产投资累计增长',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A060102', 'A060106', 'A06010E'],
      dbCode: 'yd',
      exceptName: '房地产投资_累计增长',

    },
    {
      id: 'REI-IY',
      title: '房地产开发投资额(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A051102', 'A051104'],
      dbCode: 'nd',
      exceptName: '房地产开发投资额',

    }
  ]
};



export const RealEstateSaleCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_realEstate_sell
  },
  charts: [
    {
      id: 'RES-SM',
      title: '商品住宅销售额累计值(亿元)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A060B01', 'A060B03', 'A060B05'],
      dbCode: 'yd',
      exceptName: '商品住宅销售额_累计值',

    },
    {
      id: 'RES-SRM',
      title: '商品住宅销售额累计增长',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A060B02', 'A060B04', 'A060B06'],
      dbCode: 'yd',
      exceptName: '商品住宅销售额_累计增长',

    },
    {
      id: 'RES-SAM',
      title: '商品住宅销售面积累计值(万平方米)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A060A01', 'A060A03', 'A060A05'],
      dbCode: 'yd',
      exceptName: '商品住宅销售面积_累计值',

    },
    {
      id: 'RES-SARM',
      title: '商品住宅销售面积累计增长',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A060A02', 'A060A04', 'A060A06'],
      dbCode: 'yd',
      exceptName: '商品住宅销售面积_累计增长',

    },
    {
      id: 'RES-SAY',
      title: '商品房销售面积(万平方米)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A051501', 'A051502', 'A051503', 'A051504', 'A051505'],
      dbCode: 'nd',
      exceptName: '商品房销售面积',

    },
    {
      id: 'RES-SY',
      title: '商品房销售额(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A051601', 'A051602', 'A051603', 'A051604', 'A051605'],
      dbCode: 'nd',
      exceptName: '商品房销售额',

    }
  ]
};



export const SocialRetailgoodsCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_socialretailgoods
  },
  charts: [
    {
      id: 'SRG-SRM',
      title: '社会消费品零售总额当期值(亿元)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: [
        'A070101', 'A07040105', 'A0704010H', 'A0704010L',
        'A07040205', 'A07040301', 'A07040401', 'A07040501',
        'A07040601', 'A07040701', 'A07040801', 'A07040901',
        'A07040A01', 'A07040B01', 'A07040C01', 'A07040D01',
        'A07040E01', 'A07040F01'
      ],
      dbCode: 'yd',
      exceptName: '消费类商品零售类值_当期值',

    },
    {
      id: 'SRG-SRRM',
      title: '社会消费品零售总额同比增长(%)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: [
        'A070103', 'A07040107', 'A0704010J', 'A0704010N',
        'A07040207', 'A07040303', 'A07040403', 'A07040503',
        'A07040603', 'A07040703', 'A07040803', 'A07040903',
        'A07040A03', 'A07040B03', 'A07040C03', 'A07040D03',
        'A07040E03', 'A07040F03'
      ],
      dbCode: 'yd',
      exceptName: '消费类商品零售类值_同比增长',

    },
    {
      id: 'SRG-SRAM',
      title: '社会消费品零售总额累计值(亿元)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: [
        'A070102', 'A07040106', 'A0704010I', 'A0704010M',
        'A07040206', 'A07040302', 'A07040402', 'A07040502',
        'A07040602', 'A07040702', 'A07040802', 'A07040902',
        'A07040A02', 'A07040B02', 'A07040C02', 'A07040D02',
        'A07040E02', 'A07040F02'
      ],
      dbCode: 'yd',
      exceptName: '消费类商品零售类值_累计值',

    },
    {
      id: 'SRG-SRARM',
      title: '社会消费品零售总额累计增长(%)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: [
        'A070104', 'A07040108', 'A0704010K', 'A0704010O',
        'A07040208', 'A07040304', 'A07040404', 'A07040504',
        'A07040604', 'A07040704', 'A07040804', 'A07040904',
        'A07040A04', 'A07040B04', 'A07040C04', 'A07040D04',
        'A07040E04', 'A07040F04'
      ],
      dbCode: 'yd',
      exceptName: '消费类商品零售类值_累计增长',

    }
  ]
};


export const AccommodationAndCateringIndustryCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_accommodationAndCatering
  },
  charts: [
    {
      id: 'ACI-IC',
      title: '住宿和餐饮业营业额(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0J0103', 'A0J0108', 'A0J010G'],
      dbCode: 'nd',
      exceptName: '营业额',

    },
    {
      id: 'ACI-PL',
      title: '住宿和餐饮业年末从业人数(人)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0J0102','A0J0107', 'A0J010F',],
      dbCode: 'nd',
      exceptName: '年末从业人数',

    },
    {
      id: 'ACI-NE',
      title: '住宿和餐饮业法人企业数(个)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0J0101', 'A0J0106', 'A0J010E'],
      dbCode: 'nd',
      exceptName: '法人企业数',

    }
  ]
};

export const TouristIndustryCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_touristIndustry
  },
  charts: [
    {
      id: 'TI-PL',
      title: '游客数(万人次)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0K0103', 'A0K0108', 'A0K010A'],
      dbCode: 'nd',
      exceptName: '',

    },
    {
      id: 'TI-CT',
      title: '旅游花费(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0K010C'],
      dbCode: 'nd',
      exceptName: '旅游总花费',

    }
  ]
};