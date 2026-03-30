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

    const headerPathText = computed(() => {
      const pathText = props.headerPath.filter(Boolean).join(' - ');
      const modeText = getDbCodeLabel(activeDbCode.value, viewMode.value);

      if (pathText && modeText) return `${pathText} - ${modeText}`;
      return pathText || modeText;
    });

    const headerStats = computed(() => ([
      { label: '最新', value: latestPeriod.value },
      { label: '图表', value: String(chartsToRender.value.length) }
    ]));

    const linkSummary = computed(() => {
      if (!linkedSelection.value?.value) return '';
      const sourceTitle = linkedSelection.value.chartTitle || '当前图表';
      return `${linkedSelection.value.value} · ${sourceTitle}`;
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
  background-color: #ffffff;
  /* 毛玻璃效果，透出底层全局背景色 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); 
  border-radius: 20px;
  padding: 20px; 
  box-sizing: border-box;
  /* 纯白高光边框 + 内发光，质感拉满 */
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4), 0 4px 20px rgba(0, 0, 0, 0.02);
}

.page-header {
  width: 98%;
  margin: 0 auto 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 14px;
  border-bottom: 1px solid #eef2f7;
}

.header-left {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 auto;
}

.header-path {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  color: #1e293b;
  letter-spacing: 0.01em;
  white-space: normal;
  word-break: break-word;
}

.header-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.header-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.header-linkage {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f0fcfd;
  border: 1px solid rgba(11, 194, 214, 0.2);
  white-space: nowrap;
  max-width: 100%;
}

.linkage-label {
  font-size: 12px;
  font-weight: 600;
  color: #0891b2;
}

.linkage-value {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.linkage-clear {
  border: 0;
  background: transparent;
  color: #0ea5e9;
  font-size: 12px;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
}

.linkage-clear:hover {
  color: #0284c7;
}

.header-stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.header-stat-label {
  font-size: 12px;
  color: #64748b;
}

.header-stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
}

.charts-flow {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-mode-container {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  align-self: center;
}

.custom-segment {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 阴影也稍微调柔和 */
  border-radius: 14px; 
  background: #fff;
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
  background-color: #ffffff !important;
  color: #64748b !important;
  border: 1px solid transparent !important; 
}

.custom-segment :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 14px 0 0 14px !important; 
}
.custom-segment :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 14px 14px 0 !important;
}

.custom-segment :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0bc2d6 !important;
  color: #ffffff !important;
  border-color: #0bc2d6 !important;
  box-shadow: 0 2px 6px rgba(11, 194, 214, 0.35) !important;
}

@media (max-width: 768px) {
  .dashboard-global-wrapper {
    width: 98%;
    padding: 12px;
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.6); /* 移动端可以稍微白一点点 */
  }

  .page-header {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin: 0 0 12px;
    padding-bottom: 12px;
  }

  .header-left {
    align-items: stretch;
    gap: 8px;
  }

  .header-path {
    font-size: 15px;
    line-height: 1.35;
  }

  .header-meta {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .header-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .header-linkage {
    width: 100%;
    min-height: 0;
    padding: 10px 12px;
    border-radius: 12px;
    align-items: flex-start;
    justify-content: space-between;
    white-space: normal;
  }

  .linkage-value {
    font-size: 12px;
    flex: 1 1 auto;
  }

  .header-stat {
    min-height: 34px;
    padding: 0 10px;
    border-radius: 10px;
    justify-content: center;
  }

  .header-stat-label {
    font-size: 12px;
  }

  .header-stat-value {
    font-size: 15px;
  }

  .view-mode-container {
    width: 100%;
    justify-content: stretch;
    margin-left: 0;
    align-self: stretch;
  }

  .custom-segment {
    width: 100%;
  }

  .custom-segment :deep(.el-radio-group),
  .custom-segment :deep(.el-radio-button) {
    width: 100%;
  }

  .custom-segment :deep(.el-radio-button__inner) {
    height: 28px !important;
    width: 100%;
    padding: 0 20px !important;
    font-size: 12px !important;
  }
  .custom-segment :deep(.el-radio-button:first-child .el-radio-button__inner) {
    border-radius: 12px 0 0 12px !important;
  }
  .custom-segment :deep(.el-radio-button:last-child .el-radio-button__inner) {
    border-radius: 0 12px 12px 0 !important;
  }
}
</style>
