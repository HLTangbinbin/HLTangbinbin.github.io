<template>
    <div class="container">
  
      <!-- 为下方的按钮添加上边距 style="margin-top -->
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_GDP_City }" @click="drawBarChart_GDP_City"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_GDP_City }" @click="drawLineChart_GDP_City"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="gdp_city"></div>
    </div>
  </template>
  
  <script>
  
  import { params_city, sendRequest, drawCommonChart } from '../CommonUtil';
  
  export default {
  
    data() {
      return {
        EChartType_GDP_City: {
          GW: 'gdp_city',
        },
        isBarActive_GDP_City: false,
        isLineActive_GDP_City: false,
        dataListCity: null,
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
        fetch('json/city.json')
          .then(response => response.json())
          .then(data => {
            // console.log('读取本地数据GDP数据:', data);
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
          this.drawBarChart_GDP_City();
        }
      },
  
      drawBarChart_GDP_City() {
        this.isBarActive_GDP_City = true;
        this.isLineActive_GDP_City = false;
        // 在这里绘制柱状图
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_GDP_City.GW)
  
      },
      drawLineChart_GDP_City() {
        this.isBarActive_GDP_City = false;
        this.isLineActive_GDP_City = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_GDP_City.GW)
      },
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let cityCodeArr = [];

        switch (echrtId) {
          case this.EChartType_GDP_City.GW:
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '一线城市GDP(亿元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '25%', dbCode: 'nd' }
            // A0101- 国内生产总值 A0102-第一产业增加值 A0103-第二产业增加值  A0104-第三产业增加值
            typeArr = ['A0101'];
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
  