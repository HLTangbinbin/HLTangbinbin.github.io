<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Investment_Month }"
                @click="drawBarChart_Investment_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Investment_Month }"
                @click="drawLineChart_Investment_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="investment-month"></div>

        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Investment_Rise_Month }"
                @click="drawBarChart_Investment_Rise_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Investment_Rise_Month }"
                @click="drawLineChart_Investment_Rise_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="investment-rise-month"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Investment_Year }"
                @click="drawBarChart_Investment_Year" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Investment_Year }"
                @click="drawLineChart_Investment_Year" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="investment-year"></div>

    </div>
</template>

<script>

import { params_realEstate_invest, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

    data() {
        return {
            EChartType_RealEstate_Invest: {
                IM: 'investment-month',
                IRM: 'investment-rise-month',
                IY: 'investment-year',
            },

            isBarActive_Investment_Month: false,
            isLineActive_Investment_Month: false,
            isBarActive_Investment_Rise_Month: false,
            isLineActive_Investment_Rise_Month: false,
            isBarActive_Investment_Year: false,
            isLineActive_Investment_Year: false,

            returnData: null,
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
            // 读取本地房地产数据
            fetch('json/nation.json')
                .then(response => response.json())
                .then(data => {
                    // console.log('读取本地数据房地产数据:', data);
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
                this.returnData = await sendRequest(params_realEstate_invest);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn()
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_Investment_Month()
                this.drawBarChart_Investment_Rise_Month()
                this.drawBarChart_Investment_Year()

            }
        },
        drawBarChart_Investment_Month() {
            this.isBarActive_Investment_Month = true;
            this.isLineActive_Investment_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate_Invest.IM)

        },
        drawLineChart_Investment_Month() {
            this.isBarActive_Investment_Month = false;
            this.isLineActive_Investment_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate_Invest.IM)
        },
        drawBarChart_Investment_Rise_Month() {
            this.isBarActive_Investment_Rise_Month = true;
            this.isLineActive_Investment_Rise_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate_Invest.IRM)

        },
        drawLineChart_Investment_Rise_Month() {
            this.isBarActive_Investment_Rise_Month = false;
            this.isLineActive_Investment_Rise_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate_Invest.IRM)
        },
        drawBarChart_Investment_Year() {
            this.isBarActive_Investment_Year = true;
            this.isLineActive_Investment_Year = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate_Invest.IY)

        },
        drawLineChart_Investment_Year() {
            this.isBarActive_Investment_Year = false;
            this.isLineActive_Investment_Year = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate_Invest.IY)
        },


        drawChartWithParams(echrtId) {
            // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
            let basicParams = {};
            let typeArr = []; 

            // 年度/月度数据
            switch (echrtId) {

                case this.EChartType_RealEstate_Invest.IM:
                    // A060101-房地产投资_累计值 A060105-房地产住宅投资_累计值 A06010D-房地产住宅现房投资_累计值 A06010R-土地购置费投资额_累计值
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '房地产投资累计值(亿元)', subtitle: '', exceptName: '房地产投资_累计值', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'yd' }
                    typeArr = ['A060101', 'A060105', 'A06010D', 'A06010R'];
                    break;
                case this.EChartType_RealEstate_Invest.IRM:
                    // A060102-房地产投资_累计增长 A060106-房地产住宅投资_累计增长 A06010E-房地产办公楼投资_累计增长
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '房地产投资_累计增长', subtitle: '', exceptName: '房地产投资_累计增长', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'yd' }
                    typeArr = ['A060102', 'A060106', 'A06010E'];
                    break;
                case this.EChartType_RealEstate_Invest.IY:
                    // A051102-房地产开发住宅宅投资额 A051104-房地产开发办公楼投资额
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '房地产开发投资额(亿元)', subtitle: '', exceptName: '房地产开发投资额', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
                    typeArr = ['A051102', 'A051104'];
                    break;
                default:
                    break;
            }
            drawCommonChart(basicParams, typeArr, this.returnData)
        }

    }
};
</script>