<template>
  <div class="chart-container">
    <div class="bi-toolbar">

      <div class="toolbar-group view-group">
        <div class="group-label"><i class="el-icon-menu"></i> 视图</div>

        <el-radio-group v-model="viewModeDisplay" :size="controlSize" class="no-shrink" style="margin-right: 8px;">
          <el-radio-button label="chart">图表</el-radio-button>
          <el-radio-button label="table">数据</el-radio-button>
        </el-radio-group>

        <template v-if="viewModeDisplay === 'chart'">
          <div class="split-line"></div>
          <el-radio-group v-model="chartTypeModel" :size="controlSize" class="chart-type-radio no-shrink">
            <el-radio-button label="bar">柱状</el-radio-button>
            <el-radio-button label="hbar">条形</el-radio-button>
            <el-radio-button label="line">折线</el-radio-button>
          </el-radio-group>
        </template>
      </div>

      <div class="toolbar-group time-group">
        <div class="group-label"><i class="el-icon-time"></i> 时间</div>
        <div class="slider-wrapper">
          <el-slider v-model="yearLimit" :min="1" :max="40" :step="1" class="flex-slider" />
          <span class="ctrl-val no-shrink">{{ yearLimit }}</span>
        </div>
      </div>

      <div v-if="viewModeDisplay === 'chart' || viewModeDisplay === 'table'" class="toolbar-group dim-group">
        <div class="group-label"><i class="el-icon-s-data"></i> 操作</div>

        <template v-if="viewModeDisplay === 'chart'">


          <el-button :size="controlSize" class="no-shrink btn-toggle-all"
            :type="legendAllSelected ? 'primary' : 'default'" :plain="!legendAllSelected" @click="toggleAllLegends">
            {{ legendAllSelected ? '反选' : '全选' }}
          </el-button>
          <div class="split-line"></div>


          <el-checkbox-button v-if="showSmartAnalysisToggle" v-model="enableSmartAnalysis" :size="controlSize"
            class="no-shrink" style="margin-right: 8px;">
            <el-icon style="margin-right: 4px">
              <MagicStick />
            </el-icon>智能洞察
          </el-checkbox-button>

          <div v-if="showSmartAnalysisToggle" class="split-line"></div>

          <el-radio-group v-if="showCompareToggle" v-model="isYearlyCompare" :size="controlSize" class="no-shrink">
            <el-radio-button :label="false">连续</el-radio-button>
            <el-radio-button :label="true">同比</el-radio-button>
          </el-radio-group>

          <div v-if="(showCompareToggle) && (showLegendSelector || showOffsetControls || showCityAddToggle)"
            class="split-line"></div>

          <el-select v-if="showLegendSelector" v-model="selectedLegend" placeholder="指标"
            class="legend-select no-shrink">
            <el-option v-for="legend in legendList" :key="legend" :label="legend" :value="legend" />
          </el-select>

          <div v-if="showOffsetControls" class="slider-wrapper offset-slider">
            <span class="ctrl-text no-shrink">偏移</span>
            <el-slider v-model="offsetValue" :min="-40" :max="40" :step="1" class="flex-slider" />
            <span class="ctrl-val no-shrink"
              :class="{ 'is-positive': offsetValue > 0, 'is-negative': offsetValue < 0 }">
              {{ offsetValue > 0 ? '+' : '' }}{{ offsetValue }}
            </span>
          </div>

          <div v-if="(showLegendSelector || showOffsetControls) && showCityAddToggle" class="split-line"></div>
        </template>

        <template v-if="viewModeDisplay === 'table'">
          <el-checkbox-button v-model="enableHeatmap" :size="controlSize" class="no-shrink" style="margin-right: 8px;">
            智能热力图
          </el-checkbox-button>
          <div class="split-line"></div>
        </template>

        <div v-if="showCityAddToggle" class="compare-trigger no-shrink" @click="isDrawerVisible = true">
          <el-icon class="icon-plus" v-if="selectedExtraCities.length === 0">
            <Plus />
          </el-icon>
          <span class="trigger-text">
            {{ selectedExtraCities.length === 0 ? (isProvince ? '添加省份' : '添加城市') : `对比中
            (${selectedExtraCities.length}/5)` }}
          </span>
        </div>

        <template v-if="viewModeDisplay === 'table'">
          <div v-if="showCityAddToggle" class="split-line"></div>
          <el-button :size="controlSize" type="success" plain class="no-shrink export-btn" @click="exportToCSV"
            title="导出当前视图数据">
            <el-icon>
              <Download />
            </el-icon> <span class="export-text">导出</span>
          </el-button>
        </template>

      </div>
    </div>

    <el-drawer v-model="isDrawerVisible" :title="`选择对比${isProvince ? '省份' : '城市'} (最多5个)`"
      :direction="isMobile ? 'btt' : 'rtl'" :size="isMobile ? '80%' : '380px'" :with-header="true"
      class="custom-city-drawer" append-to-body>
      <div class="drawer-content">
        <div class="search-box">
          <el-input v-model="searchKeyword" :placeholder="`输入${isProvince ? '省份' : '城市'}名称搜索`" clearable>
            <template #prefix><el-icon>
                <Search />
              </el-icon></template>
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

    <transition name="el-fade-in">
      <div v-if="enableSmartAnalysis && viewModeDisplay === 'chart' && smartNarrative" class="smart-narrative-panel">
        <div class="narrative-title"><el-icon>
            <MagicStick />
          </el-icon> AI 智能数据叙事</div>
        <div class="narrative-content" v-html="smartNarrative"></div>
      </div>
    </transition>

    <div class="chart-card" :style="{ height: chartHeight + 'px' }">

      <ChartView v-if="viewModeDisplay === 'chart'" ref="chartRef" :option="chartOption" :chartId="chart.id"
        :initSelectAll="legendAllSelected" :pieConfig="isYearlyCompare ? null : chart.pieConfig"
        @legendStateChange="legendAllSelected = $event" />

      <div v-else class="data-table-wrapper">
        <el-table :key="`table-${finalCityCodeArr.length}-${tableColumns.length}`" :data="tableData"
          :height="chartHeight" border stripe style="width: 100%"
          :header-cell-style="{ background: '#f8fafc', color: '#475569', fontWeight: 'bold' }"
          :cell-style="getTableCellStyle">
          <el-table-column v-for="col in tableColumns" :key="col.prop" :prop="col.prop" :label="col.label"
            :min-width="col.minWidth" :fixed="col.fixed" align="center" />
        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Plus, Search, Check, Download, MagicStick } from '@element-plus/icons-vue';
