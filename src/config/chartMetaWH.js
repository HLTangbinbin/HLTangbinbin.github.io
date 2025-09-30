import { params_wh } from '@/utils/CommonUtil.js';

export const WHEducationCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
  },
  charts: [
    {
      id: 'EC',
      title: '教育(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0801'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',

    }

  ]
};

export const WHFinanceCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
  },
  charts: [
    {
      id: 'FY',
      title: '地方财政(亿元)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0401', 'A0402', 'A0403'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '地方一般公共预算',
      legendTop: '70px',
      gridTop: '45%',
      pieConfig: {
        enabled: true,
        pies: [
          {
            triggerZbCodes: ['A0401','A0402'],  // 收入/支出
            radius: '20%',
            center: ['50%', '30%'],
          }
        ]
      }

    }

  ]
};

export const WHGDPCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
  },
  charts: [
    {
      id: 'GDP',
      title: '武汉市GDP(亿元)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0101', 'A0102', 'A0103', 'A0104'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '增加值',
      legendTop: '70px',
      gridTop: '45%',
      pieConfig: {
        enabled: true,
        pies: [
          {
            triggerZbCodes: ['A0102','A0103', 'A0104'],  // 第一产业、第二产业、第三产业
            radius: '20%',
            center: ['50%', '30%'],
          }
        ]
      }

    }

  ]
};

export const WHMedicalCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
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

export const WHPopulationCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
  },
  charts: [
    {
      id: 'PL',
      title: '武汉市人口(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0201','A0203'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '人口',

    }

  ]
};

export const WHRealEstateInvestCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
  },
  charts: [
    {
      id: 'EI',
      title: '房地产开发投资额(亿元)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0302', 'A0303', 'A0304'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '房地产开发投资额',

    }

  ]
};

export const WHRealEstateSellCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
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

