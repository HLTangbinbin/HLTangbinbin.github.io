<template>
  <div class="dashboard-global-wrapper">
    <div class="page-header" v-if="headerStats.length || internalShowToggles">
      <div class="header-left">
        <div class="header-path" v-if="headerPathText">{{ headerPathText }}</div>
        <div class="header-meta" v-if="headerStats.length || linkSummary">
          <div class="header-stats" v-if="headerStats.length">
            <div
              v-for="item in headerStats"
              :key="item.label"
              class="header-stat"
            >
              <span class="header-stat-label">{{ item.label }}</span>
              <span class="header-stat-value">{{ item.value }}</span>
            </div>
          </div>
          <div v-if="linkSummary" class="header-linkage">
            <span class="linkage-label">联动中</span>
            <span class="linkage-value">{{ linkSummary }}</span>
            <button class="linkage-clear" type="button" @click="clearLinkedSelection">清除</button>
          </div>
        </div>
      </div>

      <div class="view-mode-container" v-if="internalShowToggles">
        <el-radio-group v-model="viewMode" class="custom-segment" @change="handleViewModeUpdate">
          <el-radio-button label="monthly">月度</el-radio-button>
          <el-radio-button label="yearly">年度</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="charts-flow">
      <div v-if="!chartsToRender.length" class="empty-state-card">
        <div class="empty-state-title">当前视图暂无可展示图表</div>
        <div class="empty-state-text">
          {{ emptyStateText }}
        </div>
      </div>
      <ChartContainer 
        v-for="chart in chartsToRender" 
        :key="chart.id" 
        :chart="chart" 
        :returnData="returnData"
        :config="config" 
        :viewMode="viewMode"
        :linkedSelection="linkedSelection"
        @linkSelect="handleLinkSelect"
      />
    </div>

  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'; 
import ChartContainer from './ChartContainer.vue';
import { selectDataFromArr } from '@/utils/dataEngine.js';

