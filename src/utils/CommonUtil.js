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
// ============================
// 🌟 纯粹的图表数据组装流水线 (支持高度扩展)
// ============================

export function getCommonChartOption(params) {
  const startTime = performance.now(); // 记录开始时间

  // 1. 基础业务数据提取与计算 (包含你的婚姻预测、学生偏移逻辑)
  let { seriesData, filteredYears, marriageArr, birthArr } = buildBaseSeries(params);

  // 记录原始干净的指标名
  const originalLegendData = seriesData.map(s => s.name);

  if (params.isYearlyCompare) {
    const compareOption = buildYearlyCompareOption(seriesData, filteredYears, params);
    compareOption.originalLegendData = originalLegendData;

    // 🌟 修复：补回同环比模式的耗时打印
    if (typeof logger !== 'undefined') {
      logger.debug(`[getCommonChartOption - 同环比模式] 耗时: ${Math.round(performance.now() - startTime)}ms`);
    }
    return compareOption;
  }

  // 2. 核心业务推导算法 (人口预测)
  seriesData = applyBirthPrediction(seriesData, marriageArr, birthArr, params);

  // 3. 插件化扩展 A：数学趋势拟合线 (Trendline)
  if (params.enableTrendline && !params.isHorizontal) {
    seriesData = applyTrendlines(seriesData);
  }

  // 4. 组装基础 ECharts 骨架
  const optionData = buildOptionSkeleton(seriesData, filteredYears, params);

  optionData.originalLegendData = originalLegendData;

  // 6. 挂载饼图
  if (params.pieConfig?.enabled) {
    attachPieChartToOption(optionData, seriesData, filteredYears, params);
  }

  // 🌟 修复：补回标准模式的耗时打印，消除 startTime 未使用报错
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
  const { title, subtitle, isHorizontal, legendAllSelected, gridTop = '140px', legendTop = '70px', unit = '', isMobile, titleTop = '15px' } = params;

  const valueAxisConfig = {
    type: 'value', scale: true,
    min: (v) => v.min - (v.max - v.min) * 0.1,
    max: (v) => v.max + (v.max - v.min) * 0.1,
    axisLabel: { formatter: (v) => v.toFixed(Math.abs(v) >= 1 ? 2 : 3) + unit },
  };
  const categoryAxisConfig = { type: 'category', data: filteredYears };

  return {
    title: {
      text: title,
      subtext: subtitle,
      left: 'center',
      top: titleTop, // 👈 使用传过来的参数，解决间距问题
      itemGap: 22,
      textStyle: {
        fontSize: isMobile ? 14 : 18 // 👈 动态主标题大小
      },
      subtextStyle: {
        fontWeight: 'bold',
        fontSize: isMobile ? 12 : 13, // 👈 动态副标题大小
        width: window.innerWidth * 0.8,
        overflow: 'breakAll'
      }
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      enterable: true,
      extraCssText: 'max-height: 450px; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.12); padding-right: 15px;',
      formatter: getAdvancedTooltipFormatter()
    },
    legend: { type: 'scroll', left: 'center', top: legendTop, data: seriesData.map(s => s.name), selected: legendAllSelected ? seriesData.reduce((acc, s) => ({ ...acc, [s.name]: true }), {}) : {} },
    grid: { left: '1%', right: '1%', top: gridTop, bottom: '1%', containLabel: true },
    xAxis: isHorizontal ? valueAxisConfig : categoryAxisConfig,
    yAxis: isHorizontal ? categoryAxisConfig : valueAxisConfig,
    series: seriesData
  };
}

