import axios from 'axios';
import { logger } from '@/utils/Logger.js';
// 🌟 核心技巧：一键重导出所有接口参数，完美向后兼容，不破坏现有任何引用！
export * from '@/config/apiParams.js';

export function sortYearMonths(date1, date2) {
  function compareYearMonth(a, b) {
    a = a.replace('-', '');
    b = b.replace('-', '');
    var aYear = parseInt(a.substring(0, 4));
    var aMonth = parseInt(a.substring(4));
    var bYear = parseInt(b.substring(0, 4));
    var bMonth = parseInt(b.substring(4));
    if (aYear !== bYear) return aYear - bYear;
    return aMonth - bMonth;
  }
  return compareYearMonth(date1, date2);
}

export function selectDataFromArr(returndata, zbCode, dbCode = 'nd', cityCode = '', yearLimit = 10) {
  const codeItem = returndata.data[dbCode]?.[zbCode];
  if (!codeItem || !Array.isArray(codeItem.data)) return [];

  let dataArr = [...codeItem.data];

  if (cityCode) {
    dataArr = dataArr.filter(d => d.cityCode === cityCode);
  }

  dataArr.sort((a, b) => {
    const dateA = a.date?.replace('-', '');
    const dateB = b.date?.replace('-', '');
    return Number(dateA) - Number(dateB);
  });

  if (yearLimit && dataArr.length > yearLimit) {
    dataArr = dataArr.slice(-yearLimit);
<<<<<<< HEAD

=======
>>>>>>> 24ce2a9 (重构核心图表数据处理功能)
  }

  let lastNonZeroIndex = dataArr.length - 1;
  for (let i = dataArr.length - 1; i >= 0; i--) {
    if (dataArr[i].value !== '' && dataArr[i].value !== 0) {
      lastNonZeroIndex = i;
      break;
    }
  }
  dataArr = dataArr.slice(0, lastNonZeroIndex + 1);

  return dataArr.map(d => {
    const val = Number(d.value);
<<<<<<< HEAD
    let formattedValue;

    if (Number.isInteger(val)) {
      formattedValue = val;
    } else {
      const decimalPlaces = Math.abs(val) >= 1 ? 2 : 3;
      formattedValue = Number(val.toFixed(decimalPlaces));
    }

    return {
      value: formattedValue,
      date: d.date
    };
=======
    let formattedValue = Number.isInteger(val) ? val : Number(val.toFixed(Math.abs(val) >= 1 ? 2 : 3));
    return { value: formattedValue, date: d.date };
>>>>>>> 24ce2a9 (重构核心图表数据处理功能)
  });
}

const offsetArray = (arr, yearLimit, offset) => {
  if (!Array.isArray(arr)) return arr;
  if (offset < 0) {
    const absOffset = Math.min(-offset, arr.length);
    return [...arr.slice(absOffset), ...Array(absOffset).fill(null)];
  } else if (offset > 0) {
    const totalLength = yearLimit + offset;
    const paddedArr = [...Array(Math.max(0, totalLength - arr.length)).fill(null), ...arr];
    return paddedArr.slice(0, yearLimit);
  }
  return arr;
};

