import { params_financialIndustry, params_nationalFinance } from '@/config/apiParams.js';

export const FinancialCurrencyCharts = {
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

export const FinancialSocialFinancingCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_financialIndustry
  },
  charts: [
    {
      id: 'FI-SF',
      title: '社会融资规模(亿元)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0L0801'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',
    }
  ]
};

export const FinancialSecurityCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_financialIndustry
  },
  charts: [
    {
      id: 'FI-SCS',
      title: '股票数据(亿) ',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0L0904', 'A0L0905', 'A0L0906', 'A0L0907', 'A0L0908', 'A0L0909'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '股票',
    },
    {
      id: 'FI-SCO',
      title: '债券基金数据(亿) ',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0L090J', 'A0L090O', 'A0L090Q'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '成交金额',
    }
  ]
};

export const FinancialInsuranceCharts = {
  source: {
    localJson: './json/nation.json',
    apiParams: params_financialIndustry
  },
  charts: [
    {
      id: 'FI-ISA',
      title: '保险业资产(亿元) ',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0L0F01', 'A0L0F02', 'A0L0F03', 'A0L0F04', 'A0L0F05', 'A0L0F06'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '公司资产',
    },
    {
      id: 'FI-ISF',
      title: '保费收入与支出(亿) ',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0L0H01', 'A0L0H02', 'A0L0H03', 'A0L0H04', 'A0L0H05', 'A0L0H06'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '保险保费',
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A0C0102', 'A0C0202'] }]
      }
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
      pieConfig: {
        enabled: true,
        pies: [
          { triggerZbCodes: ['A080202', 'A080203'], center: ['35%', '25%'] },
          { triggerZbCodes: ['A080302', 'A080303'], center: ['65%', '25%'] }
        ]
      }
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
      legendTop: '50px',
      gridTop: '40%',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: [
            'A08040102', 'A08040103', 'A08040104', 'A08040108',
            'A08040109', 'A0804010G', 'A0804010K', 'A0804010S'
          ],
          radius: '20%',
          center: ['50%', '25%'],
        }]
      }
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
      legendTop: '50px',
      gridTop: '40%',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: [
            'A08050102', 'A08050105', 'A08050106', 'A08050108',
            'A08050109', 'A0805010B', 'A0805010C', 'A0805010G'
          ],
          radius: '20%',
          center: ['50%', '25%'],
        }]
      }
    }
  ]
};
