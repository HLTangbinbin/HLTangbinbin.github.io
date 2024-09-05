<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Investment_Year }"
                @click="drawBarChart_Investment_Year" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Investment_Year }"
                @click="drawLineChart_Investment_Year" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="investment-year"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Sell_Year }"
                @click="drawBarChart_Sell_Year" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Sell_Year }"
                @click="drawLineChart_Sell_Year" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="sell-year"></div>

    </div>
</template>

<script>

import { params_wh, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

    data() {
        return {
            EChartType_RealEstate_WH: {
                IY: 'investment-year',
                SY: 'sell-year',
                
            },

            isBarActive_Investment_Year: false,
            isLineActive_Investment_Year: false,
            isBarActive_Sell_Year: false,
            isLineActive_Sell_Year: false,

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
                this.returnData = await sendRequest(params_wh);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn()
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_Investment_Year()
                this.drawBarChart_Sell_Year()

            }
        },
        drawBarChart_Investment_Year() {
            this.isBarActive_Investment_Year = true;
            this.isLineActive_Investment_Year = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate_WH.IY)

        },
        drawLineChart_Investment_Year() {
            this.isBarActive_Investment_Year = false;
            this.isLineActive_Investment_Year = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate_WH.IY)
        },

        drawBarChart_Sell_Year() {
            this.isBarActive_Sell_Year = true;
            this.isLineActive_Sell_Year = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_RealEstate_WH.SY)

        },
        drawLineChart_Sell_Year() {
            this.isBarActive_Sell_Year = false;
            this.isLineActive_Sell_Year = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_RealEstate_WH.SY)
        },


        drawChartWithParams(echrtId) {
            // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
            let basicParams = {};
            let typeArr = []; 

            // 年度/月度数据
            switch (echrtId) {
                case this.EChartType_RealEstate_WH.IY:
                    // A0302-房地产开发投资额 A0303-房地产开发住宅投资额 A0304-地产开发办公楼投资额
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '房地产开发投资额', subtitle: '', exceptName: '房地产开发投资额', unit: '(亿元)', legendTop: '10%', gridTop: '30%', sj: '0' }
                    typeArr = ['A0302', 'A0303', 'A0304'];
                    break;
                case this.EChartType_RealEstate_WH.SY:
                    // A030A-住宅商品房销售面积 A030C-住宅商品房平均销售价格 
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '房地产销售', subtitle: '', exceptName: '商品房销售', unit: '(元或万平方米)', legendTop: '10%', gridTop: '30%', sj: '0' }
                    typeArr = ['A030A', 'A030C'];
                    break;
                default:
                    break;
            }
            drawCommonChart(basicParams, typeArr, this.returnData)
        }

    }
};
</script>