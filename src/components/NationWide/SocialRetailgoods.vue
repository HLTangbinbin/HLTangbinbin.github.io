<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_SRG_Month }"
                @click="drawBarChart_SRG_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_SRG_Month }"
                @click="drawLineChart_SRG_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="srg-month"></div>

        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_SRG_Rise_Month }"
                @click="drawBarChart_SRG_Rise_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_SRG_Rise_Month }"
                @click="drawLineChart_SRG_Rise_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="srg-rise-month"></div>

        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_SRG_Accumulated_Month }"
                @click="drawBarChart_SRG_Accumulated_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_SRG_Accumulated_Month }"
                @click="drawLineChart_SRG_Accumulated_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="srg-accumulated-month"></div>

        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_SRG_Accumulated_Rise_Month }"
                @click="drawBarChart_SRG_Accumulated_Rise_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_SRG_Accumulated_Rise_Month }"
                @click="drawLineChart_SRG_Accumulated_Rise_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="srg-accumulated-rise-month"></div>


    </div>
</template>

<script>

import { params_socialretailgoods, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

    data() {
        return {
            EChartType_SRG: {
                SRM: 'srg-month',
                SRRM: 'srg-rise-month',
                SRAM: 'srg-accumulated-month',
                SRARM: 'srg-accumulated-rise-month',
            },

            isBarActive_SRG_Month: false,
            isLineActive_SRG_Month: false,
            isBarActive_SRG_Rise_Month: false,
            isLineActive_SRG_Rise_Month: false,
            isBarActive_SRG_Accumulated_Month: false,
            isLineActive_SRG_Accumulated_Month: false,
            isBarActive_SRG_Accumulated_Rise_Month: false,
            isLineActive_SRG_Accumulated_Rise_Month: false,

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
            // 读取本地社零数据
            fetch('json/nation.json')
                .then(response => response.json())
                .then(data => {
                    // console.log('读取本地数据社零数据:', data);
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
                this.returnData = await sendRequest(params_socialretailgoods);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn()
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_SRG_Month()
                this.drawBarChart_SRG_Rise_Month()
                this.drawBarChart_SRG_Accumulated_Month()
                this.drawBarChart_SRG_Accumulated_Rise_Month()

            }
        },
        drawBarChart_SRG_Month() {
            this.isBarActive_SRG_Month = true;
            this.isLineActive_SRG_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_SRG.SRM)

        },
        drawLineChart_SRG_Month() {
            this.isBarActive_SRG_Month = false;
            this.isLineActive_SRG_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_SRG.SRM)
        },
        drawBarChart_SRG_Rise_Month() {
            this.isBarActive_SRG_Rise_Month = true;
            this.isLineActive_SRG_Rise_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_SRG.SRRM)

        },
        drawLineChart_SRG_Rise_Month() {
            this.isBarActive_SRG_Rise_Month = false;
            this.isLineActive_SRG_Rise_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_SRG.SRRM)
        },
        drawBarChart_SRG_Accumulated_Month() {
            this.isBarActive_SRG_Accumulated_Month = true;
            this.isLineActive_SRG_Accumulated_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_SRG.SRAM)

        },
        drawLineChart_SRG_Accumulated_Month() {
            this.isBarActive_SRG_Accumulated_Month = false;
            this.isLineActive_SRG_Accumulated_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_SRG.SRAM)
        },
        drawBarChart_SRG_Accumulated_Rise_Month() {
            this.isBarActive_SRG_Accumulated_Rise_Month = true;
            this.isLineActive_SRG_Accumulated_Rise_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_SRG.SRARM)

        },
        drawLineChart_SRG_Accumulated_Rise_Month() {
            this.isBarActive_SRG_Accumulated_Rise_Month = false;
            this.isLineActive_SRG_Accumulated_Rise_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_SRG.SRARM)
        },

        drawChartWithParams(echrtId) {
            // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
            let basicParams = {};
            let typeArr = []; 

            // 年度/月度数据
            switch (echrtId) {

                case this.EChartType_SRG.SRM:
                    // A070101-社会消费品零售总额_当期值 A07040105-粮油、食品类商品零售类值_当期值 A0704010H-饮料类商品零售类值_当期值 A0704010L-烟酒类商品零售类值_当期值
                    // A07040205-服装类商品零售类值_当期值 A07040301-化妆品类商品零售类值_当期值 A07040401-金银珠宝类商品零售类值_当期值 A07040501-日用品类商品零售类值_当期值
                    // A07040601-体育、娱乐用品类商品零售类值_当期值 A07040701-书报杂志类商品零售类值_当期值 A07040801-家用电器和音像器材类商品零售类值_当期值 A07040901-中西药品类商品零售类值_当期值
                    // A07040A01-文化办公用品类商品零售类值_当期值 A07040B01-家具类商品零售类值_当期值 A07040C01-通讯器材类商品零售类值_当期值 A07040D01-石油及制品类商品零售类值_当期值 A07040E01-建筑及装潢材料类商品零售类值_当期值
                    // A07040F01-汽车类商品零售类值_当期值
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '社会消费品零售总额当期值(亿元)', subtitle: '', exceptName: '消费类商品零售类值_当期值', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'yd' }
                    typeArr = ['A070101', 'A07040105', 'A0704010H', 'A0704010L', 'A07040205', 'A07040301', 'A07040401', 'A07040501', 'A07040601', 'A07040701', 'A07040801', 'A07040901',
                    'A07040A01', 'A07040B01', 'A07040C01', 'A07040D01', 'A07040E01', 'A07040F01'
                    ];
                    break;
                case this.EChartType_SRG.SRRM:
                    // A070103-社会消费品零售总额_同比增长 A07040107-粮油、食品类商品零售类值_同比增长 A0704010J-饮料类商品零售类值_同比增长 A0704010N-烟酒类商品零售类值_同比增长
                    // A07040207-服装类商品零售类值_同比增长 A07040303-化妆品类商品零售类值_同比增长 A07040403-金银珠宝类商品零售类值_同比增长 A07040503-日用品类商品零售类值_同比增长
                    // A07040603-体育、娱乐用品类商品零售类值_同比增长 A07040703-书报杂志类商品零售类值_同比增长 A07040803-家用电器和音像器材类商品零售类值_同比增长 A07040903-中西药品类商品零售类值_同比增长
                    // A07040A03-文化办公用品类商品零售类值_同比增长 A07040B03-家具类商品零售类值_同比增长 A07040C03-通讯器材类商品零售类值_同比增长 A07040D03-石油及制品类商品零售类值_同比增长 A07040E03-建筑及装潢材料类商品零售类值_同比增长
                    // A07040F03-汽车类商品零售类值_同比增长
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '社会消费品零售总额同比增长(%)', subtitle: '', exceptName: '消费类商品零售类值_同比增长', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'yd' }
                    typeArr = ['A070103', 'A07040107', 'A0704010J', 'A0704010N', 'A07040207', 'A07040303', 'A07040403', 'A07040503', 'A07040603', 'A07040703', 'A07040803', 'A07040903',
                        'A07040A03', 'A07040B03', 'A07040C03', 'A07040D03', 'A07040E03', 'A07040F03'
                    ];
                    break;
                case this.EChartType_SRG.SRAM:
                    // A070102-社会消费品零售总额_累计值 A07040106-粮油、食品类商品零售类值_累计值 A0704010I-饮料类商品零售类值_累计值 A0704010M-烟酒类商品零售类值_累计值
                    // A07040206-服装类商品零售类值_累计值 A07040302-化妆品类商品零售类值_累计值 A07040402-金银珠宝类商品零售类值_累计值 A07040502-日用品类商品零售类值_累计值
                    // A07040602-体育、娱乐用品类商品零售类值_累计值 A07040702-书报杂志类商品零售类值_累计值 A07040802-家用电器和音像器材类商品零售类值_累计值 A07040902-中西药品类商品零售类值_累计值
                    // A07040A02-文化办公用品类商品零售类值_累计值 A07040B02-家具类商品零售类值_累计值  A07040C02-通讯器材类商品零售类值_累计值 A07040D02-石油及制品类商品零售类值_累计值 A07040E02-建筑及装潢材料类商品零售类值_累计值
                    // A07040F02-汽车类商品零售类值_累计值
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '社会消费品零售总额累计值(亿元)', subtitle: '', exceptName: '消费类商品零售类值_累计值', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'yd' }
                    typeArr = ['A070102', 'A07040106', 'A0704010I','A0704010M', 'A07040206', 'A07040302', 'A07040402', 'A07040502', 'A07040602', 'A07040702', 'A07040802', 'A07040902',
                        'A07040A02', 'A07040B02', 'A07040C02', 'A07040D02', 'A07040E02', 'A07040F02'
                    ];
                    break;

                case this.EChartType_SRG.SRARM:
                    // A070104-社会消费品零售总额_累计增长 A07040108-粮油、食品类商品零售类值_累计增长 A0704010K-饮料类商品零售类值_累计增长 A0704010O-烟酒类商品零售类值_累计增长 
                    // A07040208-服装类商品零售类值_累计增长 A07040304-化妆品类商品零售类值_累计增长 A07040404-金银珠宝类商品零售类值_累计增长 A07040504-日用品类商品零售类值_累计增长
                    // A07040604-体育、娱乐用品类商品零售类值_累计增长 A07040704-书报杂志类商品零售类值_累计增长 A07040804-家用电器和音像器材类商品零售类值_累计增长 A07040904-中西药品类商品零售类值_累计增长
                    // A07040A04-文化办公用品类商品零售类值_累计增长 A07040B04-家具类商品零售类值_累计增长 A07040C04-通讯器材类商品零售类值_累计增长 A07040D04-石油及制品类商品零售类值_累计增长 A07040E04-建筑及装潢材料类商品零售类值_累计增长
                    // A07040F04-汽车类商品零售类值_累计增长
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '社会消费品零售总额_累计增长(%)', subtitle: '', exceptName: '消费类商品零售类值_累计增长', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'yd' }
                    typeArr = ['A070104', 'A07040108', 'A0704010K', 'A0704010O', 'A07040208', 'A07040304', 'A07040404', 'A07040504', 'A07040604', 'A07040704', 'A07040804', 'A07040904',
                        'A07040A04', 'A07040B04', 'A07040C04', 'A07040D04', 'A07040E04', 'A07040F04'
                    ];
                    break;
                default:
                    break;
            }
            drawCommonChart(basicParams, typeArr, this.returnData)
        }

    }
};
</script>