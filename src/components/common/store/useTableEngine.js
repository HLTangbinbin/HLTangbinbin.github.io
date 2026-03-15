import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';

export function useTableEngine(chartOption, isMobile, chartTitle) {
  const enableHeatmap = ref(false);

  const validSeries = computed(() => {
    if (!chartOption.value || !chartOption.value.series) return [];
    const seriesList = Array.isArray(chartOption.value.series) ? chartOption.value.series : [chartOption.value.series];
    return seriesList
      .map((series, originalIdx) => ({ series, originalIdx }))
      .filter(item => item.series.name && item.series.name.trim() !== '' && !item.series.isTrendline);
  });

  const getSafeAxisData = (axis) => (Array.isArray(axis) ? axis[0]?.data : axis?.data) || [];

  const tableColumns = computed(() => {
    const cols = [{ prop: 'time', label: '时间 / 指标', fixed: 'left', minWidth: 120 }];
    validSeries.value.forEach(item => {
      cols.push({ prop: `col_${item.originalIdx}`, label: item.series.name, minWidth: isMobile.value ? 100 : 140 });
    });
    return cols;
  });

  const tableData = computed(() => {
    const categories = getSafeAxisData(chartOption.value.xAxis) || getSafeAxisData(chartOption.value.yAxis) || [];
    if (categories.length > 0) {
      return categories.map((cat, timeIdx) => {
        const row = { time: cat };
        validSeries.value.forEach(item => {
          let val = '-';
          if (Array.isArray(item.series.data)) {
            const rawVal = item.series.data[timeIdx];
            val = (rawVal !== null && typeof rawVal === 'object' && rawVal.value !== undefined) ? rawVal.value : rawVal;
          }
          row[`col_${item.originalIdx}`] = (val === undefined || val === null || val === '') ? '-' : val;
        });
        return row;
      });
    }
    return [];
  });

  const tableColumnStats = computed(() => {
    const stats = {};
    validSeries.value.forEach(item => {
      const numericData = item.series.data
        .map(d => typeof d === 'object' && d !== null ? d.value : d)
        .filter(d => typeof d === 'number' && !isNaN(d));
      if (numericData.length > 0) stats[`col_${item.originalIdx}`] = { max: Math.max(...numericData), min: Math.min(...numericData) };
    });
    return stats;
  });

  const getTableCellStyle = ({ row, column }) => {
    if (!enableHeatmap.value || column.property === 'time' || row[column.property] === '-') return {};
    const stats = tableColumnStats.value[column.property];
    if (!stats || stats.max === stats.min) return {};
    const val = Number(row[column.property]);
    if (isNaN(val)) return {};
    const ratio = (val - stats.min) / (stats.max - stats.min);
    return { backgroundColor: `rgba(11, 194, 214, ${ratio * 0.45})`, color: ratio > 0.8 ? '#0f172a' : 'inherit' };
  };

  const exportToCSV = () => {
    const cols = tableColumns.value;
    const data = tableData.value;
    if (cols.length === 0 || data.length === 0) return ElMessage.warning('当前暂无可导出的数据');
    
    const header = cols.map(c => `"${c.label}"`).join(',');
    const body = data.map(row => cols.map(c => `"${row[c.prop] ?? '-'}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + header + '\n' + body], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${chartTitle || '数据导出'}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    ElMessage.success('数据导出成功！');
  };

  return { enableHeatmap, tableColumns, tableData, getTableCellStyle, exportToCSV };
}