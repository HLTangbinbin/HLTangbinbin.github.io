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
import { sortYearMonths } from './CommonUtil';
export default {

    data() {
        return {
            Education: {
                // 招生数
                A0M020119: 'A0M020119',   // 学前招生数
                A0M020111: 'A0M020111',   // 普通小学招生数
                A0M02010U: 'A0M02010U',   // 初级中学招生数
                A0M02010I: 'A0M02010I',   // 普通高中招生数
                A0M020107: 'A0M020107',   // 普通专科招生数
                A0M020106: 'A0M020106',   // 普通本科招生数
                A0M020104: 'A0M020104',   // 硕士招生数
                A0M020103: 'A0M020103',   // 博士招生数
                // 在校人数
                A0M02021A: 'A0M02021A',   // 学前在校学生数
                A0M020212: 'A0M020212',   // 普通小学在校学生数
                A0M02020V: 'A0M02020V',   // 初级中学在校学生数
                A0M02020J: 'A0M02020J',   // 普通高中在校学生数
                A0M020207: 'A0M020207',   // 普通专科在校学生数
                A0M020206: 'A0M020206',   // 普通本科在校学生数
                A0M020204: 'A0M020204',   // 硕士在校学生数
                A0M020203: 'A0M020203',   // 博士在校学生数
                // 毕业生数
                A0M02031A: 'A0M02031A',   // 学前毕业生数
                A0M020312: 'A0M020312',   // 普通小学毕业生数
                A0M02030V: 'A0M02030V',   // 初级中学毕业生数
                A0M02030J: 'A0M02030J',   // 普通高中毕业生数
                A0M020307: 'A0M020307',   // 普通专科毕业生数
                A0M020306: 'A0M020306',   // 普通本科毕业生数
                A0M020304: 'A0M020304',   // 硕士毕业生数
                A0M020303: 'A0M020303',   // 博士毕业生数
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
        loadData() {
            // 请求人民收入公开数据
            fetch('education.json')
                .then(response => response.json())
                .then(data => {
                    console.log('请求成功教育数据:', data);
                    // 列表数据
                    this.returnData = data;
                    // 处理数据绘制图表
                    this.drawBarChart_Entrants()
                    this.drawBarChart_Enrollment()
                    this.drawBarChart_Graduates()
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
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
                        data: this.educationArr(this.Education.A0M020111)
                    },
                    {
                        name: '初级中学(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M02010U)
                    }, {
                        name: '普通高中(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M02010I)
                    },
                    {
                        name: '普通专科(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020107)
                    },
                    {
                        name: '普通本科(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020106)
                    },
                    {
                        name: '硕士(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020104)
                    },
                    {
                        name: '博士(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020103)
                    }

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
                        data: this.educationArr(this.Education.A0M020212)
                    },
                    {
                        name: '初级中学(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M02020V)
                    }, {
                        name: '普通高中(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M02020J)
                    },
                    {
                        name: '普通专科(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020207)
                    },
                    {
                        name: '普通本科(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020206)
                    },
                    {
                        name: '硕士(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020204)
                    },
                    {
                        name: '博士(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020203)
                    }
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
                        data: this.educationArr(this.Education.A0M020312)
                    },
                    {
                        name: '初级中学数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M02030V)
                    }, {
                        name: '普通高中数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M02030J)
                    },
                    {
                        name: '普通专科数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020307)
                    },
                    {
                        name: '普通本科数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020306)
                    },
                    {
                        name: '硕士数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020304)
                    },
                    {
                        name: '博士数(万人)',
                        type: this.chartsType,
                        data: this.educationArr(this.Education.A0M020303)
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