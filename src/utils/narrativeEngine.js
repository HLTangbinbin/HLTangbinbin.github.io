export const generateSmartNarrative = (chartOption, selectedLegend = null) => {
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
  
    let anomaliesText = '';
    if (mainSeries.markPoint?.data?.length > 0) {
      const anomalies = mainSeries.markPoint.data;
      const lastAnomalyIndex = anomalies[anomalies.length - 1].coord[0];
      const lastAnomalyDate = categories[lastAnomalyIndex] || '近期';
      anomaliesText = `<strong>异常检测：</strong>系统基于 2σ 模型捕获到 <strong style="color: #ef4444;">${anomalies.length}</strong> 处异常，最近一次突变发生在 <strong style="color: #ef4444;">${lastAnomalyDate}</strong>，建议重点复盘。`;
    } else {
      anomaliesText = `<strong>异常检测：</strong>数据完全在置信区间内平稳波动，未检测到异常突发点。`;
    }
  
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
  
    return `<strong>🧐 数据分析：</strong>基于当前 <strong>${mainSeries.name}</strong> 数据测算：整体分布在 ${min} 至 ${max} 之间，并于 <strong style="color: #ef4444;">${maxDate}</strong> 触及峰值 <strong style="color: #ef4444;">${max}</strong>。
    最新一期录得 <strong>${latest}</strong>，${growthText}。<br/>💡 ${anomaliesText} ${forecastText} ${crossMetricText}`;
  };