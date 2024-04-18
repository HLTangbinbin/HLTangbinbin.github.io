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
        var newHouseVolumeBarMonthOptionForArea;
        //必须加这句，否则setTimeout里无法访问到this变量，访问到的是windows
        let _this = this;
        // 指定图表的配置项和数据
        setTimeout(function () {
          // 数据集处理，先把名字插入到数据数组第一个位置中
          var arr_JA = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.JA),'2023');
          arr_JA.unshift(_this.areaName.JA);
          var arr_JH = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.JH),'2023');
          arr_JH.unshift(_this.areaName.JH);
          var arr_QK = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.QK),'2023');
          arr_QK.unshift(_this.areaName.QK);
          var arr_HY = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.HY),'2023');
          arr_HY.unshift(_this.areaName.HY);
          var arr_QS = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.QS),'2023');
          arr_QS.unshift(_this.areaName.QS);
          var arr_WC = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.WC),'2023');
          arr_WC.unshift(_this.areaName.WC);
          var arr_HS = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.HS),'2023');
          arr_HS.unshift(_this.areaName.HS);
          var arr_DXH = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.DXH),'2023');
          arr_DXH.unshift(_this.areaName.DXH);
          var arr_DHGX = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.DHGX),'2023');
          arr_DHGX.unshift(_this.areaName.DHGX);
          var arr_JJKF = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.JJKF),'2023');
          arr_JJKF.unshift(_this.areaName.JJKF);
          var arr_JX = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.JX),'2023');
          arr_JX.unshift(_this.areaName.JX);
          var arr_HP = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.HP),'2023');
          arr_HP.unshift(_this.areaName.HP);
          var arr_CD = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.CD),'2023');
          arr_CD.unshift(_this.areaName.CD);
          var arr_XZ = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.XZ),'2023');
          arr_XZ.unshift(_this.areaName.XZ);
          var arr_HN = _this.selectMonthArr(_this.houseArrayWith(_this.areaName.HN),'2023');
          arr_HN.unshift(_this.areaName.HN);

          newHouseVolumeBarMonthOptionForArea = {
            title: {
                text: '武汉各区域新房月成交量',
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
                top: '50%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: {
              type: 'category'
            },
            yAxis: {},
            // 多图共享数据集
            dataset: {
              // 提供一份数据。
              source: [
                // 第一行默认是x轴的数据
                ['product', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                // 下面是y轴的数据
                [arr_JA],
                [arr_JH],
                [arr_QK],
                [arr_HY],
                [arr_QS],
                [arr_WC],
                [arr_HS],
                [arr_DXH],
                [arr_DHGX],
                [arr_JJKF],
                [arr_JX],
                [arr_HP],
                [arr_CD],
                [arr_XZ],
                [arr_HN]

              ]
            },
            series: [
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                    type: _this.chartsType,
                    emphasis: { focus: 'series' }
                },
                {
                  type: 'pie',
                  id: 'pie',
                  radius: '40%',
                  center: ['50%', '40%'],
                  emphasis: {
                    focus: 'self'
                  },
                  label: {
                    formatter: '{b}: {@一月} ({d}%)'
                  },

                  encode: {
                    itemName: 'product',
                    value: '一月',
                    tooltip: '一月'
                  }
                }
              
            ]
          };
          newHouseVolumeBarMonthChartForArea.on('updateAxisPointer', function (event) {
            const xAxisInfo = event.axesInfo[0];
            
            if (xAxisInfo) {
              const dimension = xAxisInfo.value + 1;
              console.log('区域是',dimension);
              newHouseVolumeBarMonthChartForArea.setOption({
                series: {
                  id: 'pie',
                  label: {
                    formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                  },
                  encode: {
                    value: dimension,
                    tooltip: dimension
                  }
                }
              });
            }
          });
           // 使用刚指定的配置项和数据显示图表。
          newHouseVolumeBarMonthChartForArea.setOption(newHouseVolumeBarMonthOptionForArea);
        },1000),
        newHouseVolumeBarMonthOptionForArea && newHouseVolumeBarMonthChartForArea.setOption(newHouseVolumeBarMonthOptionForArea);
      },
      drawBarChart() {
        this.isBarActive = true;
        this.isLineActive = false;
        this.chartsType = "line"
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