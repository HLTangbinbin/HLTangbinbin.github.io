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
    let formattedValue = Number.isInteger(val) ? val : Number(val.toFixed(Math.abs(val) >= 1 ? 2 : 3));
    return { value: formattedValue, date: d.date };
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
      const k = Xlast.length === 1 ? Ylast[0] / Xlast[0] : 1; 
      nextYearPred = { pred: Math.round(marriageArr[n - 1] * k) };
    } else {
      nextYearPred = { pred: Math.round(interceptLast + wLast * marriageArr[n - 1]) };
    }
  }

  return { slidingPreds, nextYearPred };
}

// ============================
// 🌟 纯粹的图表数据组装流水线
// ============================

export function getCommonChartOption(params) {
  const startTime = performance.now();

  // 1. 构建基础 Series 数据
  let { seriesData, filteredYears, marriageArr, birthArr } = buildBaseSeries(params);

  // 🌟 修复 3：在数据被污染之前，把真正的原始指标名存下来（比如：财政收入、财政支出）
  const originalLegendData = seriesData.map(s => s.name);

  // 拦截同环比逻辑
  if (params.isYearlyCompare) {
    const compareOption = buildYearlyCompareOption(seriesData, filteredYears, params);
    // 将原始指标名强行挂载到返回的 Option 里，给外部下拉框使用！
    compareOption.originalLegendData = originalLegendData; 
    if (typeof logger !== 'undefined') {
      logger.debug(`[getCommonChartOption - 同环比模式] 耗时: ${Math.round(performance.now() - startTime)}ms`);
    }
    return compareOption;
  }

  // 2. 应用人口预测算法
  seriesData = applyBirthPrediction(seriesData, marriageArr, birthArr, params);

  // 3. 组装 ECharts Option 骨架
  const optionData = buildOptionSkeleton(seriesData, filteredYears, params);

  // 同样挂载给正常模式使用
  optionData.originalLegendData = originalLegendData;

  // 4. 挂载额外的饼图配置
  if (params.pieConfig?.enabled) {
    attachPieChartToOption(optionData, seriesData, filteredYears, params.pieConfig);
  }

  if (typeof logger !== 'undefined') {
    logger.debug(`[getCommonChartOption] 总耗时: ${Math.round(performance.now() - startTime)}ms, 标题: ${params.title}`);
  }
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
      let result = selectDataFromArr(data, zbcodeArr[0], dbCode, cityCode, yearLimit) || [];
      seriesData.push({
        name, zbCode: zbcodeArr[0], type: chartType, data: result.map(i => i.value), date: result.map(i => i.date), emphasis: { focus: 'series' }
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

/**
 * 构建年度同环比的 ECharts Option
 * 将原本连续的时间序列 (如 202201, 202202...202301) 折叠合并
 * 使得 X 轴固定为 1-12 月，折线(Series)变为不同的年份
 */
/**
 * 构建年度同环比的 ECharts Option
 */
function buildYearlyCompareOption(seriesData, filteredYears, params) {
  const xAxisData = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'];
  const yearMap = {};

  filteredYears.forEach((dateStr, dateIndex) => {
    if (!dateStr || dateStr.length < 6) return;
    
    const year = dateStr.substring(0, 4);
    const monthIdx = parseInt(dateStr.substring(4, 6), 10) - 1; 

    if (!yearMap[year]) {
      yearMap[year] = {};
    }

    seriesData.forEach(series => {
      if (!yearMap[year][series.name]) {
        yearMap[year][series.name] = new Array(12).fill(null);
      }
      yearMap[year][series.name][monthIdx] = series.data[dateIndex];
    });
  });

  // 根据对比年数进行截取
  const availableYears = Object.keys(yearMap).sort((a, b) => b - a);
  const selectedYears = availableYears.slice(0, params.compareYearCount);

  const newSeries = [];
  const legendData = [];

  // 根据选中的下拉框进行过滤（比如：只看“财政收入”的同环比）
  let targetSeriesData = seriesData;
  if (params.selectedLegend && seriesData.length > 1) {
    targetSeriesData = seriesData.filter(s => s.name === params.selectedLegend);
    if (targetSeriesData.length === 0) targetSeriesData = [seriesData[0]];
  }

  const isSingleSeries = targetSeriesData.length === 1;

  selectedYears.forEach(year => {
    targetSeriesData.forEach(series => {
      const seriesName = isSingleSeries ? year : `${series.name} (${year})`;
      legendData.push(seriesName);
      
      newSeries.push({
        name: seriesName,
        type: 'line',
        connectNulls: false,
        symbolSize: 6,
        data: yearMap[year][series.name] || new Array(12).fill(null)
      });
    });
  });

  return {
    title: {
      text: params.title || '',
      subtext: params.subtitle || '年度同环比对比',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      valueFormatter: (value) => value !== null ? value + (params.unit || '') : '-'
    },
    legend: {
      data: legendData,
      top: params.legendTop || '8%',
      type: 'scroll'
    },
    grid: {
      top: params.gridTop || '20%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: { interval: 0 }
    },
    yAxis: {
      type: 'value',
      name: params.unit || '',
      alignTicks: true
    },
    series: newSeries,
    dataZoom: [] 
  };
}

// ============================
// 网络请求与数据组装核心
// ============================

const totalUrl = `${process.env.VUE_APP_API_BASE_URL}/easyquery.htm`;
const common_params = { m: 'QueryData', colcode: 'sj', k1: String(Date.now()), h: '1' };

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