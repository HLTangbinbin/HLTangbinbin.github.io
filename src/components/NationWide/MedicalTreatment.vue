<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Agency }" @click="drawBarChart_Agency"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Agency }" @click="drawLineChart_Agency"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="agency"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Officer }" @click="drawBarChart_Officer"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Officer }" @click="drawLineChart_Officer"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="officer"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Bed }" @click="drawBarChart_Bed"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Bed }" @click="drawLineChart_Bed"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="bed"></div>

    </div>
</template>

<script>

import { params_medical, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

    data() {
        return {
            EChartType_Medical: {
                AG: 'agency',
                OF: 'officer',
                BD: 'bed'
            },

            isBarActive_Agency: false,
            isLineActive_Agency: false,
            isBarActive_Officer: false,
            isLineActive_Officer: false,
            isBarActive_Bed: false,
            isLineActive_Bed: false,
            returnData: null,
            sjList: null,
            chartType: null
        };
    },
    mounted() {
        this.loadData();
    },

    methods: {
        loadData() {
            if (process.env.VUE_APP_REQUEST_IS_LOCAL === 'true') {
                this.requestWithLocalJson()
            } else {
                this.requestWithAPI()
            }
        },
        requestWithLocalJson() {
            // 读取本地医疗数据
            fetch('json/nation.json')
                .then(response => response.json())
                .then(data => {
                    // console.log('读取本地数据医疗数据:', data);
                    // 列表数据
                    this.returnData = data;
                    // 处理数据绘制图表
                    this.drawChartWithBtn()
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        async requestWithAPI() {
            try {
                this.returnData = await sendRequest(params_medical);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn()
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_Agency()
                this.drawBarChart_Officer()
                this.drawBarChart_Bed()
            }
        },

        drawBarChart_Agency() {
            this.isBarActive_Agency = true;
            this.isLineActive_Agency = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_Medical.AG)

        },
        drawLineChart_Agency() {
            this.isBarActive_Agency = false;
            this.isLineActive_Agency = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_Medical.AG)
        },
        drawBarChart_Officer() {
            this.isBarActive_Officer = true;
            this.isLineActive_Officer = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_Medical.OF)

        },
        drawLineChart_Officer() {
            this.isBarActive_Officer = false;
            this.isLineActive_Officer = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_Medical.OF)
        },
        drawBarChart_Bed() {
            this.isBarActive_Bed = true;
            this.isLineActive_Bed = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_Medical.BD)

        },
        drawLineChart_Bed() {
            this.isBarActive_Bed = false;
            this.isLineActive_Bed = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_Medical.BD)
        },
        drawChartWithParams(echrtId) {
            // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
            let basicParams = {};
            let typeArr = [];

            switch (echrtId) {
                case this.EChartType_Medical.AG:
                    // A0O0101-医疗卫生机构数 A0O0102-医院数 A0O0106-基层医疗卫生机构   
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '医疗卫生机构数(个)', subtitle: '', exceptName: '卫生机构数', unit: '', legendTop: '10%', gridTop: '20%', dbCode: 'nd'}
                    typeArr = ['A0O0101', 'A0O0102', 'A0O0106'];
                    break;
                case this.EChartType_Medical.OF:
                    // A0O0201-卫生人员数 A0O0202-卫生技术人员数 A0O0204-执业医师数 A0O0205-注册护士数   
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '医疗卫生人员数(万人)', subtitle: '', exceptName: '数', unit: '', legendTop: '10%', gridTop: '20%', dbCode: 'nd' }
                    typeArr = ['A0O0201', 'A0O0202', 'A0O0204', 'A0O0205'];
                    break;
                case this.EChartType_Medical.BD:
                    // A0O0501-卫生机构床位数 A0O0502-医院床位数 A0O0506-基层医疗卫生机构床位数
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '医疗卫生机构床位数(万张)', subtitle: '', exceptName: '卫生机构床位数', unit: '', legendTop: '10%', gridTop: '20%', dbCode: 'nd' }
                    typeArr = ['A0O0501', 'A0O0502', 'A0O0506'];
                    break;
                default:
                    break;
            }
            drawCommonChart(basicParams, typeArr, this.returnData)
        }

    }
};
</script>ß