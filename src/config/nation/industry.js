export const ForeignTradeCharts = {
  source: {
    localJson: './nation.json',
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A080105', 'A080109'] }]
      }
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A060106', 'A060107'] }]
      }
    },
    {
      id: 'FT-EX',
      title: '中国向各国出口总额(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A060502010H', 'A060502010Y', 'A0605020115', 'A0605020313', 'A060502010C', 'A0605020304', 'A0605020305', 'A060502030A', 'A0605020503'],
      dbCode: 'nd',
      exceptName: '中国向出口总额',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: ['A060502010H', 'A060502010Y', 'A0605020115', 'A0605020313', 'A060502010C', 'A0605020304', 'A0605020305', 'A060502030A', 'A0605020503'],
        }]
      }
    },
    {
      id: 'FT-IM',
      title: '中国从各国进口总额(亿元)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A060503010H', 'A060503010Y', 'A0605030115', 'A0605030313', 'A060503010C', 'A0605030304', 'A0605030305', 'A060503030A', 'A0605030503'],
      dbCode: 'nd',
      exceptName: '中国从进口总额',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: ['A060503010H', 'A060503010Y', 'A0605030115', 'A0605030313', 'A060503010C', 'A0605030304', 'A0605030305', 'A060503030A', 'A0605030503'],
        }]
      }
    }
  ]
};

export const GDPCharts = {
  source: {
    localJson: './nation.json',
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A020103', 'A020104', 'A020105'] }]
      }
    }
  ]
};

export const IndicesCharts = {
  source: {
    localJson: './nation.json',
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

export const RealEstateInvestCharts = {
  source: {
    localJson: './nation.json',
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A060105', 'A06010D'] }]
      }
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A051102', 'A051104'] }]
      }
    }
  ]
};

export const RealEstateSaleCharts = {
  source: {
    localJson: './nation.json',
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A060B03', 'A060B05'] }]
      }
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A060A03', 'A060A05'] }]
      }
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A051502', 'A051503', 'A051504', 'A051505'] }]
      }
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
      pieConfig: {
        enabled: true,
        pies: [{ triggerZbCodes: ['A051602', 'A051603', 'A051604', 'A051605'] }]
      }
    }
  ]
};

export const SocialRetailgoodsCharts = {
  source: {
    localJson: './nation.json',
  },
  charts: [
    {
      id: 'SRG-SRM',
      title: '社会消费品零售总额当期值(亿元)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A070101', 'A07040105', 'A0704010H', 'A0704010L', 'A07040205', 'A07040301', 'A07040401', 'A07040501', 'A07040601', 'A07040701', 'A07040801', 'A07040901', 'A07040A01', 'A07040B01', 'A07040C01', 'A07040D01', 'A07040E01', 'A07040F01'],
      dbCode: 'yd',
      exceptName: '消费类商品零售类值_当期值',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: ['A07040105', 'A0704010H', 'A0704010L', 'A07040205', 'A07040301', 'A07040401', 'A07040501', 'A07040601', 'A07040701', 'A07040801', 'A07040901', 'A07040A01', 'A07040B01', 'A07040C01', 'A07040D01', 'A07040E01', 'A07040F01']
        }]
      }
    },
    {
      id: 'SRG-SRRM',
      title: '社会消费品零售总额同比增长(%)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A070103', 'A07040107', 'A0704010J', 'A0704010N', 'A07040207', 'A07040303', 'A07040403', 'A07040503', 'A07040603', 'A07040703', 'A07040803', 'A07040903', 'A07040A03', 'A07040B03', 'A07040C03', 'A07040D03', 'A07040E03', 'A07040F03'],
      dbCode: 'yd',
      exceptName: '消费类商品零售类值_同比增长',
    },
    {
      id: 'SRG-SRAM',
      title: '社会消费品零售总额累计值(亿元)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A070102', 'A07040106', 'A0704010I', 'A0704010M', 'A07040206', 'A07040302', 'A07040402', 'A07040502', 'A07040602', 'A07040702', 'A07040802', 'A07040902', 'A07040A02', 'A07040B02', 'A07040C02', 'A07040D02', 'A07040E02', 'A07040F02'],
      dbCode: 'yd',
      exceptName: '消费类商品零售类值_累计值',
      pieConfig: {
        enabled: true,
        pies: [{
          triggerZbCodes: ['A07040106', 'A0704010I', 'A0704010M', 'A07040206', 'A07040302', 'A07040402', 'A07040502', 'A07040602', 'A07040702', 'A07040802', 'A07040902', 'A07040A02', 'A07040B02', 'A07040C02', 'A07040D02', 'A07040E02', 'A07040F02']
        }]
      }
    },
    {
      id: 'SRG-SRARM',
      title: '社会消费品零售总额累计增长(%)',
      subtitle: '',
      period: 'monthly',
      chartType: 'bar',
      zbcodeArr: ['A070104', 'A07040108', 'A0704010K', 'A0704010O', 'A07040208', 'A07040304', 'A07040404', 'A07040504', 'A07040604', 'A07040704', 'A07040804', 'A07040904', 'A07040A04', 'A07040B04', 'A07040C04', 'A07040D04', 'A07040E04', 'A07040F04'],
      dbCode: 'yd',
      exceptName: '消费类商品零售类值_累计增长',
    }
  ]
};

export const AccommodationAndCateringIndustryCharts = {
  source: {
    localJson: './nation.json',
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
      zbcodeArr: ['A0J0102', 'A0J0107', 'A0J010F'],
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
    localJson: './nation.json',
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

export const TransportationAndTelecommunicationsCharts = {
  source: {
    localJson: './nation.json',
  },
  charts: [
    {
      id: 'TT-LG',
      title: '运输线路长度(万公里)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0G0201', 'A0G0203', 'A0G0205', 'A0G0209', 'A0G020A', 'A0G020B'],
      dbCode: 'nd',
      exceptName: '里程',
    },
    {
      id: 'TT-CT',
      title: '旅客运输量(万人)',
      subtitle: '',
      period: 'yearly',
      chartType: 'bar',
      zbcodeArr: ['A0G0401', 'A0G0402', 'A0G0406', 'A0G0407', 'A0G0408'],
      dbCode: 'nd',
      exceptName: '客运量',
    },
  ]
};
