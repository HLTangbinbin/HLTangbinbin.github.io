<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
      </div>
     
      <div class="chart-container" id="population"></div>
    </div>
  </template>
    
    <script>
    import * as echarts from 'echarts';
    
    export default {
  
      data() {
        return {
          populationType : {
            Total : 'A030101',
            Man : 'A030102',
            Women : 'A030103',
            City : 'A030104',
            Country : 'A030105'
        },
          isBarActive: false,
          isLineActive: false,
          populationList: null,
          chartsType: null
        };
      },
      mounted() {
        this.loadData();
      },
  
      methods: {
        loadData() {
          // 请求接口公开数据
          fetch('population.json')
            .then(response => response.json())
            .then(data => {
              console.log('请求成功人口数据:', data.returndata.datanodes);
              this.populationList = data.returndata.datanodes;
              // 处理数据绘制图表
              this.drawBarChart();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
          //按照年份与日期做筛选与排序
          populationArr(type) {
            return this.populationList.filter( populationListObj => {
              return populationListObj.code.search(type) != -1;
          }).map(item => {
                //取出某个字段数据
                var number = Number(item.data.data)
                return number;
            })
          },
  
        drawCharts() {
          // 基于准备好的dom，初始化echarts实例
          var currencyLineMonthChart = echarts.init(document.getElementById('population'));
          // 指定图表的配置项和数据
          var currencyLineMonthOption = {
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
                      data: this.populationArr(this.populationType.Total)
                  },
                  {
                      name: '男性',
                      type: this.chartsType,
                      data: this.populationArr(this.populationType.Man)
                  },
                  {
                      name: '女性',
                      type: this.chartsType,
                      data: this.populationArr(this.populationType.Women)
                  },                  {
                      name: '城镇',
                      type: this.chartsType,
                      data: this.populationArr(this.populationType.City)
                  },
                  {
                      name: '农村',
                      type: this.chartsType,
                      data: this.populationArr(this.populationType.Country)
                  }
                
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          currencyLineMonthChart.setOption(currencyLineMonthOption);
        },
        drawBarChart() {
          this.isBarActive = true;
          this.isLineActive = false;
          this.chartsType = "bar"
          this.drawCharts();
   
        },
        drawLineChart() {
          this.isBarActive = false;
          this.isLineActive = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawCharts();
        }
      }
    };
    </script>
  
  
  