export default {
  name: 'ChartPage',
  components: { ChartContainer },
  props: {
    chartMetaList: { type: Array, required: true },
    returnData: { type: Object, required: true },
    config: { type: Object, default: () => ({}) },
    headerPath: { type: Array, default: () => [] },
    showToggles: { type: Boolean, default: true }
  },
  setup(props) {
    const viewMode = ref('monthly');
    const linkedSelection = ref(null);

    const internalShowToggles = computed(() => {
      if (!props.showToggles) return false;
      const dbCodes = new Set(props.chartMetaList.map(c => c.dbCode));
      return dbCodes.has('yd') && dbCodes.has('nd');
    });

    const defaultViewMode = () => {
      const dbCodes = new Set(props.chartMetaList.map(c => c.dbCode));
      if (dbCodes.has('yd')) return 'monthly';
      if (dbCodes.has('nd')) return 'yearly';
      return 'monthly';
    };
    
    viewMode.value = defaultViewMode();

    watch(() => props.chartMetaList, () => {
      viewMode.value = defaultViewMode();
      linkedSelection.value = null;
    });

    const filteredCharts = computed(() => {
      if (!internalShowToggles.value) return props.chartMetaList;
      return props.chartMetaList.filter(c =>
        viewMode.value === 'monthly' ? c.dbCode === 'yd' : c.dbCode === 'nd'
      );
    });

    const chartsToRender = computed(() => {
      return filteredCharts.value.filter(chart => {
        const sj = props.returnData?.sj?.[chart.dbCode];
        return Array.isArray(sj) && sj.length > 0;
      });
    });

    const activeDbCode = computed(() => {
      if (internalShowToggles.value) {
        return viewMode.value === 'monthly' ? 'yd' : 'nd';
      }

      if (chartsToRender.value.length > 0) {
        return chartsToRender.value[0].dbCode;
      }

      const dbCodes = Array.from(new Set(props.chartMetaList.map(chart => chart.dbCode).filter(Boolean)));
      if (dbCodes.includes('yd')) return 'yd';
      if (dbCodes.includes('nd')) return 'nd';
      return '';
    });

    const latestPeriod = computed(() => {
      const dbCode = activeDbCode.value;
      const relevantCharts = chartsToRender.value.length ? chartsToRender.value : filteredCharts.value;
      const latestDates = relevantCharts.flatMap(chart =>
        (chart.zbcodeArr || []).flatMap(zbCode =>
          selectDataFromArr(props.returnData, zbCode, dbCode, '', 0).map(item => String(item.date))
        )
      );

      if (!latestDates.length) return '暂无数据';

      const latest = Array.from(new Set(latestDates))
        .sort((a, b) => Number(a) - Number(b))
        .pop();

      return formatPeriod(latest);
    });

    const normalizedHeaderPath = computed(() => props.headerPath.filter(Boolean));

    const headerPathText = computed(() => {
      const separator = '/';
      const pathText = normalizedHeaderPath.value.join(separator);
      const modeText = getDbCodeLabel(activeDbCode.value, viewMode.value);

      if (pathText && modeText) return `${pathText}${separator}${modeText}`;
      return pathText || modeText;
    });

    const headerStats = computed(() => ([
      { label: '最新', value: latestPeriod.value }
    ]));

    const linkSummary = computed(() => {
      if (!linkedSelection.value?.value) return '';
      const sourceTitle = linkedSelection.value.chartTitle || '当前图表';
      return `${linkedSelection.value.value} · ${sourceTitle}`;
    });

    const emptyStateText = computed(() => {
      const modeLabel = getDbCodeLabel(activeDbCode.value, viewMode.value) || '当前';
      if (!filteredCharts.value.length) {
        return `${modeLabel}视图下还没有可用图表配置，请检查当前栏目配置。`;
      }
      return `${modeLabel}数据暂不可用，可能是当前频率没有返回时间序列，或该页面尚未生成对应快照。`;
    });

    const handleViewModeUpdate = (newMode) => {
      viewMode.value = newMode;
    };

    const handleLinkSelect = (payload) => {
      if (!payload?.value) return;

      if (linkedSelection.value?.value === payload.value && linkedSelection.value?.chartId === payload.chartId) {
        linkedSelection.value = null;
        return;
      }

      linkedSelection.value = payload;
    };

    const clearLinkedSelection = () => {
      linkedSelection.value = null;
    };

    return {
      viewMode,
      internalShowToggles,
      headerPathText,
      headerStats,
      linkedSelection,
      linkSummary,
      chartsToRender,
      emptyStateText,
      handleViewModeUpdate,
      handleLinkSelect,
      clearLinkedSelection
    };
  }
};

function formatPeriod(value) {
  if (!value) return '暂无数据';
  const text = String(value);
  if (/^\d{6}$/.test(text)) return `${text.slice(0, 4)}/${text.slice(4, 6)}`;
  if (/^\d{4}$/.test(text)) return `${text} 年`;
  return text;
}

function getDbCodeLabel(dbCode, viewMode) {
  if (dbCode === 'yd') return '月度';
  if (dbCode === 'nd') return '年度';
  if (dbCode === 'jd') return '季度';
  if (!dbCode && viewMode) {
    return viewMode === 'monthly' ? '月度' : '年度';
  }
  return '';
}
</script>

<style scoped>
/* 核心：替换发闷的深灰，采用高级玻璃拟态 */
.dashboard-global-wrapper {
  width: 98%;
  max-width: 1500px;
  margin: 0 auto;
  background-color: var(--bg-card);
  border-radius: 20px;
  padding: 20px; 
  box-sizing: border-box;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-soft);
}

.page-header {
  width: 98%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: nowrap;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-default);
}

.header-left {
  min-width: 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  flex: 1 1 auto;
  flex-wrap: nowrap;
  overflow: hidden;
}

.header-path {
  font-size: 17px;
  font-weight: 700;
  line-height: 34px;
  color: var(--text-primary);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 1 auto;
}

