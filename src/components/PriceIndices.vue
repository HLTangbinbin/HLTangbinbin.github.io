<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
      </div>
     
      <div class="chart-container" id="priceIndices"></div>
    </div>
  </template>
    
    <script>
    import * as echarts from 'echarts';
    
    export default {
  
      data() {
        return {
          IndicesType : {
            CPI_101 : 'A01030101',
            PPI_701 : 'A01080701'
        
        },
          isBarActive: false,
          isLineActive: false,
          priceIndicesList: null,
          chartsType: null
        };
      },
      mounted() {
        this.loadData();
      },
  
      methods: {
        loadData() {
          // 请求priceIndices数据
          fetch('priceIndices.json')
            .then(response => response.json())
            .then(data => {
              this.priceIndicesList = data
              console.log('请求成功priceIndices数据:', this.priceIndicesList);
              // 处理数据绘制图表
              this.drawBarChart();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
        // 按照类型与字段名称
        cpiArr(type) {
          return this.priceIndicesList.cpiData.filter( priceIndicesListObj => {
                return priceIndicesListObj.code.search(type) != -1;
            }).map(item => {
                return Number(item.value);
          })
        },
        ppiArr(type) {
          return this.priceIndicesList.ppiData.filter( priceIndicesListObj => {
                return priceIndicesListObj.code.search(type) != -1;
            }).map(item => {
                return Number(item.value);
          })
        },
        // 获取时间横坐标数组数据
        axisArr(type) {
            return this.priceIndicesList.cpiData.filter(priceIndicesListObj => {
              return priceIndicesListObj.code.search(type) != -1;
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
                  text: '价格指数数据统计',
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
                      data: this.cpiArr(this.IndicesType.CPI_101)
                  },
                  {
                      name: 'PPI',
                      type: this.chartsType,
                      data: this.ppiArr(this.IndicesType.PPI_701)
                  }
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          priceIndicesChart.setOption(priceIndicesOption);
        },
       
        drawBarChart() {
          this.isBarActive = true;
          this.isLineActive = false;
          this.chartsType = "bar"
          this.drawPriceIndices();
   
        },
        drawLineChart() {
          this.isBarActive = false;
          this.isLineActive = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawPriceIndices();
        }
      }
    };
    </script>
  
  
  