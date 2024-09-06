<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Education_Year }" @click="drawBarChart_Education_Year"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Education_Year }" @click="drawLineChart_Education_Year"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="education"></div>

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
  
  import { params_city, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_EHC_City: {
          EC: 'education',
          MD: 'medical',
        },
  
        isBarActive_Education_Year: false,
        isLineActive_Education_Year: false,
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
        // 读取本地财政收入数据
        fetch('city.json')
          .then(response => response.json())
          .then(data => {
            console.log('读取本地成功财政收入数据:', data);
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
          this.drawBarChart_Education_Year()
          this.drawBarChart_Medical_Year()

        }
      },
      drawBarChart_Education_Year() {
        this.isBarActive_Education_Year = true;
        this.isLineActive_Education_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_EHC_City.EC)
  
      },
      drawLineChart_Education_Year() {
        this.isBarActive_Education_Year = false;
        this.isLineActive_Education_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_EHC_City.EC)
      },
      drawBarChart_Medical_Year() {
        this.isBarActive_Medical_Year = true;
        this.isLineActive_Medical_Year = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_EHC_City.MD)
  
      },
      drawLineChart_Medical_Year() {
        this.isBarActive_Medical_Year = false;
        this.isLineActive_Medical_Year = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_EHC_City.MD)
      },
     
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let cityCodeArr = [];
        // 年度数据
        switch (echrtId) {
          case this.EChartType_EHC_City.EC:
            // A0801-在校本专科生数
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '普通本专科在校学生数(万人)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A0801'];
            break;
        case this.EChartType_EHC_City.MD:
            // A0802-医院个数
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '医院数(个)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A0802'];
            break;
          default:
            break;
        }
        cityCodeArr = ['110000', '310000', '440100', '440300', '330100', '510100', '420100', '320100', '500000', '610100', '410100', '340100', '420500']
        drawCommonChart(basicParams, typeArr, this.returnData, cityCodeArr)
      }
  
    }
  };
  </script>