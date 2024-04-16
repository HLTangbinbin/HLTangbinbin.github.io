<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
    <!-- 新房月销量柱状图 -->
    </div>
   
    <div class="chart-container" id="newHouseVolumeMonth"></div>
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
        newHouseArrayMonth2018: null,
        newHouseArrayMonth2019: null,
        newHouseArrayMonth2020: null,
        newHouseArrayMonth2021: null,
        newHouseArrayMonth2022: null,
        newHouseArrayMonth2023: null,
        newHouseArrayMonth2024: null
      };
    },
    mounted() {
      this.loadData();
    },

    methods: {
      loadData() {
        // 读取本地的 JSON 文件
        fetch('house.json', { cache: 'no-cache' })
          .then(response => response.json())
          .then(data => {
            console.log('请求成功新房数据:', data.houseList);
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
          var areaName = {
            JA : '江岸区',
            JH : '江汉区',
            QK : '硚口区',
            HY : '汉阳区',
            QS : '青山区',
            WC : '武昌区',
            HS : '洪山区',
            DXH : '东西湖区',
            DHGX : '东湖高新区',
            JJKF : '经济开发区',
            JX : '江夏区',
            HP : '黄陂区',
            CD : '蔡甸区',
            XZ : '新洲区',
            HN : '汉南区',
            TOTAL : '合计',
        }
          var totalData = areaName.TOTAL;
          var totalHouseArray = this.houseArrayWith(totalData);
          // 2017-2023年每月的合计数据
          this.newHouseArrayMonth2018 = this.selectMonthArr(totalHouseArray,'2018');
          this.newHouseArrayMonth2019 = this.selectMonthArr(totalHouseArray,'2019');
          this.newHouseArrayMonth2020 = this.selectMonthArr(totalHouseArray,'2020');
          this.newHouseArrayMonth2021 = this.selectMonthArr(totalHouseArray,'2021');
          this.newHouseArrayMonth2022 = this.selectMonthArr(totalHouseArray,'2022');
          this.newHouseArrayMonth2023 = this.selectMonthArr(totalHouseArray,'2023');
          this.newHouseArrayMonth2024 = this.selectMonthArr(totalHouseArray,'2024');
          //前面数据补齐-2020年前3月数据为0
          this.newHouseArrayMonth2020.unshift(0, 0, 0);
        },
        //筛选合计或者每个区域的数据
        houseArrayWith(name) {
          return this.houseList.filter( houseObj => {
              var areaStr = String()
              areaStr = houseObj.cityDistrict            
              return areaStr.search(name) != -1;
          })
        },
   
        //按照年份与日期做赛选与排序
        selectMonthArr(houseArr,year) {
          return houseArr.filter( houseObj => {
              var yearStr = String()
              //筛选不同年份数据
              yearStr = houseObj.month
              return yearStr.search(year) != -1;
          }).sort(function(a,b) {
              return a.statisticsTime > b.statisticsTime ? 1: -1;
          }).map(item => {
              //取出某个字段数据
              var hosuseNum = Number(item.houseNum)
              return hosuseNum
          })
      },
      drawCharts() {
        // 基于准备好的dom，初始化echarts实例（武汉新房月成交量柱状图）
        var newHouseVolumeBarMonthChart = echarts.init(document.getElementById('newHouseVolumeMonth'));
        // 指定图表的配置项和数据
        var newHouseVolumeBarMonthOption = {
            title: {
                text: '武汉新房月成交量',
                left: '60px'
            },
            tooltip: {},
            legend: {
                data: ['2018', '2019', '2020', '2021' ,'2022','2023','2024']
            },
            xAxis: {
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            yAxis: {},
            series: [
                {
                    name: 2018,
                    type: this.chartsType,
                    data: this.newHouseArrayMonth2018
                },
                {
                    name: 2019,
                    type: this.chartsType,
                    data: this.newHouseArrayMonth2019
                },
                {
                    name: 2020,
                    type: this.chartsType,
                    data: this.newHouseArrayMonth2020
                },
                {
                    name: 2021,
                    type: this.chartsType,
                    data: this.newHouseArrayMonth2021
                },
                {
                    name: 2022,
                    type: this.chartsType,
                    data: this.newHouseArrayMonth2022
                },
                {
                    name: 2023,
                    type: this.chartsType,
                    data: this.newHouseArrayMonth2023
                },
                {
                    name: 2024,
                    type: this.chartsType,
                    data: this.newHouseArrayMonth2024
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        newHouseVolumeBarMonthChart.setOption(newHouseVolumeBarMonthOption);
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

<style>

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
.buttons {
  display: flex;
  justify-content: center;
}
.button {
  display: flex;
  padding: 6px 6px;
  font-size: 16px;
  color: #fff;
  background-color: #ccc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 20px;
}

.is-active { 
  color: #fff;
  background-color: #0bc2d6;
}

.chart-container {
  display: flex;
  align-items:center;
  justify-content: center;
  margin-top: 20px; 
  width: 95%;
  min-width: 400px;
  height: 600px;
}
</style>