// 🌟 修复点：移除了未使用的 z 参数
function fitMarriageBirthDynamic(marriageArr, birthArr, recentYears) {
  const n = marriageArr.length;
  if (!Array.isArray(marriageArr) || !Array.isArray(birthArr) || n !== birthArr.length || n <= 1) {
    return { slidingPreds: [], nextYearPred: { pred: null } };
  }

  const windowSize = Math.min(recentYears, n - 1);
  const slidingPreds = [];

  for (let t = 1; t < n; t++) {
    const start = Math.max(0, t - windowSize);
    const X = marriageArr.slice(start, t);
    const Y = birthArr.slice(start + 1, t + 1);

    if (X.length === 0 || Y.length === 0) continue;

    const meanX = X.reduce((a, b) => a + b, 0) / X.length;
    const meanY = Y.reduce((a, b) => a + b, 0) / Y.length;

    let num = 0, den = 0;
    for (let i = 0; i < X.length; i++) {
      num += (X[i] - meanX) * (Y[i] - meanY);
      den += (X[i] - meanX) ** 2;
    }
    const w = den === 0 ? 0 : num / den;
    const intercept = meanY - w * meanX;
    const predValue = intercept + w * marriageArr[t];
    
    slidingPreds.push({ pred: Math.round(predValue) });
  }

  let nextYearPred = { pred: null };
  const startLast = Math.max(0, n - windowSize - 1);
  const Xlast = marriageArr.slice(startLast, n - 1);
  const Ylast = birthArr.slice(startLast + 1, n);

  if (Xlast.length > 0 && Ylast.length > 0) {
    const meanXlast = Xlast.reduce((a, b) => a + b, 0) / Xlast.length;
    const meanYlast = Ylast.reduce((a, b) => a + b, 0) / Ylast.length;

    let num = 0, den = 0;
    for (let i = 0; i < Xlast.length; i++) {
      num += (Xlast[i] - meanXlast) * (Ylast[i] - meanYlast);
      den += (Xlast[i] - meanXlast) ** 2;
    }

    const wLast = den === 0 ? 0 : num / den;
    const interceptLast = meanYlast - wLast * meanXlast;

    if (Xlast.length < 2 || Ylast.length < 2) {
<<<<<<< HEAD
      // 数据太少，退化使用上一年婚姻 × 平均生育率
      const k = Xlast.length === 1 ? Ylast[0] / Xlast[0] : 1;
      nextYearPred = {
        yearIndex: n,
        pred: Math.round(marriageArr[n - 1] * k),
        lower: null,
        upper: null
      };
    } else {
      nextYearPred = {
        yearIndex: n,
        pred: Math.round(interceptLast + wLast * marriageArr[n - 1]),
        lower: Math.round(interceptLast + wLast * marriageArr[n - 1] - z * stdLast),
        upper: Math.round(interceptLast + wLast * marriageArr[n - 1] + z * stdLast)
      };
=======
      const k = Xlast.length === 1 ? Ylast[0] / Xlast[0] : 1; 
      nextYearPred = { pred: Math.round(marriageArr[n - 1] * k) };
    } else {
      nextYearPred = { pred: Math.round(interceptLast + wLast * marriageArr[n - 1]) };
>>>>>>> 24ce2a9 (重构核心图表数据处理功能)
    }
  }

  return { slidingPreds, nextYearPred };
}

// ============================
// 🌟 纯粹的图表数据组装流水线
// ============================

export function getCommonChartOption(params) {
  const startTime = performance.now();

  // 1. 构建基础 Series 数据（清洗、整合、偏移）
  let { seriesData, filteredYears, marriageArr, birthArr } = buildBaseSeries(params);

  // 2. 应用人口预测算法（如果有配置）
  seriesData = applyBirthPrediction(seriesData, marriageArr, birthArr, params);

  // 3. 组装 ECharts Option 骨架
  const optionData = buildOptionSkeleton(seriesData, filteredYears, params);

  // 4. 挂载额外的饼图配置（如果有配置）
  if (params.pieConfig?.enabled) {
    attachPieChartToOption(optionData, seriesData, filteredYears, params.pieConfig);
  }

  logger.debug(`[getCommonChartOption] 总耗时: ${Math.round(performance.now() - startTime)}ms, 标题: ${params.title}`);
  return optionData;
}

// -------- 流水线车间：局部辅助函数 --------

