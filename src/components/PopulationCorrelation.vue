<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
      </div>
     
      <div class="chart-container" id="population"></div>
      <div class="chart-container" id="populationrate"></div>
    </div>
  </template>
    
    <script>
    import * as echarts from 'echarts';
    import { sortYearMonths } from './CommonUtil';
    export default {
  
      data() {
        return {
          PopulationType : {
            Total : 'A030101',
            Man : 'A030102',
            Women : 'A030103',
            City : 'A030104',
            Country : 'A030105'
        },
        PopulationRateType : {
            Birth : 'A030201',
            Death : 'A030202',
            Growth : 'A030203'
            
        },
          isBarActive: false,
          isLineActive: false,
          populationDataList: null,
          chartsType: null
        };
      },
      mounted() {
        this.loadData();
      },
  
      methods: {
        loadData() {
          // 请求总人口公开数据
          fetch('populationData.json')
            .then(response => response.json())
            .then(data => {
              console.log('请求成功人口数据:',data.populationData);
              // 数组倒序处理
              this.populationDataList = data.populationData;
              // 处理数据绘制图表
              this.drawBarChart();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
        //按照年份与日期做筛选与排序
        populationArr(type) {
          return this.populationDataList.filter( populationDataListObj => {
            return populationDataListObj.code.search(type) != -1;
        }).sort(function(a,b) {
            return sortYearMonths(a.date, b.date);
        }).map(item => {
              //取出某个字段数据
              var number = Number(item.value)
              return number;
          })
        },
        // 总人口图表
        drawPopulationCharts() {
          // 基于准备好的dom，初始化echarts实例
          var populationChart = echarts.init(document.getElementById('population'));
          // 指定图表的配置项和数据
          var populationOption = {
              title: {
                  text: '人口数据统计',
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
                      name: '总人口',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Total)
                  },
                  {
                      name: '男性',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Man)
                  },
                  {
                      name: '女性',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Women)
                  },                  {
                      name: '城镇',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.City)
                  },
                  {
                      name: '农村',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Country)
                  }
                
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          populationChart.setOption(populationOption);
        },
        // 出生率/死亡率/增长率图表
        drawPopulationRateCharts() {
          // 基于准备好的dom，初始化echarts实例
          var populationrateChart = echarts.init(document.getElementById('populationrate'));
          // 指定图表的配置项和数据
          var populationrateOption = {
              title: {
                  text: '人口率统计',
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
                      name: '出生率',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Birth)
                  },
                  {
                      name: '死亡率',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Death)
                  },
                  {
                      name: '自然增长率',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Growth)
                  }
                
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          populationrateChart.setOption(populationrateOption);
        },
        drawBarChart() {
          this.isBarActive = true;
          this.isLineActive = false;
          this.chartsType = "bar"
          this.drawPopulationCharts();
          this.drawPopulationRateCharts();
   
        },
        drawLineChart() {
          this.isBarActive = false;
          this.isLineActive = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawPopulationCharts();
          this.drawPopulationRateCharts();
        }
      }
    };
    </script>
  
  
  