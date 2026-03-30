import { ref, computed, watch } from 'vue';
import { buildChartOption } from '@/utils/chartBuilder.js';
import { generateSmartNarrative } from '@/utils/narrativeEngine.js';
import { useTableEngine } from './useTableEngine.js';
import { resolveMapType } from '@/utils/mapProvider.js';

export function createChartStore(props) {
  const windowWidth = ref(window.innerWidth);
  const onResize = () => { windowWidth.value = window.innerWidth; };
  window.addEventListener('resize', onResize);
  const isMobile = computed(() => windowWidth.value <= 768);
  const controlSize = computed(() => windowWidth.value > 768 ? 'large' : 'small');

  const viewModeDisplay = ref('chart');
  const currentChartType = ref('bar');
  const isHorizontal = ref(false);
  const yearLimit = ref(10);
  const legendAllSelected = ref(true);
  const isYearlyCompare = ref(false);
  const selectedLegend = ref(null);
  const offsetValue = ref(0);
  const legendNames = ref([]);

  const enableSmartAnalysis = ref(false);
  const isDrawerVisible = ref(false);
  const searchKeyword = ref('');
  const selectedExtraCities = ref([]);

  const isMonthlyChart = computed(() => props.chart?.dbCode === 'yd' || props.viewMode === 'monthly');
  const isProvince = computed(() => (props.config?.localJson || '').includes('province'));

  const chartIdentityStr = computed(() => `${props.chart?.title}-${props.chart?.id}-${props.config?.localJson}`);

  // 智能检测当前数据源是否支持地图
  const mapType = computed(() => resolveMapType(props.config?.localJson));
  // 🌟 终极收敛：只有底图是 'province'（省市）时，才显示热力图按钮！武汉也不给了！
  const isMapSupported = computed(() => {
    return mapType.value === 'province';
  });

  watch(chartIdentityStr, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      viewModeDisplay.value = 'chart';
      currentChartType.value = 'bar';
      isHorizontal.value = false;
      selectedExtraCities.value = [];
      searchKeyword.value = '';
      offsetValue.value = 0;
      isYearlyCompare.value = false;
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
      enableSmartAnalysis.value = false;
    }
  });

  watch(isMonthlyChart, (isMonthly) => {
    if (!isMonthly) isYearlyCompare.value = false;
    selectedExtraCities.value = [];
  }, { immediate: true });

  watch(isYearlyCompare, (isCompare) => { if (isCompare) offsetValue.value = 0; });

  const showSmartAnalysisToggle = computed(() => currentChartType.value === 'line' && !isHorizontal.value);
  const showCompareToggle = computed(() => isMonthlyChart.value && currentChartType.value === 'line' && !isHorizontal.value);
  const showLegendSelector = computed(() => legendList.value.length > 1 && (isYearlyCompare.value || showOffsetControls.value || enableSmartAnalysis.value));
  const showOffsetControls = computed(() => props.chart?.enableOffset === true && currentChartType.value === 'line' && !isHorizontal.value && !isYearlyCompare.value);
  const linkedLegend = computed(() => {
    const value = String(props.linkedSelection?.value || '').trim();
    if (!value) return null;
    return legendNames.value.includes(value) ? value : null;
  });

  const currentExtraCityPool = computed(() => {
    const hasSplitConfig = props.config?.needAddCityCodeArr_yd || props.config?.needAddCityCodeArr_nd;
    if (hasSplitConfig) return isMonthlyChart.value ? (props.config.needAddCityCodeArr_yd || []) : (props.config.needAddCityCodeArr_nd || []);
    return props.config?.needAddCityCodeArr || [];
  });

  const finalCityCodeArr = computed(() => Array.from(new Set([...(props.config?.cityCodeArr || []), ...selectedExtraCities.value])));
  const showCityAddToggle = computed(() => Array.isArray(currentExtraCityPool.value) && currentExtraCityPool.value.length > 0);
  const filteredCities = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase();
    if (!keyword) return currentExtraCityPool.value;
    return currentExtraCityPool.value.filter(c => c.cname && c.cname.toLowerCase().includes(keyword));
  });

  const adaptForMobile = (val, scale = 0.65, min = 10) => {
    if (!val || String(val).includes('%')) return val;
    let num = parseInt(val);
    if (isNaN(num)) return val;
    return isMobile.value ? Math.max(Math.round(num * scale), min) + 'px' : val;
  };

  // 完美规避 no-extra-boolean-cast，利用三元表达式返回干净的布尔值
  const isPieActive = computed(() => !isYearlyCompare.value && (props.chart?.pieConfig?.enabled ? true : false));
  const chartHeight = computed(() => isMobile.value ? (isPieActive.value ? 450 : 350) : (isPieActive.value ? 650 : 550));

  const chartOption = computed(() => {
    const actualDataLimit = (isYearlyCompare.value && isMonthlyChart.value) ? 360 : yearLimit.value;
    const isPieActiveVal = isPieActive.value;

    let finalTitleTop = isMobile.value ? '10px' : '15px';
    let baseLegendTop = props.chart?.legendTop || '50px';
    let finalLegendTop = adaptForMobile(baseLegendTop, 0.85, 30);
    let finalGridTop;

    if (isPieActiveVal) {
      finalGridTop = adaptForMobile(props.chart?.gridTop || '280px', 0.7, 170);
    } else {
      // 完美规避 no-extra-boolean-cast，在 if 中直接依赖 JS 的隐式布尔转换
      if (props.chart?.pieConfig?.enabled) {
        let lTopNum = parseInt(baseLegendTop) || 50;
        let offset = isMobile.value ? 40 : 50;
        finalGridTop = (isMobile.value ? Math.round(lTopNum * 0.7) : lTopNum) + offset + 'px';
      } else {
        finalGridTop = adaptForMobile(props.chart?.gridTop || '100px', 0.7, 90);
      }
    }

    let finalOption = buildChartOption({
      data: props.returnData,
      title: props.chart?.title || '默认标题',
      subtitle: props.chart?.subtitle || '',
      zbcodeArr: props.chart?.zbcodeArr || [],
      cityCodeArr: finalCityCodeArr.value,
      dbCode: props.chart?.dbCode || (props.viewMode === 'monthly' ? 'yd' : 'nd'),
      unit: props.chart?.unit || '',
      exceptName: props.chart?.exceptName || '',
      titleTop: finalTitleTop,
      legendTop: finalLegendTop,
      gridTop: finalGridTop,
      isMobile: isMobile.value,
      chartType: viewModeDisplay.value === 'map' ? 'map' : currentChartType.value,
      yearLimit: actualDataLimit,
      compareYearCount: yearLimit.value,
      isHorizontal: isHorizontal.value,
      isYearlyCompare: isMonthlyChart.value ? isYearlyCompare.value : false,
      selectedLegend: selectedLegend.value,
      linkedLegend: linkedLegend.value,
      offsetValue: offsetValue.value,
      pieConfig: isPieActiveVal ? props.chart?.pieConfig : null,
      enableBirthOffset: props.chart?.enableBirthOffset || false,
      enableBirthPrediction: props.chart?.enableBirthPrediction || false,
      enableSmartAnalysis: enableSmartAnalysis.value,
      mapType: mapType.value,
    });
    if (finalOption.legend && finalOption.series) {
      const legendData = finalOption.legend.data || [];
      const activeLegend = linkedLegend.value;

      finalOption.legend.selected = legendData.reduce((acc, name) => {
        acc[name] = activeLegend ? name === activeLegend : legendAllSelected.value;
        return acc;
      }, {});
    }

    return finalOption;
  });

  watch(chartOption, (newOption) => {
    legendNames.value = newOption?.originalLegendData || newOption?.legend?.data || [];
    if (selectedLegend.value && !legendNames.value.includes(selectedLegend.value) && legendNames.value.length > 0) {
      selectedLegend.value = legendNames.value[0];
    }
  }, { immediate: true });

  const legendList = computed(() => legendNames.value);

  const smartNarrative = computed(() => {
    if (!enableSmartAnalysis.value || viewModeDisplay.value !== 'chart') return '';
    return generateSmartNarrative(chartOption.value, linkedLegend.value || selectedLegend.value);
  });

  const tableEngine = useTableEngine(chartOption, isMobile, props.chart?.title, chartIdentityStr);

  const toggleCity = (code) => {
    const index = selectedExtraCities.value.indexOf(code);
    if (index > -1) selectedExtraCities.value.splice(index, 1);
    else if (selectedExtraCities.value.length < 5) selectedExtraCities.value.push(code);
  };

  const getCityName = (code) => {
    const city = currentExtraCityPool.value.find(c => c.code === code);
    return city ? city.cname : code;
  };

  return {
    props,
    isMobile, controlSize, chartHeight,
    viewModeDisplay, chartTypeModel, currentChartType, isHorizontal,
    yearLimit, legendAllSelected, isYearlyCompare, selectedLegend, offsetValue,
    enableSmartAnalysis, isDrawerVisible, searchKeyword, selectedExtraCities,
    isProvince, finalCityCodeArr, showCityAddToggle, filteredCities, getCityName, toggleCity,
    showSmartAnalysisToggle, showCompareToggle, showLegendSelector, showOffsetControls, legendList,
    chartOption, smartNarrative, mapType, isMapSupported, linkedLegend,
    ...tableEngine
  };
}
