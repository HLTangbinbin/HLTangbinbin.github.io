<template>
    <div class="container">

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

import { params_wh, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

    data() {
        return {
            EChartType_RealEstate_WH: {
                SAY: 'salesarea-year',
                SY: 'sales-year'
            },

            isBarActive_SalesArea_Year: false,
            isLineActive_SalesArea_Year: false,
            isBarActive_Sales_Year: false,
            isLineActive_Sales_Year: false,
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
            fetch('wh.json')
                .then(response => response.json())
                .then(data => {
                    console.log('读取本地数据房地产数据:', data);
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
                this.returnData = await sendRequest(params_wh);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn()
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_SalesArea_Year()
                this.drawBarChart_Sales_Year()

            }
        },

        drawBarChart_SalesArea_Year() {
            this.isBarActive_SalesArea_Year = true;
            this.isLineActive_SalesArea_Year = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate_WH.SAY)

        },
        drawLineChart_SalesArea_Year() {
            this.isBarActive_SalesArea_Year = false;
            this.isLineActive_SalesArea_Year = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate_WH.SAY)
        },
        drawBarChart_Sales_Year() {
            this.isBarActive_Sales_Year = true;
            this.isLineActive_Sales_Year = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate_WH.SY)

        },
        drawLineChart_Sales_Year() {
            this.isBarActive_Sales_Year = false;
            this.isLineActive_Sales_Year = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate_WH.SY)
        },

        drawChartWithParams(echrtId) {
            // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
            let basicParams = {};
            let typeArr = [];
            // 年度数据
            switch (echrtId) {
                case this.EChartType_RealEstate_WH.SAY:
                    // A030A-住宅商品房销售面积
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '住宅商品房销售面积(万平方米)', subtitle: '', exceptName: '商品房销售面积(万平方米)', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
                    typeArr = ['A030A'];
                    break;
                case this.EChartType_RealEstate_WH.SY:
                    //  A030C-住宅商品房平均销售价格
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '住宅商品房平均销售价格(元)', subtitle: '', exceptName: '商品房平均销售价格(元)', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
                    typeArr = ['A030C'];
                    break;
                default:
                    break;
            }
            drawCommonChart(basicParams, typeArr, this.returnData)
        }

    }
};
</script>