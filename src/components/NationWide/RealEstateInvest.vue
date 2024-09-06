<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Investment_Month }"
                @click="drawBarChart_Investment_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Investment_Month }"
                @click="drawLineChart_Investment_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="investment-month"></div>

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
                IY: 'investment-year',
            },

            isBarActive_Investment_Month: false,
            isLineActive_Investment_Month: false,
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
            fetch('realEstate_invest.json')
                .then(response => response.json())
                .then(data => {
                    console.log('读取本地成功房地产数据:', data);
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
                case this.EChartType_RealEstate_Invest.IY:
                    // A060A01-商品住宅销售面积_累计值 A060A03-商品住宅现房销售面积_累计值 A060A05-商品住宅期房销售面积_累计值
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '房地产开发投资额', subtitle: '', exceptName: '房地产开发投资额', unit: '(亿元)', legendTop: '10%', gridTop: '30%', sj: '0' }
                    typeArr = ['A051102', 'A051104'];
                    break;
                case this.EChartType_RealEstate_Invest.IM:
                    // A060105-商品住宅投资额_累计值 A06010D-商品住宅现房投资额_累计值 A06010R-土地购置费投资额_累计值
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '房地产投资累计值', subtitle: '', exceptName: '房地产_投资累计值', unit: '(亿元)', legendTop: '10%', gridTop: '30%', sj: '1' }
                    typeArr = ['A060105', 'A06010D', 'A06010R'];
                    break;
                default:
                    break;
            }
            drawCommonChart(basicParams, typeArr, this.returnData)
        }

    }
};
</script>