<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_SalesArea_Month }"
                @click="drawBarChart_SalesArea_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_SalesArea_Month }"
                @click="drawLineChart_SalesArea_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="salesarea-month"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Sales_Month }" @click="drawBarChart_Sales_Month"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Sales_Month }" @click="drawLineChart_Sales_Month"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="sales-month"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_SalesArea_Year }"
                @click="drawBarChart_SalesArea_Year" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_SalesArea_Year }"
                @click="drawLineChart_SalesArea_Year" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="salesarea-year"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Sales_Year }" @click="drawBarChart_Sales_Year"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Sales_Year }" @click="drawLineChart_Sales_Year"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="sales-year"></div>



    </div>
</template>

<script>

import { params_realEstate_sell, sendRequest, drawCommonChart } from './CommonUtil';
export default {

    data() {
        return {
            EChartType_RealEstate: {
                SAM: 'salesarea-month',
                SM: 'sales-month',
                SAY: 'salesarea-year',
                SY: 'sales-year'
            },

            isBarActive_SalesArea_Month: false,
            isLineActive_SalesArea_Month: false,
            isBarActive_SalesArea_Year: false,
            isLineActive_SalesArea_Year: false,
            isBarActive_Sales_Year: false,
            isLineActive_Sales_Year: false,
            isBarActive_Sales_Month: false,
            isLineActive_Sales_Month: false,
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
            fetch('realEstate_sell.json')
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
                this.returnData = await sendRequest(params_realEstate_sell);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn()
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_SalesArea_Month()
                this.drawBarChart_Sales_Month()
                this.drawBarChart_SalesArea_Year()
                this.drawBarChart_Sales_Year()

            }
        },
        drawBarChart_SalesArea_Month() {
            this.isBarActive_SalesArea_Month = true;
            this.isLineActive_SalesArea_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate.SAM)

        },
        drawLineChart_SalesArea_Month() {
            this.isBarActive_SalesArea_Month = false;
            this.isLineActive_SalesArea_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate.SAM)
        },
        drawBarChart_Sales_Month() {
            this.isBarActive_Sales_Month = true;
            this.isLineActive_Sales_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate.SM)

        },
        drawLineChart_Sales_Month() {
            this.isBarActive_Sales_Month = false;
            this.isLineActive_Sales_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate.SM)
        },
        drawBarChart_SalesArea_Year() {
            this.isBarActive_SalesArea_Year = true;
            this.isLineActive_SalesArea_Year = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate.SAY)

        },
        drawLineChart_SalesArea_Year() {
            this.isBarActive_SalesArea_Year = false;
            this.isLineActive_SalesArea_Year = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate.SAY)
        },
        drawBarChart_Sales_Year() {
            this.isBarActive_Sales_Year = true;
            this.isLineActive_Sales_Year = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate.SY)

        },
        drawLineChart_Sales_Year() {
            this.isBarActive_Sales_Year = false;
            this.isLineActive_Sales_Year = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate.SY)
        },

        drawChartWithParams(echrtId) {
            // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
            let basicParams = {};
            let typeArr = [];
            // 年度数据
            switch (echrtId) {
                case this.EChartType_RealEstate.SAM:
                    // A060A01-商品住宅销售面积_累计值 A060A03-商品住宅现房销售面积_累计值 A060A05-商品住宅期房销售面积_累计值
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '商品住宅销售面积累计值', subtitle: '', exceptName: '销售面积_累计值', unit: '(万平方米)', legendTop: '10%', gridTop: '30%', sj: '1' }
                    typeArr = ['A060A01', 'A060A03', 'A060A05'];
                    break;
                case this.EChartType_RealEstate.SM:
                    // A060B01-商品住宅销售额_累计值 A060B03-商品住宅现房销售额_累计值 A060B05-商品住宅期房销售额_累计值
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '商品住宅销售额累计值', subtitle: '', exceptName: '销售额_累计值', unit: '(亿元)', legendTop: '10%', gridTop: '30%', sj: '1' }
                    typeArr = ['A060B01', 'A060B03', 'A060B05'];
                    break;
                case this.EChartType_RealEstate.SAY:
                    // A051501-商品房销售面积 A051502-住宅商品房销售面积 A051503-别墅、高档公寓销售面积 A051504-办公楼商品房销售面积 A051505-商业营业用房销售面积
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '商品房销售面积', subtitle: '', exceptName: '销售面积', unit: '(万平方米)', legendTop: '10%', gridTop: '30%', sj: '0' }
                    typeArr = ['A051501', 'A051502', 'A051503', 'A051504', 'A051505'];
                    break;
                case this.EChartType_RealEstate.SY:
                    // A051601-住宅商品房销售额 A051602-住宅商品房销售额 A051603-别墅、高档公寓销售额 A051604-办公楼销售额 A051605-商业营业用房销售额
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '商品房销售额', subtitle: '', exceptName: '销售额', unit: '(亿元)', legendTop: '10%', gridTop: '30%', sj: '0' }
                    typeArr = ['A051601', 'A051602', 'A051603', 'A051604', 'A051605'];
                    break;
                default:
                    break;
            }
            drawCommonChart(basicParams, typeArr, this.returnData)
        }

    }
};
</script>