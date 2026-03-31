import { params_livingStandards, params_marriage, params_medical, params_population } from '@/config/apiParams.js';

const AGE_CODES = [
  'A03060102', 'A03060103', 'A03060104', 'A03060105',
  'A03060106', 'A03060107', 'A03060108', 'A03060109',
  'A0306010A', 'A0306010B', 'A0306010C', 'A0306010D',
  'A0306010E', 'A0306010F', 'A0306010G', 'A0306010H',
  'A0306010I', 'A0306010J', 'A0306010K', 'A0306010L',
];

const AGE_SEX_CODES = [
  'A03060402', 'A03060403', 'A03060404', 'A03060405',
  'A03060406', 'A03060407', 'A03060408', 'A03060409',
  'A0306040A', 'A0306040B', 'A0306040C', 'A0306040D',
  'A0306040E', 'A0306040F', 'A0306040G', 'A0306040H',
  'A0306040I', 'A0306040J', 'A0306040K', 'A0306040L',
];

const EDUCTOR_CODES = [
  'A03060904', 'A03060907', 'A0306090A', 'A0306090D', 'A0306090G',
];

export const LivingStandardsCharts = {
  source: {
    localJson: './nation.json',
    apiParams: params_livingStandards
  },
  charts: [
    {
      id: 'LS-IC',
      title: '人均收入数据(万元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0A0101', 'A0A0103', 'A0A0201', 'A0A0203', 'A0A0301', 'A0A0303'],
      dbCode: 'nd',
      exceptName: '居民可支配收入',
    },
    {
      id: 'LS-EC',
      title: '恩格尔系数',
      subtitle: '大于60%贫穷 50%~60%温饱 40%~50%小康\n30%~40%富裕 20%~30%富足 20%以下极其富裕',
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
      subtitle: '0.2~0.29-差距小 0.3~0.39-差距适中 \n0.4~0.59-差距大 0.6以上-差距悬殊',
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
    localJson: './nation.json',
    apiParams: params_marriage
  },
  charts: [
    {
      id: 'MR-MA',
      title: '结离婚登记人数(万对)',
      subtitle: '出生人口向前平移1年，实际为下一年数据',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0P0C01', 'A0P0C06', 'A030109'],
      dbCode: 'nd',
      exceptName: '居民登记',
      enableBirthOffset: true,
      enableBirthPrediction: true,
      legendTop: '90px',
      gridTop: '320px',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: ['A0P0C01', 'A0P0C06'],
          center: ['50%', '220px'],
        }]
      }
    }
  ]
};

export const MedicalCharts = {
  source: {
    localJson: './nation.json',
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

export const PopulationBasicCharts = {
  source: {
    localJson: './nation.json',
    apiParams: params_population
  },
  charts: [
    {
      id: 'PO-PL',
      title: '人口数据(万人)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A030101', 'A030102', 'A030103', 'A030104', 'A030105', 'A030302', 'A030303', 'A030304'],
      dbCode: 'nd',
      exceptName: '人口',
      pieConfig: {
        enabled: true,
        pies: [
          { triggerZbCodes: ['A030102', 'A030103'], radius: '20%', center: ['20%', '25%'] },
          { triggerZbCodes: ['A030104', 'A030105'], radius: '20%', center: ['50%', '25%'] },
          { triggerZbCodes: ['A030302', 'A030303', 'A030304'], radius: '20%', center: ['80%', '25%'] }
        ]
      }
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
      subtitle: '每100名劳动年龄人口负担多少名非劳动年龄人口',
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

export const PopulationSpotCharts = {
  source: {
    localJson: './nation.json',
    apiParams: params_population
  },
  charts: [
    {
      id: 'PO-SC-AA',
      title: '按年龄分人口数(抽样调查)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: AGE_CODES,
      dbCode: 'nd',
      exceptName: '人口数(人口抽样调查)',
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: AGE_CODES }]
      }
    },
    {
      id: 'PO-SC-AS',
      title: '按年龄分性别比(抽样调查)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: AGE_SEX_CODES,
      dbCode: 'nd',
      exceptName: '性别比(女=100)(人口抽样调查)',
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: AGE_SEX_CODES }]
      }
    },
    {
      id: 'PO-SC-EP',
      title: '按受教育程度分人口数(抽样调查)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: EDUCTOR_CODES,
      dbCode: 'nd',
      exceptName: '6岁及6岁以上及以上人口数(人口抽样调查)',
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: EDUCTOR_CODES }]
      }
    },
  ]
};
