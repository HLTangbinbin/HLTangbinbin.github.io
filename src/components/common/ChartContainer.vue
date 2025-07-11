<template>
    <div class="chart-container">
        <h3 class="chart-title">{{ chart.title }}</h3>
        <h4 v-if="chart.subtitle" class="chart-subtitle">{{ chart.subtitle }}</h4>

        <div class="chart-controls">
            <button :class="['chart-button', { 'is-active': chartType === 'bar' }]" @click="chartType = 'bar'"
                type="button">
                柱状图
            </button>
            <button :class="['chart-button', { 'is-active': chartType === 'line' }]" @click="chartType = 'line'"
                type="button">
                折线图
            </button>
        </div>

        <ChartCard :chart="chart" :chartType="chartType" :returnData="returnData" :config="config" />
    </div>
</template>

<script>
import ChartCard from './ChartCard.vue';

export default {
    components: { ChartCard },
    props: {
        chart: Object,
        returnData: Object,
        config: Object,
        initialChartType: {
            type: String,
            default: 'bar'
        }
    },
    data() {
        return {
            chartType: this.initialChartType
        };
    }
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    margin: 0 auto;
    padding: 0px 10px;
    box-sizing: border-box;
    /* 保证足够高度撑起图表 */
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 让子元素水平居中 */
    position: relative;
    z-index: 1;
    margin-top: 40px;
}

.chart-title {
  text-align: center;
  font-size: 18px;
  font-weight: 700; /* 比 500 更粗，接近 canvas 渲染视觉效果 */
  color: #333;
  font-family: 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  margin: 24px 0 6px;
  line-height: 1.4;

  
}

.chart-subtitle {
  font-size: 13px;
  font-weight: bold;
  line-height: 20px;
  color: #666; /* 可改为 #aaa 如果需要更淡 */
  text-align: center;
  white-space: pre-line;
  overflow-wrap: break-word;
  margin: 0 auto 12px;
  max-width: 80vw; /* 等价于 window.innerWidth * 0.8 */
}

.chart-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  margin-top: 8px; /* ✅ 确保和 legend 保持间隔 */
}

.chart-button {
    padding: 6px 12px;
    font-size: 13px;
    border-radius: 10px;
    background-color: #ccc;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 10px;
}

.chart-button.is-active {
    background-color: #0bc2d6;
}
</style>