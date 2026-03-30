<template>
  <section class="page-overview">
    <div class="overview-bar">
      <div class="overview-heading">
        <h2 class="heading-title">{{ displayTitle }}</h2>
      </div>

      <div class="overview-items">
        <div class="overview-item">
          <span class="item-label">最新</span>
          <span class="item-value">{{ latestPeriod }}</span>
        </div>
        <div class="overview-item">
          <span class="item-label">图表</span>
          <span class="item-value">{{ chartCount }}</span>
        </div>
        <div class="overview-item">
          <span class="item-label">指标</span>
          <span class="item-value">{{ metricCount }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineProps } from 'vue';
const props = defineProps({
  title: { type: String, required: true },
  breadcrumb: { type: Array, default: () => [] },
  chartMetaList: { type: Array, default: () => [] },
  returnData: { type: Object, default: () => ({}) },
  source: { type: Object, default: () => ({}) },
});

const breadcrumbText = computed(() => props.breadcrumb.join(' / '));
const displayTitle = computed(() => breadcrumbText.value || props.title);

const chartCount = computed(() => props.chartMetaList.length);

const metricCount = computed(() => {
  const codes = new Set();
  props.chartMetaList.forEach(chart => {
    (chart.zbcodeArr || []).forEach(code => codes.add(code));
  });
  return codes.size;
});

const allPeriods = computed(() => {
  const periodSets = Object.values(props.returnData?.sj || {});
  const merged = [];
  periodSets.forEach(periods => {
    if (Array.isArray(periods)) {
      merged.push(...periods);
    }
  });
  return Array.from(new Set(merged)).sort();
});

const latestPeriod = computed(() => formatPeriod(allPeriods.value.at(-1)));

function formatPeriod(value) {
  if (!value) return '暂无数据';

  const text = String(value);
  if (/^\d{6}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}`;
  }

  if (/^\d{4}$/.test(text)) {
    return `${text} 年`;
  }

  return text;
}
</script>

<style scoped>
.page-overview {
  width: fit-content;
  max-width: 98%;
  margin: 0 auto 14px;
  padding: 16px 18px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
}

.overview-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.overview-heading {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 0 1 auto;
}

.heading-title {
  margin: 0;
  font-size: 18px;
  line-height: 1;
  color: #334155;
  white-space: normal;
}

.overview-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
  flex: 1 1 auto;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #dbe4ee;
  white-space: nowrap;
  flex: 0 0 auto;
}

.item-label {
  font-size: 12px;
  color: #94a3b8;
}

.item-value {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

@media (max-width: 768px) {
  .page-overview {
    width: auto;
    max-width: none;
    padding: 14px 14px 12px;
    border-radius: 12px;
    margin-bottom: 10px;
  }

  .overview-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .overview-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .heading-title {
    font-size: 16px;
  }

  .overview-items {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px;
  }

  .overview-item {
    min-height: 34px;
    border-radius: 10px;
    padding: 0 10px;
  }

  .item-label {
    font-size: 11px;
  }

  .item-value {
    font-size: 13px;
  }
}
</style>
