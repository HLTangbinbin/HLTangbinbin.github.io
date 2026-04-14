<template>
  <transition name="el-fade-in">
    <div v-if="store.enableSmartAnalysis.value && store.viewModeDisplay.value === 'chart' && store.smartInsights.value?.cards?.length"
      class="smart-narrative-panel">
      <div class="narrative-header">
        <div class="narrative-title-wrap">
          <div class="narrative-title">
            <el-icon>
              <MagicStick />
            </el-icon> 洞察总结
          </div>
          <div v-if="store.smartInsights.value?.subject" class="narrative-subject">{{ store.smartInsights.value.subject }}</div>
        </div>
      </div>
      <div v-if="store.smartInsights.value?.cards?.length" class="insight-grid">
        <div
          v-for="card in store.smartInsights.value.cards"
          :key="card.label"
          class="insight-card"
          :class="`tone-${card.tone || 'default'}`"
        >
          <div class="insight-label">{{ card.label }}</div>
          <div class="insight-value" :class="`tone-${card.tone || 'neutral'}`" v-html="card.valueHtml || card.value"></div>
          <div class="insight-detail" v-html="card.detailHtml || ''"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject } from 'vue';
import { MagicStick } from '@element-plus/icons-vue';

// 注入上帝状态机获取所有相关状态
const store = inject('chartStore');
</script>

<style scoped>
/* AI 智能洞察面板专属样式 */
.smart-narrative-panel {
  background: linear-gradient(135deg, var(--color-accent-soft) 0%, var(--bg-card) 100%);
  border-left: 4px solid var(--color-accent);
  padding: 12px 16px;
  border-radius: 12px;
  margin: 0 auto 12px;
  width: 95%;
  max-width: 1500px;
  box-shadow: var(--shadow-soft);
  box-sizing: border-box;
}

.narrative-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.narrative-title-wrap {
  display: flex;
  align-items: center;
  gap: 30px;
  min-width: 0;
}

.narrative-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent-strong);
  display: flex;
  align-items: center;
  gap: 6px;
}

.narrative-subject {
  font-size: 11px;
  color: var(--text-muted);
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(var(--color-accent-rgb), 0.1);
  border: 1px solid rgba(var(--color-accent-rgb), 0.2);
  white-space: nowrap;
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.insight-card {
  padding: 9px 11px;
  border-radius: 10px;
  border: 1px solid rgba(var(--color-accent-rgb), 0.14);
  background: linear-gradient(180deg, rgba(var(--color-accent-rgb), 0.09), var(--bg-card-soft));
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.insight-card.tone-up {
  border-color: rgba(239, 68, 68, 0.24);
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.08), var(--bg-card-soft));
}

.insight-card.tone-down {
  border-color: rgba(34, 197, 94, 0.24);
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.08), var(--bg-card-soft));
}

.insight-card.tone-neutral {
  border-color: rgba(var(--color-accent-rgb), 0.18);
  background: linear-gradient(180deg, rgba(var(--color-accent-rgb), 0.12), var(--bg-card-soft));
}

.insight-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 6px;
  line-height: 1.2;
}

.insight-value {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  white-space: nowrap;
  margin-bottom: 6px;
}

.insight-detail {
  font-size: 12px;
  line-height: 1.35;
  color: var(--text-secondary);
  min-height: 32px;
}

.insight-detail :deep(.detail-emphasis) {
  color: var(--color-accent-strong);
  font-weight: 700;
}

.insight-detail :deep(.detail-alert) {
  color: #dc2626;
  font-weight: 700;
}

.insight-detail :deep(.detail-separator) {
  color: var(--text-muted);
  margin: 0 6px;
}

.insight-value.tone-up,
.insight-value :deep(.tone-up),
.insight-detail :deep(.tone-up) {
  color: #dc2626;
}

.insight-value.tone-down,
.insight-value :deep(.tone-down),
.insight-detail :deep(.tone-down) {
  color: #16a34a;
}

.insight-value.tone-neutral,
.insight-value :deep(.tone-neutral),
.insight-detail :deep(.tone-neutral) {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .smart-narrative-panel {
    width: 98%;
    padding: 10px 12px;
    margin-bottom: 10px;
  }

  .insight-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .narrative-header {
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: 6px;
  }

  .narrative-title-wrap {
    gap: 12px;
    min-width: 0;
  }

  .insight-card {
    padding: 8px 8px;
    min-width: 0;
  }

  .insight-value {
    font-size: 13px;
    margin-bottom: 4px;
  }
  .insight-detail {
    font-size: 10px;
    line-height: 1.25;
    min-height: 26px;
  }

  .insight-label {
    font-size: 10px;
  }

  .narrative-subject {
    max-width: 48%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
