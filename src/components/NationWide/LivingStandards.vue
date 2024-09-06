<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Income }" @click="drawBarChart_Income"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Income }" @click="drawLineChart_Income"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="income"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Engel }" @click="drawBarChart_Engel"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Engel }" @click="drawLineChart_Engel"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="engelcoefficient"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Gini }" @click="drawBarChart_Gini"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Gini }" @click="drawLineChart_Gini"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="ginicoefficient"></div>

  </div>
</template>

<script>

import { params_livingStandards, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

  data() {
    return {
      EChartType_LivingStandards: {
        IC: 'income',
        EC: 'engelcoefficient',
        GC: 'ginicoefficient'
      },
      isBarActive_Income: false,
      isLineActive_Income: false,
      isBarActive_Engel: false,
      isLineActive_Engel: false,
      isBarActive_Gini: false,
      isLineActive_Gini: false,
      returnData: null,
      sjList: null,
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
      // 读取本地人民收入数据
      fetch('livingStandards.json')
        .then(response => response.json())
        .then(data => {
          console.log('读取本地成功人民收入数据:', data);
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
        this.returnData = await sendRequest(params_livingStandards);
        console.log("响应处理后的数据：", this.returnData)
        this.drawChartWithBtn()
      } catch (error) {
        console.error('接口外部调用失败:', error);
      }
    },
    drawChartWithBtn() {
      if (this.returnData) {
        this.drawBarChart_Income()
        this.drawBarChart_Engel()
        this.drawBarChart_Gini()
      }
    },
    drawBarChart_Income() {
      this.isBarActive_Income = true;
      this.isLineActive_Income = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_LivingStandards.IC)
    },
    drawLineChart_Income() {
      this.isBarActive_Income = false;
      this.isLineActive_Income = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_LivingStandards.IC)
    },
    drawBarChart_Engel() {
      this.isBarActive_Engel = true;
      this.isLineActive_Engel = false;
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_LivingStandards.EC)
    },
    drawLineChart_Engel() {
      this.isBarActive_Engel = false;
      this.isLineActive_Engel = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_LivingStandards.EC)
    },
    drawBarChart_Gini() {
      this.isBarActive_Gini = true;
      this.isLineActive_Gini = false;
      this.chartType = "bar"

      this.drawChartWithParams(this.EChartType_LivingStandards.GC)
    },
    drawLineChart_Gini() {
      this.isBarActive_Gini = false;
      this.isLineActive_Gini = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_LivingStandards.GC)
    },
    drawChartWithParams(echrtId) {
      // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
      let basicParams = {};
      let typeArr = [];
      let subtitle = ''
      switch (echrtId) {
        case this.EChartType_LivingStandards.IC:
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '人均收入数据', subtitle: '', exceptName: '居民可支配收入', unit: '(万元)', legendTop: '10%', gridTop: '30%', sj: '0' }
          // A0A0101-居民人均可支配收入 A0A0103-居民人均可支配收入中位数 A0A0201-城镇居民人均可支配收入   
          // A0A0203-城镇居民人均可支配收入中位数 A0A0301-农村居民人均可支配收入 A0A0303-农村居民人均可支配收入中位数
          typeArr = ['A0A0101', 'A0A0103', 'A0A0201', 'A0A0203', 'A0A0301', 'A0A0303'];
          break;
        case this.EChartType_LivingStandards.EC:
          subtitle = '食品支出总额占个人消费支出总额的比重 \n 大于60%为贫穷 50%~60%为温饱\n 40%~50%为小康 30%~40%属于相对富裕\n 20%~30%为富足 20%以下为极其富裕 \n '
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '恩格尔系数', subtitle: subtitle, exceptName: '恩格尔系数', unit: '', legendTop: '27%', gridTop: '35%', sj: '0', min: '25', max: '35' }
          // A0A0H01-居民恩格尔系数 A0A0H02-城镇居民恩格尔系数 A0A0H03-农村居民恩格尔系数  
          typeArr = ['A0A0H01', 'A0A0H02', 'A0A0H03'];
          break;
        case this.EChartType_LivingStandards.GC:
          subtitle = '衡量一个国家或地区居民收入差距的常用指标之一 \n 0.2-0.29表示指数等级低(比较平均) \n 0.3-0.39表示指数等级中(相对合理) \n 0.4-0.59表示指数等级高(差距较大) \n 0.6以上表示指数等级极高(差距悬殊) \n 0.4作为收入分配差距的“警戒线”'
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '基尼系数', subtitle: subtitle, exceptName: '基尼系数', unit: '', legendTop: '27%', gridTop: '35%', sj: '0', min: '0.4', max: '0.5' }
          // A0A0G01-居民人均可支配收入基尼系数
          typeArr = ['A0A0G01'];
          break;
        default:
          break;
      }
      drawCommonChart(basicParams, typeArr, this.returnData)
    }
  }
};
</script>