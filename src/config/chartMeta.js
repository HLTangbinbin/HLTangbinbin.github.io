import { params_education,params_financialIndustry} from '@/utils/CommonUtil.js';

export const FinancialIndustryCharts = {

    source: {
        localJson: '/json/nation.json',
        apiParams: params_financialIndustry
    },
    charts: [
        {
            id: 'CM',
            title: '货币供应量(万亿)',
            subtitle: '',
            period: 'monthly',
            typeArr: ['A0D0105', 'A0D0103', 'A0D0101'],
            dbCode: 'yd',
            chartType: 'bar',
            exceptName: '供应量_期末值(万亿)',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        },
        {
            id: 'CRM',
            title: '货币供应量同比增长(%)',
            subtitle: '',
            period: 'monthly',
            typeArr: ['A0D0102', 'A0D0104', 'A0D0106'],
            dbCode: 'yd',
            chartType: 'bar',
            exceptName: '供应量_同比增长',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        },
        {
            id: 'CY',
            title: '货币供应量结构',
            subtitle: 'M0: 流通中的现金；M1: M0+企业活期存款；M2: M1+企业单位定期+居民存款',
            period: 'yearly',
            typeArr: ['A0L0303', 'A0L0302', 'A0L0301'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '供应量(万亿)',
            legendTop: '20%',
            gridTop: '35%',
            unit: ''
        },
        {
            id: 'FC',
            title: '黄金与外汇储备(亿美元)',
            subtitle: '',
            period: 'yearly',
            typeArr: ['A0L0401', 'A0L0402'],
            dbCode: 'nd',
            chartType: 'bar',
            exceptName: '',
            legendTop: '10%',
            gridTop: '25%',
            unit: ''
        }
    ]
};

export const EducationSectorCharts = {
  source: {
    localJson: '/json/nation.json', // ✅ 根据实际路径调整
    apiParams: params_education // ✅ 替换为你的API参数对象
  },
  charts: [
    {
      id: 'ZS', // 招生数
      title: '招生数(万人)',
      subtitle: '',
      period: 'yearly',
      typeArr: [
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
      legendTop: '10%',
      gridTop: '25%',
      unit: ''
    },
    {
      id: 'ZX', // 在校学生数
      title: '在校学生数(万人)',
      subtitle: '',
      period: 'yearly',
      typeArr: [
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
      legendTop: '10%',
      gridTop: '25%',
      unit: ''
    },
    {
      id: 'BY', // 毕业生数
      title: '毕业生数(万人)',
      subtitle: '',
      period: 'yearly',
      typeArr: [
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
      legendTop: '10%',
      gridTop: '25%',
      unit: ''
    }
  ]
};