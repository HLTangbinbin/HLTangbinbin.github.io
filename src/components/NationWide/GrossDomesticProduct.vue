<template>
  <div class="container">
    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_GDP_HG }" @click="drawBarChart_GDP_HG"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_GDP_HG }" @click="drawLineChart_GDP_HG"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="gdp_hg"></div>
  </div>
</template>

<script>

import { params_gdp, sendRequest, drawCommonChart } from '../CommonUtil';

export default {

  data() {
    return {
      EChartType_GDP: {
        GH: 'gdp_hg',
      },

      isBarActive_GDP_HG: false,
      isLineActive_GDP_HG: false,

      dataListHG: null,
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
      // 读取本地GDP数据
      fetch('nation.json')
        .then(response => response.json())
        .then(data => {
          console.log('读取本地数据GDP数据:', data);
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
        this.returnData = await sendRequest(params_gdp);
        console.log("响应处理后的数据：", this.returnData)
        this.drawChartWithBtn()
      } catch (error) {
        console.error('接口外部调用失败:', error);
      }
    },
    drawChartWithBtn() {
      if (this.returnData) {
        this.drawBarChart_GDP_HG();
      }
    },

    drawBarChart_GDP_HG() {
      this.isBarActive_GDP_HG = true;
      this.isLineActive_GDP_HG = false;
      // 在这里绘制柱状图
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_GDP.GH)

    },
    drawLineChart_GDP_HG() {
      this.isBarActive_GDP_HG = false;
      this.isLineActive_GDP_HG = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_GDP.GH)
    },

    drawChartWithParams(echrtId) {
      // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
      let basicParams = {};
      let typeArr = [];
      let cityCodeArr = [];
      switch (echrtId) {
        case this.EChartType_GDP.GH:
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '国民经济核算', subtitle: '', exceptName: '', unit: '(亿元)', legendTop: '10%', gridTop: '25%', dbCode: 'nd' }
          // A020102-CPI 国内生产总值 A020103-第一产业增加值 A020104-第二产业增加值  A020105-第三产业增加值
          typeArr = ['A020102', 'A020103', 'A020104', 'A020105'];
          break;
        default:
          break;
      }
      drawCommonChart(basicParams, typeArr, this.returnData, cityCodeArr)
    }
  }
};
</script>
