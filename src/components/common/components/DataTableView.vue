<template>
  <div class="data-table-wrapper">
    <el-table 
      :key="`table-${store.finalCityCodeArr.value.length}-${store.tableColumns.value.length}`" 
      :data="store.tableData.value"
      :height="store.chartHeight.value - 40" 
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
.data-table-wrapper {
  width: 100%;
  height: 100%;
  /* 🌟 核心修复：上间距 10px，左右 20px，下间距留出充足的 30px */
  padding: 10px 20px 30px 20px; 
  box-sizing: border-box;
}

.data-table-wrapper :deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

@media (max-width: 768px) {
  .data-table-wrapper {
    /* 移动端紧凑一点，底部留 16px */
    padding: 4px 4px 16px 4px; 
  }
}
</style>