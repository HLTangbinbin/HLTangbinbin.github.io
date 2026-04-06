<template>
  <section v-if="rows.length" class="integrity-panel">
    <div class="panel-head">
      <div class="panel-title">数据完整性调试</div>
      <div class="panel-subtitle">仅开发态显示，直接检查默认地区与实际序列覆盖情况</div>
    </div>
    <div class="panel-table">
      <div v-for="row in rows" :key="row.id" class="panel-row">
        <div class="row-title">{{ row.title }}</div>
        <div class="row-meta">
          <span class="meta-item">频率: {{ row.dbCode }}</span>
          <span class="meta-item">指标: {{ row.indicatorKeys.join(', ') || '-' }}</span>
          <span class="meta-item">布局: {{ row.seriesLayout }}</span>
        </div>
        <div class="row-detail">
          <span class="detail-label">默认地区</span>
          <span class="detail-value">{{ row.defaultRegions.join('、') || '-' }}</span>
        </div>
        <div class="row-detail">
          <span class="detail-label">实际可用</span>
          <span class="detail-value">{{ row.availableRegions.join('、') || '-' }}</span>
        </div>
        <div class="row-detail" :class="{ 'is-missing': row.missingRegions.length }">
          <span class="detail-label">缺失地区</span>
          <span class="detail-value">{{ row.missingRegions.join('、') || '无' }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { cityRegionList, provinceRegionList } from '@/config/regionLists.js';
import { getAvailableRegionCodes } from '@/utils/statDataAdapter.js';

const props = defineProps({
  chartMetaList: { type: Array, default: () => [] },
  returnData: { type: Object, default: () => ({}) },
  config: { type: Object, default: () => ({}) }
});

const regionNameMap = computed(() => {
  const baseList = (props.config?.localJson || '').includes('province') ? provinceRegionList : cityRegionList;
  return new Map(baseList.map((item) => [item.code, item.cname]));
});

const rows = computed(() => props.chartMetaList
  .filter((chart) => Array.isArray(chart?.indicatorKeys) && chart.indicatorKeys.length > 0)
  .map((chart) => {
    const defaultRegionCodes = (chart.seriesLayout === 'region'
      ? (chart.regionCodes?.length ? chart.regionCodes : (props.config?.cityCodeArr || []))
      : []);

    const availableCodes = Array.from(new Set(
      chart.indicatorKeys.flatMap((indicatorKey) => getAvailableRegionCodes(props.returnData, indicatorKey))
    )).filter((code) => code && code !== '100000');

    const toName = (code) => regionNameMap.value.get(code) || code;

    return {
      id: chart.id,
      title: chart.title,
      dbCode: chart.dbCode,
      indicatorKeys: chart.indicatorKeys,
      seriesLayout: chart.seriesLayout || 'indicator',
      defaultRegions: defaultRegionCodes.map(toName),
      availableRegions: availableCodes.map(toName),
      missingRegions: defaultRegionCodes.filter((code) => !availableCodes.includes(code)).map(toName)
    };
  }));
</script>

<style scoped>
.integrity-panel {
  width: 98%;
  max-width: 1500px;
  margin: 10px auto 12px;
  padding: 14px 16px;
  border: 1px solid rgba(245, 158, 11, 0.32);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, var(--bg-card) 100%);
  box-sizing: border-box;
}

.panel-head {
  margin-bottom: 12px;
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.panel-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.panel-table {
  display: grid;
  gap: 10px;
}

.panel-row {
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
}

.row-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.row-meta,
.row-detail {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.meta-item {
  margin-right: 12px;
}

.detail-label {
  display: inline-block;
  width: 68px;
  color: var(--text-muted);
}

.row-detail.is-missing .detail-value {
  color: #b45309;
  font-weight: 600;
}

@media (max-width: 768px) {
  .detail-label {
    width: 60px;
  }
}
</style>
