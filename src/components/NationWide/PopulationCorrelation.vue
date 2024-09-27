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
      <button class="button" :class="{ 'is-active': isBarActive_Populationrate }" @click="drawBarChart_Populationrate"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Populationrate }" @click="drawLineChart_Populationrate"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="populationrate"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Dependencyratio }" @click="drawBarChart_Dependencyratio"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Dependencyratio }"
        @click="drawLineChart_Dependencyratio" style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="dependencyratio"></div>

  </div>
</template>

<script>

import { params_population, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

  data() {
    return {
      EChartType_Population: {
        PL: 'population',
        PR: 'populationrate',
        DC: 'dependencyratio'
      },
      isBarActive_Population: false,
      isLineActive_Population: false,
      isBarActive_Populationrate: false,
      isLineActive_Populationrate: false,
      isBarActive_Dependencyratio: false,
      isLineActive_Dependencyratio: false,
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
      fetch('nation.json')
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
        this.returnData = await sendRequest(params_population);
        console.log("响应处理后的数据：", this.returnData)
        this.drawChartWithBtn()
      } catch (error) {
        console.error('接口外部调用失败:', error);
      }
    },
    drawChartWithBtn() {
      if (this.returnData) {
        this.drawBarChart_Population()
        this.drawBarChart_Populationrate()
        this.drawBarChart_Dependencyratio()
      }
    },
    drawBarChart_Population() {
      this.isBarActive_Population = true;
      this.isLineActive_Population = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Population.PL)

    },
    drawLineChart_Population() {
      this.isBarActive_Population = false;
      this.isLineActive_Population = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Population.PL)
    },
    drawBarChart_Populationrate() {
      this.isBarActive_Populationrate = true;
      this.isLineActive_Populationrate = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Population.PR)

    },
    drawLineChart_Populationrate() {
      this.isBarActive_Populationrate = false;
      this.isLineActive_Populationrate = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Population.PR)
    },
    drawBarChart_Dependencyratio() {
      this.isBarActive_Dependencyratio = true;
      this.isLineActive_Dependencyratio = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Population.DC)

    },
    drawLineChart_Dependencyratio() {
      this.isBarActive_Dependencyratio = false;
      this.isLineActive_Dependencyratio = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Population.DC)
    },
    drawChartWithParams(echrtId) {
      // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
      let basicParams = {};
      let typeArr = [];
      let subtitle = ''

      switch (echrtId) {
        case this.EChartType_Population.PL:
          // A030101-总人口 A030102-男性 A030103-女性 A030104-城市 A030105-农村
          // A030302-0-14岁 A030303-15-64岁 A030304-65岁以上
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '人口数据', subtitle: '', exceptName: '人口', unit: '(万人)', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
          typeArr = ['A030101', 'A030102', 'A030103', 'A030104', 'A030105', 'A030302', 'A030303', 'A030304'];
          break;
        case this.EChartType_Population.PR:
          // A030201-出生率 A030202-死亡率 A030203-自然增长率  
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '人口率', subtitle: '', exceptName: '人口', unit: '(%)', legendTop: '10%', gridTop: '20%', dbCode: 'nd' }
          typeArr = ['A030201', 'A030202', 'A030203'];
          break;
        case this.EChartType_Population.DC:
          // A030305-总抚养比 A030306-少儿抚养比 A030307-老年抚养比
          subtitle = '总体人口中非劳动年龄人口数与劳动年龄人口数之比\n 每100名劳动年龄人口负担多少名非劳动年龄人口'
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '人口抚养比', subtitle: subtitle, exceptName: '', unit: '(%)', legendTop: '20%', gridTop: '35%', dbCode: 'nd' }
          typeArr = ['A030305', 'A030306', 'A030307'];
          break;
        default:
          break;
      }
      drawCommonChart(basicParams, typeArr, this.returnData)
    }
  }
};
</script>