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
  // 🌟 核心拼图 3：X 轴时光机 (向未来延展 3 个周期)
  // 仅在非同比模式下开启未来预测，否则会破坏 1-12 月的固定坐标系
  const futureSteps = (params.enableSmartAnalysis && !params.isYearlyCompare) ? 3 : 0;
  if (futureSteps > 0 && filteredYears.length > 0) {
    const isMonthly = params.dbCode === 'yd' || params.viewMode === 'monthly';
    let current = String(filteredYears[filteredYears.length - 1]);
    for (let i = 0; i < futureSteps; i++) {
      if (isMonthly) {
        let y = parseInt(current.substring(0, 4));
        let m = parseInt(current.substring(4, 6));
        m++;
        if (m > 12) { m = 1; y++; }
        current = `${y}${m.toString().padStart(2, '0')}`;
      } else {
        current = String(parseInt(current) + 1);
      }
      filteredYears.push(current); // 将未来时间塞入坐标轴
    }
  }
  const originalLegendData = seriesData.map(s => s.name);

  if (params.isYearlyCompare) {
    const compareOption = buildYearlyCompareOption(seriesData, filteredYears, params);
    compareOption.originalLegendData = originalLegendData;
    return compareOption;
  }

  seriesData = applyBirthPrediction(seriesData, marriageArr, birthArr, params);

  // 确保 futureSteps 传递给底层算法引擎
  if (params.enableSmartAnalysis) {
    seriesData = applyTrendlines(seriesData, params, futureSteps);
  }

  const optionData = buildOptionSkeleton(seriesData, filteredYears, params);
  optionData.originalLegendData = originalLegendData;

  if (params.pieConfig?.enabled) {
    attachPieChartToOption(optionData, seriesData, filteredYears, params);
  }

  // 🌟 修复：补回标准模式的耗时打印，消除 startTime 未使用报错
  if (typeof logger !== 'undefined') {
    logger.debug(`[getCommonChartOption] 总耗时: ${Math.round(performance.now() - startTime)}ms, 标题: ${params.title}`);
  }
  /* 🌟 终极同步：在所有数据（包括同比、趋势线）生成完毕后，统一清理图例 */
  /* 确保图例中只显示有名字、且未被标记为隐藏的指标 */
  if (optionData.series && optionData.legend) {
    /* 这里的 logic 兼容了字符串数组和对象数组两种情况 */
    optionData.legend.data = optionData.series
      .filter(s => {
        /* 过滤掉标记为隐藏的辅助线（如预测下限、预测区间） */
        /* 同时确保只有具备有效名称的序列才会出现在图例中 */
        return s.name && s.hideInLegend !== true && s.isTrendline !== true;
      })
      .map(s => String(s.name));
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

export function attachPieChartToOption(optionData, seriesData, filteredYears, params) {
  if (!seriesData || seriesData.length === 0 || !filteredYears || filteredYears.length === 0) return;

  optionData.color = optionData.color || ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];

  // 🌟 核心修复：时光机倒退，动态计算真实的最新历史数据索引，避开未来的空白预测期
  const futureSteps = (params.enableSmartAnalysis && !params.isYearlyCompare) ? 3 : 0;
  const targetIndex = Math.max(0, filteredYears.length - 1 - futureSteps);

  const legendData = optionData.legend?.data || [];

  params.pieConfig.pies.forEach((pie, idx) => {
    // 过滤出该饼图需要展示的指标系列
    const targetSeries = seriesData.filter(s => pie.triggerZbCodes.includes(s.zbCode));

    const pieData = [];
    targetSeries.forEach(series => {
      // 🌟 图层净化：绝对不能把辅助线（趋势线、预测阴影、置信区间）当成业务数据算进饼图里
      const isAuxiliaryLine = series.isTrendline ||
        String(series.name).includes('预测') ||
        String(series.name).includes('下限') ||
        String(series.name).includes('区间');

      if (isAuxiliaryLine) return;

      // 抓取真实的最新历史数据，兼容 {value: xxx} 对象格式
      if (Array.isArray(series.data)) {
        const rawVal = series.data[targetIndex];
        const val = typeof rawVal === 'object' && rawVal !== null ? rawVal.value : rawVal;

        if (val !== null && val !== undefined && val !== '-' && val !== '') {
          pieData.push({
            name: series.name,
            value: Number(val)
          });
        }
      }
    });

    // 🌟 如果这一期全都没有有效数据，直接跳过不画，防止出现只有背景的空洞
    if (pieData.length === 0) return;

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
      // 手机端圆心高度打 0.75 折
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
    if (params.enableSmartAnalysis) {
      // 同比模式下，只画趋势线对比，不进行未来时序延展 (futureSteps 传 0)
      finalSeries = applyTrendlines(newSeries, params, 0);
    }
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
// 【数学模块】最小二乘法线性回归 (新增 近期动量拐点捕获)
function calculateLinearRegression(dataArr, futureSteps = 0) {
  let n = 0, sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  const validPoints = [];

  dataArr.forEach((val, x) => {
    if (val === null || val === undefined || val === '') return;
    let num = typeof val === 'object' ? val.value : val;
    if (num === null || num === undefined || num === '') return;

    num = Number(num);
    if (!isNaN(num)) {
      n++; sumX += x; sumY += num;
      sumXY += (x * num); sumXX += (x * x);
      validPoints.push({ x, y: num });
    }
  });

  if (n < 2) return dataArr.map(() => '-');

  // 全局趋势基准
  const denominator = (n * sumXX - sumX * sumX);
  const m = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const b = (sumY - m * sumX) / n;

  // 🌟 核心升级：近期动量修正 (专门捕获人口/经济的近期暴跌拐点)
  let recentM = m;
  if (validPoints.length >= 4) {
    const recent = validPoints.slice(-5); // 提取最近 5 个周期测算局部动量
    let rn = recent.length, rSumX = 0, rSumY = 0, rSumXY = 0, rSumXX = 0;
    recent.forEach(p => {
      rSumX += p.x; rSumY += p.y;
      rSumXY += p.x * p.y; rSumXX += p.x * p.x;
    });
    const rDenom = (rn * rSumXX - rSumX * rSumX);
    if (rDenom !== 0) recentM = (rn * rSumXY - rSumX * rSumY) / rDenom;
  }

  const meanY = sumY / n;
  let ssTot = 0, ssRes = 0, residualSqSum = 0;
  validPoints.forEach(p => {
    const predicted = m * p.x + b;
    ssTot += Math.pow(p.y - meanY, 2);
    ssRes += Math.pow(p.y - predicted, 2);
    residualSqSum += Math.pow(p.y - predicted, 2);
  });

  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - (ssRes / ssTot));
  const rmse = Math.sqrt(residualSqSum / Math.max(1, n - 2));

  const formulaStr = `y = ${m.toFixed(2)}x ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(2)}`;

  const anomalies = [];
  const trendData = [];
  const lowerBand = [];
  const bandDiff = [];
  const totalLen = dataArr.length + futureSteps;

  const lastRealX = validPoints[validPoints.length - 1].x;
  const lastRealTrendY = m * lastRealX + b; // 历史拟合线的终点

  for (let x = 0; x < totalLen; x++) {
    let predY;

    if (x <= lastRealX) {
      // 历史区间：使用全局拟合，保证趋势平滑
      predY = Number((m * x + b).toFixed(2));

      let val = dataArr[x];
      let num = val !== null && typeof val === 'object' ? val.value : val;
      if (num !== null && num !== undefined && num !== '' && !isNaN(Number(num)) && rmse > 0) {
        const diff = Number(num) - predY;
        if (Math.abs(diff) > 2 * rmse) {
          anomalies.push({ x, y: Number(num), diff: diff > 0 ? '超预期' : '低于预期' });
        }
      }
    } else {
      // 🌟 未来预测区间：从历史终点出发，使用近期动量(recentM)切线延伸！
      // 这样哪怕前10年暴涨，只要近2年暴跌，预测线也会立刻朝下拐！
      const stepsAhead = x - lastRealX;
      predY = Number((lastRealTrendY + recentM * stepsAhead).toFixed(2));
    }

    const isFlat = Math.abs(m / (meanY || 1)) < 0.001;
    let statusText = isFlat ? '<span style="color: #94a3b8;">(平稳)</span>' : (r2 > 0.8 ? '<span style="color: #10b981;">(强劲)</span>' : '<span style="color: #f59e0b;">(波动)</span>');

    trendData.push({ value: predY, formula: formulaStr, r2: r2.toFixed(4), status: statusText });

    if (x >= dataArr.length - 1) {
      const stepAhead = x - (dataArr.length - 1);
      const baseMargin = Math.max(2 * rmse, Math.abs(predY) * 0.02);
      const margin = baseMargin * (1 + stepAhead * 0.25);

      lowerBand.push(Number((predY - margin).toFixed(2)));
      bandDiff.push(Number((margin * 2).toFixed(2)));
    } else {
      lowerBand.push(null);
      bandDiff.push(null);
    }
  }

  Object.defineProperty(trendData, '_metadata', { value: { anomalies, rmse, lowerBand, bandDiff, recentM }, enumerable: false });
  return trendData;
}

// 🌟 提取独立的高级 Tooltip 渲染引擎，供所有模式复用
function getAdvancedTooltipFormatter() {
  return (params) => {
    if (!params) return '';
    const paramsArray = Array.isArray(params) ? params : [params];

    // 🛡️ 核心修复 2：过滤掉所有可能的幽灵节点，防止 ECharts 传毒
    // 🛡️ 核心修复 2：过滤幽灵节点，并彻底屏蔽用于画扇形的隐藏辅助线
    const validParams = paramsArray.filter(p =>
      p && p.value !== '-' && p.value != null && p.value !== '' &&
      !String(p.seriesName).includes('(预测下限)') &&
      !String(p.seriesName).includes('(预测区间)')
    );

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

// 【渲染插件 A】注入趋势线、异常打点与未来预测扇形
// 【渲染插件 A】注入趋势线与预测扇形 (支持单图例聚焦)
function applyTrendlines(seriesData, params = {}, futureSteps = 0) {
  const trendLines = [];
  // 🌟 如果开启了智能分析且存在下拉框选择的指标，则只对该指标进行深入分析
  const focusedLegend = params.enableSmartAnalysis ? params.selectedLegend : null;

  seriesData.forEach(s => {
    if (s.type === 'line' || s.type === 'bar') {

      // 🌟 图层过滤：多图例时，屏蔽非选中图例的趋势线和异常针，防止画面凌乱
      if (focusedLegend && s.name !== focusedLegend && seriesData.length > 1) return;

      const trendData = calculateLinearRegression(s.data, futureSteps);
      const meta = trendData._metadata;
      const themeColor = s.itemStyle?.color || '#0bc2d6';

      trendLines.push({
        name: s.name + ' (趋势)',
        type: 'line',
        data: trendData,
        isTrendline: true,
        lineStyle: { type: 'dashed', width: 2, opacity: 0.8 },
        itemStyle: { color: themeColor },
        symbol: 'none',
        tooltip: { valueFormatter: value => value + ' (拟合)' },
        z: 5
      });
      if (params.enableSmartAnalysis && futureSteps > 0 && meta) {
        // 预测下限：作为透明支撑架
        trendLines.push({
          name: `${s.name} (预测下限)`, // 赋予合法名字，确保表格等逻辑不报错
          type: 'line',
          data: meta.lowerBand,
          isTrendline: true,
          hideInLegend: true, // 🌟 专业标记：告诉图例组件忽略我
          stack: `conf-band-${s.name}`,
          lineStyle: { opacity: 0 },
          symbol: 'none',
          tooltip: { show: false },
          silent: true
        });

        // 预测区间：作为阴影填充层
        trendLines.push({
          name: `${s.name} (预测区间)`, // 赋予合法名字
          type: 'line',
          data: meta.bandDiff,
          isTrendline: true,
          hideInLegend: true, // 🌟 专业标记
          stack: `conf-band-${s.name}`,
          lineStyle: { opacity: 0 },
          areaStyle: { color: themeColor, opacity: 0.25 },
          symbol: 'none',
          tooltip: { show: false },
          silent: true
        });
      }

      if (params.enableSmartAnalysis && meta && meta.anomalies.length > 0) {
        s.markPoint = {
          symbol: 'pin',
          symbolSize: 45,
          itemStyle: { color: '#ef4444', shadowBlur: 10, shadowColor: 'rgba(239,68,68,0.4)' },
          label: { color: '#fff', fontSize: 10, formatter: '异常' },
          data: meta.anomalies.map(a => ({ coord: [a.x, a.y], name: '异常点', value: a.diff }))
        };
      }
    }
  });
  return [...seriesData, ...trendLines];
}

// 🌟 智能数据叙事生成器 (支持多图例联动、跨指标关联推演、全局核心指标红字高亮)
export function generateSmartNarrative(chartOption, selectedLegend = null) {
  if (!chartOption || !chartOption.series) return '';

  let mainSeries = null;
  if (selectedLegend) {
    mainSeries = chartOption.series.find(s => !s.isTrendline && s.name === selectedLegend);
  }
  if (!mainSeries) {
    mainSeries = chartOption.series.find(s => !s.isTrendline);
  }

  if (!mainSeries || !Array.isArray(mainSeries.data)) return '';

  const categories = chartOption.xAxis?.data || chartOption.xAxis?.[0]?.data || [];
  const data = mainSeries.data.map(d => typeof d === 'object' && d !== null ? d.value : d);
  const numericData = data.filter(d => typeof d === 'number' && !isNaN(d));

  if (numericData.length < 2) return '数据积累不足，暂无法生成有效洞察。';

  const max = Math.max(...numericData);
  const min = Math.min(...numericData);
  const maxDate = categories[data.indexOf(max)] || '';

  const latest = numericData[numericData.length - 1];
  const prev = numericData[numericData.length - 2];
  const growth = prev === 0 ? 0 : ((latest - prev) / prev * 100).toFixed(1);

  let growthText = '';
  if (growth > 0) growthText = `较上期 <span style="color: #ef4444; font-weight: bold;">增长 ${growth}%</span>`;
  else if (growth < 0) growthText = `较上期 <span style="color: #22c55e; font-weight: bold;">衰退 ${Math.abs(growth)}%</span>`;
  else growthText = `与上期持平`;

  // 异常数量与日期红色高亮
  let anomaliesText = '';
  if (mainSeries.markPoint?.data?.length > 0) {
    const anomalies = mainSeries.markPoint.data;
    const lastAnomalyIndex = anomalies[anomalies.length - 1].coord[0];
    const lastAnomalyDate = categories[lastAnomalyIndex] || '近期';
    anomaliesText = `<strong>异常检测：</strong>系统基于 2σ 模型捕获到 <strong style="color: #ef4444;">${anomalies.length}</strong> 处异常，最近一次突变发生在 <strong style="color: #ef4444;">${lastAnomalyDate}</strong>，建议重点复盘。`;
  } else {
    anomaliesText = `<strong>异常检测：</strong>数据完全在置信区间内平稳波动，未检测到异常突发点。`;
  }

  // 时序推演：上下行压力与预期中枢红色高亮
  let forecastText = '';
  const trendSeries = chartOption.series.find(s => s.isTrendline && s.name.includes('(趋势)') && s.name.includes(mainSeries.name));
  if (trendSeries && trendSeries.data) {
    const lastPredObj = trendSeries.data[trendSeries.data.length - 1];
    const lastPred = typeof lastPredObj === 'object' ? lastPredObj.value : lastPredObj;

    const meta = trendSeries.data._metadata;
    let momentumAlert = '';
    if (meta && meta.recentM < -0.01) momentumAlert = ' (受近期下行动量拖累)';
    else if (meta && meta.recentM > 0.01) momentumAlert = ' (受近期上行动量拉升)';

    const direction = lastPred > latest ? '上行空间' : '下行压力';
    forecastText = `<br/>🔮 <strong>未来推演：</strong>结合近期数据动量修正模型，预测未来 3 个周期内指标存在<strong style="color: #ef4444;">${direction}</strong>${momentumAlert}，预期中枢在 <strong style="color: #ef4444;">${lastPred}</strong> 左右，已生成扇形置信区间。`;
  }

  // 跨指标先行推演
  let crossMetricText = '';
  const crossPredSeries = chartOption.series.find(s => s.name && s.name.includes('预测') && !s.isTrendline);
  if (crossPredSeries && Array.isArray(crossPredSeries.data)) {
    const validPreds = crossPredSeries.data.filter(d => d !== null && d !== undefined);
    if (validPreds.length > 0) {
      const nextVal = typeof validPreds[validPreds.length - 1] === 'object' ? validPreds[validPreds.length - 1].value : validPreds[validPreds.length - 1];
      const baseName = crossPredSeries.name.replace('预测', '').trim();
      crossMetricText = `<br/>🔗 <strong>指标推演：</strong>基于关联数据（婚姻登记）的历史转化率模型，系统独立推算下一周期 <strong>[${baseName}]</strong> 的规模预期约为 <strong style="color: #8b5cf6;">${nextVal}</strong>。`;
    }
  }

  // 基础数据：最高点时间与峰值红色高亮
  return `<strong>🧐 数据分析：</strong>基于当前 <strong>${mainSeries.name}</strong> 数据测算：整体分布在 ${min} 至 ${max} 之间，并于 <strong style="color: #ef4444;">${maxDate}</strong> 触及峰值 <strong style="color: #ef4444;">${max}</strong>。
  最新一期录得 <strong>${latest}</strong>，${growthText}。<br/>💡 ${anomaliesText} ${forecastText} ${crossMetricText}`;
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