function buildBaseSeries(params) {
  const { data, zbcodeArr, cityCodeArr = [], dbCode = 'nd', unit = '', exceptName = '', chartType = 'bar', yearLimit, enableBirthOffset = false, selectedLegend, offsetValue = 0 } = params;
  let marriageArr = [], birthArr = [], seriesData = [];

  if (cityCodeArr.length === 0) {
    zbcodeArr.forEach(zbCode => {
      const codeItem = data.data[dbCode]?.[zbCode];
      if (!codeItem) return;

      let cname = codeItem.cname || '总的';
      if (typeof cname === 'string' && typeof exceptName === 'string') {
        let resultArr = cname.split('');
        exceptName.split('').forEach(ch => {
          const idx = resultArr.indexOf(ch);
          if (idx !== -1) resultArr.splice(idx, 1);
        });
        cname = resultArr.join('').trim() || '总的';
      }

      const name = cname + unit;
<<<<<<< HEAD

=======
>>>>>>> 24ce2a9 (重构核心图表数据处理功能)
      let result = selectDataFromArr(data, zbCode, dbCode, '', yearLimit);
      let valueArr = result.map(item => item.value);
      let dateArr = result.map(item => item.date);

      if (enableBirthOffset && zbCode === 'A0P0C01') marriageArr = valueArr;
      else if (enableBirthOffset && zbCode === 'A030109') {
        birthArr = valueArr;
        valueArr = offsetArray(valueArr, yearLimit, -1);
      } else if (chartType === 'line' && name === selectedLegend) {
        valueArr = offsetArray(valueArr, Math.min(yearLimit, valueArr.length), offsetValue);
      }

      seriesData.push({ name, zbCode, type: chartType, data: valueArr, date: dateArr, emphasis: { focus: 'series' } });
    });
  } else {
    cityCodeArr.forEach(cityCode => {
      const city = data.reg?.find(r => r.code === cityCode);
      const name = city?.cname || '';
<<<<<<< HEAD

      let result = selectDataFromArr(data, zbcodeArr[0], dbCode, cityCode, yearLimit) || [];
      let valueArr = result.map(item => item.value);
      let dateArr = result.map(item => item.date);
      seriesData.push({
        name,
        zbCode: zbcodeArr[0], // 新增 zbCode 供饼图触发
        type: chartType,
        data: valueArr,
        date: dateArr,
        emphasis: { focus: 'series' }
=======
      let result = selectDataFromArr(data, zbcodeArr[0], dbCode, cityCode, yearLimit) || [];
      seriesData.push({
        name, zbCode: zbcodeArr[0], type: chartType, data: result.map(i => i.value), date: result.map(i => i.date), emphasis: { focus: 'series' }
>>>>>>> 24ce2a9 (重构核心图表数据处理功能)
      });
    });
  }

  let filteredYears = seriesData[0]?.date || [];
  return { seriesData, filteredYears, marriageArr, birthArr };
}

function applyBirthPrediction(seriesData, marriageArr, birthArr, params) {
  if (!params.enableBirthPrediction || !marriageArr.length || !birthArr.length) return seriesData;

  const nextBirth = fitMarriageBirthDynamic(marriageArr, birthArr, 20).nextYearPred.pred;

  return seriesData.map(s => {
    if (s.name.includes('出生')) {
      if (params.chartType === 'line') {
        const lastIndex = s.data.length - 1;
        const updatedData = [...s.data];
        updatedData[lastIndex] = nextBirth;

        return [
          { ...s, type: 'line', name: '出生人口', data: updatedData.slice(0, lastIndex), lineStyle: { type: 'solid' } },
          { ...s, type: 'line', name: '出生人口预测', data: updatedData.map((d, i) => (i >= lastIndex - 1 ? d : null)), lineStyle: { color: s.lineStyle?.color || '#5470C6', type: 'dashed' }, symbol: 'circle', symbolSize: 10, connectNulls: true }
        ];
      }
      return [{ ...s, type: 'bar' }, { ...s, type: 'bar', data: [] }];
    }
    return s;
  }).flat();
}

function buildOptionSkeleton(seriesData, filteredYears, params) {
  const { title, subtitle, isHorizontal, legendAllSelected, gridTop = '140px', legendTop = '70px', unit = '' } = params;

  const valueAxisConfig = {
    type: 'value', scale: true,
    min: (v) => v.min - (v.max - v.min) * 0.1,
    max: (v) => v.max + (v.max - v.min) * 0.1,
    axisLabel: { formatter: (v) => v.toFixed(Math.abs(v) >= 1 ? 2 : 3) + unit },
  };
  const categoryAxisConfig = { type: 'category', data: filteredYears };

  return {
    title: { text: title, subtext: subtitle, left: 'center', top: 15, itemGap: 22, subtextStyle: { fontWeight: 'bold', fontSize: 13, width: window.innerWidth * 0.8, overflow: 'breakAll' } },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const sorted = params.slice().sort((a, b) => b.value - a.value);
<<<<<<< HEAD

=======
>>>>>>> 24ce2a9 (重构核心图表数据处理功能)
        let result = sorted[0].axisValue + '<br/>';
        sorted.forEach(item => {
          result += `${item.marker}${item.seriesName}: ${typeof item.value === 'number' ? item.value.toLocaleString() : item.value}<br/>`;
        });
        return result;
      }
    },
    legend: { type: 'scroll', left: 'center', top: legendTop, data: seriesData.map(s => s.name), selected: legendAllSelected ? seriesData.reduce((acc, s) => ({ ...acc, [s.name]: true }), {}) : {} },
    grid: { left: '1%', right: '1%', top: gridTop, bottom: '1%', containLabel: true },
    xAxis: isHorizontal ? valueAxisConfig : categoryAxisConfig,
    yAxis: isHorizontal ? categoryAxisConfig : valueAxisConfig,
    series: seriesData
  };
<<<<<<< HEAD

  // ----------------------------
  // dataset + 饼图
  if (pieConfig?.enabled) {
    // 确保有全局颜色
    if (!optionData.color) {
      optionData.color = [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
      ];
    }
    pieConfig.pies.forEach((pie, idx) => {
      const targetSeries = seriesData.filter(s => pie.triggerZbCodes.includes(s.zbCode));
      // logger.debug('seriesData-targetSeries',seriesData,targetSeries)


      // 获取最后一个横坐标的索引
      const lastYearIndex = filteredYears.length - 1;

      // 创建饼图数据：使用最后一年的数据
      const pieData = targetSeries.map(series => {
        // 获取最后一个年份的数据
        const lastValue = Array.isArray(series.data) ? series.data[lastYearIndex] : 0;
        return {
          name: series.name,
          value: lastValue  // 使用具体数值，不是整个data数组
        };
      });

      // 获取饼图数据在 legend 中的索引
      const legendData = optionData.legend?.data || [];

      optionData.series.push({
        id: `pie_${idx}`,
        type: 'pie',
        radius: pie.radius || '25%',
        center: pie.center || ['50%', 170],
        data: pieData,
        label: {
          formatter: params => {
            // 动态获取当前屏幕宽度，<= 768px 认为是移动端
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
              // 移动端：在名称和百分比之间加入 \n 实现换行
              return `${params.name}\n(${params.percent}%)`;
            } else {
              // PC 端：保持原样单行显示
              return `${params.name}(${params.percent}%)`;
            }
          },
        },
        emphasis: { focus: 'self' },
        itemStyle: {
          color: function (params) {
            const dataName = params.name;
            const legendIndex = legendData.indexOf(dataName);

            if (legendIndex !== -1 && optionData.color && optionData.color[legendIndex]) {
              return optionData.color[legendIndex];
            }

            return optionData.color[params.dataIndex % optionData.color.length];
          }
        }
      });
    });


  }
  // logger.debug('optionData',optionData)
  const endTime = performance.now();
  logger.debug(`[getCommonChartOption] 总耗时: ${Math.round(endTime - startTime)}ms, 标题: ${title}, series数量: ${seriesData.length}`);
  return optionData;
