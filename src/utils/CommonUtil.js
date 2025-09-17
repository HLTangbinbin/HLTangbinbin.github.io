import axios from 'axios'
import { logger } from '@/utils/Logger.js';


// 定义排序函数
export function sortYearMonths(date1, date2) {
  // 自定义比较函数
  function compareYearMonth(a, b) {
    // 将日期字符串转换为统一的格式
    a = a.replace('-', '');
    b = b.replace('-', '');

    // 将年份和月份解析为整数
    var aYear = parseInt(a.substring(0, 4));
    var aMonth = parseInt(a.substring(4));
    var bYear = parseInt(b.substring(0, 4));
    var bMonth = parseInt(b.substring(4));

    // 首先按照年份升序排序
    if (aYear !== bYear) {
      return aYear - bYear;
    } else {
      // 如果年份相同，则按照月份升序排序
      return aMonth - bMonth;
    }
  }

  // 返回排序后的结果
  return compareYearMonth(date1, date2);
}
// 优化的数据筛选函数
export function selectDataFromArr(returndata, zbCode, fieldKey, dbCode = 'nd', cityCode = '', yearLimit = 10) {
  
  const dataList = returndata.dataList.data[dbCode];
  if (!dataList || !Array.isArray(dataList)) {

    return [];
  }



  // 预计算最大年份，避免重复计算
  let maxDataYear = 0;
  const validYears = [];
  
  for (let i = 0; i < dataList.length; i++) {
    const year = parseInt(dataList[i].date?.substring(0, 4), 10);
    if (!isNaN(year)) {
      validYears.push(year);
      if (year > maxDataYear) maxDataYear = year;
    }
  }

  if (validYears.length === 0) return [];

  // 计算年份阈值
  const yearThreshold = yearLimit ? maxDataYear - yearLimit + 1 : 0;
  
  // 一次性筛选和排序
  const result = [];
  const tempData = [];
  
  for (let i = 0; i < dataList.length; i++) {
    const item = dataList[i];
    
    // 快速筛选条件
    if (item.code.indexOf(zbCode) === -1) continue;
    if (cityCode && item.cityCode.indexOf(cityCode) === -1) continue;
    
    // 年份筛选
    if (yearLimit && yearThreshold > 0) {
      const year = parseInt(item.date?.substring(0, 4), 10);
      if (isNaN(year) || year < yearThreshold) continue;
    }
    
    tempData.push(item);
  }
  
  
  // 排序
  tempData.sort((a, b) => {
    const dateA = a.date?.replace('-', '');
    const dateB = b.date?.replace('-', '');
    if (!dateA || !dateB) return 0;
    
    const yearA = parseInt(dateA.substring(0, 4), 10);
    const yearB = parseInt(dateB.substring(0, 4), 10);
    if (yearA !== yearB) return yearA - yearB;
    
    const monthA = parseInt(dateA.substring(4), 10);
    const monthB = parseInt(dateB.substring(4), 10);
    return monthA - monthB;
  });
  
  
  // 过滤末尾的0值
  let lastNonZeroIndex = -1;
  for (let i = tempData.length - 1; i >= 0; i--) {
    if (tempData[i].value !== '' && tempData[i].value !== 0) {
      lastNonZeroIndex = i;
      break;
    }
  }
  
  // 提取字段值
  for (let i = 0; i <= lastNonZeroIndex; i++) {
    result.push(tempData[i][fieldKey]);
  }

  return result;
}

// 图表统一绘制方法
// ============================
// 工具方法
// ============================
function offsetArray(arr, offset = -1) {
  // 向前/向后偏移数组，空位补 null
  if (!Array.isArray(arr)) return arr;
  if (offset < 0) {
    return arr.slice(-offset).concat(Array(-offset).fill(null));
  } else if (offset > 0) {
    return Array(offset).fill(null).concat(arr.slice(0, arr.length - offset));
  }
  return arr;
}


/**
 * 最近 N 年滑动窗口预测（滞后1年，年份动态）
 * @param {number[]} marriageArr - 历史结婚人数数组
 * @param {number[]} birthArr - 历史出生人口数组
 * @param {number} recentYears - 滑动窗口长度（<= marriageArr.length-1）
 * @param {number} z - 置信区间系数，默认 1.96
 */
