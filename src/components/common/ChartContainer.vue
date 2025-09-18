<template>
  <div class="chart-container">
    <div class="controls-wrap">
      <!-- PC端布局 - 所有控件在一行 -->
      <div class="controls-row">
        <!-- 图表类型控件 -->
        <div class="chart-controls">
          <button :class="['chart-button', { 'is-active': currentChartType === 'bar' && !isHorizontal }]"
            @click="setChartType('bar', false)">
            柱状图
          </button>
          <button :class="['chart-button', { 'is-active': currentChartType === 'bar' && isHorizontal }]"
            @click="setChartType('bar', true)">
            条形图
          </button>
          <button :class="['chart-button', { 'is-active': currentChartType === 'line' && !isHorizontal }]"
            @click="setChartType('line', false)">
            折线图
          </button>
        </div>
        
        <!-- 一键全选控件 - 与图表类型按钮在同一行 -->
        <button class="toggle-legend-btn" :style="{ backgroundColor: legendAllSelected ? '#0bc2d6' : '#ccc' }"
          @click="toggleAllLegends">
          {{ legendAllSelected ? '一键未选' : '一键全选' }}
        </button>
        
        <!-- 时间选择控件 -->
        <div class="time-control">
          <label class="year-label">选择时间:</label>
          <el-slider v-model="yearLimit" :min=1 :max=20 :step=1 class="year-slider" />
          <span class="offset-value">{{ yearLimit }}</span>
        </div>
      </div>
      
      <!-- 折线图模式下第二行控件 -->
      <div v-if="currentChartType === 'line' && !isHorizontal" class="line-mode-controls">
        <div class="legend-control">
          <el-select v-model="selectedLegend" placeholder="选择图例" class="legend-selector">
            <el-option v-for="legend in legendList" :key="legend" :label="legend" :value="legend" />
          </el-select>
        </div>
        
        <div class="offset-controls">
          <label class="year-label">折线偏移:</label>
          <div class="offset-slider-container">
            <el-slider v-model="offsetValue" :min=-20 :max=20 :step=1 class="year-slider" />
            <span class="offset-value">{{ offsetValue }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card">
      <ChartView ref="chartRef" :option="chartOption" :chartId="chart.id" :initSelectAll="legendAllSelected"
        @legendStateChange="legendAllSelected = $event" />
    </div>
  </div>
</template>


<script>
import { ref, computed, watch } from 'vue';
import ChartView from './ChartView.vue';
import { getCommonChartOption } from '@/utils/CommonUtil.js';
import { logger } from '@/utils/Logger.js';

export default {
  name: 'ChartContainer',
  components: { ChartView },
  props: {
    chart: { type: Object, required: true },
    returnData: { type: Object, required: true, default: () => ({}) },
    config: { type: Object, default: () => ({}) },
    viewMode: { type: String, default: 'monthly' }
  },
  setup(props) {
    const currentChartType = ref('bar');
    const isHorizontal = ref(false);
    const yearLimit = ref(10);
    const legendAllSelected = ref(true);
    const chartRef = ref(null);
    // 新增状态
    const selectedLegend = ref(null)
    const offsetValue = ref(0)
    const legendNames = ref([])


   // 必须这么写，不然在上面使用legendNames取不到数据，使用legendNames.value写法又报错
    const legendList = computed(() => legendNames.value)

    const chartOption = computed(() => {

      const chartConfig = {
        data: props.returnData,
        title: props.chart.title || '默认标题',
        subtitle: props.chart.subtitle || '',
        zbcodeArr: props.chart.zbcodeArr || [],
        cityCodeArr: props.config.cityCodeArr || [],
        dbCode: props.chart.dbCode || 'nd',
        unit: props.chart.unit || '',
        exceptName: props.chart.exceptName || '',
        legendTop: props.chart.legendTop,
        gridTop: props.chart.gridTop,
        chartType: currentChartType.value,
        yearLimit: yearLimit.value,
        isHorizontal: isHorizontal.value,
        enableBirthOffset: props.chart.enableBirthOffset || false,
        enableBirthPrediction: props.chart.enableBirthPrediction || false,
        selectedLegend: selectedLegend.value,
        offsetValue: offsetValue.value
      };

      const option = getCommonChartOption(chartConfig);

      return option;
    });


    // 监听 legendNames，初始化选中第一个
    // ✅ 在 watch 里同步 legend，不会报 eslint 错
    // watch returnData 或 chartOption 更新 legendNames
    watch(chartOption, async (newOption) => {

      legendNames.value = newOption?.legend?.data || []
      // 默认选中第一个 legend
      if (!selectedLegend.value && legendNames.value.length > 0) {
        selectedLegend.value = legendNames.value[0]
      }

    }, { immediate: true })

    // 切换图表类型
    const setChartType = (type, horizontal) => {
      currentChartType.value = type;
      isHorizontal.value = horizontal;
    };

    // 一键全选/未选
    const toggleAllLegends = () => {
      logger.debug('一键全选:', legendAllSelected.value);
      legendAllSelected.value = !legendAllSelected.value;
      if (chartRef.value) {
        chartRef.value.toggleAllLegends(legendAllSelected.value);
      }
    };

    return {
      currentChartType,
      isHorizontal,
      yearLimit,
      legendAllSelected,
      chartOption,
      setChartType,
      toggleAllLegends,
      chartRef,
      selectedLegend,
      offsetValue,
      legendList
    };
  }
};
</script>


<style scoped>
.chart-container {
  width: 95%;
  max-width: 1500px;
  margin: 30px auto 60px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.controls-wrap {
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin: 0 auto;
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.chart-controls {
  display: flex;
  gap: 12px;
}

.time-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.offset-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.line-mode-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  width: 100%;
}

.year-label {
  font-weight: 400;
  flex-shrink: 0;
  padding: 8px 14px; /* PC端增大尺寸 */
  font-size: 18px; /* PC端增大字体 */
  /* color: rgb(113, 109, 109); */
  border-radius: 8px;
}

.year-slider {
  min-width: 150px; /* PC端增大宽度 */
  max-width: 250px; /* PC端增大宽度 */
}

.toggle-legend-btn {
  flex-shrink: 0;
  padding: 8px 14px; /* PC端增大尺寸 */
  font-size: 14px; /* PC端增大字体 */
  color: #fff;
  background-color: #0bc2d6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
}

.toggle-legend-btn:active {
  transform: scale(0.98);
}

.chart-button {
  padding: 8px 14px; /* PC端增大尺寸 */
  font-size: 14px; /* PC端增大字体 */
  color: #fff;
  background-color: #ccc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.chart-button.is-active {
  background-color: #0bc2d6;
}

.chart-card {
  width: 95%;
  height: 700px;
  margin: 0 auto;
  margin-top: 20px;
}

.legend-selector {
  width: 100%;
  min-width: 250px;
  max-width: 350px;
}

.offset-slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.offset-value {
  flex-shrink: 0;
  min-width: 30px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    margin-top: 8px;
  }
  
  .chart-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    margin-bottom: 0;
  }
  
  .toggle-legend-btn {
    margin: 0;
    padding: 6px 10px;
    font-size: 12px;
  }
  
  /* 时间控件优化 */
  .time-control {
    width: 100%;
    justify-content: center;
    margin-top: 8px;
    flex-wrap: nowrap;
    /* background-color: #f8f9fa; */
    padding: 4px 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
  }
  
  .time-control .year-label {
    padding: 4px 4px;
    font-size: 13px;
    flex-shrink: 0;
  }
  
  .time-control .year-slider {
    min-width: 100px;
    max-width: 150px;
    flex-grow: 1;
  }
  
  .legend-selector {
    max-width: 120px; /* 进一步减小图例选择框宽度 */
    min-width: auto;
  }
  
  .chart-card {
    height: 500px;
  }
  
  /* 图例选择框和偏移控件布局优化 */
  .line-mode-controls {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 8px;
    margin-top: 8px;
    justify-content: center;
    align-items: center;
    /* background-color: #f8f9fa; */
    padding: 6px;
    border-radius: 8px;
    width: 100%;
  }
  
  .legend-control {
    flex: 1;
    min-width: 50px;
    max-width: 34%; /* 限制最大宽度 */
    justify-content: center;
  }
  
  .offset-controls {
    flex: 1;
    min-width: 150px;
    max-width: 80%; /* 限制最大宽度 */
    justify-content: center;
  }
  
  /* 偏移控件内部优化 */
  .offset-controls {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 6px;
  }
  
  .offset-slider-container {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 4px;
    flex-grow: 1;
  }
  
  .offset-controls .year-slider {
    min-width: 120px; /* 减小滑块最小宽度 */
    max-width: 200px; /* 减小滑块最大宽度 */
    flex-grow: 1;
  }
  
  .year-label {
    padding: 4px 8px;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .chart-button {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .offset-value {
    font-size: 12px;
    min-width: 25px;
    flex-shrink: 0;
  }
  
  /* 添加间距 */
  .legend-control {
    margin-right: 8px; /* 图例选择框右侧添加间距 */
  }
}

/* 滑块样式覆盖 */
::v-deep(.el-slider__bar) {
  background-color: #0bc2d6 !important;
}

::v-deep(.el-slider__button) {
  background-color: #0bc2d6 !important;
  border-color: #0bc2d6 !important;
}

/* 选legend择框圆角 */
::v-deep(.legend-selector .el-select__wrapper) {
  border-radius: 6px !important;
}

::v-deep(.legend-selector .el-select__tags) {
  border-radius: 6px !important;
}
</style>