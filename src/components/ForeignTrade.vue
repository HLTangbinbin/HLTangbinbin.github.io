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
        <div class="chart-container" id="importandexport"></div>

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
import * as echarts from 'echarts';
import { params_foreignTrade, sendRequest, sortYearMonths } from './CommonUtil';
export default {

    data() {
        return {
            ForeignTrade_ImportAndExport: {
                // 年度
                A060105: 'A060105',                // 进出口总额(美元)
                A060106: 'A060106',                // 出口总额(美元)
                A060107: 'A060107',                // 进口总额(美元)
                A060108: 'A060108',                // 进出口差额(美元)

                // 中国与各国进出口额度-出口
                A060502010H: 'A060502010H',        // 中国向日本出口总额(美元)
                A060502010Y: 'A060502010Y',        // 中国向韩国出口总额(美元)
                A0605020115: 'A0605020115',        // 中国向越南出口总额(美元)
                A0605020313: 'A0605020313',        // 中国向俄罗斯出口总额(美元)
                A060502010C: 'A060502010C',        // 中国向印度出口总额(美元)
                A0605020304: 'A0605020304',        // 中国向英国出口总额(美元)
                A0605020305: 'A0605020305',        // 中国向德国出口总额(美元)
                A060502030A: 'A060502030A',        // 中国向荷兰出口总额(美元)
                A0605020503: 'A0605020503',        // 中国向美国出口总额(美元)
                // 中国与各国进出口额度-进口
                A060503010H: 'A060503010H',        // 中国向日本进口总额(美元)
                A060503010Y: 'A060503010Y',        // 中国向韩国进口总额(美元)
                A0605030115: 'A0605030115',        // 中国向越南进口总额(美元)
                A0605030313: 'A0605030313',        // 中国向俄罗斯进口总额(美元)
                A060503010C: 'A060503010C',        // 中国向印度进口总额(美元)
                A0605030304: 'A0605030304',        // 中国向英国进口总额(美元)
                A0605030305: 'A0605030305',        // 中国向德国进口总额(美元)
                A060503030A: 'A060503030A',        // 中国向荷兰进口总额(美元)
                A0605030503: 'A0605030503',        // 中国向美国进口总额(美元)

                // 月度
                A080101: 'A080101',                // 进出口总额(美元)
                A080105: 'A080105',                // 出口总额(美元)
                A080109: 'A080109',                // 进口总额(美元)
                A08010D: 'A08010D',                // 进出口差额(美元)
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
            chartsType: null
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
            fetch('foreignTrade.json')
                .then(response => response.json())
                .then(data => {
                    console.log('读取本地成功外贸数据:', data);
                    // 列表数据
                    this.returnData = data;
                    // 处理数据绘制图表
                    this.drawBarChart_ImportAndExport_Month()
                    this.drawBarChart_ImportAndExport()
                    this.drawBarChart_Export()
                    this.drawBarChart_Import()
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        async requestWithAPI() {
            try {
                this.returnData = await sendRequest(params_foreignTrade);
                console.log("响应处理后的数据：", this.returnData)
                if (this.returnData) {
                    this.drawBarChart_ImportAndExport_Month()
                    this.drawBarChart_ImportAndExport()
                    this.drawBarChart_Export()
                    this.drawBarChart_Import()
                }
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },

        //按照年份与日期做筛选与排序
        foreignTradeArr(type) {
            return this.returnData.dataList.filter(returnDataObj => {
                return returnDataObj.code.search(type) != -1 && returnDataObj.value != 0;
            }).sort(function (a, b) {
                return sortYearMonths(a.date, b.date);
            }).map(item => {
                //取出某个字段数据
                var number = Number(item.value)
                return number;
            })
        },
        // 进出口贸易总额图表-月度
        drawImportAndExportChartsMonth() {
            // 基于准备好的dom，初始化echarts实例
            var importAndExportChart = echarts.init(document.getElementById('importandexport-month'));
            // 指定图表的配置项和数据
            var importAndExportOption = {
                title: {
                    text: '货物进出口总额-月度(美元)(百万美元)',
                    left: 'center',
                    top: 'top'
                },
                tooltip: {
                    //X轴悬浮显示所有数据
                    trigger: 'axis'
                },
                legend: {
                    left: 'center',
                    top: '10%'
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    top: '25%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.returnData.sj[1].sort()
                },
                yAxis: {
                },

                series: [
                    {
                        name: '进出口总额(美元)',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A080101)
                    },
                    {
                        name: '出口总额(美元)',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A080105)
                    },
                    {
                        name: '进口总额(美元)',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A080109)
                    }, {
                        name: '进出口差额(美元)',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A08010D)
                    },


                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            importAndExportChart.setOption(importAndExportOption);
        },
        // 进出口贸易总额图表-年度
        drawImportAndExportCharts() {
            // 基于准备好的dom，初始化echarts实例
            var importAndExportChart = echarts.init(document.getElementById('importandexport'));
            // 指定图表的配置项和数据
            var importAndExportOption = {
                title: {
                    text: '货物进出口总额-年度(美元)(百万美元)',
                    left: 'center',
                    top: 'top'
                },
                tooltip: {
                    //X轴悬浮显示所有数据
                    trigger: 'axis'
                },
                legend: {
                    left: 'center',
                    top: '10%'
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    top: '25%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.returnData.sj[0].sort()
                },
                yAxis: {
                },

                series: [
                    {
                        name: '进出口总额(美元)',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060105)
                    },
                    {
                        name: '出口总额(美元)',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060106)
                    },
                    {
                        name: '进口总额(美元)',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060107)
                    }, {
                        name: '进出口差额(美元)',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060108)
                    },


                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            importAndExportChart.setOption(importAndExportOption);
        },
        // 中国向各国出口总额图表
        drawExportCharts() {
            // 基于准备好的dom，初始化echarts实例
            var exportChart = echarts.init(document.getElementById('export'));
            // 指定图表的配置项和数据
            var exportOption = {
                title: {
                    text: '中国向各国出口总额(美元)(百万美元)',
                    left: 'center',
                    top: 'top'

                },
                tooltip: {
                    //X轴悬浮显示所有数据
                    trigger: 'axis'
                },
                legend: {
                    left: 'center',
                    top: '10%'
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    top: '25%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.returnData.sj[0].sort()
                },
                yAxis: {

                },
                series: [
                    {
                        name: '日本',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060502010H)
                    },
                    {
                        name: '韩国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060502010Y)
                    },
                    {
                        name: '越南',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605020115)
                    },
                    {
                        name: '俄罗斯',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605020313)
                    },
                    {
                        name: '印度',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060502010C)
                    },
                    {
                        name: '英国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605020304)
                    },
                    {
                        name: '德国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605020305)
                    },
                    {
                        name: '荷兰',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060502030A)
                    },
                    {
                        name: '美国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605020503)
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            exportChart.setOption(exportOption);
        },
        // 中国从各国进口总额
        drawImportCharts() {
            // 基于准备好的dom，初始化echarts实例
            var importChart = echarts.init(document.getElementById('import'));
            // 指定图表的配置项和数据
            var importOption = {
                title: {
                    text: '中国从各国进口总额(美元)(百万美元)',
                    left: 'center',
                    top: 'top',
                },
                tooltip: {
                    //X轴悬浮显示所有数据
                    trigger: 'axis'
                },
                legend: {
                    left: 'center',
                    top: '10%'
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    top: '25%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.returnData.sj[0].sort()
                },
                yAxis: {

                },
                series: [
                    {
                        name: '日本',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060503010H)
                    },
                    {
                        name: '韩国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060503010Y)
                    },
                    {
                        name: '越南',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605030115)
                    },
                    {
                        name: '俄罗斯',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605030313)
                    },
                    {
                        name: '印度',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060503010C)
                    },
                    {
                        name: '英国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605030304)
                    },
                    {
                        name: '德国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605030305)
                    },
                    {
                        name: '荷兰',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A060503030A)
                    },
                    {
                        name: '美国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_ImportAndExport.A0605030503)
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            importChart.setOption(importOption);
        },
        drawBarChart_ImportAndExport_Month() {
            this.isBarActive_ImportAndExport_Month = true;
            this.isLineActive_ImportAndExport_Month = false;
            this.chartsType = "bar"
            this.drawImportAndExportChartsMonth()

        },
        drawLineChart_ImportAndExport_Month() {
            this.isBarActive_ImportAndExport_Month = false;
            this.isLineActive_ImportAndExport_Month = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawImportAndExportChartsMonth()
        },
        drawBarChart_ImportAndExport() {
            this.isBarActive_ImportAndExport = true;
            this.isLineActive_ImportAndExport = false;
            this.chartsType = "bar"
            this.drawImportAndExportCharts()

        },
        drawLineChart_ImportAndExport() {
            this.isBarActive_ImportAndExport = false;
            this.isLineActive_ImportAndExport = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawImportAndExportCharts()
        },
        drawBarChart_Export() {
            this.isBarActive_Export = true;
            this.isLineActive_Export = false;
            this.chartsType = "bar"
            this.drawExportCharts()

        },
        drawLineChart_Export() {
            this.isBarActive_Export = false;
            this.isLineActive_Export = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawExportCharts()
        },
        drawBarChart_Import() {
            this.isBarActive_Import = true;
            this.isLineActive_Import = false;
            this.chartsType = "bar"
            this.drawImportCharts()

        },
        drawLineChart_Import() {
            this.isBarActive_Import = false;
            this.isLineActive_Import = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawImportCharts()
        },


    }
};
</script>