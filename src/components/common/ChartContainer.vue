<template>
  <div class="chart-container">
    <div class="bi-toolbar">
      <div class="toolbar-group view-group">
        <div class="group-label"><i class="el-icon-menu"></i> 图表</div>

        <el-radio-group v-model="chartTypeModel" :size="controlSize" class="chart-type-radio no-shrink">
          <el-radio-button label="bar">柱状</el-radio-button>
          <el-radio-button label="hbar">条形</el-radio-button>
          <el-radio-button label="line">折线</el-radio-button>
        </el-radio-group>

        <div class="split-line"></div>

        <el-button :size="controlSize" class="no-shrink btn-toggle-all"
          :type="legendAllSelected ? 'primary' : 'default'" :plain="!legendAllSelected" @click="toggleAllLegends">
          {{ legendAllSelected ? '未选' : '全选' }}
        </el-button>
      </div>

      <div class="toolbar-group time-group">
        <div class="group-label"><i class="el-icon-time"></i> 时间</div>
        <div class="slider-wrapper">
          <el-slider v-model="yearLimit" :min="1" :max="40" :step="1" class="flex-slider" />
          <span class="ctrl-val no-shrink">{{ yearLimit }}</span>
        </div>
      </div>

      <div v-if="showCompareToggle || showLegendSelector || showOffsetControls || showCityAddToggle"
        class="toolbar-group dim-group">
        <div class="group-label"><i class="el-icon-s-data"></i> 操作</div>

        <el-radio-group v-if="showCompareToggle" v-model="isYearlyCompare" :size="controlSize" class="no-shrink">
          <el-radio-button :label="false">连续</el-radio-button>
          <el-radio-button :label="true">同比</el-radio-button>
        </el-radio-group>

        <div v-if="(showCompareToggle) && (showLegendSelector || showOffsetControls || showCityAddToggle)"
          class="split-line"></div>

        <el-select v-if="showLegendSelector" v-model="selectedLegend" :size="controlSize" placeholder="指标"
          class="legend-select no-shrink">
          <el-option v-for="legend in legendList" :key="legend" :label="legend" :value="legend" />
        </el-select>

        <div v-if="showOffsetControls" class="slider-wrapper offset-slider">
          <span class="ctrl-text no-shrink">偏移</span>
          <el-slider v-model="offsetValue" :min="-40" :max="40" :step="1" class="flex-slider" />
          <span class="ctrl-val no-shrink" :class="{ 'is-positive': offsetValue > 0, 'is-negative': offsetValue < 0 }">
            {{ offsetValue > 0 ? '+' : '' }}{{ offsetValue }}
          </span>
        </div>

        <div v-if="(showLegendSelector || showOffsetControls) && showCityAddToggle" class="split-line"></div>

        <div v-if="showCityAddToggle" class="compare-trigger no-shrink" @click="isDrawerVisible = true">
          <el-icon class="icon-plus" v-if="selectedExtraCities.length === 0">
            <Plus />
          </el-icon>
          <span class="trigger-text">
            {{ selectedExtraCities.length === 0 ? (isProvince ? '添加省份' : '添加城市') : `对比中 (${selectedExtraCities.length}/5)` }}
          </span>
        </div>
      </div>

    </div>

    <el-drawer v-model="isDrawerVisible" :title="`选择对比${isProvince ? '省份' : '城市'} (最多5个)`"
      :direction="isMobile ? 'btt' : 'rtl'" :size="isMobile ? '80%' : '380px'" :with-header="true"
      class="custom-city-drawer" append-to-body>
      <div class="drawer-content">
        <div class="search-box">
          <el-input v-model="searchKeyword" :placeholder="`输入${isProvince ? '省份' : '城市'}名称搜索`" clearable>
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>

        <div class="selected-tags" v-if="selectedExtraCities.length > 0">
          <div class="tags-header">已选：</div>
          <div class="tags-list">
            <el-tag v-for="code in selectedExtraCities" :key="code" closable @close="toggleCity(code)" type="primary"
              class="city-tag">
              {{ getCityName(code) }}
            </el-tag>
          </div>
        </div>

        <div class="city-list">
          <div v-for="city in filteredCities" :key="city.code" class="city-item" :class="{
            'is-active': selectedExtraCities.includes(city.code),
            'is-disabled': !selectedExtraCities.includes(city.code) && selectedExtraCities.length >= 5
          }" @click="toggleCity(city.code)">
            <span class="city-name">{{ city.cname }}</span>
            <el-icon v-if="selectedExtraCities.includes(city.code)" color="#0bc2d6" size="16">
              <Check />
            </el-icon>
          </div>

          <div v-if="filteredCities.length === 0" class="empty-text">未找到匹配项</div>
        </div>
      </div>
    </el-drawer>

    <div class="chart-card" :style="{ height: chartHeight + 'px' }">
      <ChartView ref="chartRef" :option="chartOption" :chartId="chart.id" :initSelectAll="legendAllSelected"
        :pieConfig="isYearlyCompare ? null : chart.pieConfig" @legendStateChange="legendAllSelected = $event" />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Plus, Search, Check } from '@element-plus/icons-vue'; // 确保引入了这些图标
