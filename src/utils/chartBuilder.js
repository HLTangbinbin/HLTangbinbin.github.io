import { selectDataFromArr, offsetArray, selectMapTimelineData } from './dataEngine.js';
import { ComparePlugin, SmartAnalysisPlugin, PiePlugin, BirthPredictionPlugin, LegendFilterPlugin, MapTimelinePlugin } from './chartPlugins.js';
import { logger } from "@/utils/Logger";

class ChartBuilder {
  constructor(params) {
    this.params = params;
    this.plugins = [];
    this.ctx = this.initContext();
    this.option = this.buildBaseOption();
  }

  initContext() {
    const { data, zbcodeArr, cityCodeArr = [], dbCode = 'nd', unit = '', exceptName = '', chartType = 'bar', yearLimit, enableBirthOffset = false, selectedLegend, offsetValue = 0 } = this.params;
    if (chartType === 'map') {
        const mainZbCode = zbcodeArr[0]; 
        const mapTimelineData = selectMapTimelineData(data, mainZbCode, dbCode, yearLimit);
        logger.debug('当前的mapTimelineData',mapTimelineData)
        this.params.mapTimelineData = mapTimelineData;
        this.params.metricName = exceptName || data.data[dbCode]?.[mainZbCode]?.cname || '指标';
        this.params.unit = data.data[dbCode]?.[mainZbCode]?.unit || '';
  
        // 💥 修复点：在这里补上 filteredYears: []，以及其他插件可能依赖的空数组，防止下游解构崩溃
        return { 
          isMapContext: true, 
          seriesData: [], 
          filteredYears: [], // <--- 关键防弹衣！让 [...this.ctx.filteredYears] 变成展开空数组而不报错
          marriageArr: [], 
          birthArr: [],
          params: this.params 
        };
      }


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
        seriesData.push({ name, zbCode: zbcodeArr[0], type: chartType, data: result.map(i => i.value), date: result.map(i => i.date), emphasis: { focus: 'series' } });
      });
    }

    return { params: this.params, seriesData, filteredYears: seriesData[0]?.date || [], marriageArr, birthArr };
  }

  buildBaseOption() {
    const { title, subtitle, isHorizontal, legendAllSelected, gridTop = '140px', legendTop = '70px', unit = '', isMobile, titleTop = '15px' } = this.params;
    
    const valueAxisConfig = {
      type: 'value', scale: true,
      min: (v) => v.min - (v.max - v.min) * 0.1,
      max: (v) => v.max + (v.max - v.min) * 0.1,
      axisLabel: { formatter: (v) => v.toFixed(Math.abs(v) >= 1 ? 2 : 3) + unit },
    };
    const categoryAxisConfig = { type: 'category', data: [...this.ctx.filteredYears] };

    return {
      title: {
        text: title, subtext: subtitle, left: 'center', top: titleTop, itemGap: 22,
        textStyle: { fontSize: isMobile ? 14 : 18 },
        subtextStyle: { fontWeight: 'bold', fontSize: isMobile ? 12 : 13, width: window.innerWidth * 0.8, overflow: 'breakAll' }
      },
      tooltip: {
        trigger: 'axis', confine: true, enterable: true,
        extraCssText: 'max-height: 450px; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.12); padding-right: 15px;',
        formatter: this.getAdvancedTooltipFormatter()
      },
      legend: { 
        type: 'scroll', left: 'center', top: legendTop, 
        data: this.ctx.seriesData.map(s => s.name), 
        selected: legendAllSelected ? this.ctx.seriesData.reduce((acc, s) => ({ ...acc, [s.name]: true }), {}) : {} 
      },
      grid: { left: '1%', right: '1%', top: gridTop, bottom: '1%', containLabel: true },
      xAxis: isHorizontal ? valueAxisConfig : categoryAxisConfig,
      yAxis: isHorizontal ? categoryAxisConfig : valueAxisConfig,
      series: JSON.parse(JSON.stringify(this.ctx.seriesData)) 
    };
  }

  getAdvancedTooltipFormatter() {
    return (params) => {
      if (!params) return '';
      const paramsArray = Array.isArray(params) ? params : [params];

      const validParams = paramsArray.filter(p =>
        p && p.value !== '-' && p.value != null && p.value !== '' &&
        !String(p.seriesName).includes('(预测下限)') &&
        !String(p.seriesName).includes('(预测区间)')
      );

      const sorted = validParams.sort((a, b) => {
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

  use(plugin) {
    this.plugins.push(plugin);
    return this;
  }

  build() {
    let finalOption = this.option;
    this.plugins.forEach(plugin => {
      finalOption = plugin(finalOption, this.ctx);
    });
    finalOption.originalLegendData = this.ctx.seriesData.map(s => s.name);
    logger.debug('finalOption',finalOption)
    return finalOption;
  }
}

export const buildChartOption = (params) => {
  const builder = new ChartBuilder(params);
  // 注入地图插件
  builder.use(MapTimelinePlugin);
  if (params.isYearlyCompare) builder.use(ComparePlugin);
  else if (params.enableBirthPrediction) builder.use(BirthPredictionPlugin);
  
  if (params.enableSmartAnalysis) builder.use(SmartAnalysisPlugin);
  if (params.pieConfig?.enabled && !params.isYearlyCompare) builder.use(PiePlugin);
  
  builder.use(LegendFilterPlugin); 

  return builder.build();
};