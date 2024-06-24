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

import { params_education, sendRequest, drawCommonChart } from './CommonUtil';
export default {

    data() {
        return {
            EChartType_Education: {
                ZS: 'entrants',
                ZX: 'enrollment',
                BY: 'graduates'
            },

            isBarActive_Entrants: false,
            isLineActive_Entrants: false,
            isBarActive_Enrollment: false,
            isLineActive_Enrollment: false,
            isBarActive_Graduates: false,
            isLineActive_Graduates: false,
            returnData: null,
            sjList: null,
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
            // 读取本地教育公开数据
            fetch('education.json')
                .then(response => response.json())
                .then(data => {
                    console.log('读取本地成功教育数据:', data);
                    // 列表数据
                    this.returnData = data;
                    this.drawChartWithBtn()
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        async requestWithAPI() {
            try {
                this.returnData = await sendRequest(params_education);
                console.log("响应处理后的数据：", this.returnData)
                this.drawChartWithBtn()
            } catch (error) {
                console.error('接口外部调用失败:', error);
            }
        },
        drawChartWithBtn() {
            if (this.returnData) {
                this.drawBarChart_Entrants()
                this.drawBarChart_Enrollment()
                this.drawBarChart_Graduates()
            }
        },
        drawBarChart_Entrants() {
            this.isBarActive_Entrants = true;
            this.isLineActive_Entrants = false;
            this.chartType = "bar";
            this.drawChartWithParams({echrtId: this.EChartType_Education.ZS, title: '招生数', exceptName: '招生数', unit: '(万人)'})
        },
        drawLineChart_Entrants() {
            this.isBarActive_Entrants = false;
            this.isLineActive_Entrants = true;
            this.chartType = "line"
            this.drawChartWithParams({echrtId: this.EChartType_Education.ZS, title: '招生数', exceptName: '招生数', unit: '(万人)'})
        },
        drawBarChart_Enrollment() {
            this.isBarActive_Enrollment = true;
            this.isLineActive_Enrollment = false;
            this.chartType = "bar"
            this.drawChartWithParams({echrtId: this.EChartType_Education.ZX, title: '在校学生数', exceptName: '在校学生数', unit: '(万人)'})
        },
        drawLineChart_Enrollment() {
            this.isBarActive_Enrollment = false;
            this.isLineActive_Enrollment = true;
            this.chartType = "line"
            this.drawChartWithParams({echrtId: this.EChartType_Education.ZX, title: '在校学生数', exceptName: '在校学生数', unit: '(万人)'})
        },
        drawBarChart_Graduates() {
            this.isBarActive_Graduates = true;
            this.isLineActive_Graduates = false;
            this.chartType = "bar"
            this.drawChartWithParams({echrtId: this.EChartType_Education.BY, title: '毕业生数', exceptName: '毕业生数', unit: '(万人)'})
        },
        drawLineChart_Graduates() {
            this.isBarActive_Graduates = false;
            this.isLineActive_Graduates = true;
            this.chartType = "line"
            this.drawChartWithParams({echrtId: this.EChartType_Education.BY, title: '毕业生数', exceptName: '毕业生数', unit: '(万人)'})
        },
        drawChartWithParams({echrtId, title, exceptName = '', unit = '', subtitle = '', sj = '0' } = {}) {
            // basicParams-包含echrtId、title、exceptName、unit、legendTop、gridTop、xAxisDataArr
            let basicParams = { echrtId: echrtId, chartType: this.chartType, title: title, subtitle:subtitle, exceptName: exceptName, unit: unit, sj: sj}
            let typeArr = [];
            switch (echrtId) {
                case this.EChartType_Education.ZS:
                    // A0M020119-学前招生数 A0M0706-普通小学招生数 A0M0704-初中学校招生数
                    // A0M0703-普通高中招生数 A0M0701-普通高等学校招生数 A0M020102-研究生招生数
                    typeArr = ['A0M020119', 'A0M0706', 'A0M0704', 'A0M0703', 'A0M0701', 'A0M020102'];
                    break;
                case this.EChartType_Education.ZX:
                    // A0M02021A-学前在校学生数 A0M0806-普通小学在校学生数 A0M0804-初中学校在校学生数
                    // A0M0803-普通高中在校学生数 A0M0801-普通高等学校在校学生数 A0M020202-研究生在校学生数
                    typeArr = ['A0M02021A', 'A0M0806', 'A0M0804', 'A0M0803', 'A0M0801', 'A0M020202'];
                    break;
                case this.EChartType_Education.BY:
                    // A0M02031A-学前毕业生数 A0M0906-普通小学毕业生数 A0M0904-初中学校毕业生数
                    // A0M0903-普通高中毕业生数 A0M0901-普通高等学校毕业生数 A0M020302-研究生毕业生数
                    typeArr = ['A0M02031A', 'A0M0906', 'A0M0904', 'A0M0903', 'A0M0901', 'A0M020302'];
                    break;
                default:
                    break;
            }
            drawCommonChart(basicParams, typeArr, this.returnData)
        }

    }
};
</script>