<template>
    <div class="container">
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Entrants }" @click="drawBarChart_Entrants"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Entrants }" @click="drawLineChart_Entrants"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="entrants"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Enrollment }" @click="drawBarChart_Enrollment"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Enrollment }" @click="drawLineChart_Enrollment"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="enrollment"></div>

        <!-- 为下方的按钮添加上边距 style="margin-top -->
        <div class="buttons">
            <button class="button" :class="{ 'is-active': isBarActive_Graduates }" @click="drawBarChart_Graduates"
                style="margin-top: 50px;">柱状图</button>
            <button class="button" :class="{ 'is-active': isLineActive_Graduates }" @click="drawLineChart_Graduates"
                style="margin-top: 50px;">折线图</button>
        </div>
        <div class="chart-container" id="graduates"></div>

    </div>
</template>

<script>
import * as echarts from 'echarts';
import { params_education, sendRequest, sortYearMonths } from './CommonUtil';
export default {

    data() {
        return {
            Education: {
                // 招生数
                A0M020102: 'A0M020102',     // 研究生招生数
                A0M0701: 'A0M0701',         // 普通高等学校招生数
                A0M0703: 'A0M0703',         // 普通高中招生数
                A0M0704: 'A0M0704',         // 初中学校招生数
                A0M0706: 'A0M0706',         // 普通小学招生数
                A0M020119: 'A0M020119',     // 学前招生数


                // 在校人数
                A0M020202: 'A0M020202',     // 研究生在校学生数
                A0M0801: 'A0M0801',         // 普通高等学校在校学生数
                A0M0803: 'A0M0803',         // 普通高中在校学生数
                A0M0804: 'A0M0804',         // 初中学校在校学生数
                A0M0806: 'A0M0806',         // 普通小学在校学生数
                A0M02021A: 'A0M02021A',     // 学前在校学生数

                // 毕业生数
                A0M020302: 'A0M020302',     // 研究生毕业生数
                A0M0901: 'A0M0901',         // 普通高等学校毕业生数
                A0M0903: 'A0M0903',         // 普通高中毕业生数
                A0M0904: 'A0M0904',         // 初中学校毕业生数
                A0M0906: 'A0M0906',         // 普通小学毕业生数
                A0M02031A: 'A0M02031A',     // 学前毕业生数

            },

            isBarActive_Entrants: false,
            isLineActive_Entrants: false,
            isBarActive_Enrollment: false,
            isLineActive_Enrollment: false,
            isBarActive_Graduates: false,
            isLineActive_Graduates: false,
            returnData: null,
            sjList: null,
            chartsType: null
        };
    },
    mounted() {
        this.loadData();
    },

    methods: {
        async loadData() {
            // 请求人民收入公开数据
            // fetch('education.json')
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log('请求成功教育数据:', data);
            //         // 列表数据
            //         this.returnData = data;
            //         // 处理数据绘制图表
            //         this.drawBarChart_Entrants()
            //         this.drawBarChart_Enrollment()
            //         this.drawBarChart_Graduates()
            //     })
            //     .catch(error => {
            //         console.error('Error fetching data:', error)
            //     })
            try {
                this.returnData = await sendRequest(params_education);
                console.log("响应处理后的数据：", this.returnData)
                if (this.returnData) {
                    this.drawBarChart_Entrants()
                    this.drawBarChart_Enrollment()
                    this.drawBarChart_Graduates()
                }
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        //按照年份与日期做筛选与排序
        educationArr(type) {
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
        // 平均收入图表
        drawentrantsCharts() {
            // 基于准备好的dom，初始化echarts实例
            var entrantsChart = echarts.init(document.getElementById('entrants'));
            // 指定图表的配置项和数据
            var entrantsOption = {
                title: {
                    text: '招生数',
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
                        name: '学前(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020119)
                    },
                    {
                        name: '普通小学(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0706)
                    },
                    {
                        name: '初级中学(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0704)
                    }, 
                    {
                        name: '普通高中(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0703)
                    },
                    {
                        name: '普通高等学校(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0701)
                    },
                    {
                        name: '研究生(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020102)
                    },
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            entrantsChart.setOption(entrantsOption);
        },
        // 在校学生数
        drawenrollmentCharts() {
            // 基于准备好的dom，初始化echarts实例
            var enrollmentChart = echarts.init(document.getElementById('enrollment'));
            // 指定图表的配置项和数据
            var enrollmentOption = {
                title: {
                    text: '在校学生数',
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
                        name: '学前(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M02021A)
                    },
                    {
                        name: '普通小学(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0806)
                    },
                    {
                        name: '初级中学(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0804)
                    }, {
                        name: '普通高中(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0803)
                    },
                    {
                        name: '普通高等学校(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0801)
                    },
                    {
                        name: '研究生(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020202)
                    },
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            enrollmentChart.setOption(enrollmentOption);
        },
        //毕业生数图表
        drawgraduatesCharts() {
            // 基于准备好的dom，初始化echarts实例
            var graduatesChart = echarts.init(document.getElementById('graduates'));
            // 指定图表的配置项和数据
            var graduatesOption = {
                title: {
                    text: '毕业生数',
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
                        name: '学前数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M02031A)
                    },
                    {
                        name: '普通小学数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0906)
                    },
                    {
                        name: '初级中学数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0904)
                    }, {
                        name: '普通高中数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0903)
                    },
                    {
                        name: '普通高等学校(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M0901)
                    },
                    {
                        name: '研究生(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020302)
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            graduatesChart.setOption(graduatesOption);
        },
        drawBarChart_Entrants() {
            this.isBarActive_Entrants = true;
            this.isLineActive_Entrants = false;
            this.chartsType = "bar"
            this.drawentrantsCharts()

        },
        drawLineChart_Entrants() {
            this.isBarActive_Entrants = false;
            this.isLineActive_Entrants = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawentrantsCharts()
        },
        drawBarChart_Enrollment() {
            this.isBarActive_Enrollment = true;
            this.isLineActive_Enrollment = false;
            this.chartsType = "bar"
            this.drawenrollmentCharts()

        },
        drawLineChart_Enrollment() {
            this.isBarActive_Enrollment = false;
            this.isLineActive_Enrollment = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawenrollmentCharts()
        },
        drawBarChart_Graduates() {
            this.isBarActive_Graduates = true;
            this.isLineActive_Graduates = false;
            this.chartsType = "bar"
            this.drawgraduatesCharts()

        },
        drawLineChart_Graduates() {
            this.isBarActive_Graduates = false;
            this.isLineActive_Graduates = true;
            // 在这里绘制折线图
            this.chartsType = "line"
            this.drawgraduatesCharts()
        }

    }
};
</script>