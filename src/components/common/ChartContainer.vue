<template>
    <div class="chart-container">
        <h3 class="chart-title">{{ chart.title }}</h3>
        <h4 v-if="chart.subtitle" class="chart-subtitle">{{ chart.subtitle }}</h4>

        <!-- 父容器：包含第一行按钮和第二行控件 -->
        <div class="controls-wrap">
            <!-- 第一行按钮 -->
            <div class="chart-controls">
                <button :class="['chart-button', { 'is-active': chartType === 'bar' && !isHorizontal }]"
                    @click="chartType = 'bar'; isHorizontal = false">柱状图</button>
                <button :class="['chart-button', { 'is-active': chartType === 'bar' && isHorizontal }]"
                    @click="chartType = 'bar'; isHorizontal = true">条形图</button>
                <button :class="['chart-button', { 'is-active': chartType === 'line' && !isHorizontal }]"
                    @click="chartType = 'line'; isHorizontal = false">折线图</button>
            </div>

            <!-- 第二行控件 -->
            <div class="time-legend-row">
                <label class="year-label">滑动时间</label>
                <el-slider v-model="yearLimit" :min="1" :max="20" :step="1" show-tooltip :format-tooltip="formatTooltip"
                    class="year-slider" />
                <button class="toggle-legend-btn" :style="{ backgroundColor: legendAllSelected ? '#0bc2d6' : '#ccc' }"
                    @click="toggleLegend">
                    {{ legendAllSelected ? '一键未选' : '一键全选' }}
                </button>
            </div>
        </div>

        <!-- 图表 -->
        <ChartCard :chart="chart" :chartType="chartType" :returnData="returnData" :config="config"
            :yearLimit="yearLimit" :isHorizontal="isHorizontal" :legendAllSelected="legendAllSelected" />
    </div>
</template>

<script>
import { ref } from 'vue';
import ChartCard from './ChartCard.vue';

export default {
    components: { ChartCard },
    props: {
        chart: Object,
        returnData: Object,
        config: Object,
        initialChartType: { type: String, default: 'bar' },
        viewMode: String,
    },
    setup(props) {
        const chartType = ref(props.initialChartType);
        const isHorizontal = ref(false);
        const yearLimit = ref(10);
        const legendAllSelected = ref(true);

        const toggleLegend = () => {
            legendAllSelected.value = !legendAllSelected.value;
        };

        const formatTooltip = (val) => {
            const unit = props.viewMode === 'monthly' ? '个月' : '年';
            return `近 ${val} ${unit}`;
        };

        return { chartType, isHorizontal, yearLimit, legendAllSelected, toggleLegend, formatTooltip };
    },
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

/* 父容器：包含第一行按钮和第二行控件 */
.controls-wrap {
    display: flex;
    flex-direction: column;
    width: fit-content;
    /* 宽度自适应内容，即第一行按钮总宽度 */
    margin: 0 auto;
    /* 整体居中页面 */

}

/* 第一行按钮 */
.chart-controls {
    display: flex;
    justify-content: center;
    /* 整体居中 */
    gap: 12px;
    margin-top: 16px;
    /* 调整与标题间距，原来可能太小 */
}

/* 第二行控件 */
.time-legend-row {
    display: flex;
    justify-content: center;
    /* 主轴居中，方便中间控件固定位置 */
    margin-top: 16px;
    gap: 16px;
    /* 控件之间的间距 */
    align-items: center;
}

.year-label {
  flex-shrink: 0;
  display: inline-block;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 10px;
  color: #333;              /* 文本颜色改为深色 */
  background-color: #f0f0f0; /* 浅灰背景区分按钮 */
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
    /* 不允许在 flex 行中被压缩 */
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

/* 按钮样式 */
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
</style>