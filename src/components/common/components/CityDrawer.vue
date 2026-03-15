<template>
  <el-drawer v-model="store.isDrawerVisible.value" :title="`选择对比${store.isProvince.value ? '省份' : '城市'} (最多5个)`"
    :direction="store.isMobile.value ? 'btt' : 'rtl'" :size="store.isMobile.value ? '80%' : '380px'" :with-header="true"
    class="custom-city-drawer" append-to-body>
    <div class="drawer-content">

      <div class="search-box">
        <el-input v-model="store.searchKeyword.value" :placeholder="`输入${store.isProvince.value ? '省份' : '城市'}名称搜索`"
          clearable>
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>

      <div class="selected-tags" v-if="store.selectedExtraCities.value.length > 0">
        <div class="tags-header">已选：</div>
        <div class="tags-list">
          <el-tag v-for="code in store.selectedExtraCities.value" :key="code" closable @close="store.toggleCity(code)"
            type="primary" class="city-tag">
            {{ store.getCityName(code) }}
          </el-tag>
        </div>
      </div>

      <div class="city-list">
        <div v-for="city in store.filteredCities.value" :key="city.code" class="city-item" :class="{
          'is-active': store.selectedExtraCities.value.includes(city.code),
          'is-disabled': !store.selectedExtraCities.value.includes(city.code) && store.selectedExtraCities.value.length >= 5
        }" @click="store.toggleCity(city.code)">
          <span class="city-name">{{ city.cname }}</span>
          <el-icon v-if="store.selectedExtraCities.value.includes(city.code)" color="#0bc2d6" size="16">
            <Check />
          </el-icon>
        </div>
        <div v-if="store.filteredCities.value.length === 0" class="empty-text"
          style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
          未找到匹配项
        </div>
      </div>

    </div>
  </el-drawer>
</template>

<script setup>
import { inject } from 'vue';
import { Search, Check } from '@element-plus/icons-vue';

// 注入状态机获取抽屉所需的所有响应式数据和动作
const store = inject('chartStore');
</script>

<style scoped>
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.search-box {
  padding-bottom: 16px;
}

.selected-tags {
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 12px;
}

.tags-header {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.city-tag {
  border-radius: 6px;
  font-size: 13px;
}

.city-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

/* 滚动条美化 (可选) */
.city-list::-webkit-scrollbar {
  width: 6px;
}

.city-list::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.city-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 6px;
  border-radius: 8px;
  background-color: #f8fafc;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
}

.city-item:hover:not(.is-disabled) {
  background-color: #f1f5f9;
}

.city-item.is-active {
  background-color: #f0fcfd;
  color: #0bc2d6;
  font-weight: bold;
}

.city-item.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

:deep(.custom-city-drawer .el-drawer__header) {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  font-weight: bold;
}
</style>