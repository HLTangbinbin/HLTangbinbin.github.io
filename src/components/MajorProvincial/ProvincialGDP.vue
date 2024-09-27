<template>
    <div class="container">
  
      <!-- 为下方的按钮添加上边距 style="margin-top -->
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_GDP_Province }" @click="drawBarChart_GDP_Province"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_GDP_Province }" @click="drawLineChart_GDP_Province"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="gdp_province"></div>
    </div>
  </template>
  
  <script>
  
  import { params_province, sendRequest, drawCommonChart } from '../CommonUtil';
  
  export default {
  
    data() {
      return {
        EChartType_GDP_Province: {
          GW: 'gdp_province',
        },
        isBarActive_GDP_Province: false,
        isLineActive_GDP_Province: false,
        dataListProvince: null,
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
        fetch('province.json')
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
          this.returnData = await sendRequest(params_province);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_GDP_Province();
        }
      },
  
      drawBarChart_GDP_Province() {
        this.isBarActive_GDP_Province = true;
        this.isLineActive_GDP_Province = false;
        // 在这里绘制柱状图
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_GDP_Province.GW)
  
      },
      drawLineChart_GDP_Province() {
        this.isBarActive_GDP_Province = false;
        this.isLineActive_GDP_Province = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_GDP_Province.GW)
      },
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let provinceCodeArr = [];

        switch (echrtId) {
          case this.EChartType_GDP_Province.GW:
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '各省市GDP(亿元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '25%', dbCode: 'nd' }
            // A020101- 生产总值 
            typeArr = ['A020101'];
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
  