.header-meta {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  min-width: 0;
  flex: 0 0 auto;
}

.header-stats {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
}

.header-linkage {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  border: 1px solid rgba(11, 194, 214, 0.24);
  white-space: nowrap;
  max-width: 100%;
  flex: 0 1 auto;
  overflow: hidden;
}

.linkage-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent-strong);
}

.linkage-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.linkage-clear {
  border: 0;
  background: transparent;
  color: var(--color-accent-strong);
  font-size: 12px;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
}

.linkage-clear:hover {
  color: var(--color-accent);
}

.header-stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  white-space: nowrap;
}

.header-stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.header-stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.charts-flow {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-state-card {
  width: 98%;
  max-width: 1500px;
  min-height: 520px;
  margin: 10px auto 20px;
  padding: 36px 28px;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  background: var(--bg-card-soft);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.empty-state-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.empty-state-text {
  max-width: 760px;
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-secondary);
}

.view-mode-container {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  align-self: center;
  flex: 0 0 auto;
}

.custom-segment {
  box-shadow: var(--shadow-soft);
  border-radius: 14px; 
  background: var(--bg-card);
}

.custom-segment :deep(.el-radio-button__inner) {
  height: 36px !important; 
  padding: 0 32px !important;
  font-size: 15px !important;
  font-weight: bold !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  transition: all 0.2s ease;
  background-color: var(--bg-card) !important;
  color: var(--text-muted) !important;
  border: 1px solid transparent !important; 
}

.custom-segment :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 14px 0 0 14px !important; 
}
.custom-segment :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 14px 14px 0 !important;
}

.custom-segment :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: var(--color-accent-fill) !important;
  color: var(--color-accent-contrast) !important;
  border-color: var(--color-accent) !important;
  box-shadow: inset 0 0 0 1px rgba(var(--color-accent-rgb), 0.08) !important;
}

@media (max-width: 768px) {
  .dashboard-global-wrapper {
    width: 98%;
    padding: 10px;
    border-radius: 14px;
    background-color: var(--bg-card);
  }

  .empty-state-card {
    width: 98%;
    min-height: 360px;
    padding: 26px 16px;
    border-radius: 12px;
    margin: 10px auto 16px;
  }

  .empty-state-title {
    font-size: 18px;
  }

  .empty-state-text {
    font-size: 13px;
    max-width: none;
  }

  .page-header {
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    margin: 0 0 10px;
    padding-bottom: 10px;
    flex-wrap: nowrap;
  }

  .header-left {
    align-items: center;
    gap: 6px;
    flex: 1 1 auto;
    min-width: 0;
  }

  .header-path {
    font-size: 12px;
    line-height: 28px;
    max-width: 42%;
  }

  .header-meta {
    flex-direction: row;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .header-stats {
    display: flex;
    flex-wrap: nowrap;
    gap: 6px;
  }

  .header-linkage {
    display: none;
  }

  .header-stat {
    min-height: 28px;
    padding: 0 8px;
    border-radius: 999px;
    justify-content: center;
  }

  .header-stat-label {
    font-size: 10px;
  }

  .header-stat-value {
    font-size: 12px;
  }

  .view-mode-container {
    width: auto;
    justify-content: flex-end;
    margin-left: 0;
    align-self: center;
    flex: 0 0 auto;
  }

  .custom-segment {
    width: auto;
  }

  .custom-segment :deep(.el-radio-group),
  .custom-segment :deep(.el-radio-button) {
    width: auto;
  }

  .custom-segment :deep(.el-radio-button__inner) {
    height: 28px !important;
    width: auto;
    min-width: 52px;
    padding: 0 12px !important;
    font-size: 11px !important;
  }
  .custom-segment :deep(.el-radio-button:first-child .el-radio-button__inner) {
    border-radius: 12px 0 0 12px !important;
  }
  .custom-segment :deep(.el-radio-button:last-child .el-radio-button__inner) {
    border-radius: 0 12px 12px 0 !important;
  }
}
</style>