import ChartView from './ChartView.vue';
import { getCommonChartOption, generateSmartNarrative } from '@/utils/CommonUtil.js';
import { ElMessage } from 'element-plus';

export default {
  name: 'ChartContainer',
  components: { ChartView, Plus, Search, Check, Download, MagicStick },
  props: {
    chart: { type: Object, required: true },
    returnData: { type: Object, required: true, default: () => ({}) },
    config: { type: Object, default: () => ({}) },
    viewMode: { type: String, default: 'monthly' },
  },
  setup(props) {
    const windowWidth = ref(window.innerWidth);
    const onResize = () => { windowWidth.value = window.innerWidth; };
    onMounted(() => window.addEventListener('resize', onResize));
    onBeforeUnmount(() => window.removeEventListener('resize', onResize));

    const isMobile = computed(() => windowWidth.value <= 768);
    const controlSize = computed(() => windowWidth.value > 768 ? 'large' : 'small');

    // UI 基础状态
    const viewModeDisplay = ref('chart');
    const currentChartType = ref('bar'); // 考虑到趋势拟合功能，默认线图更好
    const isHorizontal = ref(false);
    const yearLimit = ref(10);
    const legendAllSelected = ref(true);
    const chartRef = ref(null);

    const isYearlyCompare = ref(false);
    const selectedLegend = ref(null);
    const offsetValue = ref(0);
    const legendNames = ref([]);

    const isDrawerVisible = ref(false);
    const searchKeyword = ref('');
    const selectedExtraCities = ref([]);

    // 🌟 高级功能开关;
    const enableHeatmap = ref(false);
    const enableSmartAnalysis = ref(false);

    // 彻底重置所有状态 (解决 Tab 切换幽灵状态)
    const chartIdentityStr = computed(() => `${props.chart?.title}-${props.chart?.id}-${props.config?.localJson}`);
    watch(chartIdentityStr, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        viewModeDisplay.value = 'chart';
        currentChartType.value = 'bar';
        isHorizontal.value = false;

        selectedExtraCities.value = [];
        searchKeyword.value = '';
        offsetValue.value = 0;
        isYearlyCompare.value = false;
        enableHeatmap.value = false;
        enableSmartAnalysis.value = false;
      }
    });

    const chartTypeModel = computed({
      get() {
        if (currentChartType.value === 'bar') return isHorizontal.value ? 'hbar' : 'bar';
        return 'line';
      },
      set(val) {
        if (val === 'hbar') { currentChartType.value = 'bar'; isHorizontal.value = true; }
        else if (val === 'bar') { currentChartType.value = 'bar'; isHorizontal.value = false; }
        else { currentChartType.value = 'line'; isHorizontal.value = false; }
        if (currentChartType.value !== 'line') isYearlyCompare.value = false;
        // 👇 加上这一行：只要切换了图表类型，立刻关闭智能洞察
        enableSmartAnalysis.value = false;
      }
    });

    const isMonthlyChart = computed(() => props.chart.dbCode === 'yd' || props.viewMode === 'monthly');
    const isPieActive = computed(() => !isYearlyCompare.value && !!props.chart.pieConfig?.enabled);

    const chartHeight = computed(() => {
      if (isMobile.value) return isPieActive.value ? 450 : 350;
      return isPieActive.value ? 650 : 550;
    });

    const adaptForMobile = (val, scale = 0.65, min = 10) => {
      if (!val || String(val).includes('%')) return val;
      let num = parseInt(val);
      if (isNaN(num)) return val;
      return isMobile.value ? Math.max(Math.round(num * scale), min) + 'px' : val;
    };

    watch(isMonthlyChart, (isMonthly) => {
      if (!isMonthly) isYearlyCompare.value = false;
      selectedExtraCities.value = [];
    }, { immediate: true });

    const currentExtraCityPool = computed(() => {
      const hasSplitConfig = props.config.needAddCityCodeArr_yd || props.config.needAddCityCodeArr_nd;
      if (hasSplitConfig) {
        return isMonthlyChart.value
          ? (props.config.needAddCityCodeArr_yd || [])
          : (props.config.needAddCityCodeArr_nd || []);
      }
      return props.config.needAddCityCodeArr || [];
    });

    const isProvince = computed(() => {
      const jsonPath = props.config.localJson || '';
      return jsonPath.includes('province');
    });

    const finalCityCodeArr = computed(() => {
      const defaultCodes = props.config.cityCodeArr || [];
      const extraCodes = selectedExtraCities.value || [];
      return Array.from(new Set([...defaultCodes, ...extraCodes]));
    });

    const showCityAddToggle = computed(() => Array.isArray(currentExtraCityPool.value) && currentExtraCityPool.value.length > 0);

    const filteredCities = computed(() => {
      const allExtra = currentExtraCityPool.value;
      const keyword = searchKeyword.value.trim().toLowerCase();
      if (!keyword) return allExtra;
      return allExtra.filter(c => c.cname && c.cname.toLowerCase().includes(keyword));
    });

    const getCityName = (code) => {
      const city = currentExtraCityPool.value.find(c => c.code === code);
      return city ? city.cname : code;
    };

    const toggleCity = (code) => {
      const index = selectedExtraCities.value.indexOf(code);
      if (index > -1) selectedExtraCities.value.splice(index, 1);
      else if (selectedExtraCities.value.length < 5) selectedExtraCities.value.push(code);
    };

    const chartOption = computed(() => {
      const actualDataLimit = (isYearlyCompare.value && isMonthlyChart.value) ? 360 : yearLimit.value;
      const hasPieConfig = !!props.chart.pieConfig?.enabled;
      const isPieActiveVal = !isYearlyCompare.value && hasPieConfig;

      let finalTitleTop = isMobile.value ? '10px' : '15px';
      let baseLegendTop = props.chart.legendTop || '50px';
      let finalLegendTop = adaptForMobile(baseLegendTop, 0.85, 30);
      let finalGridTop;

      if (isPieActiveVal) {
        finalGridTop = adaptForMobile(props.chart.gridTop || '280px', 0.7, 170);
      } else {
        if (hasPieConfig) {
          let lTopNum = parseInt(baseLegendTop) || 50;
          let offset = isMobile.value ? 40 : 50;
          finalGridTop = (isMobile.value ? Math.round(lTopNum * 0.7) : lTopNum) + offset + 'px';
        } else {
          finalGridTop = adaptForMobile(props.chart.gridTop || '100px', 0.7, 90);
        }
      }

      return getCommonChartOption({
        data: props.returnData,
        title: props.chart.title || '默认标题',
        subtitle: props.chart.subtitle || '',
        zbcodeArr: props.chart.zbcodeArr || [],
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
        // 传递给底层的拟合状态
        enableSmartAnalysis: enableSmartAnalysis.value
      });
    });

    watch(chartOption, (newOption) => {
      legendNames.value = newOption?.originalLegendData || newOption?.legend?.data || [];
      if (!legendNames.value.includes(selectedLegend.value) && legendNames.value.length > 0) {
        selectedLegend.value = legendNames.value[0];
      }
    }, { immediate: true });

    watch(isYearlyCompare, (isCompare) => { if (isCompare) offsetValue.value = 0; });
    watch(chartHeight, () => { nextTick(() => { window.dispatchEvent(new Event('resize')); }); });


    const showSmartAnalysisToggle = computed(() => {
      return currentChartType.value === 'line' && !isHorizontal.value;
    });

    // =========================================================
    // 🌟 表格解析引擎 (自带防火墙隔离)
    // =========================================================
    const validSeries = computed(() => {
      if (!chartOption.value || !chartOption.value.series) return [];
      const seriesList = Array.isArray(chartOption.value.series) ? chartOption.value.series : [chartOption.value.series];
      return seriesList
        .map((series, originalIdx) => ({ series, originalIdx }))
        // 防火墙核心：过滤掉 isTrendline 标记的拟合线，保证表格数据绝对干净！
        .filter(item => item.series.name && item.series.name.trim() !== '' && !item.series.isTrendline);
    });

    const getSafeAxisData = (axis) => {
      if (!axis) return null;
      if (Array.isArray(axis)) return axis[0]?.data;
      return axis.data;
    };

    const tableColumns = computed(() => {
      const cols = [{ prop: 'time', label: '时间 / 指标', fixed: 'left', minWidth: 120 }];
      validSeries.value.forEach(item => {
        cols.push({
          prop: `col_${item.originalIdx}`,
          label: item.series.name,
          minWidth: isMobile.value ? 100 : 140
        });
      });
      return cols;
    });

    const tableData = computed(() => {
      const categories = getSafeAxisData(chartOption.value.xAxis) || getSafeAxisData(chartOption.value.yAxis) || [];

      if (categories.length > 0) {
        return categories.map((cat, timeIdx) => {
          const row = { time: cat };
          validSeries.value.forEach(item => {
            let val = '-';
            if (Array.isArray(item.series.data)) {
              const rawVal = item.series.data[timeIdx];
              val = (rawVal !== null && typeof rawVal === 'object' && rawVal.value !== undefined) ? rawVal.value : rawVal;
            }
            row[`col_${item.originalIdx}`] = (val === undefined || val === null || val === '') ? '-' : val;
          });
          return row;
        });
      }

      const rows = [];
      const nameSet = new Set();
      validSeries.value.forEach(item => {
        if (Array.isArray(item.series.data)) {
          item.series.data.forEach(dataItem => {
            if (dataItem && typeof dataItem === 'object' && dataItem.name) nameSet.add(dataItem.name);
          });
        }
      });

      if (nameSet.size > 0) {
        Array.from(nameSet).forEach(name => {
          const row = { time: name };
          validSeries.value.forEach(item => {
            let val = '-';
            if (Array.isArray(item.series.data)) {
              const target = item.series.data.find(d => d && typeof d === 'object' && d.name === name);
              if (target) val = target.value;
            }
            row[`col_${item.originalIdx}`] = (val === undefined || val === null || val === '') ? '-' : val;
          });
          rows.push(row);
        });
        return rows;
      }
      return [];
    });

    // =========================================================
    // 🌟 彭博级表格热力图引擎
    // =========================================================
    const tableColumnStats = computed(() => {
      const stats = {};
      validSeries.value.forEach(item => {
        const numericData = item.series.data
          .map(d => typeof d === 'object' && d !== null ? d.value : d)
          .filter(d => typeof d === 'number' && !isNaN(d));

        if (numericData.length > 0) {
          stats[`col_${item.originalIdx}`] = {
            max: Math.max(...numericData),
            min: Math.min(...numericData)
          };
        }
      });
      return stats;
    });

    const getTableCellStyle = ({ row, column }) => {
      if (!enableHeatmap.value || column.property === 'time' || row[column.property] === '-') return {};

      const stats = tableColumnStats.value[column.property];
      if (!stats || stats.max === stats.min) return {};

      const val = Number(row[column.property]);
      if (isNaN(val)) return {};

      const ratio = (val - stats.min) / (stats.max - stats.min);
      const alpha = ratio * 0.45;
      return {
        backgroundColor: `rgba(11, 194, 214, ${alpha})`,
        color: ratio > 0.8 ? '#0f172a' : 'inherit'
      };
    };

    // =========================================================
    // 工具函数
    // =========================================================
    const exportToCSV = () => {
      const cols = tableColumns.value;
      const data = tableData.value;
      if (cols.length === 0 || data.length === 0) {
        ElMessage.warning('当前暂无可导出的数据');
        return;
      }
      const header = cols.map(c => `"${c.label}"`).join(',');
      const body = data.map(row => {
        return cols.map(c => `"${row[c.prop] ?? '-'}"`).join(',');
      }).join('\n');
      const csvString = '\uFEFF' + header + '\n' + body;
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${props.chart.title || '大唐数据导出'}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      ElMessage.success('数据导出成功！');
    };

    const toggleAllLegends = () => {
      legendAllSelected.value = !legendAllSelected.value;
      if (chartRef.value) chartRef.value.toggleAllLegends(legendAllSelected.value);
    };

    const legendList = computed(() => legendNames.value);
    const showCompareToggle = computed(() => isMonthlyChart.value && currentChartType.value === 'line' && !isHorizontal.value);
    const showLegendSelector = computed(() =>
      legendList.value.length > 1 &&
      (isYearlyCompare.value || showOffsetControls.value || enableSmartAnalysis.value)
    );
    const showOffsetControls = computed(() => props.chart.enableOffset === true && currentChartType.value === 'line' && !isHorizontal.value && !isYearlyCompare.value);
    // 🌟 极简调用：只负责拿生成好的文本
    const smartNarrative = computed(() => {
      if (!enableSmartAnalysis.value || viewModeDisplay.value !== 'chart') return '';
      return generateSmartNarrative(chartOption.value, selectedLegend.value);
    });
    return {
      chartTypeModel, currentChartType, isHorizontal, yearLimit, legendAllSelected,
      chartRef, selectedLegend, offsetValue, legendNames, windowWidth, chartHeight,
      legendList, chartOption, isYearlyCompare, showCompareToggle, showLegendSelector,
      showOffsetControls, controlSize, toggleAllLegends, showCityAddToggle,
      isDrawerVisible, searchKeyword, selectedExtraCities, filteredCities, getCityName,
      toggleCity, isMobile, isProvince, finalCityCodeArr,
      viewModeDisplay, tableColumns, tableData, exportToCSV,
      enableHeatmap, getTableCellStyle, enableSmartAnalysis, smartNarrative, showSmartAnalysisToggle
    };
  }
};
</script>

