<template>
    <div class="chart-container">
      <h3 class="chart-title">{{ chart.title }}</h3>
      <h4 v-if="chart.subtitle" class="chart-subtitle">{{ chart.subtitle }}</h4>
  
      <div class="controls-wrap">
        <div class="chart-controls">
          <button :class="['chart-button', { 'is-active': chartType === 'bar' && !isHorizontal }]"
                  @click="setChartType('bar', false)">
            柱状图
          </button>
          <button :class="['chart-button', { 'is-active': chartType === 'bar' && isHorizontal }]"
                  @click="setChartType('bar', true)">
            条形图
          </button>
          <button :class="['chart-button', { 'is-active': chartType === 'line' && !isHorizontal }]"
                  @click="setChartType('line', false)">
            折线图
          </button>
        </div>
  
        <div class="time-legend-row">
          <label class="year-label">滑动时间</label>
          <el-slider v-model="yearLimit" :min="1" :max="20" :step="1" show-tooltip :format-tooltip="formatTooltip"
                     class="year-slider" />
          <button class="toggle-legend-btn" :style="{ backgroundColor: legendAllSelected ? '#0bc2d6' : '#ccc' }"
                  @click="toggleAllLegends">
            {{ legendAllSelected ? '一键未选' : '一键全选' }}
          </button>
        </div>
      </div>
  
      <div class="chart-card">
        <ChartView ref="chartViewRef" :option="chartOption" :debug="debug" class="chart-wrapper"
                   @legendselectchanged="handleLegendSelect" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import { debounce } from 'lodash-es';
  import ChartView from './ChartView.vue';
  import { getCommonChartOption } from '@/utils/CommonUtil.js';
  
  export default {
    name: 'ChartContainer',
    components: { ChartView },
    props: {
      chart: {
        type: Object,
        required: true,
        validator: (val) => ['title', 'zbcodeArr'].every(key => key in val)
      },
      returnData: {
        type: Object,
        required: true
      },
      config: {
        type: Object,
        default: () => ({})
      },
      viewMode: {
        type: String,
        default: 'monthly',
        validator: (val) => ['monthly', 'yearly'].includes(val)
      },
      debug: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { expose }) {
      const chartViewRef = ref(null);
      const chartType = ref('bar');
      const isHorizontal = ref(false);
      const yearLimit = ref(10);
      const legendStates = ref({});
      const legendAllSelected = ref(true);
      const chartOption = ref({});
  
      // 更新全选状态
      const updateAllSelectedState = () => {
        const allNames = Object.keys(legendStates.value);
        legendAllSelected.value = allNames.length > 0 &&
            allNames.every(name => legendStates.value[name]);
      };
      
      // 初始化图例状态
      const initLegendStates = () => {
        const initialOption = getCommonChartOption({
          data: props.returnData,
          zbcodeArr: props.chart.zbcodeArr,
          cityCodeArr: props.config?.cityCodeArr || [],
          isHorizontal: isHorizontal.value
        });
        
        if (initialOption.legend?.data) {
          // 初始化为全选状态
          legendStates.value = initialOption.legend.data.reduce((acc, name) => {
            acc[name] = true;
            return acc;
          }, {});
          updateAllSelectedState();
        }
      };
      
      // 创建图表配置
      const getChartOption = () => {
        const params = {
          data: props.returnData,
          title: props.chart.title,
          subtitle: props.chart.subtitle,
          zbcodeArr: props.chart.zbcodeArr,
          cityCodeArr: props.config?.cityCodeArr || [],
          dbCode: props.chart.dbCode || 'nd',
          unit: props.chart.unit || '',
          exceptName: props.chart.exceptName || '',
          legendTop: '5%',
          gridTop: props.chart.gridTop,
          chartType: chartType.value,
          yearLimit: yearLimit.value,
          isHorizontal: isHorizontal.value,
          legendAllSelected: legendAllSelected.value,
          legendStates: { ...legendStates.value },
          forceMultiSelect: true
        };
        
        const option = getCommonChartOption(params);
        delete option.title; // 确保删除title
        return option;
      };
      
      // 更新图表配置
      const updateChartOption = () => {
        chartOption.value = getChartOption();
      };
      
      // 处理图例选择事件 - 关键修复
      const handleLegendSelect = (event) => {
        if (event?.name !== undefined && event?.selected !== undefined) {
          // 只更新单个图例状态
          legendStates.value = {
            ...legendStates.value,
            [event.name]: event.selected
          };
          updateAllSelectedState();
          updateChartOption();
        }
      };
      
      // 一键全选/取消
      const toggleAllLegends = () => {
        const newState = !legendAllSelected.value;
        legendAllSelected.value = newState;
        
        // 创建新的状态对象
        const newLegendStates = {};
        Object.keys(legendStates.value).forEach(name => {
          newLegendStates[name] = newState;
        });
        
        // 更新状态
        legendStates.value = newLegendStates;
        updateChartOption();
      };
      
      // 设置图表类型
      const setChartType = (type, horizontal) => {
        chartType.value = type;
        isHorizontal.value = horizontal;
        updateChartOption();
      };
      
      // 格式化工具提示
      const formatTooltip = (val) => {
        return `${val}年`;
      };
      
      // 添加防抖的resize处理函数
      const debouncedResize = debounce(() => {
        chartViewRef.value?.getChartInstance()?.resize();
      }, 300);
      
      // 初始化
      onMounted(() => {
        initLegendStates();
        updateChartOption();
        window.addEventListener('resize', debouncedResize);
      });
      
      onBeforeUnmount(() => {
        window.removeEventListener('resize', debouncedResize);
        debouncedResize.cancel();
      });
      
      // 监听相关状态变化
      watch(yearLimit, updateChartOption);
      
      // 暴露方法
      const getChartInstance = () => chartViewRef.value?.getChartInstance();
      
      expose({
        getChartInstance
      });
      
      return {
        chartViewRef,
        chartType,
        isHorizontal,
        yearLimit,
        legendAllSelected,
        chartOption,
        setChartType,
        handleLegendSelect,
        toggleAllLegends,
        formatTooltip
      };
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    max-width: 1500px;
    margin: 50px auto 60px;
    padding: 16px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
  }
  
  .chart-title {
    margin: 24px 0 6px;
    font-size: 18px;
    font-weight: 700;
    color: #333;
    text-align: center;
  }
  
  .chart-subtitle {
    margin: 0 auto 12px;
    font-size: 13px;
    font-weight: bold;
    line-height: 20px;
    color: #666;
    text-align: center;
    white-space: pre-line;
    overflow-wrap: break-word;
    max-width: 80vw;
  }
  
  .controls-wrap {
    display: flex;
    flex-direction: column;
    width: fit-content;
    margin: 0 auto;
  }
  
  .chart-controls {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 16px;
  }
  
  .time-legend-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    gap: 16px;
  }
  
  .year-label {
    flex-shrink: 0;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #333;
    background-color: #f0f0f0;
    border-radius: 10px;
  }
  
  .year-slider {
    min-width: 120px;
    max-width: 200px;
  }
  
  ::v-deep(.year-slider .el-slider__bar) {
    background-color: #0bc2d6 !important;
  }
  
  ::v-deep(.year-slider .el-slider__button) {
    background-color: #0bc2d6 !important;
    border-color: #0bc2d6 !important;
  }
  
  .toggle-legend-btn {
    flex-shrink: 0;
    padding: 6px 12px;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    height: auto;
  }
  
  .toggle-legend-btn:active {
    transform: scale(0.98);
  }
  
  .chart-button {
    padding: 6px 12px;
    margin: 10px;
    font-size: 13px;
    color: #fff;
    background-color: #ccc;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .chart-button.is-active {
    background-color: #0bc2d6;
  }
  
  .chart-card {
    width: 95%;
    height: 600px;
    margin: 0 auto;
  }
  
  .chart-wrapper {
    width: 100%;
    height: 100%;
  }
  </style>