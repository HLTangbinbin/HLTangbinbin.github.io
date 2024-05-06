<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
      </div>
     
      <div class="chart-container" id="priceIndices"></div>
      <div class="chart-container" id="pmi"></div>
    </div>
  </template>
    
    <script>
    import * as echarts from 'echarts';
    import { sortYearMonths } from './CommonUtil';
    export default {
  
      data() {
        return {
          IndicesType : {
            CPI_101 : 'A01030101',
            PPI_701 : 'A01080701',
            PMI_301 : 'A0B0301',
            PMI_201 : 'A0B0201',
            PMI_101 : 'A0B0101'
        
        },
          isBarActive: false,
          isLineActive: false,
          indicesDataList: null,
          chartsType: null
        };
      },
      mounted() {
        this.loadData();
      },
  
      methods: {
        loadData() {
          // 请求priceIndices数据
          fetch('indicesData.json')
            .then(response => response.json())
            .then(data => {
              this.indicesDataList = data.data
              console.log('请求成功priceIndices数据:', this.indicesDataList);
              // 处理数据绘制图表
              this.drawBarChart();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
        // 按照类型与字段名称
        dataArr(type) {
          return this.indicesDataList.filter( indicesDataListObj => {
                return indicesDataListObj.code.search(type) != -1;
            }).sort(function(a,b) {
              return sortYearMonths(a.date, b.date);
          }).map(item => {
                return Number(item.value);
          })
        },
       
        // 获取时间横坐标数组数据
        axisArr(type) {
            return this.indicesDataList.filter(indicesDataListObj => {
              return indicesDataListObj.code.search(type) != -1;
          }).sort(function(a,b) {
              return sortYearMonths(a.date, b.date);
          }).map(item => {
              return Number(item.date);
            })
          },

        // cpi图表
        drawPriceIndices() {
          // 基于准备好的dom，初始化echarts实例
          var priceIndicesChart = echarts.init(document.getElementById('priceIndices'));
          // 指定图表的配置项和数据
          var priceIndicesOption = {
              title: {
                  text: '居民消费价格指数',
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
                  data: this.axisArr(this.IndicesType.CPI_101)
              },
              yAxis: {
                min: '99',
                max: '101'
              },
              series: [
                  {
                      name: 'CPI',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.CPI_101)
                  },
                  {
                      name: 'PPI',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PPI_701)
                  }
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          priceIndicesChart.setOption(priceIndicesOption);
        },

         // pmi图表
         drawPMIChart() {
          // 基于准备好的dom，初始化echarts实例
          var pmiChart = echarts.init(document.getElementById('pmi'));
          // 指定图表的配置项和数据
          var pmiOption = { 
              title: {
                  text: '采购经理指数',
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
                  data: this.axisArr(this.IndicesType.CPI_101)
              },
              yAxis: {
                min: '48',
                max: '55'
              },
              series: [
                  {
                      name: '制造业PMI',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PMI_101)
                  },
                  {
                      name: '非制造业PMI',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PMI_201)
                  },
                  {
                      name: '综合PMI',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PMI_301)
                  }
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          pmiChart.setOption(pmiOption);
        },
       
        drawBarChart() {
          this.isBarActive = true;
          this.isLineActive = false;
          this.chartsType = "bar"
          this.drawPriceIndices();
          this.drawPMIChart();
   
        },
        drawLineChart() {
          this.isBarActive = false;
          this.isLineActive = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawPriceIndices();
          this.drawPMIChart()
        }
      }
    };
    </script>
  
  
  