<style scoped>
.chart-container {
  width: 95%;
  max-width: 1500px;
  margin: 10px auto 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
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

/* ==========================================
   PC端下拉框：弹性宽度，自动呼吸
   ========================================== */
.legend-select {
  /* 删除了死板的 width: 140px 和 flex-shrink: 0 */
  min-width: 120px;
  /* 🌟 核心：给个保底宽度，防止里面没字时缩成一团 */
  max-width: 200px;
  /* 🌟 核心：给个上限，防止超长指标名霸占整个屏幕 */
  flex: 0 1 auto;
  /* 🌟 核心：允许它在空间不够时适度缩小 (flex-shrink: 1) */
  margin-right: 0;

  /* 高度保持之前的完美配置不变 */
  height: 36px !important;
  line-height: 36px !important;
}

/* 强制内部外壳完全填满根节点的 36px */
.legend-select :deep(.el-input__wrapper),
.legend-select :deep(.el-select__wrapper) {
  height: 100% !important;
  /* 🌟 核心：填满父级 */
  min-height: 100% !important;
  padding: 0 12px !important;
  border-radius: 10px !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  background-color: transparent !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
}

/* 聚焦高亮 */
.legend-select :deep(.el-input__wrapper.is-focus),
.legend-select :deep(.el-select__wrapper.is-focused) {
  border-color: #0bc2d6 !important;
  box-shadow: none !important;
}

/* 内部文字排版 */
.legend-select :deep(.el-input__inner),
.legend-select :deep(.el-select__placeholder) {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #475569 !important;
  line-height: normal !important;
}

/* 复选框按钮打磨 */
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
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

:deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
  color: #ffffff !important;
  box-shadow: none !important;
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

/* 表格及新控件专属样式 */
.data-table-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
}

