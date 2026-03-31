import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getCssVar } from '@/utils/theme.js';

export function useTableEngine(chartOption, isMobile, chartTitle, chartIdentityStr) {
  const enableHeatmap = ref(false);
  watch(
    () => chartIdentityStr.value,
    () => {
      enableHeatmap.value = false;
    },
    { immediate: true } // ✅ 防止首次残留
  );
  const validSeries = computed(() => {
    if (!chartOption.value || !chartOption.value.series) return [];
    const seriesList = Array.isArray(chartOption.value.series) ? chartOption.value.series : [chartOption.value.series];
    return seriesList
      .map((series, originalIdx) => ({ series, originalIdx }))
      .filter(item => item.series.name && item.series.name.trim() !== '' && !item.series.isTrendline);
  });

  const getSafeAxisData = (axis) => (Array.isArray(axis) ? axis[0]?.data : axis?.data) || [];

  const tableColumns = computed(() => {
    const cols = [{ prop: 'time', label: '时间', fixed: 'left', minWidth: 120 }];
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
      if (numericData.length > 0) {
        const max = Math.max(...numericData);
        const min = Math.min(...numericData);
        // 计算当前列的最大绝对值，作为热力图深浅的极值基准
        const maxAbs = Math.max(Math.abs(max), Math.abs(min));
        stats[`col_${item.originalIdx}`] = { max, min, maxAbs };
      }
    });
    return stats;
  });

  const getTableCellStyle = ({ row, column }) => {
    if (!enableHeatmap.value || column.property === 'time' || row[column.property] === '-') return {};
    const stats = tableColumnStats.value[column.property];
    if (!stats || stats.max === stats.min) return {};

    const val = Number(row[column.property]);
    if (isNaN(val)) return {};

    // 核心：大唐主题的“黄金视觉区间”
    const MIN_ALPHA = 0.12; // 填补断带的保底微弱底色
    const MAX_ALPHA = 0.45; // 恢复原版清爽的透明度上限

    let finalOpacity = 0;

    if (stats.min < 0 && stats.max > 0) {
      // 场景一：跨零点（如增长率、财政盈亏）
      // 这里的 0 必须是纯白基准，因为 0 代表不增不减
      const ratio = Math.abs(val) / stats.maxAbs;
      finalOpacity = ratio * MAX_ALPHA;
    }
    else if (stats.min >= 0) {
      // 场景二：全正数（如GDP、人口）
      if (stats.min === 0) {
        // 如果列中本身就包含 0（如原图1），完美还原最初始的逻辑
        finalOpacity = (val / stats.max) * MAX_ALPHA;
      } else {
        // 如果是一堆大数字（如原图2），最小值给保底色，最大值给上限色，消除突兀的纯白
        const ratio = (val - stats.min) / (stats.max - stats.min);
        finalOpacity = MIN_ALPHA + ratio * (MAX_ALPHA - MIN_ALPHA);
      }
    }
    else {
      // 场景三：全负数
      const ratio = (stats.max - val) / (stats.max - stats.min);
      finalOpacity = MIN_ALPHA + ratio * (MAX_ALPHA - MIN_ALPHA);
    }

    // 文字颜色：抛弃所有反白逻辑，回归最纯粹的深色与警示红
    const isNegative = val < 0;
    const textColor = isNegative ? '#dc3545' : getCssVar('--text-primary', '#0f172a');
    const fontWeight = isNegative ? 'bold' : 'normal';
    const accentRgb = getCssVar('--color-accent-rgb', '11, 194, 214');

    return {
      backgroundColor: `rgba(${accentRgb}, ${finalOpacity})`,
      color: textColor,
      fontWeight: fontWeight
    };
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