import ChartView from './ChartView.vue';
import { getCommonChartOption } from '@/utils/CommonUtil.js';

export default {
  name: 'ChartContainer',
  components: { ChartView, Plus, Search, Check },
  props: {
    chart: { type: Object, required: true },
    returnData: { type: Object, required: true, default: () => ({}) },
    config: { type: Object, default: () => ({}) }, // 期待包含 cityCodeArr 和 needAddCityCodeArr
    viewMode: { type: String, default: 'monthly' },
  },
  setup(props) {
    const currentChartType = ref('bar');
    const isHorizontal = ref(false);
    const yearLimit = ref(10);
    const legendAllSelected = ref(true);
    const chartRef = ref(null);

    const isYearlyCompare = ref(false);
    const selectedLegend = ref(null);
    const offsetValue = ref(0);
    const legendNames = ref([]);

    // 🌟 新增：城市对比功能的状态
    const isDrawerVisible = ref(false);
    const searchKeyword = ref('');
    const selectedExtraCities = ref([]);

    const chartTypeModel = computed({
      get() {
        if (currentChartType.value === 'bar') return isHorizontal.value ? 'hbar' : 'bar';
        return 'line';
      },
      set(val) {
        if (val === 'hbar') { currentChartType.value = 'bar'; isHorizontal.value = true; }
        else if (val === 'bar') { currentChartType.value = 'bar'; isHorizontal.value = false; }
        else { currentChartType.value = 'line'; isHorizontal.value = false; }

        if (currentChartType.value !== 'line') {
          isYearlyCompare.value = false;
        }
      }
    });

    const windowWidth = ref(window.innerWidth);
    const onResize = () => { windowWidth.value = window.innerWidth; };
    onMounted(() => window.addEventListener('resize', onResize));
    onBeforeUnmount(() => window.removeEventListener('resize', onResize));

    const isMobile = computed(() => windowWidth.value <= 768);
    const isPieActive = computed(() => !isYearlyCompare.value && !!props.chart.pieConfig?.enabled);

    const chartHeight = computed(() => {
      if (isMobile.value) {
        return isPieActive.value ? 450 : 350;
      } else {
        return isPieActive.value ? 650 : 550;
      }
    });

    const adaptForMobile = (val, scale = 0.65, min = 10) => {
      if (!val || String(val).includes('%')) return val;
      let num = parseInt(val);
      if (isNaN(num)) return val;
      return isMobile.value ? Math.max(Math.round(num * scale), min) + 'px' : val;
    };

    const controlSize = computed(() => {
      return windowWidth.value > 768 ? 'large' : 'small';
    });

    const legendList = computed(() => legendNames.value);

    const isMonthlyChart = computed(() => props.chart.dbCode === 'yd' || props.viewMode === 'monthly');

    watch(isMonthlyChart, (isMonthly) => {
      if (!isMonthly) isYearlyCompare.value = false;
      
      // 🌟 新增：一旦发生“月/年”维度的切换，立刻清空已选的额外城市
      // 防止用户在月度选了“丹东”，切到年度时找不到数据而报错
      selectedExtraCities.value = [];
      searchKeyword.value = '';
    }, { immediate: true });

    // 🌟 新增：重置选择的城市
    watch(() => props.config.cityCodeArr, () => {
      // 当默认城市数组发生变化（说明切换了页面或大Tab）时，重置额外选择的城市
      selectedExtraCities.value = [];
      searchKeyword.value = '';
    }, { deep: true });

    // 🌟 2. 新增：智能判定当前该用哪个“城市池”
    const currentExtraCityPool = computed(() => {
      if (isMonthlyChart.value) {
        // 如果是月度(yd)，优先取70城配置，如果没有则降级取通用配置
        return props.config.needAddCityCodeArr_yd || props.config.needAddCityCodeArr || [];
      } else {
        // 如果是年度(nd)，优先取36城配置，如果没有则降级取通用配置
        return props.config.needAddCityCodeArr_nd || props.config.needAddCityCodeArr || [];
      }
    });

    // 🌟 新增：合并最终的城市/省份数组
    const finalCityCodeArr = computed(() => {
      const defaultCodes = props.config.cityCodeArr || [];
      const extraCodes = selectedExtraCities.value || [];
      // 使用 Set 去重
      return Array.from(new Set([...defaultCodes, ...extraCodes]));
    });

    const chartOption = computed(() => {
      const actualDataLimit = (isYearlyCompare.value && isMonthlyChart.value) ? 360 : yearLimit.value;
      const hasPieConfig = !!props.chart.pieConfig?.enabled;
      const isPieActiveVal = !isYearlyCompare.value && hasPieConfig;

      let finalTitleTop = isMobile.value ? '10px' : '15px';
      let baseLegendTop = props.chart.legendTop || '50px';
      let finalLegendTop = adaptForMobile(baseLegendTop, 0.85, 30);
      let finalGridTop;

      if (isPieActiveVal) {
        let baseGridTop = props.chart.gridTop || '280px';
        finalGridTop = adaptForMobile(baseGridTop, 0.7, 170);
      } else {
        if (hasPieConfig) {
          let lTopNum = parseInt(baseLegendTop) || 50;
          let mobileLTop = Math.round(lTopNum * 0.7);
          let offset = isMobile.value ? 40 : 50;
          finalGridTop = (isMobile.value ? mobileLTop : lTopNum) + offset + 'px';
        } else {
          let baseGridTop = props.chart.gridTop || '100px';
          finalGridTop = adaptForMobile(baseGridTop, 0.7, 90);
        }
      }

      return getCommonChartOption({
        data: props.returnData,
        title: props.chart.title || '默认标题',
        subtitle: props.chart.subtitle || '',
        zbcodeArr: props.chart.zbcodeArr || [],

        // 🌟 核心修改：传给图表的将是合并后的数组
        cityCodeArr: finalCityCodeArr.value,

        dbCode: props.chart.dbCode || (props.viewMode === 'monthly' ? 'yd' : 'nd'),
        unit: props.chart.unit || '',
        exceptName: props.chart.exceptName || '',
        titleTop: finalTitleTop,
        legendTop: finalLegendTop,
        gridTop: finalGridTop,
        isMobile: isMobile.value,
        chartType: currentChartType.value,
        yearLimit: actualDataLimit,
        compareYearCount: yearLimit.value,
        isHorizontal: isHorizontal.value,
        isYearlyCompare: isMonthlyChart.value ? isYearlyCompare.value : false,
        selectedLegend: selectedLegend.value,
        offsetValue: offsetValue.value,
        pieConfig: isPieActiveVal ? props.chart.pieConfig : null,
        enableBirthOffset: props.chart.enableBirthOffset || false,
        enableBirthPrediction: props.chart.enableBirthPrediction || false,
      });
    });

    watch(chartOption, (newOption) => {
      legendNames.value = newOption?.originalLegendData || newOption?.legend?.data || [];
      if (!legendNames.value.includes(selectedLegend.value) && legendNames.value.length > 0) {
        selectedLegend.value = legendNames.value[0];
      }
    }, { immediate: true });

    watch(isYearlyCompare, (isCompare) => {
      if (isCompare) offsetValue.value = 0;
    });

    watch(chartHeight, () => {
      nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    });

    const toggleAllLegends = () => {
      legendAllSelected.value = !legendAllSelected.value;
      if (chartRef.value) chartRef.value.toggleAllLegends(legendAllSelected.value);
    };

    const showCompareToggle = computed(() => {
      return isMonthlyChart.value && currentChartType.value === 'line' && !isHorizontal.value;
    });

    const showLegendSelector = computed(() => {
      if (legendList.value.length <= 1) return false;
      return isYearlyCompare.value || showOffsetControls.value;
    });

    const showOffsetControls = computed(() => {
      return props.chart.enableOffset === true &&
        currentChartType.value === 'line' &&
        !isHorizontal.value &&
        !isYearlyCompare.value;
    });

    // 🌟 新增：是否显示城市选择器 (只在传了 needAddCityCodeArr 时显示)
    const showCityAddToggle = computed(() => {
      // 改为判断 currentExtraCityPool
      return Array.isArray(currentExtraCityPool.value) && currentExtraCityPool.value.length > 0;
    });

    // 🌟 新增：判断文案是“省份”还是“城市” (通过看返回数据里是否包含省份关键字)
    const isProvince = computed(() => {
      if (props.config.needAddCityCodeArr && props.config.needAddCityCodeArr.length > 0) {
        const sampleName = props.config.needAddCityCodeArr[0].cname || '';
        return sampleName.includes('省') || sampleName.includes('自治区');
      }
      return false;
    });

    // 🌟 新增：搜索过滤逻辑
    const filteredCities = computed(() => {
      // 改为从 currentExtraCityPool 过滤
      const allExtra = currentExtraCityPool.value;
      const keyword = searchKeyword.value.trim().toLowerCase();
      if (!keyword) return allExtra;
      return allExtra.filter(c => c.cname && c.cname.toLowerCase().includes(keyword));
    });

    const getCityName = (code) => {
      // 改为从 currentExtraCityPool 查找
      const city = currentExtraCityPool.value.find(c => c.code === code);
      return city ? city.cname : code;
    };

    const toggleCity = (code) => {
      const index = selectedExtraCities.value.indexOf(code);
      if (index > -1) {
        selectedExtraCities.value.splice(index, 1);
      } else {
        if (selectedExtraCities.value.length >= 5) return; // 限制最多5个
        selectedExtraCities.value.push(code);
      }
    };


    return {
      chartTypeModel, currentChartType, isHorizontal, yearLimit, legendAllSelected,
      chartRef, selectedLegend, offsetValue, legendNames, windowWidth, chartHeight,
      legendList, chartOption, isYearlyCompare, showCompareToggle, showLegendSelector,
      showOffsetControls, controlSize, toggleAllLegends,
      // 新增暴露的变量
      showCityAddToggle, isDrawerVisible, searchKeyword, selectedExtraCities,
      filteredCities, getCityName, toggleCity, isMobile, isProvince
    };
  }
};
</script>

