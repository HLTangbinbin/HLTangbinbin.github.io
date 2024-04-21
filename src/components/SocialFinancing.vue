<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive }" @click="drawBarChart">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive }" @click="drawLineChart">折线图</button>
    </div>
   
    <div class="chart-container" id="socialFinancingMonth"></div>
  </div>
</template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {

    data() {
      return {
        isBarActive: false,
        isLineActive: false,
        currencyInfoList: null,
        chartsType: null
      };
    },
    mounted() {
      this.loadData();
    },

    methods: {
      loadData() {
        // 读取本地的 JSON 文件
        fetch('currencyInfo.json')
          .then(response => response.json())
          .then(data => {
            console.log('请求成功金融数据:', data.currencyInfoList);
            this.currencyInfoList = data.currencyInfoList;
            // 处理数据绘制图表
            this.drawBarChart();
          })
          .catch(error => {
            console.error('Error fetching data:', error)
          })
      },
        //按照年份与日期做筛选与排序
        afreAndCurrencylArr(year) {
          return this.currencyInfoList.filter( afreAndCurrencyObj => {
              var yearStr = String()
              yearStr = afreAndCurrencyObj.itemDate
              return yearStr.search(year) != -1;
          }).sort(function(a,b) {
              return a.itemDate > b.itemDate ? 1: -1;
          }).map(item => {
              //取出某个字段数据
              var afre = Number(item.afre)
              return afre;
          })
        },

      drawCharts() {
        // 基于准备好的dom，初始化echarts实例
        var afreLineMonthChart = echarts.init(document.getElementById('socialFinancingMonth'));
        // 指定图表的配置项和数据
        var afreLineMonthOption = {
            title: {
                text: '社会融资增量',
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
                // {
                //     name: 2014,
                //     type: this.chartsType,
                //     data: this.afreAndCurrencylArr(2014)
                // },
                // {
                //     name: 2015,
                //     type: this.chartsType,
                //     data: this.afreAndCurrencylArr(2015)
                // },
                // {
                //     name: 2016,
                //     type: this.chartsType,
                //     data: this.afreAndCurrencylArr(2016)
                // },
                // {
                //     name: 2017,
                //     type: this.chartsType,
                //     data: this.afreAndCurrencylArr(2017)
                // },
                // {
                //     name: 2018,
                //     type: this.chartsType,
                //     data: this.afreAndCurrencylArr(2018)
                // },
                {
                    name: 2019,
                    type: this.chartsType,
                    data: this.afreAndCurrencylArr(2019)
                },
                {
                    name: 2020,
                    type: this.chartsType,
                    data: this.afreAndCurrencylArr(2020)
                },
                {
                    name: 2021,
                    type: this.chartsType,
                    data: this.afreAndCurrencylArr(2015)
                },
                {
                    name: 2015,
                    type: this.chartsType,
                    data: this.afreAndCurrencylArr(2021)
                },
                {
                    name: 2022,
                    type: this.chartsType,
                    data: this.afreAndCurrencylArr(2022)
                },
                {
                    name: 2023,
                    type: this.chartsType,
                    data: this.afreAndCurrencylArr(2023)
                },
                {
                    name: 2024,
                    type: this.chartsType,
                    data: this.afreAndCurrencylArr(2024)
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        afreLineMonthChart.setOption(afreLineMonthOption);
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


