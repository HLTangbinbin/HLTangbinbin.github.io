export const fitMarriageBirthDynamic = (marriageArr, birthArr, recentYears) => {
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
  };
  
  export const calculateLinearRegression = (dataArr, futureSteps = 0) => {
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
  
    const denominator = (n * sumXX - sumX * sumX);
    const m = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;
  
    let recentM = m;
    if (validPoints.length >= 4) {
      const recent = validPoints.slice(-5);
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
    const lastRealTrendY = m * lastRealX + b;
  
    for (let x = 0; x < totalLen; x++) {
      let predY;
  
      if (x <= lastRealX) {
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
  };