function attachPieChartToOption(optionData, seriesData, filteredYears, params) {
  optionData.color = optionData.color || ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
  const lastYearIndex = filteredYears.length - 1;
  const legendData = optionData.legend?.data || [];

  params.pieConfig.pies.forEach((pie, idx) => {
    const targetSeries = seriesData.filter(s => pie.triggerZbCodes.includes(s.zbCode));
    const pieData = targetSeries.map(series => ({
      name: series.name,
      value: Array.isArray(series.data) ? series.data[lastYearIndex] : 0
    }));
    // 🌟 1. 饼图半径等比缩放
    let r = pie.radius || '20%';
    if (params.isMobile && typeof r === 'string' && r.endsWith('px')) {
      // 手机端半径打 0.65 折，比如 60px -> 39px
      r = Math.max(Math.round(parseInt(r) * 0.65), 30) + 'px';
    }

    // 🌟 2. 饼图位置 (Y轴) 等比缩放！这是消灭间距的终极杀招！
    let cx = (pie.center && pie.center[0]) ? pie.center[0] : '50%';
    let cy = (pie.center && pie.center[1]) ? pie.center[1] : '170px';

    if (params.isMobile && typeof cy === 'string' && cy.endsWith('px')) {
      // 手机端圆心高度打 0.65 折！如果 JSON 配置的是 180px，这里直接算出 117px！
      // 这样它就会完美地卡在 legend (35px) 和 gridTop (182px) 的正中间！
      cy = Math.max(Math.round(parseInt(cy) * 0.75), 90) + 'px';
    } else if (params.isMobile && typeof cy === 'number') {
      cy = Math.max(Math.round(cy * 0.75), 90);
    }

    optionData.series.push({
      id: `pie_${idx}`,
      type: 'pie',
      radius: r,
      center: [cx, cy],
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
// 构建年度同环比的 ECharts Option
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
      // 🛡️ 核心修复 4：强制将数据长度不一时产生的 undefined 转为 null，切断报错源头！
      const safeValue = series.data[dateIndex] !== undefined ? series.data[dateIndex] : null;
      yearMap[year][series.name][monthIdx] = safeValue;
    });
  });

  const availableYears = Object.keys(yearMap).sort((a, b) => b - a);
  const selectedYearsRaw = availableYears.slice(0, params.compareYearCount);
  const selectedYears = selectedYearsRaw.sort((a, b) => a - b);

  const newSeries = [];
  const legendData = [];

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

  // 追加趋势拟合线
  let finalSeries = newSeries;
  if (params.enableTrendline) {
    finalSeries = applyTrendlines(newSeries);
  }

  return {
    title: {
      text: params.title || '',
      subtext: params.subtitle,
      left: 'center',
      top: params.titleTop || '15px',
      textStyle: { fontSize: params.isMobile ? 14 : 18 },
      subtextStyle: { fontSize: params.isMobile ? 12 : 14 }
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      enterable: true,
      extraCssText: 'max-height: 450px; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.12); padding-right: 15px;',
      formatter: getAdvancedTooltipFormatter() // 接入高级装甲
    },
    legend: {
      data: legendData,
      top: params.legendTop || '50px',
      type: 'scroll',
    },
    grid: {
      top: params.gridTop || '100px',
      left: '5%', right: '5%', bottom: '3%',
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
    series: finalSeries,
    dataZoom: []
  };
}

// ----------------------------------------------------
// 🌟 新增的独立扩展模块 (遵循高内聚低耦合原则)
// ----------------------------------------------------

// 【数学模块】最小二乘法线性回归 (含 R² 和回归方程计算)
function calculateLinearRegression(dataArr) {
  let n = 0, sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  const validPoints = [];

  // 🛡️ 核心修复 1：严格过滤空值，绝对不能把 null 或 undefined 当成 0 参与回归计算！
  dataArr.forEach((val, x) => {
    if (val === null || val === undefined || val === '') return;
    let num = typeof val === 'object' ? val.value : val;
    if (num === null || num === undefined || num === '') return;

    num = Number(num);
    if (!isNaN(num)) {
      n++;
      sumX += x;
      sumY += num;
      sumXY += (x * num);
      sumXX += (x * x);
      validPoints.push({ x, y: num });
    }
  });

  if (n < 2) return dataArr.map(() => '-');

  const denominator = (n * sumXX - sumX * sumX);
  const m = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const b = (sumY - m * sumX) / n;

  const meanY = sumY / n;
  let ssTot = 0, ssRes = 0;
  validPoints.forEach(p => {
    const predicted = m * p.x + b;
    ssTot += Math.pow(p.y - meanY, 2);
    ssRes += Math.pow(p.y - predicted, 2);
  });

  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - (ssRes / ssTot));

  const sign = b >= 0 ? '+' : '-';
  const formulaStr = `y = ${m.toFixed(2)}x ${sign} ${Math.abs(b).toFixed(2)}`;
  const r2Str = r2.toFixed(4);

  return dataArr.map((_, x) => {
    const predY = Number((m * x + b).toFixed(2));
    const isFlat = Math.abs(m / (meanY || 1)) < 0.001;
    let statusText = '';
    if (isFlat) {
      statusText = '<span style="color: #94a3b8;">(高位平稳，随机波动)</span>';
    } else if (r2 > 0.8) {
      statusText = '<span style="color: #10b981;">(趋势强劲，可信度高)</span>';
    } else if (r2 < 0.3) {
      statusText = '<span style="color: #f59e0b;">(波动剧烈，缺乏线性规律)</span>';
    }

    return {
      value: predY,
      formula: formulaStr,
      r2: r2Str,
      status: statusText
    };
  });
}