function fitMarriageBirthDynamic(marriageArr, birthArr, recentYears, z = 1.96) {
  const n = marriageArr.length;
  if (!Array.isArray(marriageArr) || !Array.isArray(birthArr) || n !== birthArr.length || n <= 1) {
    return {
      slidingPreds: [],
      nextYearPred: { yearIndex: null, pred: null, lower: null, upper: null }
    };
  }

  const windowSize = Math.min(recentYears, n - 1);
  const slidingPreds = [];

  // 历史滑动预测
  for (let t = 1; t < n; t++) {
    const start = Math.max(0, t - windowSize);
    const X = marriageArr.slice(start, t);
    const Y = birthArr.slice(start + 1, t + 1);

    if (X.length === 0 || Y.length === 0) {
      slidingPreds.push({
        yearIndex: t,
        marriage: marriageArr[t],
        pred: null,
        lower: null,
        upper: null,
        actual: birthArr[t],
        error: null
      });
      continue;
    }

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
    const residuals = Y.map((y, i) => y - (intercept + w * X[i]));
    const std = residuals.length > 1 ? Math.sqrt(residuals.reduce((s, r) => s + r ** 2, 0) / (residuals.length - 1)) : 0;

    slidingPreds.push({
      yearIndex: t,
      marriage: marriageArr[t],
      pred: Math.round(predValue),
      lower: Math.round(predValue - z * std),
      upper: Math.round(predValue + z * std),
      actual: birthArr[t],
      error: Math.round(predValue - birthArr[t])
    });
  }

  // 下一年预测
  let nextYearPred = { yearIndex: n, pred: null, lower: null, upper: null };

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
    const residualsLast = Ylast.map((y, i) => y - (interceptLast + wLast * Xlast[i]));
    const stdLast = residualsLast.length > 1 ? Math.sqrt(residualsLast.reduce((s, r) => s + r ** 2, 0) / (residualsLast.length - 1)) : 0;

    if (Xlast.length < 2 || Ylast.length < 2) {
      // 数据太少，退化使用上一年婚姻 × 平均生育率
      const k = Xlast.length === 1 ? Ylast[0] / Xlast[0] : 1; 
      nextYearPred = {
        yearIndex: n,
        pred: Math.round(marriageArr[n - 1] * k),
        lower: null,
        upper: null
      };
    }else {
      nextYearPred = {
        yearIndex: n,
        pred: Math.round(interceptLast + wLast * marriageArr[n - 1]),
        lower: Math.round(interceptLast + wLast * marriageArr[n - 1] - z * stdLast),
        upper: Math.round(interceptLast + wLast * marriageArr[n - 1] + z * stdLast)
      };
    }

  }

  return { slidingPreds, nextYearPred };
}


