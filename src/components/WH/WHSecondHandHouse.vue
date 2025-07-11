<template>
  <div class="container">
    <!-- 第一张图：合计 -->
    <div class="chart-block">
      <h3 class="chart-title">武汉二手房月成交量</h3>
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive }"
          @click="drawBarChart">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive }"
          @click="drawLineChart">折线图</button>
      </div>
      <div class="chart-container" id="oldHouseVolumeMonth"></div>
    </div>
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
        fetch('json/whhouseTradingInfo.json')
          .then(response => response.json())
          .then(data => {
            // console.log('读取本地数据二手房数据:', data.houseList);
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
            // title: {
            //     text: '武汉二手房月成交量',
            //     left: 'center',
            //     top: 'top'
            // },
            tooltip: {
               //X轴悬浮显示所有数据
               trigger: 'axis'
            },
            legend: {
                left: 'center',
                top: '5%'
            },
            grid: {
                left: '1%',
                right: '1%',
                top: '20%',
                bottom: '1%',
                containLabel: true
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


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

/* 每个图表块：一张卡片 */
.chart-block {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 图表标题 */
.chart-title {
  text-align: center;
  font-size: 18px;
  font-weight: 700; /* 比 500 更粗，接近 canvas 渲染视觉效果 */
  color: #333;
  font-family: 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  margin: 0px 0 12px;
  line-height: 1.4;
}

/* 图表副标题 */
.chart-subtitle {
  text-align: center;
  font-size: 14px;
  color: #666;
  white-space: pre-line;
  margin-bottom: 16px;
}

/* 图表切换按钮 */
.buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  margin-top: 8px; /* ✅ 确保和 legend 保持间隔 */
}

.button {
    padding: 6px 12px;
    font-size: 13px;
    border-radius: 10px;
    background-color: #ccc;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 10px;
}

.button.is-active {
  background-color: #0bc2d6;
}

/* 图表 DOM 容器 */
.chart-container {
  width: 100%;
  height: 600px;
  margin: 0 auto;
}

</style>