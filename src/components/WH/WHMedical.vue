<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Medical_Year }" @click="drawBarChart_Medical_Year"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Medical_Year }" @click="drawLineChart_Medical_Year"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="medical"></div>

    </div>
  </template>
  
  <script>
  
  import { params_wh, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_Medical_WH: {
          MD: 'medical',
        },
  
        isBarActive_Medical_Year: false,
        isLineActive_Medical_Year: false,

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
        fetch('wh.json')
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
          this.returnData = await sendRequest(params_wh);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_Medical_Year()

        }
      },

      drawBarChart_Medical_Year() {
        this.isBarActive_Medical_Year = true;
        this.isLineActive_Medical_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Medical_WH.MD)
  
      },
      drawLineChart_Medical_Year() {
        this.isBarActive_Medical_Year = false;
        this.isLineActive_Medical_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Medical_WH.MD)
      },
     
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        // 年度数据
        switch (echrtId) {
        case this.EChartType_Medical_WH.MD:
            // A0802-医院个数
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '医疗', subtitle: '', exceptName: '', unit: '(个)', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A0802'];
            break;
          default:
            break;
        }
        drawCommonChart(basicParams, typeArr, this.returnData)
      }
  
    }
  };
  </script>