// 🌟 提取独立的高级 Tooltip 渲染引擎，供所有模式复用
function getAdvancedTooltipFormatter() {
  return (params) => {
    if (!params) return '';
    const paramsArray = Array.isArray(params) ? params : [params];

    // 🛡️ 核心修复 2：过滤掉所有可能的幽灵节点，防止 ECharts 传毒
    const validParams = paramsArray.filter(p => p && p.value !== '-' && p.value != null && p.value !== '');

    const sorted = validParams.sort((a, b) => {
      // 🛡️ 核心修复 3：全面使用可选链 ?. 防止 Cannot read properties of undefined
      let valA = typeof a.value === 'object' ? a.value?.value : a.value;
      let valB = typeof b.value === 'object' ? b.value?.value : b.value;
      return Number(valB || 0) - Number(valA || 0);
    });

    if (sorted.length === 0) return paramsArray[0]?.axisValue || paramsArray[0]?.name || '';

    const title = sorted[0].axisValue || sorted[0].name || '';
    let result = `<div style="font-size: 14px; margin-bottom: 8px; color: #1e293b;">${title}</div>`;

    sorted.forEach(item => {
      let rawValue = typeof item.value === 'object' ? item.value?.value : item.value;
      let val = typeof rawValue === 'number' ? rawValue.toLocaleString() : (rawValue || '-');

      let markerHtml = item.marker || `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color || '#ccc'};"></span>`;

      // 🌟 核心视觉修复：引入 BI 级左右分布排版、统一字体族、数字等宽渲染
      result += `
        <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="display: flex; align-items: center; color: #475569; font-size: 13px;">
            ${markerHtml} 
            <span style="margin-left: 2px;">${item.seriesName || item.name}</span>
          </div>
          <div style="font-weight: 600; color: #1e293b; font-size: 14px; margin-left: 24px; font-variant-numeric: tabular-nums;">
            ${val}
          </div>
        </div>`;

      // ... 下面的 if (item.data && item.data.formula && item.data.r2) { ... } 保持不变
      if (item.data && item.data.formula && item.data.r2) {
        result += `
          <div style="margin-top: 6px; margin-bottom: 10px; padding: 8px 10px; background: rgba(11, 194, 214, 0.06); border-radius: 6px; border-left: 3px solid #0bc2d6; font-size: 12px; color: #64748b; font-family: 'Consolas', 'Courier New', monospace; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);">
            <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
              <span>回归方程：</span>
              <span style="color: #0f172a; font-weight: 600;">${item.data.formula}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>拟合优度 (R²)：</span>
              <span style="font-weight: 600;">
                <span style="color: ${item.data.r2 > 0.8 ? '#10b981' : '#f59e0b'}; margin-right: 6px;">${item.data.r2}</span>
                ${item.data.status || ''}
              </span>
            </div>
          </div>
        `;
      }
    });
    return result;
  };
}

// 【渲染插件 A】注入趋势线
function applyTrendlines(seriesData) {
  const trendLines = [];
  seriesData.forEach(s => {
    if (s.type === 'line' || s.type === 'bar') {
      const trendData = calculateLinearRegression(s.data);
      trendLines.push({
        name: s.name + ' (趋势)',
        type: 'line',
        data: trendData,
        // 🌟 核心防御标记：告诉表格和外层，这是一个纯视觉辅助线，不属于业务数据
        isTrendline: true,
        lineStyle: { type: 'dashed', width: 2, opacity: 0.8 },
        itemStyle: { color: s.itemStyle?.color },
        symbol: 'none',
        tooltip: { valueFormatter: value => value + ' (拟合)' }
      });
    }
  });
  return [...seriesData, ...trendLines];
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