<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Population }" @click="drawBarChart_Population"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Population }" @click="drawLineChart_Population"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="population"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Populationrate_Birth }" @click="drawBarChart_Populationrate_Birth"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Populationrate_Birth }" @click="drawLineChart_Populationrate_Birth"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="populationrate_birth"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Populationrate_Death }" @click="drawBarChart_Populationrate_Death"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Populationrate_Death }" @click="drawLineChart_Populationrate_Death"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="populationrate_death"></div>


    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Populationrate_Increase }" @click="drawBarChart_Populationrate_Increase"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Populationrate_Increase }" @click="drawLineChart_Populationrate_Increase"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="populationrate_increase"></div>
  
    </div>
  </template>
  
  <script>
  
  import { params_province, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_Population_Province: {
          PP: 'population',
          PRB: 'populationrate_birth',
          PRD: 'populationrate_death',
          PRI: 'populationrate_increase',

        },
        isBarActive_Population: false,
        isLineActive_Population: false,
        isBarActive_Populationrate_Birth: false,
        isLineActive_Populationrate_Birth: false,
        isBarActive_Populationrate_Death: false,
        isLineActive_Populationrate_Death: false,
        isBarActive_Populationrate_Increase: false,
        isLineActive_Populationrate_Increase: false,
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
        fetch('province.json')
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
          this.returnData = await sendRequest(params_province);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_Population()
          this.drawBarChart_Populationrate_Birth()
          this.drawBarChart_Populationrate_Death()
          this.drawBarChart_Populationrate_Increase()
        }
      },
      drawBarChart_Population() {
        this.isBarActive_Population = true;
        this.isLineActive_Population = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Population_Province.PP)
  
      },
      drawLineChart_Population() {
        this.isBarActive_Population = false;
        this.isLineActive_Population = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Population_Province.PP)
      },
      drawBarChart_Populationrate_Birth() {
        this.isBarActive_Populationrate_Birth = true;
        this.isLineActive_Populationrate_Birth = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Population_Province.PRB)
  
      },
      drawLineChart_Populationrate_Birth() {
        this.isBarActive_Populationrate_Birth = false;
        this.isLineActive_Populationrate_Birth = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Population_Province.PRB)
      },
      drawBarChart_Populationrate_Death() {
        this.isBarActive_Populationrate_Death = true;
        this.isLineActive_Populationrate_Death = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Population_Province.PRD)
  
      },
      drawLineChart_Populationrate_Death() {
        this.isBarActive_Populationrate_Death = false;
        this.isLineActive_Populationrate_Death = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Population_Province.PRD)
      },

      drawBarChart_Populationrate_Increase() {
        this.isBarActive_Populationrate_Increase = true;
        this.isLineActive_Populationrate_Increase = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Population_Province.PRI)
  
      },
      drawLineChart_Populationrate_Increase() {
        this.isBarActive_Populationrate_Increase = false;
        this.isLineActive_Populationrate_Increase = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Population_Province.PRI)
      },
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let provinceCodeArr = [];
        switch (echrtId) {
          case this.EChartType_Population_Province.PP:
            // A0201-年末户籍人口 
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '年末户籍人口', subtitle: '', exceptName: '人口', unit: '(万人)', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A030101'];
            break;
        case this.EChartType_Population_Province.PRB:
            // A030201-出生率
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '人口出生率', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A030201'];
            break;
        case this.EChartType_Population_Province.PRD:
            // A030202-死亡率
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '人口死亡率', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A030202'];
            break;
        case this.EChartType_Population_Province.PRI:
            // A030203-出生率
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '人口自然增长率', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', sj: '0' }
            typeArr = ['A030203'];
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