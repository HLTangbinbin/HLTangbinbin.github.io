export const generateSmartInsights = (chartOption, selectedLegend = null) => {
    if (!chartOption || !chartOption.series) return null;

    let mainSeries = null;
    if (selectedLegend) {
        mainSeries = chartOption.series.find(s => !s.isTrendline && s.name === selectedLegend);
    }
    if (!mainSeries) {
        mainSeries = chartOption.series.find(s => !s.isTrendline);
    }

    if (!mainSeries || !Array.isArray(mainSeries.data)) return null;

    const categories = chartOption.xAxis?.data || chartOption.xAxis?.[0]?.data || [];
    const data = mainSeries.data.map(d => typeof d === 'object' && d !== null ? d.value : d);
    const validData = data
        .map((value, index) => ({ value, index }))
        .filter(item => typeof item.value === 'number' && !isNaN(item.value));

    if (validData.length < 2) return null;

    const latestItem = validData[validData.length - 1];
    const prevItem = validData[validData.length - 2];
    const maxItem = validData.reduce((best, current) => current.value > best.value ? current : best, validData[0]);
    const minItem = validData.reduce((best, current) => current.value < best.value ? current : best, validData[0]);
    const growth = prevItem.value === 0 ? 0 : ((latestItem.value - prevItem.value) / prevItem.value) * 100;
    const anomalies = Array.isArray(mainSeries.markPoint?.data) ? mainSeries.markPoint.data : [];
    const trendSeries = chartOption.series.find(s => s.isTrendline && s.name.includes('(趋势)') && s.name.includes(mainSeries.name));

    let trendSummary = '较上期持平';
    if (growth > 0) trendSummary = `较上期增长 ${growth.toFixed(1)}%`;
    else if (growth < 0) trendSummary = `较上期下降 ${Math.abs(growth).toFixed(1)}%`;

    let riskSummary = '近期未见明显异常';
    if (anomalies.length > 0) {
        const lastAnomaly = anomalies[anomalies.length - 1];
        const anomalyDate = categories[lastAnomaly.coord?.[0]] || '近期';
        riskSummary = `${anomalies.length} 个异常点，最近在 ${anomalyDate}`;
    }

    const isYearlyCompare = Array.isArray(categories)
        && categories.length === 12
        && categories.every((item) => /月$/.test(String(item || '')));

    let forecastCard = {
        label: '未来预测',
        value: '暂无',
        detailHtml: '当前图表未生成趋势预测',
        tone: 'neutral'
    };

    if (!isYearlyCompare && trendSeries && Array.isArray(trendSeries.data) && trendSeries.data.length > 0) {
        const futurePredObj = trendSeries.data[latestItem.index + 1];
        const futurePred = typeof futurePredObj === 'object' ? futurePredObj?.value : futurePredObj;
        if (futurePred !== null && futurePred !== undefined && !Number.isNaN(Number(futurePred))) {
            const forecastTone = Number(futurePred) > latestItem.value ? 'up' : Number(futurePred) < latestItem.value ? 'down' : 'neutral';
            const direction = forecastTone === 'up' ? '偏上行' : forecastTone === 'down' ? '偏下行' : '保持平稳';
            forecastCard = {
                label: '未来预测',
                value: formatInsightValue(futurePred),
                detailHtml: `下一期预测值<span class="detail-separator">·</span><span class="tone-${forecastTone}">${direction}</span>`,
                tone: forecastTone
            };
        }
    }

    const cards = [
        {
            label: '最新值',
            value: formatInsightValue(latestItem.value),
            valueHtml: formatInsightValue(latestItem.value),
            detailHtml: `<span class="detail-emphasis">${categories[latestItem.index] || '最新期'}</span><span class="detail-separator">·</span><span class="tone-${growth > 0 ? 'up' : growth < 0 ? 'down' : 'neutral'}">${trendSummary}</span>`,
            tone: growth > 0 ? 'up' : growth < 0 ? 'down' : 'neutral'
        },
            {
                label: '区间',
                value: `${formatInsightValue(minItem.value)} - ${formatInsightValue(maxItem.value)}`,
                valueHtml: `<span class="tone-up">${formatInsightValue(minItem.value)} - ${formatInsightValue(maxItem.value)}</span>`,
                detailHtml: `高点 <span class="detail-alert">${categories[maxItem.index] || '峰值期'}</span><span class="detail-separator">·</span>低点 <span class="detail-alert">${categories[minItem.index] || '低点期'}</span>`,
                tone: 'up'
            },
        {
            label: '风险提示',
            value: anomalies.length > 0 ? '波动偏强' : '运行平稳',
            valueHtml: anomalies.length > 0 ? '<span class="tone-up">波动偏强</span>' : '<span class="tone-down">运行平稳</span>',
            detailHtml: anomalies.length > 0
                ? `${anomalies.length} 个异常点<span class="detail-separator">·</span>最近在 <span class="detail-alert">${categories[anomalies[anomalies.length - 1]?.coord?.[0]] || '近期'}</span>`
                : `<span class="tone-down">${riskSummary}</span>`,
            tone: anomalies.length > 0 ? 'up' : 'down'
        }
    ];

    if (!isYearlyCompare) {
        cards.push(forecastCard);
    }

    return {
        subject: mainSeries.name,
        cards
    };
};

function formatInsightValue(value) {
    const number = Number(value);
    if (Number.isNaN(number)) return String(value ?? '-');
    if (Math.abs(number) >= 1000) return number.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return number.toFixed(Math.abs(number) >= 10 ? 1 : 2);
}
