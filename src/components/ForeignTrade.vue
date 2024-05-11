<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_ImportAndExport }"
                @click="drawBarChart_ImportAndExport" style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_ImportAndExport }"
                @click="drawLineChart_ImportAndExport" style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="import"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Importl }" @click="drawBarChart_Importl"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Importl }" @click="drawLineChart_Importl"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="engelcoefficient"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Export }" @click="drawBarChart_Export"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Export }" @click="drawLineChart_Export"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="ginicoefficient"></div>

    </div>
</template>

<script>
import * as echarts from 'echarts';
import { sortYearMonths } from './CommonUtil';
export default {

    data() {
        return {
            ForeignTrade_ImportAndExport: {
                A060105 : 'A060105',                // 进出口总额(美元)
                A060106 : 'A060106',                // 出口总额(美元)
                A060107 : 'A060107',                // 进口总额(美元)
                A060108 : 'A060108',                // 进出口差额(美元)
  
                // 中国与各国进出口额度-出口
                A0605020117 : 'A0605020117',        // 中国向台湾出口总额(美元)
                A060502010H : 'A060502010H',        // 中国向日本出口总额(美元)
                A060502010Y : 'A060502010Y',        // 中国向韩国出口总额(美元)
                A0605020115 : 'A0605020115',        // 中国向越南出口总额(美元)
                A0605020313 : 'A0605020313',        // 中国向俄罗斯出口总额(美元)
                A060502010C : 'A060502010C',        // 中国向印度出口总额(美元)
                A0605020304 : 'A0605020304',        // 中国向英国出口总额(美元)
                A0605020305 : 'A0605020305',        // 中国向德国出口总额(美元)
                A060502030A : 'A060502030A',        // 中国向荷兰出口总额(美元)
                A0605020503 : 'A0605020503',        // 中国向美国出口总额(美元)
                // 中国与各国进出口额度-进口
                A0605030117 : 'A0605030117',        // 中国向台湾出口总额(美元)
                A060503010H : 'A060503010H',        // 中国向日本出口总额(美元)
                A060503010Y : 'A060503010Y',        // 中国向韩国出口总额(美元)
                A0605030115 : 'A0605030115',        // 中国向越南出口总额(美元)
                A0605030313 : 'A0605030313',        // 中国向俄罗斯出口总额(美元)
                A060503010C : 'A060503010C',        // 中国向印度出口总额(美元)
                A0605030304 : 'A0605030304',        // 中国向英国出口总额(美元)
                A0605030305 : 'A0605030305',        // 中国向德国出口总额(美元)
                A060503030A : 'A060503030A',        // 中国向荷兰出口总额(美元)
                A0605030503 : 'A0605030503',        // 中国向美国出口总额(美元)



            },

            isBarActive_ImportAndExport: false,
            isLineActive_ImportAndExport: false,
            isBarActive_Importl: false,
            isLineActive_Importl: false,
            isBarActive_Export: false,
            isLineActive_Export: false,
            importAndExportList: null,
            chartsType: null
        };
    },
    mounted() {
        this.loadData();
    },

    methods: {
        loadData() {
            // 请求人民收入公开数据
            fetch('foreignTrade.json')
                .then(response => response.json())
                .then(data => {
                    console.log('请求成功对外贸易数据:', data);
                    // 列表数据
                    this.importAndExportList = data;
                    // 处理数据绘制图表
                    this.drawBarChart_ImportAndExport()
                    this.drawBarChart_Importl()
                    this.drawBarChart_Export()
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        //按照年份与日期做筛选与排序
        foreignTradeArr(type) {
            return this.importAndExportList.data.filter(importAndExportListObj => {
                return importAndExportListObj.code.search(type) != -1 && importAndExportListObj.value != 0;
            }).sort(function (a, b) {
                return sortYearMonths(a.date, b.date);
            }).map(item => {
                //取出某个字段数据
                var number = Number(item.value)
                return number;
            })
        },
        // 进出口贸易总额图表
        drawImportAndExportCharts() {
            // 基于准备好的dom，初始化echarts实例
            var importChart = echarts.init(document.getElementById('import'));
            // 指定图表的配置项和数据
            var importOption = {
                title: {
                    text: '货物进出口总额(美元)(百万美元)',
                    left: 'center',
                    top: 'top'
                },
                tooltip: {
                    //X轴悬浮显示所有数据
                    trigger: 'axis'
                },
                legend: {
                    left: 'center',
                    top: '50px'
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    top: '20%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.importAndExportList.sj
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
            importChart.setOption(importOption);
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
                    top: '20%'
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    top: '30%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.importAndExportList.sj
                },
                yAxis: {

                },
                series: [
         
                    {
                        name: '台湾',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605020117)
                    },
                    {
                        name: '日本',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A060502010H)
                    },
                    {
                        name: '韩国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A060502010Y)
                    },
                    {
                        name: '越南',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605020115)
                    },
                    {
                        name: '俄罗斯',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605020313)
                    },
                    {
                        name: '印度',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A060502010C)
                    },
                    {
                        name: '英国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605020304)
                    },
                    {
                        name: '德国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605020305)
                    },
                    {
                        name: '荷兰',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A060502030A)
                    },
                    {
                        name: '美国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605020503)
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            exportChart.setOption(exportOption);
        },
        // 中国从各国进口总额
        drawGiniCoefficientCharts() {
            // 基于准备好的dom，初始化echarts实例
            var giniCoefficientChart = echarts.init(document.getElementById('ginicoefficient'));
            // 指定图表的配置项和数据
            var giniCoefficientOption = {
                title: {
                    text: '中国从各国进口总额(美元)(百万美元)',
                    left: 'center',
                    top: 'top',
                    subtextStyle: {
                        fontWeight: 'bold',
                        fontSize: 13,
                        lineHeight: 20,
                    }
                },
                tooltip: {
                    //X轴悬浮显示所有数据
                    trigger: 'axis'
                },
                legend: {
                    left: 'center',
                    top: '27%'
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    top: '35%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.importAndExportList.sj
                },
                yAxis: {
       
                },
                series: [
                {
                        name: '台湾',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605030117)
                    },
                    {
                        name: '日本',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A060503010H)
                    },
                    {
                        name: '韩国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A060503010Y)
                    },
                    {
                        name: '越南',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605030115)
                    },
                    {
                        name: '俄罗斯',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605030313)
                    },
                    {
                        name: '印度',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A060503010C)
                    },
                    {
                        name: '英国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605030304)
                    },
                    {
                        name: '德国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605030305)
                    },
                    {
                        name: '荷兰',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A060503030A)
                    },
                    {
                        name: '美国',
                        type: this.chartsType,
                        data: this.foreignTradeArr(this.ForeignTrade_Coefficient.A0605030503)
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            giniCoefficientChart.setOption(giniCoefficientOption);
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
        drawBarChart_Importl() {
            this.isBarActive_Importl = true;
            this.isLineActive_Importl = false;
            this.chartsType = "bar"
            this.drawExportCharts()

        },
        drawLineChart_Importl() {
            this.isBarActive_Importl = false;
            this.isLineActive_Importl = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawExportCharts()
        },
        drawBarChart_Export() {
            this.isBarActive_Export = true;
            this.isLineActive_Export = false;
            this.chartsType = "bar"
            this.drawGiniCoefficientCharts()

        },
        drawLineChart_Export() {
            this.isBarActive_Export = false;
            this.isLineActive_Export = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawGiniCoefficientCharts()
        }

    }
};
</script>