<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Finance_Month }" @click="drawBarChart_Finance_Month"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Finance_Month }" @click="drawLineChart_Finance_Month"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="finance-month"></div>
    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Finance }" @click="drawBarChart_Finance"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Finance }" @click="drawLineChart_Finance"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="finance-year"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_FiscalRevenue }" @click="drawBarChart_FiscalRevenue"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_FiscalRevenue }" @click="drawLineChart_FiscalRevenue"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="fiscalrevenue"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_FiscalExpenditure }"
        @click="drawBarChart_FiscalExpenditure" style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_FiscalExpenditure }"
        @click="drawLineChart_FiscalExpenditure" style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="fiscalexpenditure"></div>

  </div>
</template>

<script>

import { params_nationalFinance, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

  data() {
    return {
      EChartType_NationalFinance: {
        FM: 'finance-month',
        FY: 'finance-year',
        FR: 'fiscalrevenue',
        FE: 'fiscalexpenditure'
      },

      isBarActive_Finance_Month: false,
      isLineActive_Finance_Month: false,
      isBarActive_Finance: false,
      isLineActive_Finance: false,
      isBarActive_FiscalRevenue: false,
      isLineActive_FiscalRevenue: false,
      isBarActive_FiscalExpenditure: false,
      isLineActive_FiscalExpenditure: false,
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
      // 读取本地数据
      fetch('nation.json')
        .then(response => response.json())
        .then(data => {
          console.log('读取本地数据:', data);
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
        this.returnData = await sendRequest(params_nationalFinance);
        console.log("响应处理后的数据：", this.returnData)
        this.drawChartWithBtn()
      } catch (error) {
        console.error('接口外部调用失败:', error);
      }
    },
    drawChartWithBtn() {
      if (this.returnData) {
        this.drawBarChart_Finance_Month()
        this.drawBarChart_Finance()
        this.drawBarChart_FiscalRevenue()
        this.drawBarChart_FiscalExpenditure()
      }
    },
    drawBarChart_Finance_Month() {
      this.isBarActive_Finance_Month = true;
      this.isLineActive_Finance_Month = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_NationalFinance.FM)

    },
    drawLineChart_Finance_Month() {
      this.isBarActive_Finance_Month = false;
      this.isLineActive_Finance_Month = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_NationalFinance.FM)
    },
    drawBarChart_Finance() {
      this.isBarActive_Finance = true;
      this.isLineActive_Finance = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_NationalFinance.FY)

    },
    drawLineChart_Finance() {
      this.isBarActive_Finance = false;
      this.isLineActive_Finance = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_NationalFinance.FY)
    },
    drawBarChart_FiscalRevenue() {
      this.isBarActive_FiscalRevenue = true;
      this.isLineActive_FiscalRevenue = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_NationalFinance.FR)

    },
    drawLineChart_FiscalRevenue() {
      this.isBarActive_FiscalRevenue = false;
      this.isLineActive_FiscalRevenue = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_NationalFinance.FR)
    },
    drawBarChart_FiscalExpenditure() {
      this.isBarActive_FiscalExpenditure = true;
      this.isLineActive_FiscalExpenditure = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_NationalFinance.FE)

    },
    drawLineChart_FiscalExpenditure() {
      this.isBarActive_FiscalExpenditure = false;
      this.isLineActive_FiscalExpenditure = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_NationalFinance.FE)
    },
    drawChartWithParams(echrtId) {
      // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
      let basicParams = {};
      let typeArr = [];
      // 年度数据
      switch (echrtId) {
        case this.EChartType_NationalFinance.FM:
          // A0C0102-国家财政收入 A0C0202-国家财政支出  
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '国家财政收支累计值', subtitle: '', exceptName: '国家财政(不含债务还本)_累计值', unit: '(亿元)', legendTop: '10%', gridTop: '30%', dbCode: 'yd' }
          typeArr = ['A0C0102', 'A0C0202'];
          break;
        case this.EChartType_NationalFinance.FY:
          // A080201-全国财政收入 A080202-中央财政收入 A080203-地方财政收入 A080301-全国财政收入  A080302-中央财政收入  A080303-地方财政收入
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '中央与地方财政收支', subtitle: '', exceptName: '', unit: '(亿元)', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
          typeArr = ['A080201', 'A080202', 'A080203', 'A080301', 'A080302', 'A080303'];
          break;
        case this.EChartType_NationalFinance.FR:
          // A08040102- 国家税收收入 A08040103-国内增值税 A08040104-国内消费税 A08040108-企业所得税
          // A08040109-个人所得税 A0804010G-国家土地增值税 A0804010K-关税 A0804010S-国家罚没收入
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '国家财政主要收入项目', subtitle: '', exceptName: '国家国内财政收入', unit: '(亿元)', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
          typeArr = ['A08040102', 'A08040103', 'A08040104', 'A08040108',
            'A08040109', 'A0804010G', 'A0804010K', 'A0804010S'];
          break;
        case this.EChartType_NationalFinance.FE:
          // A08050102-一般公共服务支出 A08050105-国防支出 A08050106-公共安全支出 A08050108-教育支出
          // A08050109-科学技术支出 A0805010B-社会保障和就业支出 A0805010C-医疗卫生支出 A0805010G-交通运输支出       
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '国家财政主要支出项目', subtitle: '', exceptName: '国家国内财政支出', unit: '(亿元)', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
          typeArr = ['A08050102', 'A08050105', 'A08050106', 'A08050108', 'A08050109', 'A0805010B', 'A0805010C', 'A0805010G'];
          break;
        default:
          break;
      }
      drawCommonChart(basicParams, typeArr, this.returnData)
    }

  }
};
</script>