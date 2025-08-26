<template>
  <div class="container">
    <!-- 第一张图：合计 -->
    <div class="chart-block">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_VolumeMonth }"
          @click="drawBarChart_VolumeMonth">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_VolumeMonth }"
          @click="drawLineChart_VolumeMonth">折线图</button>
      </div>
      <div class="chart-container" id="newHouseVolumeMonth"></div>
    </div>

    <!-- 第二张图：分区域 -->
    <div class="chart-block">
      <h3 class="chart-title">武汉各区域新房月成交量</h3>
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_VolumeMonthForArea }"
          @click="drawBarChart_VolumeMonthForArea">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_VolumeMonthForArea }"
          @click="drawLineChart_VolumeMonthForArea">折线图</button>
      </div>
      <div class="chart-container-month" id="newHouseVolumeMonthForArea"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { logger } from '@/utils/Logger.js';

export default {

  data() {
    return {
      AreaName: {
        JA: '江岸区',
        JH: '江汉区',
        QK: '硚口区',
        HY: '汉阳区',
        QS: '青山区',
        WC: '武昌区',
        HS: '洪山区',
        DXH: '东西湖区',
        DHGX: '东湖高新区',
        JJKF: '经济开发区',
        JX: '江夏区',
        HP: '黄陂区',
        CD: '蔡甸区',
        XZ: '新洲区',
        HN: '汉南区',
        TOTAL: '合计',
      },
      isBarActive_VolumeMonth: false,
      isLineActive_VolumeMonth: false,
      isBarActive_VolumeMonthForArea: false,
      isLineActive_VolumeMonthForArea: false,
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
      fetch('json/whnewhouse.json')
        .then(response => response.json())
        .then(data => {
          // logger.debug('读取本地数据新房数据:', data.houseList);
          this.houseList = data.houseList;
          // 每年每月合计数据
          this.handleTotalData();
          // 处理数据绘制图表
          this.drawBarChart_VolumeMonth();
          this.drawBarChart_VolumeMonthForArea();
        })
        .catch(error => {
          logger.error('Error fetching data:', error)
        })
    },
    handleTotalData() {
      //每年每月合计数据前面数据补齐-2020年前3月数据为0
      this.selectMonthArr(this.houseArrayWith(this.AreaName.TOTAL), '2020').unshift(0, 0, 0);
    },
    // 每年每月的合计数据需要先选出合计，然后选出每月的数组数据
    //筛选合计或者每个区域的数据
    houseArrayWith(name) {
      return this.houseList.filter(houseObj => {
        var areaStr = String()
        areaStr = houseObj.cityDistrict
        //筛选合计数据 
        return areaStr.search(name) != -1;
      })
    },
    //按照年份与日期做赛选与排序
    selectMonthArr(houseArr, year = new Date().getFullYear()) {
      return houseArr.filter(houseObj => {
        //筛选年份的
        return houseObj.month.search(year) != -1;

      }).sort(function (a, b) {
        return a.statisticsTime > b.statisticsTime ? 1 : -1;
      }).map(item => {
        //取出某个字段数据
        var hosuseNum = Number(item.houseNum)
        return hosuseNum
      })
    },

    drawVolumeMonthChart() {
      // 基于准备好的dom，初始化echarts实例（武汉新房月成交量柱状图）
      var newHouseVolumeBarMonthChart = echarts.init(document.getElementById('newHouseVolumeMonth'));
      const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
      const totalData = this.houseArrayWith(this.AreaName.TOTAL);
      // 指定图表的配置项和数据
      var newHouseVolumeBarMonthOption = {
        title: {
            text: '武汉新房月成交量',
            left: 'center',
            top: '13'
        },
        tooltip: {
          //X轴悬浮显示所有数据
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          left: 'center',
          top: '10%'
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
        series: years.map(year => ({
          name: year,
          type: this.chartsType,
          data: this.selectMonthArr(totalData, String(year))
        }))
      };
      // 使用刚指定的配置项和数据显示图表。
      newHouseVolumeBarMonthChart.setOption(newHouseVolumeBarMonthOption);
    },
    drawVolumeMonthForAreaChart() {
      // 基于准备好的dom，初始化echarts实例（武汉新房月成交量柱状图）
      var newHouseVolumeBarMonthChartForArea = echarts.init(document.getElementById('newHouseVolumeMonthForArea'));
      var newHouseVolumeBarMonthOptionForArea;
      //必须加这句，否则setTimeout里无法访问到this变量，访问到的是windows
      let _this = this;
      // 指定图表的配置项和数据
      setTimeout(function () {
        // 数据集处理，先把名字插入到数据数组第一个位置中
        const areaKeys = Object.keys(_this.AreaName).filter(key => key !== 'TOTAL');
        const monthHeader = ['product', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

        const areaData = areaKeys.map(key => {
          const name = _this.AreaName[key];
          const values = _this.selectMonthArr(_this.houseArrayWith(name));
          values.unshift(name); // 插入区域名作为每行首项
          return values;
        });

        const datasetSource = [monthHeader, ...areaData];
        const areaNames = Object.values(_this.AreaName).filter(name => name !== '合计');

        const series = areaNames.map(() => ({
          type: _this.chartsType,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
        }));
        series.push({
          type: 'pie',
          id: 'pie',
          radius: '25%',
          center: ['50%', '20%'],
          emphasis: { focus: 'self' },
          label: {
            formatter: '{b}: {@一月} ({d}%)'
          },
          encode: {
            itemName: 'product',
            value: '一月',
            tooltip: '一月'
          }
        });

        newHouseVolumeBarMonthOptionForArea = {
          // title: {
          //   text: `武汉各区域${year}年新房月成交量`,
          //   left: 'center',
          //   top: 'top'
          // },
          tooltip: {
            //X轴悬浮显示所有数据
            trigger: 'axis',
            // position: ['60%', '40%']
          },
          legend: {
            type: 'scroll',
            left: 'center',
            top: '0%'
          },
          grid: {
            left: '1%',
            right: '1%',
            top: '40%',
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
            source: datasetSource
          },

          series: series
        };
        newHouseVolumeBarMonthChartForArea.on('updateAxisPointer', function (event) {
          const xAxisInfo = event.axesInfo[0];

          if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1;
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
      }, 1000),
        newHouseVolumeBarMonthOptionForArea && newHouseVolumeBarMonthChartForArea.setOption(newHouseVolumeBarMonthOptionForArea);
    },
    drawBarChart_VolumeMonth() {
      this.isBarActive_VolumeMonth = true;
      this.isLineActive_VolumeMonth = false;
      // 在这里绘制柱状图
      this.chartsType = "bar"
      this.drawVolumeMonthChart();

    },
    drawLineChart_VolumeMonth() {
      this.isBarActive_VolumeMonth = false;
      this.isLineActive_VolumeMonth = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawVolumeMonthChart();
    },
    drawBarChart_VolumeMonthForArea() {
      this.isBarActive_VolumeMonthForArea = true;
      this.isLineActive_VolumeMonthForArea = false;
      // 在这里绘制柱状图
      this.chartsType = "bar"
      this.drawVolumeMonthForAreaChart();

    },
    drawLineChart_VolumeMonthForArea() {
      this.isBarActive_VolumeMonthForArea = false;
      this.isLineActive_VolumeMonthForArea = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawVolumeMonthForAreaChart()
    }
  }
};
</script>



<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}

/* 每个图表块：一张卡片 */
.chart-block {
  width: 95%;
  max-width: 1400px;
  margin: 0 auto 60px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
}

/* 图表标题 */
.chart-title {
  text-align: center;
  font-size: 18px;
  font-weight: 700; /* 比 500 更粗，接近 canvas 渲染视觉效果 */
  color: #333;
  font-family: 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  margin: 24px 0 6px;
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
  margin-bottom: 25px;
  margin-top: 20px; /* ✅ 确保和 legend 保持间隔 */
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

.chart-container-month {
  width: 100%;
  height: 1000px;
  margin: 0 auto;
}
</style>