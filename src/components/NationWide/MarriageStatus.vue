<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Marriage }" @click="drawBarChart_Marriage"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Marriage }" @click="drawLineChart_Marriage"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="marriage"></div>
  
    </div>
  </template>
  
  <script>
  
  import { params_marriage, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_Marriage: {
          MA: 'marriage',
        },
        isBarActive_Marriage: false,
        isLineActive_Marriage: false,
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
        // 读取本地国家数据
        fetch('json/nation.json')
          .then(response => response.json())
          .then(data => {
            // console.log('读取本地国家数据:', data);
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
          this.returnData = await sendRequest(params_marriage);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_Marriage()
        }
      },
      drawBarChart_Marriage() {
        this.isBarActive_Marriage = true;
        this.isLineActive_Marriage = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Marriage.MA)
  
      },
      drawLineChart_Marriage() {
        this.isBarActive_Marriage = false;
        this.isLineActive_Marriage = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Marriage.MA)
      },
      
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let subtitle = ''
  
        switch (echrtId) {
          case this.EChartType_Marriage.MA:
            // A0P0C01-结婚登记 A0P0C02-内地居民登记结婚 A0P0C03-内地居民初婚登记
            // A0P0C04-内地居民再婚登记 A0P0C06-离婚登记
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '结离婚登记人数(万对)', subtitle: subtitle, exceptName: '居民登记', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
            typeArr = ['A0P0C01', 'A0P0C06',];
            break;
          default:
            break;
        }
        drawCommonChart(basicParams, typeArr, this.returnData)
      }
    }
  };
  </script>