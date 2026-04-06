<template>
  <section v-if="alerts.length" class="status-panel">
    <article
      v-for="alert in alerts"
      :key="alert.title"
      class="alert-card"
      :class="`tone-${alert.tone}`"
    >
      <div class="alert-title">{{ alert.title }}</div>
      <div class="alert-body">{{ alert.body }}</div>
    </article>
  </section>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { getTimeItems } from '@/utils/statDataAdapter.js';

const props = defineProps({
  chartMetaList: { type: Array, default: () => [] },
  returnData: { type: Object, default: () => ({}) },
});

const requiredDbCodes = computed(() => Array.from(new Set(
  props.chartMetaList.map(chart => chart.dbCode).filter(Boolean)
)));

const availableDbCodes = computed(() => {
  const timeItems = Object.values(getTimeItems(props.returnData));
  return requiredDbCodes.value.filter((dbCode) => timeItems.some((item) => item?.period === dbCode));
});

const latestPeriodMap = computed(() => {
  const result = {};
  requiredDbCodes.value.forEach((dbCode) => {
    const periods = Object.values(getTimeItems(props.returnData))
      .filter((item) => item?.period === dbCode)
      .map((item) => item?.key)
      .filter(Boolean);
    if (!periods.length) return;
    const normalized = periods.map((item) => String(item)).sort((a, b) => Number(a) - Number(b));
    result[dbCode] = normalized[normalized.length - 1];
  });
  return result;
});

const alerts = computed(() => {
  const items = [];
  const missingCodes = requiredDbCodes.value.filter(code => !availableDbCodes.value.includes(code));

  if (missingCodes.length) {
    items.push({
      tone: 'critical',
      title: '频率缺失',
      body: `当前页面需要 ${formatDbCodes(missingCodes)} 数据，但返回结果中未提供对应时间序列。`,
    });
  }

  requiredDbCodes.value.forEach(dbCode => {
    const periods = Object.values(getTimeItems(props.returnData))
      .filter((item) => item?.period === dbCode)
      .map((item) => item?.key)
      .filter(Boolean);
    const freshnessState = evaluateFreshness(dbCode, latestPeriodMap.value[dbCode]);
    if (freshnessState && freshnessState.tone !== 'healthy') {
      items.push({
        tone: freshnessState.tone,
        title: `${dbCode === 'yd' ? '月度' : '年度'}更新偏慢`,
        body: freshnessState.body,
      });
    }

    if (Array.isArray(periods)) {
      const threshold = dbCode === 'yd' ? 12 : 8;
      if (periods.length < threshold) {
        items.push({
          tone: 'warn',
          title: `${dbCode === 'yd' ? '月度' : '年度'}样本偏短`,
          body: `当前仅返回 ${periods.length} 个期次，趋势判断和同比分析容易受短样本干扰。`,
        });
      }
    }
  });

  return dedupeAlerts(items);
});

function evaluateFreshness(dbCode, latestPeriod) {
  if (!latestPeriod) {
    return {
      tone: 'critical',
      body: `未识别到${dbCode === 'yd' ? '月度' : '年度'}最新期次。`,
    };
  }

  const now = new Date();

  if (dbCode === 'yd') {
    const parsed = parseMonthPeriod(latestPeriod);
    if (!parsed) return null;
    const diff = monthDiff(parsed, now);
    if (diff <= 2) {
      return { tone: 'healthy', body: '' };
    }
    if (diff <= 5) {
      return { tone: 'warn', body: `最新月度数据停留在 ${formatPeriod(latestPeriod)}，较当前时间已滞后 ${diff} 个月。` };
    }
    return { tone: 'critical', body: `最新月度数据停留在 ${formatPeriod(latestPeriod)}，滞后 ${diff} 个月，建议优先检查定时任务和服务器文件同步。` };
  }

  const parsed = parseYearPeriod(latestPeriod);
  if (!parsed) return null;
  const diff = now.getFullYear() - parsed;
  if (diff <= 1) {
    return { tone: 'healthy', body: '' };
  }
  if (diff <= 2) {
    return { tone: 'warn', body: `最新年度数据停留在 ${formatPeriod(latestPeriod)}，较当前年份已有明显延迟。` };
  }
  return { tone: 'critical', body: `最新年度数据停留在 ${formatPeriod(latestPeriod)}，建议确认年度快照是否已重新生成。` };
}

function parseMonthPeriod(value) {
  const text = String(value);
  if (!/^\d{6}$/.test(text)) return null;
  return new Date(Number(text.slice(0, 4)), Number(text.slice(4, 6)) - 1, 1);
}

function parseYearPeriod(value) {
  const text = String(value);
  if (!/^\d{4}$/.test(text)) return null;
  return Number(text);
}

function monthDiff(from, to) {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

function formatPeriod(value) {
  const text = String(value || '');
  if (/^\d{6}$/.test(text)) return `${text.slice(0, 4)}-${text.slice(4, 6)}`;
  if (/^\d{4}$/.test(text)) return `${text} 年`;
  return text || '暂无数据';
}

function formatDbCodes(codes) {
  return codes.map(code => code === 'yd' ? '月度' : '年度').join(' / ');
}

function dedupeAlerts(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = `${item.title}-${item.body}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}
</script>

<style scoped>
.status-panel {
  width: 98%;
  max-width: 1500px;
  margin: 0 auto 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.alert-card {
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid transparent;
}

.alert-card.tone-healthy {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, var(--bg-card) 100%);
  border-color: rgba(16, 185, 129, 0.28);
}

.alert-card.tone-warn {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, var(--bg-card) 100%);
  border-color: rgba(245, 158, 11, 0.28);
}

.alert-card.tone-critical {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, var(--bg-card) 100%);
  border-color: rgba(239, 68, 68, 0.28);
}

.alert-title {
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.alert-body {
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .status-panel {
    grid-template-columns: 1fr;
  }

  .alert-card {
    border-radius: 14px;
  }
}
</style>
