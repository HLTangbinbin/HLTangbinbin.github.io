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
      :header-cell-style="{ background: '#f8fafc', color: '#475569', fontWeight: 'bold' }"
      :cell-style="store.getTableCellStyle"
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

// 注入上帝状态机，所有数据直接拿来用
const store = inject('chartStore');
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
  color: #1e293b; 
  letter-spacing: 1px;
}
</style>