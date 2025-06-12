<template>
    <div class="container">
  
      <!-- 为下方的按钮添加上边距 style="margin-top -->
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_GDP_WH }" @click="drawBarChart_GDP_WH"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_GDP_WH }" @click="drawLineChart_GDP_WH"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="gdp_wh"></div>
    </div>
  </template>
  
  <script>
  
  import { params_wh, sendRequest, drawCommonChart } from '../CommonUtil';
  
  export default {
  
    data() {
      return {
        EChartType_GDP_WH: {
          GW: 'gdp_wh',
        },
        isBarActive_GDP_WH: false,
        isLineActive_GDP_WH: false,
        dataListWH: null,
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
        fetch('json/wh.json')
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
          this.returnData = await sendRequest(params_wh);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_GDP_WH();
        }
      },
  
      drawBarChart_GDP_WH() {
        this.isBarActive_GDP_WH = true;
        this.isLineActive_GDP_WH = false;
        // 在这里绘制柱状图
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_GDP_WH.GW)
  
      },
      drawLineChart_GDP_WH() {
        this.isBarActive_GDP_WH = false;
        this.isLineActive_GDP_WH = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_GDP_WH.GW)
      },
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let cityCodeArr = [];
        switch (echrtId) {
          case this.EChartType_GDP_WH.GW:
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '武汉市GDP(亿元)', subtitle: '', exceptName: '增加值', unit: '', legendTop: '10%', gridTop: '25%', dbCode: 'nd' }
            // A0101- 国内生产总值 A0102-第一产业增加值 A0103-第二产业增加值  A0104-第三产业增加值
            typeArr = ['A0101', 'A0102', 'A0103', 'A0104'];
            break;
          default:
            break;
        }
        drawCommonChart(basicParams, typeArr, this.returnData, cityCodeArr)
      }
    }
  };
  </script>
  