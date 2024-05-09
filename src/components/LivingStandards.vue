<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
      </div>
     
      <div class="chart-container" id="livingStandards"></div>
      <div class="chart-container" id="engelcoefficient"></div>
      <div class="chart-container" id="ginicoefficient"></div>
    </div>
  </template>
    
    <script>
    import * as echarts from 'echarts';
    import { sortYearMonths } from './CommonUtil';
    export default {
  
      data() {
        return {
          LivingStandards_Income : {
            A0A0101 : 'A0A0101',   // 居民人均可支配收入
            A0A0103 : 'A0A0103',   // 居民人均可支配收入中位数
            A0A0201 : 'A0A0201',   // 城镇居民人均可支配收入
            A0A0203 : 'A0A0203',   // 城镇居民人均可支配收入中位数
            A0A0301 : 'A0A0301',   // 农村居民人均可支配收入
            A0A0303 : 'A0A0303',   // 农村居民人均可支配收入中位数
        },
        LivingStandards_Coefficient : {
            A0A0G01 : 'A0A0G01',   // 居民人均可支配收入基尼系数
            A0A0H01 : 'A0A0H01',   // 居民恩格尔系数
            A0A0H02 : 'A0A0H02',   // 城镇居民恩格尔系数
            A0A0H03 : 'A0A0H03',   // 农村居民恩格尔系数
    
        },
          isBarActive: false,
          isLineActive: false,
          livingStandardsDataList: null,
          chartsType: null
        };
      },
      mounted() {
        this.loadData();
      },
  
      methods: {
        loadData() {
          // 请求人民收入公开数据
          fetch('livingStandardsData.json')
            .then(response => response.json())
            .then(data => {
              console.log('请求成功人民收入数据:',data.livingStandardsData);
              // 列表数据
              this.livingStandardsDataList = data.livingStandardsData;
              // 处理数据绘制图表
              this.drawBarChart();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
        //按照年份与日期做筛选与排序
        livingStandardsArr(type) {
          return this.livingStandardsDataList.filter( livingStandardsDataListObj => {
            return livingStandardsDataListObj.code.search(type) != -1;
        }).sort(function(a,b) {
            return sortYearMonths(a.date, b.date);
        }).map(item => {
              //取出某个字段数据
              var number = Number(item.value)
              return number;
          })
        },
        // 平均收入图表
        drawLivingStandardsCharts() {
          // 基于准备好的dom，初始化echarts实例
          var livingStandardsChart = echarts.init(document.getElementById('livingStandards'));
          // 指定图表的配置项和数据
          var livingStandardsOption = {
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
                  top: '50px'
              },
              grid: {
                  left: '1%',
                  right: '1%',
                  top: '20%',
                  bottom: '1%',
                  containLabel: true
              },
              xAxis: {
                  type: 'category',
                  data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
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
                  },                  {
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
          livingStandardsChart.setOption(livingStandardsOption);
        },
        // 恩格尔系数
        drawEngelCoefficientCharts() {
          // 基于准备好的dom，初始化echarts实例
          var engelCoefficientChart = echarts.init(document.getElementById('engelcoefficient'));
          // 指定图表的配置项和数据
          var engelCoefficientOption = {
              title: {
                  text: '恩格尔系数',
                  subtext: '恩格尔系数是食品支出总额占个人消费支出总额的比重 \n 59%以上为贫困 50~59%为温饱 \n 40~50%为小康 30~40%为富裕 \n 低于30%为最富裕',
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
                  top: '30%',
                  bottom: '1%',
                  containLabel: true
              },
              xAxis: {
                  type: 'category',
                  data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
              },
              yAxis: {
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
                  data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
              },
              yAxis: {
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
        drawBarChart() {
          this.isBarActive = true;
          this.isLineActive = false;
          this.chartsType = "bar"
          this.drawChart()
   
        },
        drawLineChart() {
          this.isBarActive = false;
          this.isLineActive = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawChart()
        },
        drawChart() {
          this.drawLivingStandardsCharts();
          this.drawEngelCoefficientCharts();
          this.drawGiniCoefficientCharts();
      }
    }
  };
    </script>
  
  
  