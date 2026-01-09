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

export const WHNewHouseCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
  },
  charts: [
    {
      id: 'HNYV',
      title: '武汉新房年成交量',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0501'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '',

    },
    {
      id: 'HNMV',
      title: '武汉新房月成交量',
      subtitle: '',
      period: 'monthly',
      zbcodeArr: ['A0101'],
      dbCode: 'yd',
      chartType: 'bar',
      exceptName: '',

    },
    {
      id: 'HNYVA',
      title: '武汉各区域二手房月成交量',
      subtitle: '',
      period: 'monthly',
      zbcodeArr: ['A0102','A0103','A0104','A0105','A0106','A0107','A0108','A0109','A010A','A010B','A010C','A010D','A010E','A010F','A010G','A010H'],
      dbCode: 'yd',
      chartType: 'bar',
      exceptName: '',
      legendTop: '70px',
      gridTop: '55%',
      pieConfig: {
        enabled: true,
        pies: [
          {
            triggerZbCodes: ['A0102','A0103','A0104','A0105','A0106','A0107','A0108','A0109','A010A','A010B','A010C','A010D','A010E','A010F','A010G','A010H'],
            radius: '30%',
            center: ['50%', '35%'],
          }
        ]
      }

    }

  ]
};

export const WHSecondHouseCharts = {

  source: {
    localJson: './json/wh.json',
    apiParams: params_wh
  },
  charts: [
    {
      id: 'HSYV',
      title: '武汉二手房年成交量',
      subtitle: '',
      period: 'yearly',
      zbcodeArr: ['A0502'],
      dbCode: 'nd',
      chartType: 'bar',
      exceptName: '二手房数',

    },
    {
      id: 'HSMV',
      title: '武汉二手房月成交量',
      subtitle: '',
      period: 'monthly',
      zbcodeArr: ['A0201'],
      dbCode: 'yd',
      chartType: 'bar',
      exceptName: '二手房数',

    },
    {
      id: 'HSMP',
      title: '武汉二手房月成交价',
      subtitle: '',
      period: 'monthly',
      zbcodeArr: ['A0202'],
      dbCode: 'yd',
      chartType: 'bar',
      exceptName: '二手房',

    },
    {
      id: 'HSMA',
      title: '武汉二手房房源数量',
      subtitle: '',
      period: 'monthly',
      zbcodeArr: ['A0203','A0204','A0205'],
      dbCode: 'yd',
      chartType: 'bar',
      exceptName: '武汉二手房数量',

    },
    {
      id: 'HSMW',
      title: '武汉二手房看房人数',
      subtitle: '',
      period: 'monthly',
      zbcodeArr: ['A0206'],
      dbCode: 'yd',
      chartType: 'bar',
      exceptName: '武汉二手房数量',

    }

  ]
};

