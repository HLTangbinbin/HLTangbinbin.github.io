<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
    <!-- 新房月销量柱状图 -->
    </div>
   
    <div class="chart-container" id="newHouseVolumeMonth"></div>
    <div class="chart-container-area" id="newHouseVolumeMonthForArea"></div>
    
  </div>
</template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {

    data() {
      return {
        areaName : {
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
        },
        isBarActive: false,
        isLineActive: false,
        houseList: null,
        chartsType: null
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
            // 每年每月合计数据
            this.handleTotalData();
            // 处理数据绘制图表
            this.drawBarChart();
            //各个区域图表
          })
          .catch(error => {
            console.error('Error fetching data:', error)
          })
      },
        handleTotalData() {
          //每年每月合计数据前面数据补齐-2020年前3月数据为0
          this.selectMonthArr(this.houseArrayWith(this.areaName.TOTAL),'2020').unshift(0, 0, 0);
        },
        // 每年每月的合计数据需要先选出合计，然后选出每月的数组数据
        //筛选合计或者每个区域的数据
        houseArrayWith(name) {
          return this.houseList.filter( houseObj => {
              var areaStr = String()
              areaStr = houseObj.cityDistrict    
              //筛选合计数据 
              return areaStr.search(name) != -1;     
          })
        }, 
        //按照年份与日期做赛选与排序
        selectMonthArr(houseArr,year) {
          return houseArr.filter( houseObj => {
            //筛选年份的
            return houseObj.month.search(year) != -1;
              
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
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            yAxis: {},
            series: [
                {
                    name: 2018,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.TOTAL),'2018')
                },
                {
                    name: 2019,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.TOTAL),'2019')
                },
                {
                    name: 2020,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.TOTAL),'2020')
                },
                {
                    name: 2021,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.TOTAL),'2021')
                },
                {
                    name: 2022,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.TOTAL),'2022')
                },
                {
                    name: 2023,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.TOTAL),'2023')
                },
                {
                    name: 2024,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.TOTAL),'2024')
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        newHouseVolumeBarMonthChart.setOption(newHouseVolumeBarMonthOption);
      },
      drawChartsWithArea() {
        // 基于准备好的dom，初始化echarts实例（武汉新房月成交量柱状图）
        var newHouseVolumeBarMonthChartForArea = echarts.init(document.getElementById('newHouseVolumeMonthForArea'));
        // 指定图表的配置项和数据
        var newHouseVolumeBarMonthOptionForArea = {
            title: {
                text: '武汉各区域新房月成交量',
                left: 'center',
                top: 'top'
            },
            tooltip: {},
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
              data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            yAxis: {},
            series: [
                {
                    name: this.areaName.JA,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.JA),'2023')
                },
                {
                    name: this.areaName.JH,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.JH),'2023')
                },
                {
                    name: this.areaName.QK,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.QK),'2023')
                },
                {
                    name: this.areaName.HY,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.HY),'2023')
                },
                {
                    name: this.areaName.QS,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.QS),'2023')
                },
                {
                    name: this.areaName.WC,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.WC),'2023')
                },
                {
                    name: this.areaName.HS,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.HS),'2023')
                },
                {
                    name: this.areaName.DXH,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.DXH),'2023')
                },
                {
                    name: this.areaName.DHGX,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.DHGX),'2023')
                },
                {
                    name: this.areaName.JJKF,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.JJKF),'2023')
                },
                {
                    name: this.areaName.JX,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.JX),'2023')
                },
                {
                    name: this.areaName.HP,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.HP),'2023')
                },
                {
                    name: this.areaName.CD,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.CD),'2023')
                },
                {
                    name: this.areaName.XZ,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.XZ),'2023')
                },
                {
                    name: this.areaName.HN,
                    type: this.chartsType,
                    data: this.selectMonthArr(this.houseArrayWith(this.areaName.HN),'2023')
                }
              
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        newHouseVolumeBarMonthChartForArea.setOption(newHouseVolumeBarMonthOptionForArea);
      },
      drawBarChart() {
        this.isBarActive = true;
        this.isLineActive = false;
        this.chartsType = "bar"
        this.drawCharts();
        this.drawChartsWithArea();
 
      },
      drawLineChart() {
        this.isBarActive = false;
        this.isLineActive = true;
        // 在这里绘制折线图
        this.chartsType = "line"
        this.drawCharts();
        this.drawChartsWithArea();
      }
    }
  };
  </script>

<style>

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
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
  margin-top: 30px; 
  width: 95%;
  height: 600px;
}
.chart-container-area {
  display: flex;
  align-items:center;
  justify-content: center;
  margin-top: 30px; 
  width: 95%;
  height: 600px;
}
</style>