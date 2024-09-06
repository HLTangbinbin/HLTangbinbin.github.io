<template>
    <div class="container">
        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_NewHouse }" @click="drawBarChart_NewHouse"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_NewHouse }" @click="drawLineChart_NewHouse"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="cityHouseNew"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_OldHouse }" @click="drawBarChart_OldHouse"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_OldHouse }" @click="drawLineChart_OldHouse"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="cityHouseOld"></div>
        
        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_HousePrice }" @click="drawBarChart_HousePrice"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_HousePrice }" @click="drawLineChart_HousePrice"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="cityHousePrice"></div>
    </div>
</template>

<script>

import { params_cityHousePrice, sendRequest, drawCommonChart } from '../CommonUtil';

export default {

    data() {
        return {
            EChartType_CityHouse: {
                CHP: 'cityHousePrice',
                CHN: 'cityHouseNew',
                CHO: 'cityHouseOld'
            },

            isBarActive_HousePrice: false,
            isLineActive_HousePrice: false,
            isBarActive_NewHouse: false,
            isLineActive_NewHouse: false,
            isBarActive_OldHouse: false,
            isLineActive_OldHouse: false,
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
            // 本地cityHouse数据
            fetch('cityHouse.json')
                .then(response => response.json())
                .then(data => {
                    this.returnData = data
                    console.log('本地cityHouseNew数据:', this.returnData);
                    // 处理数据绘制图表
                    this.drawChartWithBtn()
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        async requestWithAPI() {
            try {
                this.returnData = await sendRequest(params_cityHousePrice);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn()
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_HousePrice();
                this.drawBarChart_NewHouse();
                this.drawBarChart_OldHouse();
            }
        },
        drawBarChart_HousePrice() {
            this.isBarActive_HousePrice = true;
            this.isLineActive_HousePrice = false;
            // 在这里绘制柱状图
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_CityHouse.CHP)

        },
        drawLineChart_HousePrice() {
            this.isBarActive_HousePrice = false;
            this.isLineActive_HousePrice = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_CityHouse.CHP)
        },
        drawBarChart_NewHouse() {
            this.isBarActive_NewHouse = true;
            this.isLineActive_NewHouse = false;
            // 在这里绘制柱状图
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_CityHouse.CHN)

        },
        drawLineChart_NewHouse() {
            this.isBarActive_NewHouse = false;
            this.isLineActive_NewHouse = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_CityHouse.CHN)
        },
        drawBarChart_OldHouse() {
            this.isBarActive_OldHouse = true;
            this.isLineActive_OldHouse = false;
            // 在这里绘制柱状图
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_CityHouse.CHO)
        },
        drawLineChart_OldHouse() {
            this.isBarActive_OldHouse = false;
            this.isLineActive_OldHouse = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_CityHouse.CHO)
        },
        drawChartWithParams(echrtId) {
            // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
            let basicParams = {};
            let typeArr = [];
            let cityCodeArr = [];
            switch (echrtId) {
                case this.EChartType_CityHouse.CHP:
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '住宅商品房平均销售价格', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '25%', sj: '0' }
                    // A030C-住宅商品房平均销售价格
                    typeArr = ['A030C'];
                    break;
                case this.EChartType_CityHouse.CHN:
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '新建商品住宅销售价格指数(上月=100)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '25%', sj: '1', min: '98', max: '101' }
                    // A010804-新建商品住宅销售价格指数(上月=100)
                    typeArr = ['A010804'];
                    break;
                case this.EChartType_CityHouse.CHO:
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '二手房住宅销售价格指数(上月=100)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '25%', sj: '1', min: '98', max: '101' }
                    // A010807-二手房住宅销售价格指数(上月=100)
                    typeArr = ['A010807'];
                    break;
                default:
                    break;
            }
            // 110000-北京 440100-上海 440100-广州 440300-深圳 330100-杭州 510100-成都 420100-武汉 320100-南京
            // 500000-重庆 610100-西安 410100-郑州 340100-合肥 420500-宜昌
            cityCodeArr = ['110000', '310000', '440100', '440300', '330100', '510100', '420100', '320100', '500000', '610100', '410100', '340100', '420500']
            drawCommonChart(basicParams, typeArr, this.returnData, cityCodeArr)
        }
    }
};
</script>


<style>
.buttons {
    top: '100px'
}
</style>