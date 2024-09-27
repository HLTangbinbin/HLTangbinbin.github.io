<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_ImportAndExport_Month }"
                @click="drawBarChart_ImportAndExport_Month" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_ImportAndExport_Month }"
                @click="drawLineChart_ImportAndExport_Month" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="importandexport-month"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_ImportAndExport }"
                @click="drawBarChart_ImportAndExport" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_ImportAndExport }"
                @click="drawLineChart_ImportAndExport" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="importandexport-year"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Export }" @click="drawBarChart_Export"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Export }" @click="drawLineChart_Export"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="export"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Import }" @click="drawBarChart_Import"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Import }" @click="drawLineChart_Import"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="import"></div>

    </div>
</template>

<script>

import { params_foreignTrade, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

    data() {
        return {
            EChartType_ForeignTrade: {
                IEM: 'importandexport-month',
                IEY: 'importandexport-year',
                EX: 'export',
                IM: 'import',
            },
            isBarActive_ImportAndExport_Month: false,
            isLineActive_ImportAndExport_Month: false,
            isBarActive_ImportAndExport: false,
            isLineActive_ImportAndExport: false,
            isBarActive_Import: false,
            isLineActive_Import: false,
            isBarActive_Export: false,
            isLineActive_Export: false,
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
            // 读取本地外贸数据
            fetch('nation.json')
                .then(response => response.json())
                .then(data => {
                    console.log('读取本地数据外贸数据:', data);
                    // 列表数据
                    this.returnData = data;
                    // 处理数据绘制图表
                    this.drawChartWithBtn();
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        async requestWithAPI() {
            try {
                this.returnData = await sendRequest(params_foreignTrade);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn();
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_ImportAndExport_Month()
                this.drawBarChart_ImportAndExport()
                this.drawBarChart_Export()
                this.drawBarChart_Import()
            }
        },
        drawBarChart_ImportAndExport_Month() {
            this.isBarActive_ImportAndExport_Month = true;
            this.isLineActive_ImportAndExport_Month = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_ForeignTrade.IEM)

        },
        drawLineChart_ImportAndExport_Month() {
            this.isBarActive_ImportAndExport_Month = false;
            this.isLineActive_ImportAndExport_Month = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_ForeignTrade.IEM)
        },
        drawBarChart_ImportAndExport() {
            this.isBarActive_ImportAndExport = true;
            this.isLineActive_ImportAndExport = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_ForeignTrade.IEY)
        },
        drawLineChart_ImportAndExport() {
            this.isBarActive_ImportAndExport = false;
            this.isLineActive_ImportAndExport = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_ForeignTrade.IEY)
        },
        drawBarChart_Export() {
            this.isBarActive_Export = true;
            this.isLineActive_Export = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_ForeignTrade.EX)

        },
        drawLineChart_Export() {
            this.isBarActive_Export = false;
            this.isLineActive_Export = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_ForeignTrade.EX)
        },
        drawBarChart_Import() {
            this.isBarActive_Import = true;
            this.isLineActive_Import = false;
            this.chartType = "bar"
            this.drawChartWithParams(this.EChartType_ForeignTrade.IM)
        },
        drawLineChart_Import() {
            this.isBarActive_Import = false;
            this.isLineActive_Import = true;
            // 在这里绘制折线图
            this.chartType = "line"
            this.drawChartWithParams(this.EChartType_ForeignTrade.IM)
        },
        drawChartWithParams(echrtId) {
            // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
            let basicParams = {};
            let typeArr = [];

            switch (echrtId) {
                case this.EChartType_ForeignTrade.IEM:
                    // A080101-进出口总额 A080105-出口总额(美元) A080109-进口总额(美元) A08010D-进出口差额(美元)    
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '货物进出口总额', subtitle: '', exceptName: '_当期值', unit: '(百万美元)', legendTop: '10%', gridTop: '25%', dbCode: 'yd' }
                    typeArr = ['A080101', 'A080105', 'A080109', 'A08010D'];
                    break;
                case this.EChartType_ForeignTrade.IEY:
                    // A060105-进出口总额 A060106-出口总额(美元) A060107-进口总额(美元) A060108-进出口差额(美元)    
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '货物进出口总额', subtitle: '', exceptName: '(美元)', unit: '(百万美元)', legendTop: '10%', gridTop: '25%', dbCode: 'nd' }
                    typeArr = ['A060105', 'A060106', 'A060107', 'A060108'];
                    break;
                case this.EChartType_ForeignTrade.EX:
                    // A060502010H-中国向日本出口总额 A060502010Y- 中国向韩国出口总额 A0605020115-中国向越南出口总额 A0605020313-中国向俄罗斯出口总额 
                    // A060502010C-中国向印度出口总额 A0605020304- 中国向英国出口总额 A0605020305-中国向德国出口总额 A060502030A-中国向荷兰出口总额
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '中国向各国出口总额', subtitle: '', exceptName: '中国向出口总额', unit: '', legendTop: '10%', gridTop: '25%', dbCode: 'nd' }
                    typeArr = ['A060502010H', 'A060502010Y', 'A0605020115', 'A0605020313',
                        'A060502010C', 'A0605020304', 'A0605020305', 'A060502030A', 'A0605020503'
                    ];
                    break;
                case this.EChartType_ForeignTrade.IM:
                    // A060503010H-中国向日本进口总额 A060503010Y- 中国向韩国进口总额 A0605030115-中国向越南进口总额 A0605030313-中国向俄罗斯进口总额 
                    // A060503010C-中国向印度进口总额 A0605030304- 中国向英国进口总额 A0605030305-中国向德国进口总额 A060503030A-中国向荷兰进口总额
                    // A0605030503-中国向美国进口总额        
                    basicParams = { echrtId: echrtId, chartType: this.chartType, title: '中国从各国进口总额', subtitle: '', exceptName: '中国从进口总额', unit: '', legendTop: '10%', gridTop: '25%', dbCode: 'nd' }
                    typeArr = ['A060503010H', 'A060503010Y', 'A0605030115', 'A0605030313',
                        'A060503010C', 'A0605030304', 'A0605030305', 'A060503030A', 'A0605030503'
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