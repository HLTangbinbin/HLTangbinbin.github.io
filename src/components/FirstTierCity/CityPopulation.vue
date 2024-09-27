<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Population }" @click="drawBarChart_Population"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Population }" @click="drawLineChart_Population"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="population"></div>
  
    </div>
  </template>
  
  <script>
  
  import { params_city, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_Population_City: {
          PL: 'population',

        },
        isBarActive_Population: false,
        isLineActive_Population: false,
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
        // 读取本地人口数据
        fetch('city.json')
          .then(response => response.json())
          .then(data => {
            console.log('读取本地数据人口数据:', data);
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
          this.drawBarChart_Population()
        }
      },
      drawBarChart_Population() {
        this.isBarActive_Population = true;
        this.isLineActive_Population = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Population_City.PL)
  
      },
      drawLineChart_Population() {
        this.isBarActive_Population = false;
        this.isLineActive_Population = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Population_City.PL)
      },
     
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let cityCodeArr = [];

        switch (echrtId) {
          case this.EChartType_Population_City.PL:
            // A0201-年末户籍人口 
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '年末户籍人口(万人)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
            typeArr = ['A0201'];
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