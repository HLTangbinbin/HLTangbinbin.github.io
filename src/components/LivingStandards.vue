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
import * as echarts from 'echarts';
import { params_livingStandards, sendRequest, sortYearMonths } from './CommonUtil';
export default {

  data() {
    return {
      LivingStandards_Income: {
        A0A0101: 'A0A0101',   // 居民人均可支配收入
        A0A0103: 'A0A0103',   // 居民人均可支配收入中位数
        A0A0201: 'A0A0201',   // 城镇居民人均可支配收入
        A0A0203: 'A0A0203',   // 城镇居民人均可支配收入中位数
        A0A0301: 'A0A0301',   // 农村居民人均可支配收入
        A0A0303: 'A0A0303',   // 农村居民人均可支配收入中位数
      },
      LivingStandards_Coefficient: {
        A0A0G01: 'A0A0G01',   // 居民人均可支配收入基尼系数
        A0A0H01: 'A0A0H01',   // 居民恩格尔系数
        A0A0H02: 'A0A0H02',   // 城镇居民恩格尔系数
        A0A0H03: 'A0A0H03',   // 农村居民恩格尔系数

      },
      isBarActive_Income: false,
      isLineActive_Income: false,
      isBarActive_Engel: false,
      isLineActive_Engel: false,
      isBarActive_Gini: false,
      isLineActive_Gini: false,
      returnData: null,
      sjList: null,
      chartsType: null
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
          this.drawBarChart_Income()
          this.drawBarChart_Engel()
          this.drawBarChart_Gini()
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    async requestWithAPI() {
      try {
        this.returnData = await sendRequest(params_livingStandards);
        console.log("响应处理后的数据：", this.returnData)
        if (this.returnData) {
          this.drawBarChart_Income()
          this.drawBarChart_Engel()
          this.drawBarChart_Gini()
        }
      } catch (error) {
        console.error('接口外部调用失败:', error);
      }
    },
    //按照年份与日期做筛选与排序
    livingStandardsArr(type) {
      return this.returnData.dataList.filter(returnDataObj => {
        return returnDataObj.code.search(type) != -1 && returnDataObj.value != 0;
      }).sort(function (a, b) {
        return sortYearMonths(a.date, b.date);
      }).map(item => {
        //取出某个字段数据
        var number = Number(item.value)
        return number;
      })
    },
    // 平均收入图表
    drawIncomeCharts() {
      // 基于准备好的dom，初始化echarts实例
      var incomeChart = echarts.init(document.getElementById('income'));
      // 指定图表的配置项和数据
      var incomeOption = {
        title: {
          text: '居民人均收入数据',
          left: 'center',
          top: 'top'
        },
        tooltip: {
          //X轴悬浮显示所有数据
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          top: '10%'
        },
        grid: {
          left: '1%',
          right: '1%',
          top: '30%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.returnData.sj[0].sort()
        },
        yAxis: {
        },
        series: [
          {
            name: '人均收入(万)',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Income.A0A0101)
          },
          {
            name: '人均收入中位数(万)',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Income.A0A0103)
          },
          {
            name: '城镇人均收入(万)',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Income.A0A0201)
          }, {
            name: '城镇人均收入中位数(万)',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Income.A0A0203)
          },
          {
            name: '农村人均收入(万)',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Income.A0A0301)
          },
          {
            name: '农村人均收入中位数(万)',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Income.A0A0303)
          }

        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      incomeChart.setOption(incomeOption);
    },
    // 恩格尔系数
    drawEngelCoefficientCharts() {
      // 基于准备好的dom，初始化echarts实例
      var engelCoefficientChart = echarts.init(document.getElementById('engelcoefficient'));
      // 指定图表的配置项和数据
      var engelCoefficientOption = {
        title: {
          text: '恩格尔系数',
          subtext: '恩格尔系数是食品支出总额占个人消费支出总额的比重 \n 59%以上为贫困 50~59%为温饱 \n 40~50%为小康 30~40%为相对富裕 \n 20~30%为富裕 低于20%为及其富裕',
          left: 'center',
          top: 'top',
          subtextStyle: {
            fontWeight: 'bold',
            fontSize: 13,
            lineHeight: 20,
          }
        },
        tooltip: {
          //X轴悬浮显示所有数据
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          top: '20%'
        },
        grid: {
          left: '1%',
          right: '1%',
          top: '35%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.returnData.sj[0].sort()
        },
        yAxis: {
          min: '25',
          max: '50'
        },
        series: [
          {
            name: '居民恩格尔系数',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Coefficient.A0A0H01)
          },
          {
            name: '城镇居民恩格尔系数',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Coefficient.A0A0H02)
          },
          {
            name: '农村居民恩格尔系数',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Coefficient.A0A0H03)
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      engelCoefficientChart.setOption(engelCoefficientOption);
    },
    // 基尼系数图表
    drawGiniCoefficientCharts() {
      // 基于准备好的dom，初始化echarts实例
      var giniCoefficientChart = echarts.init(document.getElementById('ginicoefficient'));
      // 指定图表的配置项和数据
      var giniCoefficientOption = {
        title: {
          text: '基尼系数',
          subtext: '衡量一个国家或地区居民收入差距的常用指标之一 \n 0.2-0.29表示指数等级低(比较平均) \n 0.3-0.39表示指数等级中(相对合理) \n 0.4-0.59表示指数等级高(差距较大) \n 0.6以上表示指数等级极高(差距悬殊) \n 0.4作为收入分配差距的“警戒线”',
          left: 'center',
          top: 'top',
          subtextStyle: {
            fontWeight: 'bold',
            fontSize: 13,
            lineHeight: 20,
          }
        },
        tooltip: {
          //X轴悬浮显示所有数据
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          top: '27%'
        },
        grid: {
          left: '1%',
          right: '1%',
          top: '35%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.returnData.sj[0].sort()
        },
        yAxis: {
          min: '0.4',
          max: '0.5'
        },
        series: [
          {
            name: '基尼系数',
            type: this.chartsType,
            data: this.livingStandardsArr(this.LivingStandards_Coefficient.A0A0G01)
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      giniCoefficientChart.setOption(giniCoefficientOption);
    },
    drawBarChart_Income() {
      this.isBarActive_Income = true;
      this.isLineActive_Income = false;
      this.chartsType = "bar"
      this.drawIncomeCharts()

    },
    drawLineChart_Income() {
      this.isBarActive_Income = false;
      this.isLineActive_Income = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawIncomeCharts()
    },
    drawBarChart_Engel() {
      this.isBarActive_Engel = true;
      this.isLineActive_Engel = false;
      this.chartsType = "bar"
      this.drawEngelCoefficientCharts()

    },
    drawLineChart_Engel() {
      this.isBarActive_Engel = false;
      this.isLineActive_Engel = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawEngelCoefficientCharts()
    },
    drawBarChart_Gini() {
      this.isBarActive_Gini = true;
      this.isLineActive_Gini = false;
      this.chartsType = "bar"
      this.drawGiniCoefficientCharts()

    },
    drawLineChart_Gini() {
      this.isBarActive_Gini = false;
      this.isLineActive_Gini = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawGiniCoefficientCharts()
    }

  }
};
</script>