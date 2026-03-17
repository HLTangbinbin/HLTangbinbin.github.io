import axios from 'axios';
import { logger } from '@/utils/Logger.js';

export * from '@/config/apiParams.js';

export const sortYearMonths = (date1, date2) => {
  const compareYearMonth = (a, b) => {
    a = a.replace('-', '');
    b = b.replace('-', '');
    const aYear = parseInt(a.substring(0, 4));
    const aMonth = parseInt(a.substring(4));
    const bYear = parseInt(b.substring(0, 4));
    const bMonth = parseInt(b.substring(4));
    if (aYear !== bYear) return aYear - bYear;
    return aMonth - bMonth;
  };
  return compareYearMonth(date1, date2);
};

export const selectDataFromArr = (returndata, zbCode, dbCode = 'nd', cityCode = '', yearLimit = 10) => {
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
    const formattedValue = Number.isInteger(val) ? val : Number(val.toFixed(Math.abs(val) >= 1 ? 2 : 3));
    return { value: formattedValue, date: d.date };
  });
};

export const offsetArray = (arr, yearLimit, offset) => {
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

// 新增：提取带时间轴的地图截面数据
// dataEngine.js (完全覆盖原有的 selectMapTimelineData 方法)
export const selectMapTimelineData = (returndata, zbCode, dbCode = 'nd', yearLimit = 10) => {
  // 1. 数据源兜底检查
  const codeItem = returndata.data?.[dbCode]?.[zbCode];
  if (!codeItem || !Array.isArray(codeItem.data)) {
    return { years: [], timelineData: [] };
  }

  // 2. 提取所有有数据的年份并排序
  const yearsSet = new Set(codeItem.data.map(d => d.date?.substring(0, 4)));
  let years = Array.from(yearsSet).filter(Boolean).sort((a, b) => a - b);

  if (yearLimit && years.length > yearLimit) {
    years = years.slice(-yearLimit);
  }

  // 3. 💥 核心修复：构建地域字典 (你的原始数据只有 cityCode，必须来这里捞中文名！)
  const regMap = {};
  if (Array.isArray(returndata.reg)) {
    returndata.reg.forEach(r => {
      regMap[r.code] = r.cname;
    });
  }

  // 4. 组装 Timeline 数据
  const timelineData = years.map(year => {
    const yearData = codeItem.data
      .filter(d => d.date && d.date.substring(0, 4) === year)
      .map(d => {
        // 💥 从字典中精确匹配中文地名
        let mappedName = d.cityName || regMap[d.cityCode] || '';
        if (mappedName && !/[省市区州盟县]$/.test(mappedName)) {
          mappedName += "市";
        }
        // 💥 修正数值提取：把真正的空字符串拦截掉，但保留 0
        let rawVal = typeof d.value === 'object' ? d.value.value : d.value;
        let val = (rawVal === '' || rawVal === null || rawVal === undefined) ? null : Number(rawVal);

        return {
          name: mappedName,
          value: val,
          cityCode: d.cityCode
        };
      })
      // 💥 严密清洗：放行 0！只拦截 null、NaN，并且必须要有 name！
      .filter(d => d.value !== null && !isNaN(d.value) && d.name !== '');

    return { year, data: yearData };
  });

  // 5. 剔除完全没有有效数据的空壳年份
  const validTimeline = timelineData.filter(td => td.data.length > 0);
  const finalYears = validTimeline.map(t => t.year);
  return { years: finalYears, timelineData: validTimeline };
};

const totalUrl = `${process.env.VUE_APP_API_BASE_URL}/easyquery.htm`;
const common_params = { m: 'QueryData', colcode: 'sj', k1: String(Date.now()), h: '1' };

export const sendRequest = async (specificParams) => {
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
};