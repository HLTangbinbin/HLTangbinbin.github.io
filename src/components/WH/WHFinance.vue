<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Finance_Year }" @click="drawBarChart_Finance_Year"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Finance_Year }" @click="drawLineChart_Finance_Year"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="finance-year"></div>
    </div>
  </template>
  
  <script>
  
  import { params_wh, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_NationalFinance_WH: {
          FY: 'finance-year',
        },
  
        isBarActive_Finance_Year: false,
        isLineActive_Finance_Year: false,

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
        fetch('json/wh.json')
          .then(response => response.json())
          .then(data => {
            // console.log('读取本地数据:', data);
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
          this.returnData = await sendRequest(params_wh);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_Finance_Year()

        }
      },
      drawBarChart_Finance_Year() {
        this.isBarActive_Finance_Year = true;
        this.isLineActive_Finance_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_NationalFinance_WH.FY)
  
      },
      drawLineChart_Finance_Year() {
        this.isBarActive_Finance_Year = false;
        this.isLineActive_Finance_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_NationalFinance_WH.FY)
      },
     
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        // 年度数据
        switch (echrtId) {
          case this.EChartType_NationalFinance_WH.FY:
            // A0401-地方一般公共预算收入 A0402-地方一般公共预算支出 A0403-住户存款余额 
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '地方财政(亿元)', subtitle: '', exceptName: '地方一般公共预算', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
            typeArr = ['A0401', 'A0402', 'A0403'];
            break;
          default:
            break;
        }
        drawCommonChart(basicParams, typeArr, this.returnData)
      }
  
    }
  };
  </script>