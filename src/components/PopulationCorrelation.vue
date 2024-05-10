<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Population }" @click="drawBarChart_Population" style="margin-top: 50px;" >柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Population }" @click="drawLineChart_Population" style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="population"></div>

     <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Populationrate }" @click="drawBarChart_Populationrate" style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Populationrate }" @click="drawLineChart_Populationrate" style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="populationrate"></div>

     <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Dependencyratio }" @click="drawBarChart_Dependencyratio" style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Dependencyratio }" @click="drawLineChart_Dependencyratio" style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="dependencyratio"></div>

  </div>
</template>
    
    <script>
    import * as echarts from 'echarts';
    import { sortYearMonths } from './CommonUtil';
    export default {
  
      data() {
        return {
          PopulationType : {
            Population_A030101 : 'A030101',   // 总人口
            Population_A030102 : 'A030102',   // 男性
            Population_A030103 : 'A030103',   // 女性
            Population_A030104 : 'A030104',   // 城市
            Population_A030105 : 'A030105',   // 农村
            Population_A030302 : 'A030302',   // 0-14岁
            Population_A030303 : 'A030303',   // 15-64岁
            Population_A030304 : 'A030304'    // 65岁以上
        },
        PopulationRateType : {
            Population_A030201 : 'A030201',   // 出生率
            Population_A030202 : 'A030202',   // 死亡率
            Population_A030203 : 'A030203',   // 自然增长率
            Population_A030305 : 'A030305',   // 总抚养比
            Population_A030306 : 'A030306',   // 少儿抚养比
            Population_A030307 : 'A030307'    // 老年抚养比
            
        },
          isBarActive_Population: false,
          isLineActive_Population: false,
          isBarActive_Populationrate: false,
          isLineActive_Populationrate: false,
          isBarActive_Dependencyratio: false,
          isLineActive_Dependencyratio: false,
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
              this.drawBarChart_Population()
              this.drawBarChart_Populationrate()
              this.drawBarChart_Dependencyratio()
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
        //按照年份与日期做筛选与排序
        populationArr(type) {
          return this.populationDataList.filter( populationDataListObj => {
            return populationDataListObj.code.search(type) != -1 && populationDataListObj.value !=0;
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
                  text: '人口数据',
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
                      name: '总人口(万人)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Population_A030101)
                  },
                  {
                      name: '男性(万人)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Population_A030102)
                  },
                  {
                      name: '女性(万人)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Population_A030103)
                  },                  {
                      name: '城镇(万人)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Population_A030104)
                  },
                  {
                      name: '农村(万人)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Population_A030105)
                  },
                  {
                      name: '0-14岁(万人)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Population_A030302)
                  },
                  {
                      name: '14-64岁(万人)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Population_A030303)
                  },
                  {
                      name: '65岁以上(万人)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationType.Population_A030304)
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
                  text: '人口率',
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
                      name: '出生率(%)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Population_A030201)
                  },
                  {
                      name: '死亡率(%)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Population_A030202)
                  },
                  {
                      name: '自然增长率(%)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Population_A030203)
                  } 
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          populationrateChart.setOption(populationrateOption);
        },
         // 抚养比图表
         drawDependencyRatioCharts() {
          // 基于准备好的dom，初始化echarts实例
          var dependencyratioChart = echarts.init(document.getElementById('dependencyratio'));
          // 指定图表的配置项和数据
          var dependencyratioOption = {
              title: {
                  text: '抚养比',
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
                      name: '总抚养比(%)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Population_A030305)
                  },
                  {
                      name: '少儿抚养比(%)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Population_A030306)
                  },
                  {
                      name: '老年抚养比(%)',
                      type: this.chartsType,
                      data: this.populationArr(this.PopulationRateType.Population_A030307)
                  }
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          dependencyratioChart.setOption(dependencyratioOption);
        },
        drawBarChart_Population() {
          this.isBarActive_Population = true;
          this.isLineActive_Population = false;
          this.chartsType = "bar"
          this.drawPopulationCharts()
   
        },
        drawLineChart_Population() {
          this.isBarActive_Population = false;
          this.isLineActive_Population = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawPopulationCharts()
        },
        drawBarChart_Populationrate() {
          this.isBarActive_Populationrate = true;
          this.isLineActive_Populationrate = false;
          this.chartsType = "bar"
          this.drawPopulationRateCharts()
   
        },
        drawLineChart_Populationrate() {
          this.isBarActive_Populationrate = false;
          this.isLineActive_Populationrate = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawPopulationRateCharts()
        },
        drawBarChart_Dependencyratio() {
          this.isBarActive_Dependencyratio = true;
          this.isLineActive_Dependencyratio = false;
          this.chartsType = "bar"
          this.drawDependencyRatioCharts()
   
        },
        drawLineChart_Dependencyratio() {
          this.isBarActive_Dependencyratio = false;
          this.isLineActive_Dependencyratio = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawDependencyRatioCharts()
        }
    }
  };
    </script>
  
  
  