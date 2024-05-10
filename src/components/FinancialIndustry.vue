<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Currency }" @click="drawBarChart_Currency"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Currency }" @click="drawLineChart_Currency"
        style="margin-top: 50px;">折线图</button>
    </div>

    <div class="chart-container" id="currency"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_ForeignCurrency }" @click="drawBarChart_ForeignCurrency"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_ForeignCurrency }"
        @click="drawLineChart_ForeignCurrency" style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="foreigncurrency"></div>
  </div>
</template>


<script>
import * as echarts from 'echarts';
import { sortYearMonths } from './CommonUtil';
export default {

  data() {
    return {
      CurrencyType: {
        A0D0101: 'A0D0101', //  货币(M2)供应量(亿元)
        A0L0401: 'A0L0401', //  黄金储备(万盎司)
        A0L0402: 'A0L0402', //  外汇储备(亿美元)

      },
      isBarActive_Currency: false,
      isLineActive_Currency: false,
      isBarActive_ForeignCurrency: false,
      isLineActive_ForeignCurrency: false,
      currencyDataList: null,
      chartsType: null
    };
  },
  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      // 请求currency数据
      fetch('currencyData.json')
        .then(response => response.json())
        .then(data => {
          this.currencyDataList = data.financialIndustryData
          console.log('请求成功currency数据:', this.currencyDataList);
          // 处理数据绘制图表
          this.drawBarChart_Currency();
          this.drawBarChart_ForeignCurrency();

          console.log('djajdjadkjadj:', this.dataArr_Currency(this.CurrencyType.A0L0402));
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    // 按照类型与字段名称
    dataArr_Currency(type, year = '', xAxis = 0) {
      return this.currencyDataList.filter(currencyDataListObj => {
        if (year != '') {
          return currencyDataListObj.code.search(type) != -1 && currencyDataListObj.date.search(year) != -1 && currencyDataListObj.value != 0;
        }
        return currencyDataListObj.code.search(type) != -1 && currencyDataListObj.value != 0;
      }).sort(function (a, b) {
        return sortYearMonths(a.date, b.date);
      }).map(item => {
        if (xAxis == 1) {
          return Number(item.date);
        }
        return Number(item.value);
      })
    },

    // 货币供应量图表
    drawChat_Currency() {
      // 基于准备好的dom，初始化echarts实例
      var currencyChart = echarts.init(document.getElementById('currency'));
      // 指定图表的配置项和数据
      var currencyOption = {
        title: {
          text: '货币(M2)供应量(亿元)',
          left: 'center',
          top: 'top',
        },
        tooltip: {
          //X轴悬浮显示所有数据
          trigger: 'axis'
        },
        legend: {
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
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          min: '1500000'
        },
        series: [
          {
            name: '2018',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0101, '2018')
          },
          {
            name: '2019',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0101, '2019')
          },
          {
            name: '2020',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0101, '2020')
          },
          {
            name: '2021',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0101, '2021')
          },
          {
            name: '2022',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0101, '2022')
          },
          {
            name: '2023',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0101, '2023')
          },
          {
            name: '2024',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0101, '2024')
          },

        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      currencyChart.setOption(currencyOption);
    },
    // ForginCurrency图表
    drawChart_ForginCurrency() {
      // 基于准备好的dom，初始化echarts实例
      var forginCurrencyChart = echarts.init(document.getElementById('foreigncurrency'));
      // 指定图表的配置项和数据
      var forginCurrencyOption = {
        title: {
          text: '黄金和外汇储备',
          left: 'center',
          top: 'top',
        },
        tooltip: {
          //X轴悬浮显示所有数据
          trigger: 'axis'
        },
        legend: {
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
          type: 'category',
          data: this.dataArr_Currency(this.CurrencyType.A0L0402, 1)
        },
        yAxis: {

        },
        series: [
          {
            name: '黄金储备(万盎司)',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0L0401)
          },
          {
            name: '外汇储备(亿美元)',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0L0402)
          },
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      forginCurrencyChart.setOption(forginCurrencyOption);
    },

    drawBarChart_Currency() {
      this.isBarActive_Currency = true;
      this.isLineActive_Currency = false;
      // 在这里绘制柱状图
      this.chartsType = "bar"
      this.drawChat_Currency();

    },
    drawLineChart_Currency() {
      this.isBarActive_Currency = false;
      this.isLineActive_Currency = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawChat_Currency();
    },
    drawBarChart_ForeignCurrency() {
      this.isBarActive_ForeignCurrency = true;
      this.isLineActive_ForeignCurrency = false;
      // 在这里绘制柱状图
      this.chartsType = "bar"
      this.drawChart_ForginCurrency();

    },
    drawLineChart_ForeignCurrency() {
      this.isBarActive_ForeignCurrency = false;
      this.isLineActive_ForeignCurrency = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawChart_ForginCurrency();
    }
  }
};
</script>
