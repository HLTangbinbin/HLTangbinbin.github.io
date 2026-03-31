<template>
  <div class="bi-toolbar">
    <div class="toolbar-group view-group">
      <div class="group-label"><i class="el-icon-menu"></i> 视图</div>
      <el-radio-group v-model="store.viewModeDisplay.value" :size="store.controlSize.value" class="no-shrink"
        style="margin-right: 8px;">
        <el-radio-button label="chart">图表</el-radio-button>
        <el-radio-button label="table">表格</el-radio-button>
        <el-radio-button v-if="store?.isMapSupported?.value" label="map">
        地图
      </el-radio-button>
      </el-radio-group>
      <template v-if="store.viewModeDisplay.value === 'chart'">
        <div class="split-line"></div>
        <el-radio-group v-model="store.chartTypeModel.value" :size="store.controlSize.value"
          class="chart-type-radio no-shrink">
          <el-radio-button label="bar">柱状</el-radio-button>
          <el-radio-button label="hbar">条形</el-radio-button>
          <el-radio-button label="line">折线</el-radio-button>
        </el-radio-group>
      </template>
    </div>

    <div class="toolbar-group time-group">
      <div class="group-label"><i class="el-icon-time"></i> 时间</div>
      <div class="slider-wrapper">
        <el-slider v-model="store.yearLimit.value" :show-tooltip="false" :min="1" :max="40" :step="1" class="flex-slider" />
        <span class="ctrl-val no-shrink">{{ store.yearLimit.value }}</span>
      </div>
    </div>

    <div v-if="store.viewModeDisplay.value === 'chart' || store.viewModeDisplay.value === 'table'"
      class="toolbar-group dim-group">
      <div class="group-label"><i class="el-icon-s-data"></i> 操作</div>

      <template v-if="store.viewModeDisplay.value === 'chart'">
        <el-button :size="store.controlSize.value" class="no-shrink btn-toggle-all"
          :type="store.legendAllSelected.value ? 'primary' : 'default'" :plain="!store.legendAllSelected.value"
          @click="$emit('toggleAllLegends')">
          {{ store.legendAllSelected.value ? '反选' : '全选' }}
        </el-button>
        <div class="split-line"></div>

        <el-checkbox-button v-if="store.showSmartAnalysisToggle.value" v-model="store.enableSmartAnalysis.value"
          :size="store.controlSize.value" class="no-shrink" style="margin-right: 8px;">智能分析
        </el-checkbox-button>
        <div v-if="store.showSmartAnalysisToggle.value" class="split-line"></div>

        <el-radio-group v-if="store.showCompareToggle.value" v-model="store.isYearlyCompare.value"
          :size="store.controlSize.value" class="no-shrink">
          <el-radio-button :label="false">连续</el-radio-button>
          <el-radio-button :label="true">同比</el-radio-button>
        </el-radio-group>
        <div
          v-if="(store.showCompareToggle.value) && (store.showLegendSelector.value || store.showOffsetControls.value || store.showCityAddToggle.value)"
          class="split-line"></div>

        <el-select v-if="store.showLegendSelector.value" v-model="store.selectedLegend.value" placeholder="指标"
          class="legend-select no-shrink">
          <el-option v-for="legend in store.legendList.value" :key="legend" :label="legend" :value="legend" />
        </el-select>

        <div v-if="store.showOffsetControls.value" class="slider-wrapper offset-slider">
          <span class="ctrl-text no-shrink">偏移</span>
          <el-slider v-model="store.offsetValue.value" :min="-40" :max="40" :step="1" class="flex-slider" />
          <span class="ctrl-val no-shrink"
            :class="{ 'is-positive': store.offsetValue.value > 0, 'is-negative': store.offsetValue.value < 0 }">
            {{ store.offsetValue.value > 0 ? '+' : '' }}{{ store.offsetValue.value }}
          </span>
        </div>
        <div v-if="(store.showLegendSelector.value || store.showOffsetControls.value) && store.showCityAddToggle.value"
          class="split-line"></div>
      </template>

      <template v-if="store.viewModeDisplay.value === 'table'">
        <el-checkbox-button v-model="store.enableHeatmap.value" :size="store.controlSize.value" class="no-shrink"
          style="margin-right: 8px;">热力图</el-checkbox-button>
        <div class="split-line"></div>
      </template>

      <div v-if="store.showCityAddToggle.value" class="compare-trigger no-shrink"
        @click="store.isDrawerVisible.value = true">
        <el-icon class="icon-plus" v-if="store.selectedExtraCities.value.length === 0">
          <Plus />
        </el-icon>
        <span class="trigger-text">
          {{ store.selectedExtraCities.value.length === 0 ? (store.isProvince.value ? '添加省份' : '添加城市') : `对比中
          (${store.selectedExtraCities.value.length}/5)` }}
        </span>
      </div>

      <template v-if="store.viewModeDisplay.value === 'table'">
        <div v-if="store.showCityAddToggle.value" class="split-line"></div>
        <el-button :size="store.controlSize.value" type="success" plain class="no-shrink export-btn"
          @click="store.exportToCSV" title="导出数据">
          <el-icon>
            <Download />
          </el-icon> <span class="export-text">导出</span>
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { inject, defineEmits } from 'vue';
import { Plus, Download } from '@element-plus/icons-vue';