=======
>>>>>>> 24ce2a9 (重构核心图表数据处理功能)
}

function attachPieChartToOption(optionData, seriesData, filteredYears, pieConfig) {
  optionData.color = optionData.color || ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
  const lastYearIndex = filteredYears.length - 1;
  const legendData = optionData.legend?.data || [];

  pieConfig.pies.forEach((pie, idx) => {
    const targetSeries = seriesData.filter(s => pie.triggerZbCodes.includes(s.zbCode));
    const pieData = targetSeries.map(series => ({
      name: series.name,
      value: Array.isArray(series.data) ? series.data[lastYearIndex] : 0
    }));

    optionData.series.push({
      id: `pie_${idx}`,
      type: 'pie',
      radius: pie.radius || '25%',
      center: pie.center || ['50%', 170],
      data: pieData,
      label: { formatter: p => `${p.name}(${p.percent}%)` },
      emphasis: { focus: 'self' },
      itemStyle: {
        color: (p) => {
          const legendIndex = legendData.indexOf(p.name);
          return (legendIndex !== -1 && optionData.color[legendIndex]) ? optionData.color[legendIndex] : optionData.color[p.dataIndex % optionData.color.length];
        }
      }
    });
  });
}

// ============================
// 网络请求与数据组装核心
// ============================

