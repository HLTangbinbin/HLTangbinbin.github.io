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
// //按照年份与日期做筛选与排序
// //按照年份与日期做筛选与排序
export function selectDataFromArr(returnData, zbCode, fieldKey, dbCode = 'nd', cityCode = '', yearLimit = 10) {

  // 先获取所有数据中最大的年份（即数据最后一年）
  const allYears = returnData.dataList.data[dbCode]
    .map(d => parseInt(d.date?.substring(0, 4), 10))
    .filter(y => !isNaN(y));
  const maxDataYear = Math.max(...allYears);

  // 使用 maxDataYear 作为数据有效的当前年份
  const filteredData = returnData.dataList.data[dbCode]
    .filter(returnDataObj => {
      // 筛选符合 zbCode 和 cityCode 的数据
      const isMatchZb = returnDataObj.code.search(zbCode) !== -1;
      const isMatchCity = cityCode === '' || returnDataObj.cityCode.search(cityCode) !== -1;
      if (!isMatchZb || !isMatchCity) return false;

      // 筛选近 yearLimit 年
      if (yearLimit !== null && yearLimit > 0) {
        const year = parseInt(returnDataObj.date?.substring(0, 4), 10);
        if (isNaN(year)) return false;
        return year >= maxDataYear - yearLimit + 1;
      }

      return true;
    })
    .sort((a, b) => {
      // 根据日期排序
      return sortYearMonths(a.date, b.date);
    })
    .filter((returnDataObj, index, array) => {
      // 先过滤掉空字符串
      let filteredData = array.filter(item => item.value !== '');

      // 找到从末尾开始第一个非 0 的数据的位置
      let lastNonZeroIndex = filteredData.length - 1;
      for (let i = filteredData.length - 1; i >= 0; i--) {
        if (filteredData[i].value !== 0) {
          lastNonZeroIndex = i;
          break;
        }
      }

      // 保留中间的 0，剔除末尾连续的 0
      return index <= lastNonZeroIndex || returnDataObj.value !== 0;
    })
    .map(item => {
      // 提取指定字段的值
      return item[fieldKey];
    });

  return filteredData;
}

// 图表统一绘制方法
export function getCommonChartOption(basicParams, zbArr, returnData, cityCodeArr = [], yearLimit = 10) {
  const type = basicParams.chartType;
  const unit = basicParams.unit || '';
  const seriesData = [];


  if (cityCodeArr.length === 0) {
    // 不区分城市，展示多个指标
    zbArr.forEach(zbCode => {
      let cname = selectDataFromArr(returnData, zbCode, 'cname', basicParams.dbCode, '', yearLimit)?.[0] || '总的';

      // 去除 cname 中的 exceptName 字符
      if (typeof cname === 'string' && typeof basicParams.exceptName === 'string') {
        const resultArr = cname.split('');
        const exceptArr = basicParams.exceptName.split('');
        exceptArr.forEach(ch => {
          const idx = resultArr.indexOf(ch);
          if (idx !== -1) resultArr.splice(idx, 1);
        });
        cname = resultArr.join('').trim() || '总的';
      }

      const name = cname + unit;
      const valueArr = selectDataFromArr(returnData, zbCode, 'value', basicParams.dbCode, '', yearLimit) || [];
      seriesData.push({ name, type, data: valueArr });
    });
  } else {
    // 区分城市，展示某一指标在多个城市的对比
    cityCodeArr.forEach(cityCode => {
      const city = returnData.dataList.reg?.find(r => r.code === cityCode);
      const name = city?.cname || '';
      const valueArr = selectDataFromArr(returnData, zbArr[0], 'value', basicParams.dbCode, cityCode, yearLimit) || [];
      seriesData.push({ name, type, data: valueArr });
    });
  }

  // 计算所有series中所有数据点，过滤有效数字
  const allValues = seriesData.flatMap(s => s.data).filter(v => typeof v === 'number' && !isNaN(v));

  const dataMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const dataMax = allValues.length > 0 ? Math.max(...allValues) : 100;

  // 5%缓冲区，防止数据紧贴边界，最小缓冲为1
  const rangeMargin = (dataMax - dataMin) * 0.05 || 1;

  // 优先使用用户传入的 min/max（转数字），否则自动计算
  let finalMin = basicParams.min !== undefined ? Number(basicParams.min) : dataMin - rangeMargin;
  let finalMax = basicParams.max !== undefined ? Number(basicParams.max) : dataMax + rangeMargin;

  const fullYears = (returnData.dataList.sj?.[basicParams.dbCode] || []).sort((a, b) => a.localeCompare(b)); // 确保按年份排序
  const filteredYears = yearLimit ? fullYears.slice(-yearLimit) : fullYears;

  // 防止 min >= max
  if (finalMin >= finalMax) {
    finalMin = dataMin;
    finalMax = dataMax + rangeMargin;
  }

  return {
    title: {
      text: basicParams.title,
      subtext: basicParams.subtitle,
      left: 'center',
      top: 'top',
      subtextStyle: {
        fontWeight: 'bold',
        fontSize: 13,
        lineHeight: 20,
        width: window.innerWidth * 0.8,
        overflowWrap: 'break-word'  // 修正 overflow 属性，保证换行
      }
    },
    tooltip: { trigger: 'axis' },
    legend: { left: 'center', top: basicParams.legendTop || '5%' },
    grid: {
      left: '1%',
      right: '1%',
      top: basicParams.gridTop || '20%',
      bottom: '1%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: filteredYears
    },
    yAxis: {
      type: 'value',
      scale: true,
      min: (value) => value.min - (value.max - value.min) * 0.1, // 下边留10%
      max: (value) => value.max + (value.max - value.min) * 0.1, // 上边留10%
      axisLabel: {
        formatter: (value) => value.toFixed(2) + unit
      }
    },
    series: seriesData
  };
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
};