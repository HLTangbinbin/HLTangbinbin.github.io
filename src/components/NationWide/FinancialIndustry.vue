<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Currency_Month }" @click="drawBarChart_Currency_Month"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Currency_Month }" @click="drawLineChart_Currency_Month"
        style="margin-top: 50px;">折线图</button>
    </div>
    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="chart-container" id="currency-month"></div>

    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Currency_Rise_Month }" @click="drawBarChart_Currency_Rise_Month"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Currency_Rise_Month }" @click="drawLineChart_Currency_Rise_Month"
        style="margin-top: 50px;">折线图</button>
    </div>
    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="chart-container" id="currency-rise-month"></div>

    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Currency }" @click="drawBarChart_Currency"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Currency }" @click="drawLineChart_Currency"
        style="margin-top: 50px;">折线图</button>
    </div>

    <div class="chart-container" id="currency-year"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_ForeignCurrency }" @click="drawBarChart_ForeignCurrency"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_ForeignCurrency }"
        @click="drawLineChart_ForeignCurrency" style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="foreigncurrency"></div>
  </div>
</template>


<script>

import { params_financialIndustry, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

  data() {
    return {
      EChartType_Currency: {
        CM: 'currency-month',
        CRM: 'currency-rise-month',
        CY: 'currency-year',
        FC: 'foreigncurrency'
      },

      isBarActive_Currency_Month: false,
      isLineActive_Currency_Month: false,
      isBarActive_Currency_Rise_Month: false,
      isLineActive_Currency_Rise_Month: false,
      isBarActive_Currency: false,
      isLineActive_Currency: false,
      isBarActive_ForeignCurrency: false,
      isLineActive_ForeignCurrency: false,
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
      // 读取本地currency数据
      fetch('json/nation.json')
        .then(response => response.json())
        .then(data => {
          // console.log('读取本地数据currency数据:', data);
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
        this.returnData = await sendRequest(params_financialIndustry);
        console.log("响应处理后的数据：", this.returnData)
        this.drawChartWithBtn();
      } catch (error) {
        console.error('接口外部调用失败:', error);
      }
    },
    drawChartWithBtn() {
      if (this.returnData) {
        this.drawBarChart_Currency_Month();
        this.drawBarChart_Currency_Rise_Month();
        this.drawBarChart_Currency();
        this.drawBarChart_ForeignCurrency();
      }
    },

    drawBarChart_Currency_Month() {
      this.isBarActive_Currency_Month = true;
      this.isLineActive_Currency_Month = false;
      // 在这里绘制柱状图
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Currency.CM)
    },
    drawLineChart_Currency_Month() {
      this.isBarActive_Currency_Month = false;
      this.isLineActive_Currency_Month = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Currency.CM)
    },

    drawBarChart_Currency_Rise_Month() {
      this.isBarActive_Currency_Rise_Month = true;
      this.isLineActive_Currency_Rise_Month = false;
      // 在这里绘制柱状图
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Currency.CRM)
    },
    drawLineChart_Currency_Rise_Month() {
      this.isBarActive_Currency_Rise_Month = false;
      this.isLineActive_Currency_Rise_Month = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Currency.CRM)
    },
    drawBarChart_Currency() {
      this.isBarActive_Currency = true;
      this.isLineActive_Currency = false;
      // 在这里绘制柱状图
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Currency.CY)
    },
    drawLineChart_Currency() {
      this.isBarActive_Currency = false;
      this.isLineActive_Currency = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Currency.CY)
    },
    drawBarChart_ForeignCurrency() {
      this.isBarActive_ForeignCurrency = true;
      this.isLineActive_ForeignCurrency = false;
      // 在这里绘制柱状图
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Currency.FC)
    },
    drawLineChart_ForeignCurrency() {
      this.isBarActive_ForeignCurrency = false;
      this.isLineActive_ForeignCurrency = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Currency.FC)
    },
    drawChartWithParams(echrtId) {
      // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
      let basicParams = {};
      let typeArr = [];
      let subtitle = ''
      switch (echrtId) {
        case this.EChartType_Currency.CM:
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '货币供应量(万亿)', subtitle: '', exceptName: '供应量_期末值(万亿)', unit: '', legendTop: '10%', gridTop: '25%', dbCode: 'yd' }
          // A0D0101-货币(M2)供应量(亿元) A0D0103-货币(M1)供应量(亿元) A0D0105-货币(M0)供应量(亿元)    
          typeArr = ['A0D0105', 'A0D0103', 'A0D0101'];
          break;
        case this.EChartType_Currency.CRM:
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '货币供应量同比增长(%)', subtitle: '', exceptName: '供应量_同比增长', unit: '', legendTop: '10%', gridTop: '25%', dbCode: 'yd' }
          // A0D0102-货币(M2)供应量同比增长 A0D0104-货币(M1)供应量同比增长 A0D0106-货币(M0)供应量同比增长  
          typeArr = ['A0D0102', 'A0D0104', 'A0D0106'];
          break;
        case this.EChartType_Currency.CY:
          subtitle = 'M0: 流通中的现金; \n M1: M0+企业活期存款; \n M2: M1+企业单位定期存款+城乡居民储蓄存款;'
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '货币供应量(万亿)', subtitle: subtitle, exceptName: '供应量(万亿)', unit: '', legendTop: '20%', gridTop: '35%', dbCode: 'nd' }
          // A0L0301-货币(M2)供应量(亿元) A0L0302-货币(M1)供应量(亿元) A0L0303-货币(M0)供应量(亿元)   
          typeArr = ['A0L0303', 'A0L0302', 'A0L0301'];
          break;
        case this.EChartType_Currency.FC:
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '黄金与外汇储备(亿美元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '25%', dbCode: 'nd' }
          // A0L0401-黄金储备(万盎司) A0L0402-外汇储备(亿美元)
          typeArr = ['A0L0401', 'A0L0402'];
          break;
        default:
          break;
      }
      drawCommonChart(basicParams, typeArr, this.returnData)
    }
  }
};
</script>