const totalUrl = `${process.env.VUE_APP_API_BASE_URL}/easyquery.htm`;
<<<<<<< HEAD
const common_params = {
  m: 'QueryData',
  colcode: 'sj',
  k1: String(Date.now()),
  h: '1'
};
// 武汉相关
// GDP
const params_wh = [
  // 城市年度数据 'dbcode' : 'csnd 'wds'与dfwds一定分别设置，这个普通数据请求参数不同！！！！！
  { 'dbcode': 'csnd', 'rowcode': 'zb', 'wds': '[{"wdcode":"reg","valuecode":"420100"}]', 'dfwds': '[{"wdcode":"zb","valuecode":"A01"},{"wdcode":"sj","valuecode":"LAST10"}]' },  // A01 地区生产总值
  { 'dbcode': 'csnd', 'rowcode': 'zb', 'wds': '[{"wdcode":"reg","valuecode":"420100"}]', 'dfwds': '[{"wdcode":"zb","valuecode":"A02"},{"wdcode":"sj","valuecode":"LAST10"}]' },  // A02 人口和就业
  { 'dbcode': 'csnd', 'rowcode': 'zb', 'wds': '[{"wdcode":"reg","valuecode":"420100"}]', 'dfwds': '[{"wdcode":"zb","valuecode":"A03"},{"wdcode":"sj","valuecode":"LAST10"}]' },  // A03 房地产
  { 'dbcode': 'csnd', 'rowcode': 'zb', 'wds': '[{"wdcode":"reg","valuecode":"420100"}]', 'dfwds': '[{"wdcode":"zb","valuecode":"A04"},{"wdcode":"sj","valuecode":"LAST10"}]' },  // A04 财政和金融
  { 'dbcode': 'csnd', 'rowcode': 'zb', 'wds': '[{"wdcode":"reg","valuecode":"420100"}]', 'dfwds': '[{"wdcode":"zb","valuecode":"A08"},{"wdcode":"sj","valuecode":"LAST10"}]' },  // A08 教育、卫生、文化
]
// 一线城市
const params_city = [
  // 请求的数据指标与时间，
  // 城市年度数据 'dbcode' : 'csnd 'wds'与dfwds一定分别设置，这个普通数据请求参数不同！！！！！
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0101"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0101 地区生产总值
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0201"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0201 年末户籍人口
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0303"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0303 房地产住宅投资额
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A030A"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A030A 房地产住宅销售面积
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A030C"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A030C 房地产住宅平均销售价格
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0401"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0401 地方公共预算收入
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0402"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0402 地方公共收预算支出
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0403"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0403 住户存款余额
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0801"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0801 普通本专科在校学生数
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0802"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0802 医院个数

  // 城市月度数据 'dbcode' : 'csyd
  { 'dbcode': 'csyd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A010804"},{"wdcode":"sj","valuecode":"LAST13"}]', 'dfwds': '[]' }, // A010804 新建商品住宅销售价格指数(上月=100)
  { 'dbcode': 'csyd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A010805"},{"wdcode":"sj","valuecode":"LAST13"}]', 'dfwds': '[]' }, // A010805 新建商品住宅销售价格指数(上年同月=100)
  { 'dbcode': 'csyd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A01080S"},{"wdcode":"sj","valuecode":"LAST13"}]', 'dfwds': '[]' }, // A01080S 新建商品住宅销售价格指数(上年同期=100)
  { 'dbcode': 'csyd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A010807"},{"wdcode":"sj","valuecode":"LAST13"}]', 'dfwds': '[]' }, // A010807 二手住宅销售价格指数(上月=100)
  { 'dbcode': 'csyd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A010808"},{"wdcode":"sj","valuecode":"LAST13"}]', 'dfwds': '[]' }, // A010808 二手住宅销售价格指数(上年同月=100)
  { 'dbcode': 'csyd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A01080T"},{"wdcode":"sj","valuecode":"LAST13"}]', 'dfwds': '[]' }, // A01080T 二手住宅销售价格指数(上年同期=100)

]