<style scoped>
/* ================== 原有 CSS 保持不变 ================== */
.chart-container {
  width: 95%;
  max-width: 1500px;
  margin: 10px auto 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Helvetica, Arial, "Microsoft YaHei", sans-serif;
}

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
  background: #fff;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
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
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 12px;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.split-line {
  width: 1px;
  height: 18px;
  background-color: #cbd5e1;
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

.target-group {
  flex-shrink: 0 !important;
}

.legend-select {
  width: 140px;
  flex-shrink: 0 !important;
  margin-right: 0;
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
  color: #475569;
  flex-shrink: 0;
}

.no-shrink {
  flex-shrink: 0 !important;
}

.ctrl-val {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
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

.legend-select :deep(.el-input__wrapper) {
  height: 36px !important;
  min-height: 36px !important;
  box-sizing: border-box;
  border-radius: 10px !important;
  box-shadow: 0 0 0 1px #e2e8f0 inset !important;
}

.legend-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #0bc2d6 inset !important;
}

:deep(.el-slider__bar) {
  background-color: #0bc2d6 !important;
}

:deep(.el-slider__button) {
  border-color: #0bc2d6 !important;
  border-width: 2px !important;
  width: 16px;
  height: 16px;
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
  color: #64748b !important;
  background-color: #ffffff !important;
  box-shadow: none !important;
}

:deep(.el-radio-button__original-radio:not(:checked) + .el-radio-button__inner:hover) {
  color: #0bc2d6 !important;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  color: #ffffff !important;
  box-shadow: -1px 0 0 0 #0bc2d6 !important;
}

:deep(.el-button--primary.btn-toggle-all) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  color: #ffffff !important;
}

:deep(.el-button--default.btn-toggle-all:hover) {
  color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  background-color: #f0fcfd !important;
}

/* ================== 🌟 新增：触发器按钮与 Drawer 抽屉样式 ================== */
.compare-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  padding: 0 16px;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.compare-trigger:hover {
  background-color: #f0fcfd;
  border-color: #0bc2d6;
  color: #0bc2d6;
}

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

/* ================== 移动端适配 ================== */
@media (max-width: 768px) {
  .chart-container {
    padding: 10px;
    margin: 10px auto 16px;
    border-radius: 12px;
  }

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

  .legend-select :deep(.el-input__wrapper) {
    height: 28px !important;
    min-height: 28px !important;
    border-radius: 8px !important;
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

  :deep(.el-radio-button__inner) {
    width: 100%;
    height: 28px !important;
    padding: 0 2px !important;
    font-size: 12px !important;
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

  /* 🌟 移动端的触发器按钮，完美等高 */
  .compare-trigger {
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 8px;
    flex: 1 1 auto;
    margin-right: 4px;
  }
}

.chart-card {
  width: 100%;
  position: relative;
  z-index: 0 !important;
}
</style>