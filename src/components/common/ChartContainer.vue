<template>
    <div class="chart-container">
      <h3 class="chart-title">{{ chart.title }}</h3>
      <h4 v-if="chart.subtitle" class="chart-subtitle">{{ chart.subtitle }}</h4>
  
      <div class="controls-wrap">
        <div class="chart-controls">
          <button :class="['chart-button', { 'is-active': chartType === 'bar' && !isHorizontal }]"
            @click="setChartType('bar', false)">柱状图</button>
          <button :class="['chart-button', { 'is-active': chartType === 'bar' && isHorizontal }]"
            @click="setChartType('bar', true)">条形图</button>
          <button :class="['chart-button', { 'is-active': chartType === 'line' && !isHorizontal }]"
            @click="setChartType('line', false)">折线图</button>
        </div>
  
        <div class="time-legend-row">
          <label class="year-label">滑动时间</label>
          <el-slider 
            v-model="yearLimit" 
            :min="1" 
            :max="20" 
            :step="1" 
            show-tooltip 
            :format-tooltip="formatTooltip"
            class="year-slider" 
          />
          <button 
            class="toggle-legend-btn" 
            :style="{ backgroundColor: legendAllSelected ? '#0bc2d6' : '#ccc' }"
            @click="toggleAllLegends"
          >
            {{ legendAllSelected ? '一键未选' : '一键全选' }}
          </button>
        </div>
      </div>
  
      <div class="chart-card">
        <ChartView 
          :option="chartOption" 
          class="chart-wrapper" 
          @legendselectchanged="handleLegendSelect"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref, watch } from 'vue';
  import ChartView from './ChartView.vue';
  import { getCommonChartOption } from '@/utils/CommonUtil.js';
  
  export default {
    name: 'ChartContainer',
    components: { ChartView },
    props: {
      chart: {
        type: Object,
        required: true
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
        default: 'monthly'
      }
    },
    setup(props) {
      // 图表状态
      const chartType = ref('bar');
      const isHorizontal = ref(false);
      const yearLimit = ref(10);
      const legendStates = ref({});
      const legendAllSelected = ref(true);
      
      // 计算图表配置
      const chartOption = computed(() => {
        const params = {
          data: props.returnData,
          cityCodeArr: props.config?.cityCodeArr || [],
          title: props.chart.title,
          subtitle: props.chart.subtitle,
          dbCode: props.chart.dbCode,
          zbcodeArr: props.chart.zbcodeArr,
          unit: props.chart.unit,
          exceptName: props.chart.exceptName,
          legendTop: getAdjustedLegendTop(),
          gridTop: props.chart.gridTop,
          echrtId: props.chart.id,
          chartType: chartType.value,
          yearLimit: yearLimit.value,
          isHorizontal: isHorizontal.value,
          legendStates: legendStates.value,
          legendAllSelected: legendAllSelected.value
        };
        
        const option = getCommonChartOption(params);
        if (option.title) delete option.title; // 防止重复标题显示
        
        return option;
      });
      
      // 获取调整后的图例位置
      const getAdjustedLegendTop = () => {
        const baseTop = props.chart.legendTop || '15%';
        
        // 移动端适配
        if (window.innerWidth <= 768) {
          if (typeof baseTop === 'string' && baseTop.endsWith('%')) {
            const num = parseFloat(baseTop);
            return (num / 3) + '%';
          }
          if (typeof baseTop === 'number') {
            return baseTop / 3;
          }
          return '5%';
        }
        
        return baseTop;
      };
      
      // 设置图表类型
      const setChartType = (type, horizontal) => {
        chartType.value = type;
        isHorizontal.value = horizontal;
      };
      
      // 处理图例选择
      const handleLegendSelect = (params) => {
        if (params?.name) {
          // 更新单个图例状态
          legendStates.value = {
            ...legendStates.value,
            [params.name]: params.selected[params.name]
          };
          
          // 更新全选状态
          updateAllSelectedState();
        }
      };
      
      // 更新全选状态
      const updateAllSelectedState = () => {
        const values = Object.values(legendStates.value);
        legendAllSelected.value = values.length > 0 && values.every(selected => selected);
      };
      
      // 切换所有图例
      const toggleAllLegends = () => {
        const newState = !legendAllSelected.value;
        const newLegendStates = {};
        
        Object.keys(legendStates.value).forEach(name => {
          newLegendStates[name] = newState;
        });
        
        legendStates.value = newLegendStates;
        legendAllSelected.value = newState;
      };
      
      // 时间变化时重置图例
      watch(yearLimit, () => {
        // 重置为全选
        const newLegendStates = {};
        Object.keys(legendStates.value).forEach(name => {
          newLegendStates[name] = true;
        });
        
        legendStates.value = newLegendStates;
        legendAllSelected.value = true;
      });
      
      // 工具提示
      const formatTooltip = (val) => {
        const unit = props.viewMode === 'monthly' ? '个月' : '年';
        return `近 ${val} ${unit}`;
      };
  
      return { 
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
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
  }
  
  .chart-title {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 24px 0 6px;
  }
  
  .chart-subtitle {
    font-size: 13px;
    font-weight: bold;
    line-height: 20px;
    color: #666;
    text-align: center;
    white-space: pre-line;
    overflow-wrap: break-word;
    margin: 0 auto 12px;
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
    margin-top: 16px;
    gap: 16px;
    align-items: center;
  }
  
  .year-label {
    flex-shrink: 0;
    display: inline-block;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 10px;
    color: #333;
    background-color: #f0f0f0;
  }
  
  .year-slider {
    max-width: 200px;
    min-width: 120px;
  }
  
  /* element-plus 滑块样式 */
  ::v-deep(.year-slider .el-slider__bar) {
    background-color: #0bc2d6 !important;
  }
  
  ::v-deep(.year-slider .el-slider__button) {
    background-color: #0bc2d6 !important;
    border-color: #0bc2d6 !important;
  }
  
  .toggle-legend-btn {
    flex-shrink: 0;
    display: inline-flex;
    padding: 6px 12px;
    height: auto;
    align-items: center;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .chart-button {
    padding: 6px 12px;
    margin: 10px;
    font-size: 13px;
    border-radius: 10px;
    background-color: #ccc;
    color: #fff;
    border: none;
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