// ============================
// 主方法
// ============================
export function getCommonChartOption(params) {
  
  const {
    data,
    title,
    subtitle,
    zbcodeArr,
    cityCodeArr = [],
    dbCode = 'nd',
    unit = '',
    exceptName = '',
    legendTop = '70px',
    gridTop = '140px',
    chartType = 'bar',
    yearLimit,
    isHorizontal = false,
    legendAllSelected,
    enableBirthOffset = false,
    enableBirthPrediction = false,
    selectedLegend,
    offsetValue = 0
  } = params;

  const startTime = performance.now();

  let marriageArr = [];
  let birthArr = [];
  let nextBirth = 0;
  
  // 优化年份处理
  const fullYears = (data.dataList.sj?.[dbCode] || []).sort((a, b) => a.localeCompare(b));
  const filteredYears = yearLimit ? fullYears.slice(-yearLimit) : fullYears;


  let seriesData = [];

  // ----------------------------
  // 生成基础 series
  if (cityCodeArr.length === 0) {
    zbcodeArr.forEach(zbCode => {
      let originalCname = selectDataFromArr(data, zbCode, 'cname', dbCode, '', yearLimit)?.[0] || '总的';
      let cname = originalCname;

      if (typeof cname === 'string' && typeof exceptName === 'string') {
        const resultArr = cname.split('');
        const exceptArr = exceptName.split('');
        exceptArr.forEach(ch => {
          const idx = resultArr.indexOf(ch);
          if (idx !== -1) resultArr.splice(idx, 1);
        });
        cname = resultArr.join('').trim() || '总的';
      }

      const name = cname + unit;
      let valueArr = selectDataFromArr(data, zbCode, 'value', dbCode, '', yearLimit) || [];

      if (enableBirthOffset && zbCode === 'A0P0C01') {
        marriageArr = valueArr;
      }
      if (enableBirthOffset && zbCode === 'A030109') {
        birthArr = valueArr;
        valueArr = offsetArray(valueArr, -1);
      }
      logger.debug('chartType----name----selectedLegend',chartType,name,selectedLegend)
      if (chartType === 'line' && name === selectedLegend) 
        {
          valueArr = offsetArray(valueArr, offsetValue);

        }

      seriesData.push({
        name: name,
        type: chartType,
        data: valueArr,
      });
    });
  } else {
    cityCodeArr.forEach(cityCode => {
      const city = data.dataList.reg?.find(r => r.code === cityCode);
      const name = city?.cname || '';
      const valueArr = selectDataFromArr(data, zbcodeArr[0], 'value', dbCode, cityCode, yearLimit) || [];
      seriesData.push({
        name: name,
        type: chartType,
        data: valueArr,
      });
    });
  }

  // ----------------------------
  // 预测下一年出生人口
  if (enableBirthPrediction && marriageArr.length && birthArr.length) {
    const mode = fitMarriageBirthDynamic(marriageArr, birthArr, 20);
    nextBirth = mode.nextYearPred.pred;

  }

  // ----------------------------
  // 处理折线图出生人口系列
  seriesData = seriesData.map(s => {
    // 只处理出生人口系列
    if (enableBirthPrediction && s.name.includes('出生')) {
      if (chartType === 'line') {
        const lastIndex = s.data.length - 1;
        const color = s.lineStyle?.color || '#5470C6';
        const updatedData = s.data.slice();
        updatedData[lastIndex] = nextBirth;

        // 历史 + 预测拆分
        const historySeries = {
          ...s,
          type: 'line',
          name: '出生人口',
          data: updatedData.slice(0, lastIndex),
          lineStyle: { type: 'solid' },
        };
        const predictionData = updatedData.map((d, i) => (i >= lastIndex - 1 ? d : null));
        const predictionSeries = {
          ...s,
          type: 'line',
          name: '出生人口预测',
          data: predictionData,
          lineStyle: { color, type: 'dashed' },
          symbol: 'circle',
          symbolSize: 10,
          connectNulls: true
        };
        return [historySeries, predictionSeries];
      } else {
        // 非折线图，保留 series，但 data 置空即可，ECharts 会更新
        return [
          { ...s, type: 'bar'}, // 历史实线 series
          { ...s, type: 'bar', data: [] } // 虚线 series
        ];
      }
    }
    return s;
  }).flat();

  // ---------- 条形图横向正序处理 ----------
if (isHorizontal) {
  // 反转每个 series 的 data
  seriesData = seriesData.map(s => ({
    ...s,
    data: s.data ? [...s.data].reverse() : s.data
  }));
}

  // ----------------------------
  const valueAxisConfig = {
    type: 'value',
    scale: true,
    min: (value) => value.min - (value.max - value.min) * 0.1, // 留10%
    max: (value) => value.max + (value.max - value.min) * 0.1,
    axisLabel: {
      formatter: (value) => value.toFixed(2) + unit,
    },
  };

  const categoryAxisConfig = {
    type: 'category',
    data: isHorizontal ? [...filteredYears].reverse() : filteredYears,
  };

  const result = {
    title: {
      text: title,
      subtext: subtitle,
      left: 'center',
      top: '15',
      itemGap: 22, 
      subtextStyle: {
        fontWeight: 'bold',
        fontSize: 13,
        width: window.innerWidth * 0.8,
        overflow: "breakAll"
      },
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => {
        if (typeof value === 'number') {
          // 如果是整数，直接显示；否则保留2位小数
          return value % 1 === 0 ? value.toString() : value.toFixed(2);
        }
        return value; // 非数值保持不变
      },
    },
    legend: {
      type: 'scroll',
      left: 'center',
      top: legendTop,
      data: seriesData.map(s => s.name),
      selected: legendAllSelected ? seriesData.reduce((acc, s) => ({ ...acc, [s.name]: true }), {}) : {},
    },
    grid: {
      left: '1%',
      right: '1%',
      top: gridTop,
      bottom: '1%',
      containLabel: true,
    },
    xAxis: isHorizontal ? valueAxisConfig : categoryAxisConfig,
    yAxis: isHorizontal ? categoryAxisConfig : valueAxisConfig,
    series: seriesData
  };

  const endTime = performance.now();
  logger.debug(`[getCommonChartOption] 总耗时: ${Math.round(endTime - startTime)}ms, 标题: ${title}, series数量: ${seriesData.length}`);

  return result;
}


// const baseurl = 'https://data.stats.gov.cn/easyquery.htm';
// const proxyServerUrl = 'https://githubproxy-592325394348.herokuapp.com/api'
// 改为这种方式解决跨域报错问题
const totalUrl = `${process.env.VUE_APP_API_BASE_URL}/easyquery.htm`;
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
  {'dbcode' : 'hgnd','rowcode' : 'zb','wds' : '[]','dfwds': '[{"wdcode":"zb","valuecode":"A0G02"},{"wdcode":"sj","valuecode":"LAST20"}]'}, // 运输长度
  {'dbcode' : 'hgnd','rowcode' : 'zb','wds' : '[]','dfwds': '[{"wdcode":"zb","valuecode":"A0G04"},{"wdcode":"sj","valuecode":"LAST20"}]'}, // 客运量
]


