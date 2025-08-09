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
      legendTop: '5%',
      gridTop: '25%',
      unit: ''
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
      legendTop: '5%',
      gridTop: '25%',
      unit: ''
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
      legendTop: '5%',
      gridTop: '25%',
      unit: ''
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
      legendTop: '5%',
      gridTop: '25%',
      unit: ''
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
      title: '年末户籍人口(万人)',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0201'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '人口',
      legendTop: '5%',
      gridTop: '25%',
      unit: ''
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
      legendTop: '5%',
      gridTop: '25%',
      unit: ''
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
      legendTop: '5%',
      gridTop: '25%',
      unit: ''
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
      legendTop: '5%',
      gridTop: '25%',
      unit: ''
    },

  ]
};

