<template>
  <div class="bi-toolbar">
    <div class="toolbar-group view-group">
      <div class="group-label"><i class="el-icon-menu"></i> 视图</div>
      <el-radio-group v-model="store.displayModeModel.value" :size="store.controlSize.value" class="no-shrink">
        <el-radio-button label="table">表格</el-radio-button>
        <el-radio-button label="bar">柱状</el-radio-button>
        <el-radio-button label="hbar">条形</el-radio-button>
        <el-radio-button label="line">折线</el-radio-button>
        <el-radio-button v-if="store?.isMapSupported?.value" label="map">
          地图
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="toolbar-group time-group">
      <div class="group-label"><i class="el-icon-time"></i> 时间</div>
      <div class="slider-wrapper">
        <el-slider v-model="store.yearLimit.value" :show-tooltip="false" :min="1" :max="store.timeLimitMax.value" :step="1" class="flex-slider" />
        <span class="ctrl-val no-shrink">{{ store.yearLimit.value }}</span>
      </div>
    </div>

    <div v-if="store.viewModeDisplay.value === 'chart' || store.viewModeDisplay.value === 'table' || store.viewModeDisplay.value === 'map'"
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
          :size="store.controlSize.value" class="no-shrink" style="margin-right: 8px;">分析
        </el-checkbox-button>
        <div v-if="store.showSmartAnalysisToggle.value" class="split-line"></div>

      <el-radio-group v-if="store.showCompareToggle.value" v-model="store.isYearlyCompare.value"
        :size="store.controlSize.value" class="no-shrink compare-segment">
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
      </template>

      <el-button :size="store.controlSize.value" type="success" plain class="no-shrink export-btn"
        @click="$emit('exportCurrentView')" title="导出当前视图">
        <span class="export-text">导出</span>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { inject, defineEmits } from 'vue';
import { Plus } from '@element-plus/icons-vue';

const store = inject('chartStore');
defineEmits(['toggleAllLegends', 'exportCurrentView']);
</script>

<style scoped>
.bi-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  flex-wrap: nowrap !important;
  align-items: center;
  justify-content: stretch;
  gap: 8px;
  padding: 5px 5px 12px;
  border-radius: 0;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border-default);
  overflow-x: auto !important;
  overflow-y: hidden !important;
  width: 100%;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

.bi-toolbar::-webkit-scrollbar {
  display: none;
}

.toolbar-group {
  display: flex;
  align-items: center;
  background: transparent;
  padding: 0;
  border-radius: 0;
  border: 0;
  box-shadow: none;
  gap: 8px;
  flex: 0 1 auto;
  min-width: 0;
  white-space: nowrap;
  min-height: 38px;
  box-sizing: border-box;
  overflow-y: hidden !important;
}

.view-group {
  justify-content: flex-start;
}

.time-group {
  justify-content: center;
  width: 230px;
  flex-shrink: 0;
}

.dim-group {
  justify-content: flex-end;
}

.group-label {
  display: none;
  font-size: 12px;
  font-weight: 850;
  color: var(--text-muted);
  align-items: center;
  gap: 4px;
  padding-right: 0;
  border-right: 0;
  flex-shrink: 0;
}

.split-line {
  display: none;
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
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  background: var(--bg-card-soft);
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
  font-size: 12px;
  font-weight: 850;
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
  height: 32px !important;
  padding: 0 10px !important;
  font-size: 12px !important;
  font-weight: 850 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  border-radius: 8px !important;
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
  height: 32px !important;
  padding: 0 10px !important;
  font-size: 12px !important;
  font-weight: 850 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  line-height: normal !important;
  transition: all 0.2s ease;
}

.btn-toggle-all {
  border-radius: 8px !important;
  margin-left: 0;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 8px !important;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 8px !important;
}

:deep(.el-radio-button) {
  margin-right: 8px;
}

:deep(.el-radio-button:last-child) {
  margin-right: 0;
}

:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner) {
  color: var(--text-muted) !important;
  background-color: var(--bg-card) !important;
  box-shadow: none !important;
  border-color: var(--border-default) !important;
  border-radius: 8px !important;
}

:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner:hover) {
  color: var(--color-accent) !important;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: var(--color-accent-fill) !important;
  border-color: var(--color-accent) !important;
  color: var(--color-accent-contrast) !important;
  box-shadow: -1px 0 0 0 var(--color-accent) !important;
  border-radius: 8px !important;
}

.compare-segment {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--border-default);
  border-radius: 10px;
  background: var(--bg-card-soft);
  box-shadow: var(--shadow-soft);
  flex: 0 0 auto;
}

.compare-segment :deep(.el-radio-button) {
  margin-right: 3px;
}

.compare-segment :deep(.el-radio-button:last-child) {
  margin-right: 0;
}

.compare-segment :deep(.el-radio-button__inner) {
  height: 28px !important;
  padding: 0 10px !important;
  border: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
}

.compare-segment :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, var(--color-accent), #1696a8) !important;
  color: #fff !important;
  box-shadow: 0 6px 12px rgba(var(--color-accent-rgb), 0.18) !important;
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
  height: 32px;
  padding: 0 10px;
  background-color: var(--bg-card-soft);
  border: 1px dashed var(--border-strong);
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 850;
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
  font-weight: 850;
  height: 32px !important;
  padding: 0 10px !important;
  font-size: 12px !important;
  line-height: normal !important;
}

.export-btn :deep(span) {
  font-size: 12px !important;
  font-weight: 850 !important;
  line-height: normal !important;
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
    display: flex;
    flex-direction: column !important;
    padding: 2px 0 10px;
    gap: 6px;
    margin-bottom: 8px;
    align-items: stretch;
  }

  .toolbar-group {
    width: 100%;
    padding: 0;
    gap: 6px;
    min-height: 32px;
    height: auto;
    flex-wrap: nowrap !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }

  .view-group,
  .time-group,
  .dim-group {
    justify-content: flex-start;
  }

  .toolbar-group::-webkit-scrollbar {
    display: none;
  }

  .group-label {
    display: none;
  }

  .view-group {
    width: 100%;
  }

  .time-group {
    width: 100%;
  }

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
    min-width: 140px;
    flex: 1 1 auto;
    gap: 6px;
    height: 30px;
    padding: 0 8px;
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
    display: inline-flex;
    flex: 1 1 auto;
  }

  :deep(.el-radio-button) {
    flex: 0 0 auto;
    display: flex;
    margin-right: 6px;
  }

  :deep(.el-radio-button__inner),
  :deep(.el-checkbox-button__inner) {
    width: auto;
    height: 28px !important;
    padding: 0 9px !important;
    font-size: 11px !important;
    border-radius: 8px !important;
  }

  .btn-toggle-all {
    height: 28px !important;
    padding: 0 8px !important;
    font-size: 12px !important;
    flex: 0 0 auto;
    border-radius: 8px !important;
  }

  :deep(.el-radio-button:first-child .el-radio-button__inner) {
    border-radius: 8px !important;
  }

  :deep(.el-radio-button:last-child .el-radio-button__inner) {
    border-radius: 8px !important;
  }

  .split-line {
    display: none;
  }

  .compare-trigger {
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
    border-radius: 8px;
    flex: 0 0 auto;
    margin-right: 0;
  }

  .export-text {
    display: inline-flex;
  }

  .export-btn {
    width: auto;
    padding: 0 !important;
    min-width: 44px;
    height: 28px !important;
    font-size: 11px !important;
  }

  .export-btn :deep(span) {
    font-size: 11px !important;
  }

  .compare-segment {
    flex: 0 0 auto;
    padding: 2px;
  }

  .compare-segment :deep(.el-radio-group) {
    flex: 0 0 auto;
  }

  .compare-segment :deep(.el-radio-button__inner) {
    height: 26px !important;
    padding: 0 8px !important;
    font-size: 11px !important;
  }
}
</style>
