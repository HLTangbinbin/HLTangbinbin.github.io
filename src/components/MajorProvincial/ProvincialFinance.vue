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


    </div>
  </template>
  
  <script>
  
  import { params_province, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_Finance_Provincial: {
          FIY: 'financeincome-year',
          FOY: 'financeoutput-year',
        },
  
        isBarActive_FinanceIncome_Year: false,
        isLineActive_FinanceIncome_Year: false,

        isBarActive_FinanceOutput_Year: false,
        isLineActive_FinanceOutput_Year: false,


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
        fetch('province.json')
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
          this.returnData = await sendRequest(params_province);
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

        }
      },
      drawBarChart_FinanceIncome_Year() {
        this.isBarActive_FinanceIncome_Year = true;
        this.isLineActive_FinanceIncome_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Finance_Provincial.FIY)
  
      },
      drawLineChart_FinanceIncome_Year() {
        this.isBarActive_FinanceIncome_Year = false;
        this.isLineActive_FinanceIncome_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Finance_Provincial.FIY)
      },
      drawBarChart_FinanceOutput_Year() {
        this.isBarActive_FinanceOutput_Year = true;
        this.isLineActive_FinanceOutput_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Finance_Provincial.FOY)
  
      },
      drawLineChart_FinanceOutput_Year() {
        this.isBarActive_FinanceOutput_Year = false;
        this.isLineActive_FinanceOutput_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Finance_Provincial.FOY)
      },

     
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let provinceCodeArr = [];
        // 年度数据
        switch (echrtId) {
          case this.EChartType_Finance_Provincial.FIY:
            // A080101-地方一般公共预算收入
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '地方财政收入(亿元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A080101'];
            break;
          case this.EChartType_Finance_Provincial.FOY:
            // A080201-地方一般公共预算支出 
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '地方财政支出(亿元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A080201'];
            break;
          default:
            break;
        }
        provinceCodeArr = ['110000', '120000', '130000', '140000', 
                            '150000', '210000', '220000', '230000', 
                            '310000', '320000', '330000', '340000', '350000','360000', '370000', 
                            '410000', '420000', '430000','440000', '450000', '460000',
                            '500000', '510000', '520000','530000', '510000', '540000',
                            '610000', '620000', '630000','640000', '650000']
        drawCommonChart(basicParams, typeArr, this.returnData, provinceCodeArr)
      }
  
    }
  };
  </script>