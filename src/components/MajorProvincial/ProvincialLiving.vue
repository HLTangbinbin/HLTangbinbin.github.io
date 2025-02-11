<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_FinanceDisposable_Year }" @click="drawBarChart_FinanceDisposable_Year"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_FinanceDisposable_Year }" @click="drawLineChart_FinanceDisposable_Year"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="financedisposable-year"></div>

    </div>
  </template>
  
  <script>
  
  import { params_province, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_Finance_Provincial: {
          FDY: 'financedisposable-year'
        },

        isBarActive_FinanceDisposable_Year: false,
        isLineActive_FinanceDisposable_Year: false,

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
        fetch('json/province.json')
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
          this.returnData = await sendRequest(params_province);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_FinanceDisposable_Year()

        }
      },
      drawBarChart_FinanceDisposable_Year() {
        this.isBarActive_FinanceDisposable_Year = true;
        this.isLineActive_FinanceDisposable_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Finance_Provincial.FDY)
      },
      drawLineChart_FinanceDisposable_Year() {
        this.isBarActive_FinanceDisposable_Year = false;
        this.isLineActive_FinanceDisposable_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Finance_Provincial.FDY)
      },
     
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let provinceCodeArr = [];
        // 年度数据
        switch (echrtId) {
          case this.EChartType_Finance_Provincial.FDY:
            // A0A0101-居民人均可支配收入
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '居民人均可支配收入(元)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
            typeArr = ['A0A0101'];
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