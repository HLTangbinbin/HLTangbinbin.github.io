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
  
  // 核心改动：严格校验是否存在新版的 cityNodes
  if (!codeItem || !Array.isArray(codeItem.cityNodes)) return [];

  let dataArr = [];

  // 精准打击：直接进入对应的城市节点提取数据
  if (cityCode) {
    const targetNode = codeItem.cityNodes.find(n => n.cityCode === cityCode);
    if (targetNode && Array.isArray(targetNode.data)) {
      dataArr = [...targetNode.data];
    }
  } else {
    // 如果未传入城市代码（如全国单线数据），默认抓取第一个节点
    if (codeItem.cityNodes.length > 0 && Array.isArray(codeItem.cityNodes[0].data)) {
      dataArr = [...codeItem.cityNodes[0].data];
    }
  }

  // 👇 下面的排序、截断和清洗逻辑，一行都不用变，保持你原来的经典配方
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
export const selectMapTimelineData = (returndata, zbCode, dbCode = 'nd', yearLimit = 10) => {
  const codeItem = returndata.data?.[dbCode]?.[zbCode];
  
  // 核心改动：严格校验是否存在新版的 cityNodes
  if (!codeItem || !Array.isArray(codeItem.cityNodes)) {
    return { years: [], timelineData: [] };
  }

  // 1. 临时“拍扁”：将嵌套的 cityNodes 展开为地图组件需要的带城市名的数据列
  let flatData = [];
  codeItem.cityNodes.forEach(node => {
    if (Array.isArray(node.data)) {
      node.data.forEach(d => {
        // 给内层的每一个数值临时挂上外层的城市身份标签
        flatData.push({ ...d, cityCode: node.cityCode, cityName: node.cityName });
      });
    }
  });

  // 2. 提取所有有数据的年份并去重、排序（使用 flatData 替代老的 codeItem.data）
  const yearsSet = new Set(flatData.map(d => d.date?.substring(0, 4)));
  let years = Array.from(yearsSet).filter(Boolean).sort((a, b) => a - b);

  // 3. 截取最近的 N 年
  if (yearLimit && years.length > yearLimit) {
    years = years.slice(-yearLimit);
  }

  // 4. 构建城市代码到名称的映射字典（用于兜底）
  const regMap = {};
  if (Array.isArray(returndata.reg)) {
    returndata.reg.forEach(r => { regMap[r.code] = r.cname; });
  }

  // 5. 按年份分组，组装 ECharts 时间轴地图所需的 timelineData
  const timelineData = years.map(year => {
    const yearData = flatData
      .filter(d => d.date && d.date.substring(0, 4) === year)
      .map(d => {
        // 确定城市名称，并自动补全“市”字以匹配 ECharts 地图的 GeoJSON 标准
        let mappedName = d.cityName || regMap[d.cityCode] || '';
        if (mappedName && !/[省市区州盟县]$/.test(mappedName)) {
          mappedName += "市";
        }
        
        // 提取并清洗数值
        let rawVal = typeof d.value === 'object' ? d.value.value : d.value;
        let val = (rawVal === '' || rawVal === null || rawVal === undefined) ? null : Number(rawVal);

        return { name: mappedName, value: val, cityCode: d.cityCode };
      })
      // 过滤掉无效数据和空城市名
      .filter(d => d.value !== null && !isNaN(d.value) && d.name !== '');

    return { year, data: yearData };
  });

  // 6. 剔除完全没有数据的空年份
  const validTimeline = timelineData.filter(td => td.data.length > 0);
  const finalYears = validTimeline.map(t => t.year);
  
  return { years: finalYears, timelineData: validTimeline };
};
