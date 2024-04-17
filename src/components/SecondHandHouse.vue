<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
    </div>
   
    <div class="chart-container" id="oldHouseVolumeMonth"></div>
  </div>
</template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {

    data() {
      return {
        isBarActive: false,
        isLineActive: false,
        houseList: null,
        chartsType: null,
        oldHouseArrayYear2019: null,
        oldHouseArrayYear2020: null,
        oldHouseArrayYear2021: null,
        oldHouseArrayYear2022: null,
        oldHouseArrayMonth2019: null,
        oldHouseArrayMonth2020: null,
        oldHouseArrayMonth2021: null,
        oldHouseArrayMonth2022: null
      };
    },
    mounted() {
      this.loadData();
    },

    methods: {
      loadData() {
        // 读取本地的 JSON 文件
        fetch('houseTradingInfo.json', { cache: 'no-cache' })
          .then(response => response.json())
          .then(data => {
            console.log('请求成功二手房数据:', data.houseList);
            this.houseList = data.houseList;
            this.handleData();
            // 处理数据绘制图表
            this.drawBarChart();
          })
          .catch(error => {
            console.error('Error fetching data:', error)
          })
      },
        handleData() {
          // 2019-2022年二手房月成交累计数据
          this.oldHouseArrayYear2019 = this.oldHouseTotalArr('oldHouseVolume','2019')
          this.oldHouseArrayYear2020 = this.oldHouseTotalArr('oldHouseVolume','2020')
          this.oldHouseArrayYear2021 = this.oldHouseTotalArr('oldHouseVolume','2021')
          this.oldHouseArrayYear2022 = this.oldHouseTotalArr('oldHouseVolume','2022')
          console.log('2022年二手房年成交数组 %o ',this.oldHouseArrayYear2022)
          // 2019-2022年二手房月成交数据
          this.oldHouseArrayMonth2019 = this.oldSelectMonthArr(this.oldHouseArrayYear2019)
          this.oldHouseArrayMonth2020 = this.oldSelectMonthArr(this.oldHouseArrayYear2020)
          this.oldHouseArrayMonth2021 = this.oldSelectMonthArr(this.oldHouseArrayYear2021)
          this.oldHouseArrayMonth2022 = this.oldSelectMonthArr(this.oldHouseArrayYear2022)

          //补全数据处理
          this.oldHouseArrayMonth2020.unshift(0, 0, this.oldHouseArrayYear2020[0])
          this.oldHouseArrayMonth2021.unshift(0, this.oldHouseArrayYear2021[0])
          this.oldHouseArrayMonth2022.unshift(0, this.oldHouseArrayYear2022[0])
          console.log('2022年二手房月成交数组 %o ',this.oldHouseArrayMonth2022)
          //前面数据补齐-2020年前3月数据为0
          this.oldHouseArrayMonth2020.unshift(0, 0, 0);
        },
        //按照年份与日期做筛选与排序
        oldHouseTotalArr(houseType, year) {
          var inventory = Number();
          return this.houseList.filter( houseObj => {
              var yearStr = String()
              yearStr = houseObj.tradingDate
              return yearStr.search(year) != -1;
          }).sort(function(a,b) {
              return a.statisticalTime > b.statisticalTime ? 1: -1;
          }).map(item => {
              if (houseType == 'oldHouseVolume') {
                  var volume = Number(item.oldHouseVolume)
                  return volume
              }else if (houseType == 'newHouseVolume') {
                  inventory = Number(item.newHouseVolume)
                  return inventory
              }else if (houseType == 'newHouseInventory'){
                  inventory = Number(item.newHouseInventory)
                  return inventory
              }
              
          })
        },
        oldSelectMonthArr(arr) {
                var tempArr = Array()
                for(let i in arr) {
                    if (i>0) {
                        var currenthMonth = (arr[i])-(arr[i-1])
                        tempArr.push(currenthMonth)
                    }
                }
                return tempArr
        },
          

      drawCharts() {
        // 基于准备好的dom，初始化echarts实例（武汉新房月成交量柱状图）
        var oldHouseVolumeBarMonthChart = echarts.init(document.getElementById('oldHouseVolumeMonth'));
        // 指定图表的配置项和数据
        var oldHouseVolumeBarMonthOption = {
            title: {
                text: '武汉二手房月成交量',
                left: 'center',
                top: 'top'
            },
            tooltip: {},
            legend: {
                left: 'center',
                top: '30px'
            },
            xAxis: {
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            yAxis: {},
            series: [
                {
                    name: 2019,
                    type: this.chartsType,
                    data: this.oldHouseArrayMonth2019
                },
                {
                    name: 2020,
                    type: this.chartsType,
                    data: this.oldHouseArrayMonth2020
                },
                {
                    name: 2021,
                    type: this.chartsType,
                    data: this.oldHouseArrayMonth2021
                },
                {
                    name: 2022,
                    type: this.chartsType,
                    data: this.oldHouseArrayMonth2022
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        oldHouseVolumeBarMonthChart.setOption(oldHouseVolumeBarMonthOption);
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


