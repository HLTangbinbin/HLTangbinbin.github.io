<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Currency_Month }" @click="drawBarChart_Currency_Month"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Currency_Month }" @click="drawLineChart_Currency_Month"
        style="margin-top: 50px;">折线图</button>
    </div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="chart-container" id="currency-month"></div>
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
import { params_financialIndustry,sendRequest , sortYearMonths } from './CommonUtil';
export default {

  data() {
    return {
      CurrencyType: {
        // 年度
        A0L0301: 'A0L0301', //  货币(M2)供应量(亿元)
        A0L0302: 'A0L0302', //  货币(M1)供应量(亿元)
        A0L0303: 'A0L0303', //  货币(M0)供应量(亿元)
        // 月度
        A0D0101: 'A0D0101', //  货币(M2)供应量(亿元)
        A0D0103: 'A0D0103', //  货币(M1)供应量(亿元)     
        A0D0105: 'A0D0105', //  货币(M0)供应量(亿元)             

        A0L0401: 'A0L0401', //  黄金储备(万盎司)
        A0L0402: 'A0L0402', //  外汇储备(亿美元)

      },
      isBarActive_Currency_Month: false,
      isLineActive_Currency_Month: false,
      isBarActive_Currency: false,
      isLineActive_Currency: false,
      isBarActive_ForeignCurrency: false,
      isLineActive_ForeignCurrency: false,
      returnData: null,
      chartsType: null
    };
  },
  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      // 请求currency数据
      // fetch('financialIndustry.json')
      //   .then(response => response.json())
      //   .then(data => {
      //     this.returnData = data
      //     console.log('请求成功currency数据:', this.returnData);
      //     // 处理数据绘制图表
      //     this.drawBarChart_Currency_Month();
      //     this.drawBarChart_Currency();
      //     this.drawBarChart_ForeignCurrency();
      //   })
      //   .catch(error => {
      //     console.error('Error fetching data:', error)
      //   })
      try {
        this.returnData = await sendRequest(params_financialIndustry);
        console.log("响应处理后的数据：", this.returnData)
        if (this.returnData) {
          // 处理数据绘制图表
          this.drawBarChart_Currency_Month();
          this.drawBarChart_Currency();
          this.drawBarChart_ForeignCurrency();
        }
      } catch (error) {
        console.error('接口外部调用失败:', error);
      }
    },
    // 按照类型与字段名称
    dataArr_Currency(type, year = '') {
      return this.returnData.dataList.filter(returnDataObj => {
        if (year != '') {
          return returnDataObj.code.search(type) != -1 && returnDataObj.date.search(year) != -1 && returnDataObj.value != 0;
        }
        return returnDataObj.code.search(type) != -1 && returnDataObj.value != 0;
      }).sort(function (a, b) {
        return sortYearMonths(a.date, b.date);
      }).map(item => {
        return Number(item.value);
      })
    },
    // 货币供应量图表-月度
    drawChat_Currency_Month() {
      // 基于准备好的dom，初始化echarts实例
      var currencyChart = echarts.init(document.getElementById('currency-month'));
      // 指定图表的配置项和数据
      var currencyOption = {
        title: {
          text: '货币供应量M2(亿元)',
          left: 'center',
          top: 'top',
        },
        tooltip: {
          //X轴悬浮显示所有数据
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          top: '20%'
        },
        grid: {
          left: '1%',
          right: '1%',
          top: '35%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.returnData.sj[1].sort()
        },
        yAxis: {

        },
        series: [
          {
            name: 'M0',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0105)
          },
          {
            name: 'M1',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0103)
          },
          {
            name: 'M2',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0D0101)
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      currencyChart.setOption(currencyOption);
    },
    // 货币供应量图表-年度
    drawChat_Currency() {
      // 基于准备好的dom，初始化echarts实例
      var currencyChart = echarts.init(document.getElementById('currency'));
      // 指定图表的配置项和数据
      var currencyOption = {
        title: {
          text: '货币供应量(亿元)',
          left: 'center',
          top: 'top',
          subtext: 'M0：流通中的现金; \n M1：M0+企业活期存款; \n M2：M1+企业单位定期存款+城乡居民储蓄存款;',
          subtextStyle: {
            fontWeight: 'bold',
            fontSize: 13,
            lineHeight: 20,
          }
        },
        tooltip: {
          //X轴悬浮显示所有数据
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          top: '20%'
        },
        grid: {
          left: '1%',
          right: '1%',
          top: '35%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.returnData.sj[0].sort()
        },
        yAxis: {

        },
        series: [
          {
            name: 'M0',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0L0303)
          },
          {
            name: 'M1',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0L0302)
          },
          {
            name: 'M2',
            type: this.chartsType,
            data: this.dataArr_Currency(this.CurrencyType.A0L0301)
          }
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
          top: '25%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.returnData.sj[1].sort()
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
    drawBarChart_Currency_Month() {
      this.isBarActive_Currency_Month = true;
      this.isLineActive_Currency_Month = false;
      // 在这里绘制柱状图
      this.chartsType = "bar"
      this.drawChat_Currency_Month();

    },
    drawLineChart_Currency_Month() {
      this.isBarActive_Currency_Month = false;
      this.isLineActive_Currency_Month = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawChat_Currency_Month();
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
