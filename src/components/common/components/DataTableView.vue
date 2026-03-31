<template>
  <div class="data-table-wrapper">
    <div class="table-header-container">
      <h3 class="chart-table-title">{{ store.props.chart.title || '详细数据表格' }}</h3>
    </div>

    <el-table 
      :key="`table-${store.finalCityCodeArr.value.length}-${store.tableColumns.value.length}`" 
      :data="store.tableData.value"
      :height="store.chartHeight.value - 80" 
      border 
      stripe 
      style="width: 100%"
      :header-cell-style="headerCellStyle"
      :cell-style="store.getTableCellStyle"
      class="themed-data-table"
    >
      <el-table-column 
        v-for="col in store.tableColumns.value" 
        :key="col.prop" 
        :prop="col.prop" 
        :label="col.label"
        :min-width="col.minWidth" 
        :fixed="col.fixed" 
        align="center" 
      />
    </el-table>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { getCssVar } from '@/utils/theme.js';

// 注入上帝状态机，所有数据直接拿来用
const store = inject('chartStore');

const headerCellStyle = () => ({
  background: getCssVar('--bg-card-soft', '#f8fafc'),
  color: getCssVar('--text-primary', '#1e293b'),
  fontWeight: 'bold'
});
</script>

<style scoped>
/* 确保外部容器纵向排布，不干扰外部布局 */
.data-table-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 标题容器居中对齐，并留出底部呼吸空间 */
.table-header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 16px;
  padding-top: 8px;
}

/* 标题文字样式，采用沉稳的深石板色，与你们青色主题搭配非常高级 */
.chart-table-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary); 
  letter-spacing: 1px;
}

.data-table-wrapper :deep(.el-table) {
  --el-table-border-color: var(--border-default);
  --el-table-header-bg-color: var(--bg-card-soft);
  --el-table-tr-bg-color: var(--bg-card);
  --el-table-row-hover-bg-color: var(--bg-elevated);
  --el-table-current-row-bg-color: var(--bg-elevated);
  --el-table-text-color: var(--text-primary);
  --el-table-header-text-color: var(--text-primary);
  --el-fill-color-lighter: var(--bg-card-soft);
  background: var(--bg-card);
  color: var(--text-primary);
}

.data-table-wrapper :deep(.el-table th.el-table__cell) {
  background: var(--bg-card-soft) !important;
  color: var(--text-primary) !important;
}

.data-table-wrapper :deep(.el-table tr) {
  background: var(--bg-card);
}

.data-table-wrapper :deep(.el-table td.el-table__cell) {
  color: var(--text-primary);
}

.data-table-wrapper :deep(.el-table td.el-table__cell),
.data-table-wrapper :deep(.el-table th.el-table__cell.is-leaf) {
  border-bottom-color: var(--border-default);
}

.data-table-wrapper :deep(.el-table--border::before),
.data-table-wrapper :deep(.el-table--group::after),
.data-table-wrapper :deep(.el-table::before) {
  background-color: var(--border-default);
}
</style>