export async function sendRequest(specificParams) {

  let datanodesArr = [];
  let newDataArr = []
  let nodesArr_zb = [];         // 城市指标描述数组
  let nodesArr_reg = [];        // 城市指标描述数组
  let nodesArr_sj_code_nd = [];
  let nodesArr_sj_code_yd = [];

  for (let params of specificParams) {
    let mergedParams = { ...common_params, ...params };
    logger.debug("请求完整参数：", mergedParams)
    try {

      let response = await axios.get(totalUrl, { params: mergedParams, timeout: 30000 });
      let data = response.data;
      logger.debug("请求返回数据：", data.returndata)
      if (data && data.returndata) {
        if (data.returndata.datanodes) {
          datanodesArr = datanodesArr.concat(data.returndata.datanodes);
        }
        //获取wdnodes数组的第一个元素，包含cname的数据
        if (data.returndata.wdnodes && data.returndata.wdnodes[0] && data.returndata.wdnodes[0].nodes) {
          nodesArr_zb = nodesArr_zb.concat(data.returndata.wdnodes[0].nodes);
        }
        //对于所有请求来说返回的城市数据都一样，所以不能合并数组
        //获取wdnodes数组的第二个元素，0: zb 1:reg 2:sj ,如果没有reg，则1: sj
        if (data.returndata.wdnodes && data.returndata.wdnodes[1] && data.returndata.wdnodes[1].wdcode === 'reg') {
          nodesArr_reg = data.returndata.wdnodes[1].nodes;
        }
        let dbCode = mergedParams.dbcode;
        if (dbCode.includes('nd')) {
          const nodesArr_sj_nd = data.returndata.wdnodes.slice(-1)[0]?.nodes || [];
          //对于所有请求来说返回的城市数据都一样，所以不能合并数组
          nodesArr_sj_code_nd = nodesArr_sj_nd.map(item => item.code);
        }
        if (dbCode.includes('yd')) {
          const nodesArr_sj_yd = data.returndata.wdnodes.slice(-1)[0]?.nodes || [];
          //对于所有请求来说返回的时间太多组一样的，所以不能合并数组
          nodesArr_sj_code_yd = nodesArr_sj_yd.map(item => item.code);
        }
      }

    } catch (error) {
      if (error.response && error.response.data) {
        logger.error(`JSON解码错误: 响应内容不是JSON格式,响应内容为: ${error.response.data}`);
      } else {
        logger.error('请求错误:', error.message);
      }
      return;
    }
  }
  datanodesArr.forEach(dataElement => {
    let newJson = {};
    newJson['value'] = dataElement['data']['data'];
    newJson['code'] = dataElement['wds'][0]['valuecode'];

    nodesArr_zb.forEach(nodesElement_zb => {
      if (nodesElement_zb['code'] === dataElement['wds'][0]['valuecode']) {
        newJson['cname'] = nodesElement_zb['cname'];
        // 提取并组合字段
        return false; // break the loop
      }
    });

    // 如果有reg的话，['wds'][1]就不是sj是reg了，所以这里取wds的最后一个元素
    newJson['date'] = dataElement['wds'][dataElement['wds'].length - 1]['valuecode'];

    if (dataElement['wds'][1]['wdcode'] === "reg") {
      let valueCode = dataElement['wds'][1]['valuecode'];

      nodesArr_reg.forEach(nodesElement_reg => {
        if (nodesElement_reg['code'] === valueCode) {
          newJson['cityName'] = nodesElement_reg['cname'];
          newJson['cityCode'] = dataElement['wds'][1]['valuecode'];
          return false; // break the loop
        }
      });
    }

    newDataArr.push(newJson);
  });

  const newDataArr_zb = nodesArr_zb.map(item => ({ cname: item.cname, code: item.code }));
  const newDataArr_reg = nodesArr_reg.map(item => ({ cname: item.cname, code: item.code }));
  const newDataArr_sj = [];
  if (nodesArr_sj_code_nd.length > 0) {
    newDataArr_sj.push(nodesArr_sj_code_nd);
  }
  if (nodesArr_sj_code_yd.length > 0) {
    newDataArr_sj.push(nodesArr_sj_code_yd);
  }

  const newData = {
    dataList: newDataArr,
    zb: newDataArr_zb,
    reg: newDataArr_reg,
    sj: newDataArr_sj
  };

  return newData;
}

// 导出模块
export {
  params_wh,
  params_city,
  params_province,
  params_realEstate_invest,
  params_realEstate_sell,
  params_socialretailgoods,
  params_gdp,
  params_nationalFinance,
  params_financialIndustry,
  params_foreignTrade,
  params_population,
  params_education,
  params_medical,
  params_marriage,
  params_indices,
  params_livingStandards,
  params_accommodationAndCatering,
  params_touristIndustry,
  params_transportationAndTelecommunications
};