.data-table-wrapper :deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.export-btn {
  border-radius: 8px !important;
  font-weight: bold;
}

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

  /* ==========================================
     移动端下拉框响应式：见缝插针，自动填满
     ========================================== */
  .legend-select {
    /* 高度保持 28px 不变 */
    height: 28px !important;
    line-height: 28px !important;

    /* 🌟 移动端专属宽度魔法 */
    min-width: 80px;
    /* 手机上保底宽度可以小一点 */
    max-width: none;
    /* 解除上限 */
    flex: 1 1 auto;
    /* 🌟 核心：flex-grow设为1，让它自动伸展，填满工具栏的剩余空白！ */
  }

  /* 调整手机端的圆角和边距 */
  .legend-select :deep(.el-input__wrapper),
  .legend-select :deep(.el-select__wrapper) {
    padding: 0 8px !important;
    border-radius: 6px !important;
  }

  /* 缩小手机端的字号 */
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

  .data-table-wrapper {
    padding: 4px;
  }

  .export-text {
    display: none;
  }

  .export-btn {
    width: 32px;
    padding: 0 !important;
  }
}

.chart-card {
  width: 100%;
  position: relative;
  z-index: 0 !important;
}

/* AI 智能洞察面板专属样式 */
.smart-narrative-panel {
  background: linear-gradient(135deg, #f0fcfd 0%, #ffffff 100%);
  border-left: 4px solid #0bc2d6;
  padding: 16px 20px;
  border-radius: 12px;
  margin: 0 auto 16px;
  width: 95%;
  max-width: 1500px;
  box-shadow: 0 4px 16px rgba(11, 194, 214, 0.08);
  box-sizing: border-box;
}

.narrative-title {
  font-size: 15px;
  font-weight: 700;
  color: #0bc2d6;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.narrative-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
  letter-spacing: 0.5px;
}

.narrative-content :deep(strong) {
  color: #0f172a;
  margin: 0 3px;
  font-weight: 600;
}
</style>