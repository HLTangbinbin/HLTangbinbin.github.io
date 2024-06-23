<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Agency }" @click="drawBarChart_Agency"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Agency }" @click="drawLineChart_Agency"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="agency"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Officer }" @click="drawBarChart_Officer"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Officer }" @click="drawLineChart_Officer"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="officer"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Bed }" @click="drawBarChart_Bed"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Bed }" @click="drawLineChart_Bed"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="bed"></div>

    </div>
</template>

<script>
import * as echarts from 'echarts';
import { params_medical, sendRequest, sortYearMonths } from './CommonUtil';
export default {

    data() {
        return {
            Medical: {
                // 卫生机构数
                A0O0101: 'A0O0101',   // 医疗卫生机构数
                A0O0102: 'A0O0102',   // 医院数
                A0O0106: 'A0O0106',   // 基层医疗卫生机构
                // 在校人数
                A0O0201: 'A0O0201',   // 卫生人员数
                A0O0202: 'A0O0202',   // 卫生技术人员数
                A0O0204: 'A0O0204',   // 执业医师数
                A0O0205: 'A0O0205',   // 注册护士数
                // 卫生机构床位数
                A0O0501: 'A0O0501',   // 卫生机构床位数
                A0O0502: 'A0O0502',   // 医院床位数
                A0O0506: 'A0O0506',   // 基层医疗卫生机构床位数

            },

            isBarActive_Agency: false,
            isLineActive_Agency: false,
            isBarActive_Officer: false,
            isLineActive_Officer: false,
            isBarActive_Bed: false,
            isLineActive_Bed: false,
            returnData: null,
            sjList: null,
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
            // 读取本地医疗数据
            fetch('medical.json')
                .then(response => response.json())
                .then(data => {
                    console.log('读取本地成功医疗数据:', data);
                    // 列表数据
                    this.returnData = data;
                    // 处理数据绘制图表
                    this.drawBarChart_Agency()
                    this.drawBarChart_Officer()
                    this.drawBarChart_Bed()
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        async requestWithAPI() {
            try {
                this.returnData = await sendRequest(params_medical);
                console.log("响应处理后的数据：", this.returnData)
                if (this.returnData) {
                    this.drawBarChart_Agency()
                    this.drawBarChart_Officer()
                    this.drawBarChart_Bed()
                }
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        //按照年份与日期做筛选与排序
        medicalArr(type) {
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

        // 卫生机构图表
        drawAgencyCharts() {
            // 基于准备好的dom，初始化echarts实例
            var agencyChart = echarts.init(document.getElementById('agency'));
            // 指定图表的配置项和数据
            var agencyOption = {
                title: {
                    text: '医疗卫生机构数',
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
                    top: '20%',
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
                        name: '医疗卫生机构数(个)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0101)
                    },
                    {
                        name: '医院数(个)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0102)
                    },
                    {
                        name: '基础医疗卫生机构(个)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0106)
                    }

                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            agencyChart.setOption(agencyOption);
        },
        // 卫生人员数
        drawOfficerCharts() {
            // 基于准备好的dom，初始化echarts实例
            var officerChart = echarts.init(document.getElementById('officer'));
            // 指定图表的配置项和数据
            var officerOption = {
                title: {
                    text: '卫生人员数',
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
                    top: '20%',
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
                        name: '卫生人员数(万人)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0201)
                    },
                    {
                        name: '卫生技术人员数(万人)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0202)
                    },
                    {
                        name: '执业医师数(万人)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0204)
                    },
                    {
                        name: '注册护士数(万人)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0205)
                    }

                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            officerChart.setOption(officerOption);
        },
        // 医疗卫生机构床位数
        drawBedCharts() {
            // 基于准备好的dom，初始化echarts实例
            var bedChart = echarts.init(document.getElementById('bed'));
            // 指定图表的配置项和数据
            var bedOption = {
                title: {
                    text: '医疗卫生机构床位数',
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
                    top: '20%',
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
                        name: '卫生机构床位数(万张)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0501)
                    },
                    {
                        name: '医院床位数(万张)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0502)
                    },
                    {
                        name: '基础医疗卫生机构床位数(万张)',
                        type: this.chartsType,
                        data: this.medicalArr(this.Medical.A0O0506)
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            bedChart.setOption(bedOption);
        },
        drawBarChart_Agency() {
            this.isBarActive_Agency = true;
            this.isLineActive_Agency = false;
            this.chartsType = "bar"
            this.drawAgencyCharts()

        },
        drawLineChart_Agency() {
            this.isBarActive_Agency = false;
            this.isLineActive_Agency = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawAgencyCharts()
        },
        drawBarChart_Officer() {
            this.isBarActive_Officer = true;
            this.isLineActive_Officer = false;
            this.chartsType = "bar"
            this.drawOfficerCharts()

        },
        drawLineChart_Officer() {
            this.isBarActive_Officer = false;
            this.isLineActive_Officer = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawOfficerCharts()
        },
        drawBarChart_Bed() {
            this.isBarActive_Bed = true;
            this.isLineActive_Bed = false;
            this.chartsType = "bar"
            this.drawBedCharts()

        },
        drawLineChart_Bed() {
            this.isBarActive_Bed = false;
            this.isLineActive_Bed = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawBedCharts()
        }

    }
};
</script>