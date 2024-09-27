<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_FinanceIncome_Year }" @click="drawBarChart_FinanceIncome_Year"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_FinanceIncome_Year }" @click="drawLineChart_FinanceIncome_Year"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="financeincome-year"></div>

      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_FinanceOutput_Year }" @click="drawBarChart_FinanceOutput_Year"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_FinanceOutput_Year }" @click="drawLineChart_FinanceOutput_Year"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="financeoutput-year"></div>

      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_FinanceDeposit_Year }" @click="drawBarChart_FinanceDeposit_Year"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_FinanceDeposit_Year }" @click="drawLineChart_FinanceDeposit_Year"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="financedeposit-year"></div>

    </div>
  </template>
  
  <script>
  
  import { params_city, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_Finance_City: {
          FIY: 'financeincome-year',
          FOY: 'financeoutput-year',
          FDY: 'financedeposit-year'
        },
  
        isBarActive_FinanceIncome_Year: false,
        isLineActive_FinanceIncome_Year: false,

        isBarActive_FinanceOutput_Year: false,
        isLineActive_FinanceOutput_Year: false,

        isBarActive_FinanceDeposit_Year: false,
        isLineActive_FinanceDeposit_Year: false,

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
        fetch('city.json')
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
          this.returnData = await sendRequest(params_city);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_FinanceIncome_Year()
          this.drawBarChart_FinanceOutput_Year()
          this.drawBarChart_FinanceDeposit_Year()

        }
      },
      drawBarChart_FinanceIncome_Year() {
        this.isBarActive_FinanceIncome_Year = true;
        this.isLineActive_FinanceIncome_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Finance_City.FIY)
  
      },
      drawLineChart_FinanceIncome_Year() {
        this.isBarActive_FinanceIncome_Year = false;
        this.isLineActive_FinanceIncome_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Finance_City.FIY)
      },
      drawBarChart_FinanceOutput_Year() {
        this.isBarActive_FinanceOutput_Year = true;
        this.isLineActive_FinanceOutput_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Finance_City.FOY)
  
      },
      drawLineChart_FinanceOutput_Year() {
        this.isBarActive_FinanceOutput_Year = false;
        this.isLineActive_FinanceOutput_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Finance_City.FOY)
      },
      drawBarChart_FinanceDeposit_Year() {
        this.isBarActive_FinanceDeposit_Year = true;
        this.isLineActive_FinanceDeposit_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Finance_City.FDY)
      },
      drawLineChart_FinanceDeposit_Year() {
        this.isBarActive_FinanceDeposit_Year = false;
        this.isLineActive_FinanceDeposit_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Finance_City.FDY)
      },
     
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let cityCodeArr = [];
        // 年度数据
        switch (echrtId) {
          case this.EChartType_Finance_City.FIY:
            // A0401-地方一般公共预算收入 A0402-地方一般公共预算支出 A0403-住户存款余额 
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '地方财政收入(亿元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
            typeArr = ['A0401'];
            break;
          case this.EChartType_Finance_City.FOY:
            // A0401-地方一般公共预算收入 A0402-地方一般公共预算支出 A0403-住户存款余额 
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '地方财政支出(亿元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
            typeArr = ['A0402'];
            break;
          case this.EChartType_Finance_City.FDY:
            // A0401-地方一般公共预算收入 A0402-地方一般公共预算支出 A0403-住户存款余额 
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '住户存款余额(亿元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
            typeArr = ['A0403'];
            break;
          default:
            break;
        }
        cityCodeArr = ['110000', '310000', '440100', '440300', '330100', '510100', '420100', '320100', '500000', '610100', '410100', '340100']
        drawCommonChart(basicParams, typeArr, this.returnData, cityCodeArr)
      }
  
    }
  };
  </script>