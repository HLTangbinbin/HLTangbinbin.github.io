<template>
    <div class="echart-container">
        <!-- ✅ 切换按钮（按需显示） -->
        <div v-if="showToggles" class="switch-buttons">
            <div class="buttons-group">
                <button :class="['datatype-button', { 'is-active': viewMode === 'monthly' }]"
                    @click="viewMode = 'monthly'">月度</button>
                <button :class="['datatype-button', { 'is-active': viewMode === 'yearly' }]"
                    @click="viewMode = 'yearly'">年度</button>
            </div>

            <div class="buttons-group">
                <button :class="['echarttype-button', { 'is-active': chartType === 'bar' }]"
                    @click="chartType = 'bar'">柱状图</button>
                <button :class="['echarttype-button', { 'is-active': chartType === 'line' }]"
                    @click="chartType = 'line'">折线图</button>
            </div>
        </div>

        <!-- ✅ 图表区域 -->
        <ChartView v-for="chart in chartsToRender" :key="chart.id" :option="getOption(chart)" class="chart-wrapper" />
    </div>
</template>

<script>
import ChartView from './ChartView.vue';
import { getCommonChartOption } from '../CommonUtil.js';

export default {
    components: { ChartView },
    props: {
        chartMetaList: Array,
        returnData: Object,
        showToggles: { type: Boolean, default: true }, // ✅ 新增控制项
    },
    data() {
        return {
            viewMode: 'monthly',
            chartType: 'bar',
        };
    },
    computed: {
        filteredCharts() {
            return this.chartMetaList.filter(c => c.period === this.viewMode);
        },
        chartsToRender() {
            return this.filteredCharts.filter(chart => {
                const sj = this.returnData?.dataList?.sj?.[chart.dbCode];
                return Array.isArray(sj) && sj.length > 0;
            });
        }
    },
    methods: {
        getOption(chart) {
            const params = {
                ...chart,
                chartType: this.chartType,
                echrtId: chart.id
            };
            return getCommonChartOption(params, chart.typeArr, this.returnData);
        }
    }
};
</script>

<style scoped>
.echart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    width: 95%;
}

.switch-buttons {
    display: flex;
    flex-direction: column;
    /* 每组按钮占一行 */
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.buttons-group {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    /* 上下留间距 */
}

.datatype-button {
    padding: 10px 25px;
    font-size: 14px;
    margin: 0 20px;
    border: none;
    border-radius: 30px;
    background-color: #ccc;
    color: #fff;
    cursor: pointer;
}

.echarttype-button {
    padding: 10px 16px;
    font-size: 14px;
    margin: 0 20px;
    border: none;
    border-radius: 20px;
    background-color: #ccc;
    color: #fff;
    cursor: pointer;
}

.is-active {
    background-color: #0bc2d6;
}

.chart-wrapper {
    width: 100%;
    height: 600px;
    margin-bottom: 24px;
}
</style>