// 主要省份
const params_province = [
  // 请求的数据指标与时间，
  // 年度数据 'dbcode' : 'csnd 'wds'与dfwds一定分别设置，这个普通数据请求参数不同！！！！！
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A020101"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A020101 地区生产总值
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A030101"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A030101 年末常住人口
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A030201"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A030201 出生率
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A030202"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A030202 死亡率
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A030203"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A030203 增长率
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A050D01"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A050D01 房地产投资额
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A050H02"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A050H02 房地产住宅销售面积
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A050J02"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A030C 房地产住宅平均销售价格
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A080101"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A080101 地方财政收入
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A080201"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A080201 地方财政支出
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0A0101"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A0A0101 居民人均可支配收入
  { 'dbcode': 'fsnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0M0108"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },        // A0403 普通高等学校预计毕业生数
]

//房地产-投资
const params_realEstate_invest = [
  //年度数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A051102"},{"wdcode":"sj","valuecode":"LAST10"}]' }, //A051102 房地产开发住宅投资额
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A051104"},{"wdcode":"sj","valuecode":"LAST10"}]' }, //A051104 房地产开发办公楼投资额
  //月度数据
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A060105"},{"wdcode":"sj","valuecode":"LAST13"}]' },//A060105 房地产住宅投资累计值
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A06010D"},{"wdcode":"sj","valuecode":"LAST13"}]' }, //A06010D 房地产办公楼投资累计值
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A06010R"},{"wdcode":"sj","valuecode":"LAST13"}]' }, //A06010R 房地产土地购置投资累计值

]
//房地产-销售
const params_realEstate_sell = [
  //年度数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0515"},{"wdcode":"sj","valuecode":"LAST10"}]' }, //A0516 商品住宅面积
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0516"},{"wdcode":"sj","valuecode":"LAST10"}]' }, //A0516 商品住宅销售额
  //月度数据
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A060A"},{"wdcode":"sj","valuecode":"LAST13"}]' },//A060A 商品住宅面积
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A060B"},{"wdcode":"sj","valuecode":"LAST13"}]' }, //A060B 商品住宅销售额
]

//社零
const params_socialretailgoods = [
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070101"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零总
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070401"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070402"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070403"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070404"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070405"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070406"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070407"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070408"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A070409"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A07040A"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A07040B"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A07040C"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A07040D"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A07040E"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A07040F"},{"wdcode":"sj","valuecode":"LAST14"}]' },   // 社零分类
]
// GDP
const params_gdp = [
  // 国家年度数据---// A0201：A020102 国内生产总值  A020103 第一产值增加  A020104 第二产值增加  A020105 第三产值增加
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0201"},{"wdcode":"sj","valuecode":"LAST10"}]' },
  // 城市年度数据 'dbcode' : 'csnd 'wds'与dfwds一定分别设置，这个普通数据请求参数不同！！！！！
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0101"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0101 国内生产总值
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0102"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0102 第一产值增加
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0103"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0103 第二产值增加
  { 'dbcode': 'csnd', 'rowcode': 'reg', 'wds': '[{"wdcode":"zb","valuecode":"A0104"}]', 'dfwds': '[{"wdcode":"sj","valuecode":"LAST10"}]' },  // A0104 第三产值增加

]
// 财政
const params_nationalFinance = [
  // 年度数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0802"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 国家财政收入
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0803"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 国家财政支出
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A080401"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 国家财政收入-项目
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A080501"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 国家财政支出-项目
  // 月度数据
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0C01"},{"wdcode":"sj","valuecode":"LAST13"}]' }, // 国家财政收入-项目
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0C02"},{"wdcode":"sj","valuecode":"LAST13"}]' }, // 国家财政支出-项目
]
// 金融
const params_financialIndustry = [
  // 年度数据-货币供应
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0L03"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 货币供应量(亿元)
  // 年度数据-外汇
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0L0401"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 黄金储备(万盎司)
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0L0402"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 外汇储备(亿美元) 
  // 月度数据-货币供应
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0D01"},{"wdcode":"sj","valuecode":"LAST13"}]' }, // 货币供应量(亿元)
]
// 外贸
const params_foreignTrade = [
  // 年度数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0601"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 进出口总额
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A06050201"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 向亚洲出口总额
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A06050203"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 向欧洲出口总额
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A06050205"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 向北美洲出口总额
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A06050301"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 向亚洲进口总额
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A06050303"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 向欧洲进口总额
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A06050305"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 向北美洲进口总额 

  // 月度数据 A0801
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0801"},{"wdcode":"sj","valuecode":"LAST13"}]' }, // 进出口总额
]
// 人口
const params_population = [
  // 请求的数据指标与时间，必须通过这2个确定数据，如果不传"wdcode":"sj"参数，默认为10年数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0301"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 301 总人口
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0302"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 302 增长率
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0303"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 303 年龄结构与抚养比
]

// 教育
const params_education = [
  // 请求的数据指标与时间，必须通过这2个确定数据，如果不传"wdcode":"sj"参数，默认为10年数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M07"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 招生数
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M08"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 在校学生数
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M09"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 毕业生数
  // 学前-硕士使用下方接口
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M020102"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 招生数-研究生
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M020119"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 招生数--学前
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M020202"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 在校学生数-研究生
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M02021A"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 在校学生数--学前
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M020302"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 毕业生数-研究生
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0M02031A"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 毕业生数---学前
]
// 医疗
const params_medical = [
  // 请求的数据指标与时间，必须通过这2个确定数据，如果不传"wdcode":"sj"参数，默认为10年数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0O01"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 医疗卫生机构
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0O02"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 卫生人员
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0O05"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 医疗机构床位
]
// 婚姻
const params_marriage = [
  // 请求的数据指标与时间，必须通过这2个确定数据，如果不传"wdcode":"sj"参数，默认为10年数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0P0C"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 婚姻
]
// 指数数据
const params_indices = [
  // 请求的数据指标与时间，必须通过这2个确定数据，如果不传"wdcode":"sj"参数，LAST13为最近13个月数据
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A01010101"},{"wdcode":"sj","valuecode":"LAST13"}]' }, // CPI 上年同比
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A01030101"},{"wdcode":"sj","valuecode":"LAST13"}]' }, // CPI 上月环比
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A01080101"},{"wdcode":"sj","valuecode":"LAST13"}]' }, // PPI 上年同比
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A01080701"},{"wdcode":"sj","valuecode":"LAST13"}]' }, // PPI 上月环比
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0B0101"},{"wdcode":"sj","valuecode":"LAST13"}]' },   // 制造业采购指数
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0B0201"},{"wdcode":"sj","valuecode":"LAST13"}]' },   // 非制造业采购指数
  { 'dbcode': 'hgyd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0B0301"},{"wdcode":"sj","valuecode":"LAST13"}]' }    // 综合采购指数
]
// 生活水平
const params_livingStandards = [
  // 请求的数据指标与时间，必须通过这2个确定数据，如果不传"wdcode":"sj"参数，LAST10为最近10年数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0A01"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 全国居民收入
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0A02"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 城镇居民收入
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0A03"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 农村居民收入
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0A0G"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 可支配收入基尼系数
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0A0H"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 居民恩格尔系数

]

// 住宿与餐饮情况
const params_accommodationAndCatering = [
  // 请求的数据指标与时间，必须通过这2个确定数据，如果不传"wdcode":"sj"参数，默认为10年数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0J01"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 住宿和餐饮
]

// 旅游业发展情况
const params_touristIndustry = [
  // 请求的数据指标与时间，必须通过这2个确定数据，如果不传"wdcode":"sj"参数，默认为10年数据
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0K01"},{"wdcode":"sj","valuecode":"LAST10"}]' }, // 旅游业发展情况
]
// 运输与邮电
const params_transportationAndTelecommunications = [
  // 运输
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0G02"},{"wdcode":"sj","valuecode":"LAST20"}]' }, // 运输长度
  { 'dbcode': 'hgnd', 'rowcode': 'zb', 'wds': '[]', 'dfwds': '[{"wdcode":"zb","valuecode":"A0G04"},{"wdcode":"sj","valuecode":"LAST20"}]' }, // 客运量
]

=======
const common_params = { m: 'QueryData', colcode: 'sj', k1: String(Date.now()), h: '1' };
>>>>>>> 24ce2a9 (重构核心图表数据处理功能)

export async function sendRequest(specificParams) {
  let datanodesArr = [], newDataArr = [], nodesArr_zb = [], nodesArr_reg = [], nodesArr_sj_code_nd = [], nodesArr_sj_code_yd = [];

  for (let params of specificParams) {
    let mergedParams = { ...common_params, ...params };
    try {
      let response = await axios.get(totalUrl, { params: mergedParams, timeout: 30000 });
      let data = response.data;
      if (data && data.returndata) {
        if (data.returndata.datanodes) datanodesArr = datanodesArr.concat(data.returndata.datanodes);
        if (data.returndata.wdnodes?.[0]?.nodes) nodesArr_zb = nodesArr_zb.concat(data.returndata.wdnodes[0].nodes);
        if (data.returndata.wdnodes?.[1]?.wdcode === 'reg') nodesArr_reg = data.returndata.wdnodes[1].nodes;
        
        let dbCode = mergedParams.dbcode;
        if (dbCode.includes('nd')) nodesArr_sj_code_nd = (data.returndata.wdnodes.slice(-1)[0]?.nodes || []).map(i => i.code);
        if (dbCode.includes('yd')) nodesArr_sj_code_yd = (data.returndata.wdnodes.slice(-1)[0]?.nodes || []).map(i => i.code);
      }
    } catch (error) {
      logger.error('请求错误:', error.response?.data || error.message);
      return;
    }
  }

  datanodesArr.forEach(dataElement => {
    let newJson = { value: dataElement.data.data, code: dataElement.wds[0].valuecode, date: dataElement.wds[dataElement.wds.length - 1].valuecode };
    const matchedZb = nodesArr_zb.find(n => n.code === newJson.code);
    if (matchedZb) newJson.cname = matchedZb.cname;

    if (dataElement.wds[1].wdcode === "reg") {
      newJson.cityCode = dataElement.wds[1].valuecode;
      const matchedReg = nodesArr_reg.find(n => n.code === newJson.cityCode);
      if (matchedReg) newJson.cityName = matchedReg.cname;
    }
    newDataArr.push(newJson);
  });

  const newDataArr_sj = [];
  if (nodesArr_sj_code_nd.length > 0) newDataArr_sj.push(nodesArr_sj_code_nd);
  if (nodesArr_sj_code_yd.length > 0) newDataArr_sj.push(nodesArr_sj_code_yd);

  return {
    data: newDataArr,
    zb: nodesArr_zb.map(i => ({ cname: i.cname, code: i.code })),
    reg: nodesArr_reg.map(i => ({ cname: i.cname, code: i.code })),
    sj: newDataArr_sj
  };
}