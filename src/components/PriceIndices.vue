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
            CPI : 'A01030101',
            PPI : 'A01080701'
        
        },
          isBarActive: false,
          isLineActive: false,
          cpiList: null,
          ppiList: null,
          chartsType: null
        };
      },
      mounted() {
        this.loadData();
      },
  
      methods: {
        loadData() {
          // 请求cpi数据
          fetch('cpi.json')
            .then(response => response.json())
            .then(data => {
              console.log('请求成功cpi数据:', data.returndata.datanodes);
              // 数组倒序处理
              this.cpiList = data.returndata.datanodes.reverse();
              // 处理数据绘制图表
              this.drawBarChart();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            }),
          // 请求ppi公开数据
          fetch('ppi.json')
            .then(response => response.json())
            .then(data => {
              console.log('请求成功ppi数据:', data.returndata.datanodes);
              this.ppiList = data.returndata.datanodes.reverse();
              // 处理数据绘制图表
              this.drawBarChart();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
        // 按照类型与字段名称
        indicesArr(type) {
            if (type == this.IndicesType.CPI) {
                return this.cpiList.filter( cpiListObj => {
                    return cpiListObj.code.search(type) != -1;
                }).map(item => {
                    return Number(item.data.data)
                })
            }else if (type == this.IndicesType.PPI) {
                return this.ppiList.filter( cpiListObj => {
                    return cpiListObj.code.search(type) != -1;
                }).map(item => {
                    return Number(item.data.data)
                })
            }

          },
        // 获取时间横坐标数组数据
        axisArr(type) {
            return this.ppiList.filter(ppiListObj => {
              return ppiListObj.code.search(type) != -1;
          }).map(item => {
                var wdsDic = item.wds;
                return Number(wdsDic[1].valuecode);
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
                  data: this.axisArr(this.IndicesType.PPI)
              },
              yAxis: {
                min: '99',
                max: '101'
              },
              series: [
                  {
                      name: 'CPI',
                      type: this.chartsType,
                      data: this.indicesArr(this.IndicesType.CPI)
                  },
                  {
                      name: 'PPI',
                      type: this.chartsType,
                      data: this.indicesArr(this.IndicesType.PPI)
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
  
  
  