const store = inject('chartStore');
defineEmits(['toggleAllLegends']);
</script>

<style scoped>
.bi-toolbar {
  display: flex;
  flex-wrap: nowrap !important;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 5px 5px;
  border-radius: 12px;
  margin-bottom: 5px;
  overflow: visible !important;
  width: 100%;
  box-sizing: border-box;
}

.toolbar-group {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-soft);
  gap: 12px;
  flex: 0 1 auto;
  min-width: 0;
  white-space: nowrap;
  height: 50px;
  box-sizing: border-box;
  overflow-y: hidden !important;
}

.group-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 12px;
  border-right: 1px solid var(--border-default);
  flex-shrink: 0;
}

.split-line {
  width: 1px;
  height: 18px;
  background-color: var(--border-strong);
  margin: 0 4px;
  flex-shrink: 0;
}

.view-group {
  flex: 0 1 auto;
}

.time-group {
  width: 280px;
  flex-shrink: 0;
}

.dim-group {
  flex: 0 1 auto;
}

.legend-select {
  min-width: 80px;
  max-width: 120px;
  flex: 0 1 auto;
  margin-right: 0;
  height: 36px !important;
  line-height: 36px !important;
}

.legend-select :deep(.el-input__wrapper),
.legend-select :deep(.el-select__wrapper) {
  height: 100% !important;
  min-height: 100% !important;
  padding: 0 12px !important;
  border-radius: 10px !important;
  box-shadow: none !important;
  border: 1px solid var(--border-default) !important;
  background-color: var(--bg-card) !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
}

.legend-select :deep(.el-input__wrapper.is-focus),
.legend-select :deep(.el-select__wrapper.is-focused) {
  border-color: var(--color-accent) !important;
  box-shadow: none !important;
}

.legend-select :deep(.el-input__inner),
.legend-select :deep(.el-select__placeholder) {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: var(--text-secondary) !important;
  line-height: normal !important;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.offset-slider {
  width: 200px;
  margin-left: 8px;
}

.flex-slider {
  flex: 1 1 auto;
  min-width: 40px;
  margin: 0;
}

.ctrl-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.no-shrink {
  flex-shrink: 0 !important;
}

.ctrl-val {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 24px;
  margin-left: 10px;
  text-align: left;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.ctrl-val.is-positive {
  color: #ef4444;
}

.ctrl-val.is-negative {
  color: #22c55e;
}

:deep(.el-checkbox-button__inner) {
  height: 36px !important;
  padding: 0 16px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  border-radius: 10px !important;
  box-shadow: none !important;
  border: 1px solid var(--border-default);
  transition: all 0.2s ease;
  background-color: var(--bg-card) !important;
  color: var(--text-muted) !important;
}

:deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
  background-color: var(--color-accent-fill) !important;
  border-color: var(--color-accent) !important;
  color: var(--color-accent-contrast) !important;
  box-shadow: none !important;
}

:deep(.el-slider__bar) {
  background-color: var(--color-accent) !important;
}

:deep(.el-slider__button) {
  border-color: var(--color-accent) !important;
  border-width: 2px !important;
  width: 16px;
  height: 16px;
  background-color: var(--bg-card) !important;
}

:deep(.el-radio-button__inner),
.btn-toggle-all {
  height: 36px !important;
  padding: 0 16px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  line-height: normal !important;
  transition: all 0.2s ease;
}

.btn-toggle-all {
  border-radius: 10px !important;
  margin-left: 4px;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 10px 0 0 10px !important;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 10px 10px 0 !important;
}

:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner) {
  color: var(--text-muted) !important;
  background-color: var(--bg-card) !important;
  box-shadow: none !important;
  border-color: var(--border-default) !important;
}

:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner:hover) {
  color: var(--color-accent) !important;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: var(--color-accent-fill) !important;
  border-color: var(--color-accent) !important;
  color: var(--color-accent-contrast) !important;
  box-shadow: -1px 0 0 0 var(--color-accent) !important;
}

:deep(.el-button--primary.btn-toggle-all) {
  background-color: var(--color-accent-fill) !important;
  border-color: var(--color-accent) !important;
  color: var(--color-accent-contrast) !important;
}

:deep(.el-button--default.btn-toggle-all:hover) {
  color: var(--color-accent) !important;
  border-color: var(--color-accent) !important;
  background-color: var(--color-accent-soft) !important;
}

.compare-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  padding: 0 16px;
  background-color: var(--bg-card-soft);
  border: 1px dashed var(--border-strong);
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.compare-trigger:hover {
  background-color: var(--color-accent-soft);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.export-btn {
  border-radius: 8px !important;
  font-weight: bold;
}

:deep(.el-button--default.btn-toggle-all) {
  background-color: var(--bg-card) !important;
  border-color: var(--border-default) !important;
  color: var(--text-secondary) !important;
}

:deep(.el-button--success.is-plain.export-btn) {
  background-color: var(--bg-card) !important;
  border-color: var(--border-default) !important;
  color: var(--text-secondary) !important;
}

:deep(.el-button--success.is-plain.export-btn:hover) {
  background-color: var(--color-accent-soft) !important;
  border-color: var(--color-accent) !important;
  color: var(--color-accent) !important;
}

:deep(.el-slider__runway) {
  background-color: var(--border-default) !important;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .bi-toolbar {
    flex-direction: column !important;
    padding: 6px;
    gap: 6px;
    margin-bottom: 0px;
    align-items: stretch;
  }

  .toolbar-group {
    width: 100%;
    padding: 0 8px;
    gap: 8px;
    height: 40px;
    flex-wrap: nowrap !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }

  .toolbar-group::-webkit-scrollbar {
    display: none;
  }

  .group-label {
    font-size: 13px;
    font-weight: bold;
    width: 45px;
    padding-right: 4px;
    flex-shrink: 0;
    justify-content: flex-start;
  }

  .view-group,
  .time-group,
  .dim-group {
    width: 100%;
  }

  .legend-select {
    height: 28px !important;
    line-height: 28px !important;
    min-width: 86px;
    max-width: 100px;
    flex: 1 1 auto;
  }

  .legend-select :deep(.el-input__wrapper),
  .legend-select :deep(.el-select__wrapper) {
    padding: 0 8px !important;
    border-radius: 6px !important;
  }

  .legend-select :deep(.el-input__inner),
  .legend-select :deep(.el-select__placeholder) {
    font-size: 12px !important;
  }

  .slider-wrapper {
    min-width: 120px;
    flex: 1 1 auto;
    gap: 8px;
  }

  .flex-slider {
    min-width: 50px;
  }

  .offset-slider {
    width: auto;
    flex: 1 1 auto;
    margin-left: 0;
  }

  :deep(.el-radio-group) {
    display: flex;
    flex: 1 1 auto;
  }

  :deep(.el-radio-button) {
    flex: 1 1 auto;
    display: flex;
  }

  :deep(.el-radio-button__inner),
  :deep(.el-checkbox-button__inner) {
    width: 100%;
    height: 28px !important;
    padding: 0 4px !important;
    font-size: 12px !important;
    border-radius: 6px !important;
  }

  .btn-toggle-all {
    height: 28px !important;
    padding: 0 10px !important;
    font-size: 12px !important;
    flex: 0 0 auto;
    border-radius: 8px !important;
  }

  :deep(.el-radio-button:first-child .el-radio-button__inner) {
    border-radius: 8px 0 0 8px !important;
  }

  :deep(.el-radio-button:last-child .el-radio-button__inner) {
    border-radius: 0 8px 8px 0 !important;
  }

  .split-line {
    height: 14px;
    margin: 0 2px;
  }

  .compare-trigger {
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 8px;
    flex: 1 1 auto;
    margin-right: 4px;
  }

  .export-text {
    display: none;
  }

  .export-btn {
    width: 32px;
    padding: 0 !important;
  }
}
</style>
