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

import { params_province, sendRequest, drawCommonChart } from '../CommonUtil';
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
      fetch('json/province.json')
        .then(response => response.json())
        .then(data => {
          // console.log('读取本地数据教育数据:', data);
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
        this.returnData = await sendRequest(params_province);
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
      this.drawChartWithParams(this.EChartType_Education.ZS)
    },
    drawLineChart_Entrants() {
      this.isBarActive_Entrants = false;
      this.isLineActive_Entrants = true;
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Education.ZS)
    },
    drawBarChart_Enrollment() {
      this.isBarActive_Enrollment = true;
      this.isLineActive_Enrollment = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Education.ZX)
    },
    drawLineChart_Enrollment() {
      this.isBarActive_Enrollment = false;
      this.isLineActive_Enrollment = true;
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Education.ZX)
    },
    drawBarChart_Graduates() {
      this.isBarActive_Graduates = true;
      this.isLineActive_Graduates = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Education.BY)
    },
    drawLineChart_Graduates() {
      this.isBarActive_Graduates = false;
      this.isLineActive_Graduates = true;
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Education.BY)
    },
    drawChartWithParams(echrtId) {
      // basicParams-包含echrtId、title、exceptName、unit、legendTop、gridTop、xAxisDataArr
      let basicParams = {}
      let typeArr = [];
      let provinceCodeArr = [];

      switch (echrtId) {
        case this.EChartType_Education.ZS:
          // A0M0103-普通高等学校招生数
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '普通高等学校本科招生数(万人)', subtitle: '', exceptName: '', unit: '', dbCode: 'nd' }
          typeArr = ['A0M0103'];
          break;
        case this.EChartType_Education.ZX:
          // A0M0106-普通高等学校在校学生数
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '普通高等学校本科在校学生数(万人)', subtitle: '', exceptName: '', unit: '', dbCode: 'nd' }
          typeArr = ['A0M0106'];
          break;
        case this.EChartType_Education.BY:
          // A0M010C-普通高等学校毕业生数
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '普通高等学校本科毕业生数(万人)', subtitle: '', exceptName: '', unit: '', dbCode: 'nd' }
          typeArr = ['A0M010C'];
          break;
        default:
          break;
      }
      provinceCodeArr = ['110000', '120000', '130000', '140000',
        '150000', '210000', '220000', '230000',
        '310000', '320000', '330000', '340000', '350000', '360000', '370000',
        '410000', '420000', '430000', '440000', '450000', '460000',
        '500000', '510000', '520000', '530000', '510000', '540000',
        '610000', '620000', '630000', '640000', '650000']

      drawCommonChart(basicParams, typeArr, this.returnData,  provinceCodeArr)
    }

  }
};
</script>