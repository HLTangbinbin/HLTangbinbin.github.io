<template>
  <section
    v-if="alerts.length"
    class="status-panel"
    :class="[inline ? 'inline' : `count-${alerts.length}`]"
  >
    <article
      v-for="alert in alerts"
      :key="alert.title"
      class="alert-card"
      :class="`tone-${alert.tone}`"
    >
      <div class="alert-title">{{ alert.title }}</div>
      <div class="alert-body">{{ inline ? (alert.shortBody || alert.body) : alert.body }}</div>
    </article>
  </section>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { selectDataFromArr } from '@/utils/dataEngine.js';

const props = defineProps({
  chartMetaList: { type: Array, default: () => [] },
  returnData: { type: Object, default: () => ({}) },
  inline: { type: Boolean, default: false },
});

function resolveEnglishKeys(chart) {
  if (Array.isArray(chart?.englishKeys) && chart.englishKeys.length) return chart.englishKeys;
  if (Array.isArray(chart?.seriesRefs) && chart.seriesRefs.length) {
    return chart.seriesRefs.map((item) => item?.englishKey).filter(Boolean);
  }
  return [];
}

const requiredDbCodes = computed(() => Array.from(new Set(
  props.chartMetaList.map(chart => chart.dbCode).filter(Boolean)
)));

const availableDbCodes = computed(() => {
  return requiredDbCodes.value.filter((dbCode) =>
    props.chartMetaList
      .filter((chart) => chart?.dbCode === dbCode)
      .some((chart) =>
        resolveEnglishKeys(chart).some((englishKey) =>
          selectDataFromArr(props.returnData, englishKey, dbCode, '', 1).length > 0
        )
      )
  );
});

const latestPeriodMap = computed(() => {
  const result = {};
  requiredDbCodes.value.forEach((dbCode) => {
    const periods = props.chartMetaList
      .filter((chart) => chart?.dbCode === dbCode)
      .flatMap((chart) =>
        resolveEnglishKeys(chart).flatMap((englishKey) =>
          selectDataFromArr(props.returnData, englishKey, dbCode, '', 0).map((item) => item?.date)
        )
      )
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
      shortBody: formatDbCodes(missingCodes),
      body: `当前页面需要 ${formatDbCodes(missingCodes)} 数据，但返回结果中未提供对应时间序列。`,
    });
  }

  requiredDbCodes.value.forEach(dbCode => {
    const freshnessState = evaluateFreshness(dbCode, latestPeriodMap.value[dbCode]);
    if (freshnessState && freshnessState.tone !== 'healthy') {
      items.push({
        tone: freshnessState.tone,
        title: `${dbCode === 'yd' ? '月度' : '年度'}更新偏慢`,
        shortBody: freshnessState.shortBody,
        body: freshnessState.body,
      });
    }
  });

  return dedupeAlerts(items);
});

function evaluateFreshness(dbCode, latestPeriod) {
  if (!latestPeriod) {
    return {
      tone: 'critical',
      shortBody: '暂无期次',
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
      return {
        tone: 'warn',
        shortBody: `${formatPeriod(latestPeriod)} · 滞后${diff}月`,
        body: `最新月度数据停留在 ${formatPeriod(latestPeriod)}，较当前时间已滞后 ${diff} 个月。`
      };
    }
    return {
      tone: 'critical',
      shortBody: `${formatPeriod(latestPeriod)} · 滞后${diff}月`,
      body: `最新月度数据停留在 ${formatPeriod(latestPeriod)}，滞后 ${diff} 个月，建议优先检查定时任务和服务器文件同步。`
    };
  }

  const parsed = parseYearPeriod(latestPeriod);
  if (!parsed) return null;
  const diff = now.getFullYear() - parsed;
  if (diff <= 1) {
    return { tone: 'healthy', body: '' };
  }
  if (diff <= 2) {
    return {
      tone: 'warn',
      shortBody: formatPeriod(latestPeriod),
      body: `最新年度数据停留在 ${formatPeriod(latestPeriod)}，较当前年份已有明显延迟。`
    };
  }
  return {
    tone: 'critical',
    shortBody: formatPeriod(latestPeriod),
    body: `最新年度数据停留在 ${formatPeriod(latestPeriod)}，建议确认年度快照是否已重新生成。`
  };
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

.status-panel.count-1 {
  max-width: 760px;
  grid-template-columns: minmax(0, 1fr);
}

.status-panel.count-2 {
  max-width: 1080px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.status-panel.inline {
  width: auto;
  max-width: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.alert-card {
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid transparent;
}

.status-panel.inline .alert-card {
  padding: 6px 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
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

.status-panel.inline .alert-title {
  margin-bottom: 0;
  font-size: 12px;
  flex-shrink: 0;
}

.alert-body {
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-secondary);
}

.status-panel.inline .alert-body {
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .status-panel {
    grid-template-columns: 1fr;
  }

  .status-panel.inline {
    justify-content: flex-start;
    gap: 6px;
  }

  .alert-card {
    border-radius: 14px;
  }

  .status-panel.inline .alert-card {
    width: 100%;
    border-radius: 12px;
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .status-panel.inline .alert-body {
    white-space: normal;
  }
}
</style>
