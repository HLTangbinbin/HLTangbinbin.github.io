<template>
  <div class="container">
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_Finance }" @click="drawBarChart_Finance"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_Finance }" @click="drawLineChart_Finance"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="finance"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_FiscalRevenue }" @click="drawBarChart_FiscalRevenue"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_FiscalRevenue }" @click="drawLineChart_FiscalRevenue"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="fiscalrevenue"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_FiscalExpenditure }"
        @click="drawBarChart_FiscalExpenditure" style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_FiscalExpenditure }"
        @click="drawLineChart_FiscalExpenditure" style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="fiscalexpenditure "></div>

  </div>
</template>

<script>
import * as echarts from 'echarts';
import { sortYearMonths } from './CommonUtil';
export default {

  data() {
    return {
      NationalFinance: {
        A080201: 'A080201',        // 全国财政收入
        A080202: 'A080202',        // 中央财政收入
        A080203: 'A080203',        // 地方财政收入
        A080301: 'A080301',        // 全国财政收入
        A080302: 'A080302',        // 中央财政收入
        A080303: 'A080303',        // 地方财政收入

        A08040102: 'A08040102',    // 国家税收收入
        A08040103: 'A08040103',    // 国内增值税
        A08040104: 'A08040104',    // 国内消费税
        A08040108: 'A08040108',    // 企业所得税
        A08040109: 'A08040109',    // 个人所得税
        A0804010G: 'A0804010G',    // 国家土地增值税
        A0804010K: 'A0804010K',    // 关税
        A0804010S: 'A0804010S',    // 国家罚没收入

        A08050102: 'A08050102',    // 一般公共服务支出
        A08050105: 'A08050105',    // 国防支出
        A08050106: 'A08050106',    // 公共安全支出
        A08050108: 'A08050108',    // 教育支出
        A08050109: 'A08050109',    // 科学技术支出
        A0805010B: 'A0805010B',    // 社会保障和就业支出
        A0805010C: 'A0805010C',    // 医疗卫生支出
        A0805010G: 'A0805010G',    // 交通运输支出

      },

      isBarActive_Finance: false,
      isLineActive_Finance: false,
      isBarActive_FiscalRevenue: false,
      isLineActive_FiscalRevenue: false,
      isBarActive_FiscalExpenditure: false,
      isLineActive_FiscalExpenditure: false,
      returnData: null,
      chartsType: null
    };
  },
  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      // 请求人民收入公开数据
      fetch('nationalFinance.json')
        .then(response => response.json())
        .then(data => {
          console.log('请求成功：财政收入与支出数据:', data);
          // 列表数据
          this.returnData = data;
          // 处理数据绘制图表
          this.drawBarChart_Finance()
          this.drawBarChart_FiscalRevenue()
          this.drawBarChart_FiscalExpenditure()
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    //按照年份与日期做筛选与排序
    nationalFinanceArr(type) {
      return this.returnData.dataList.filter(returnDataObj => {
        return returnDataObj.code.search(type) != -1 && returnDataObj.value != 0;
      }).sort(function (a, b) {
        return sortYearMonths(a.date, b.date);
      }).map(item => {
        return Number(item.value);
      })
    },
    // 国家财政收支图表
    drawFinanceCharts() {
      // 基于准备好的dom，初始化echarts实例
      var financeChart = echarts.init(document.getElementById('finance'));
      // 指定图表的配置项和数据
      var financeOption = {
        title: {
          text: '中央与地方财政收支',
          left: 'center',
          top: 'top'
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
          top: '30%',
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
            name: '全国财政收入(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A080201)
          },
          {
            name: '中央财政收入(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A080202)
          },
          {
            name: '地方财政收入(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A080203)
          },
          {
            name: '全国财政支出(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A080301)
          },
          {
            name: '中央财政支出(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A080302)
          },
          {
            name: '地方财政支出(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A080303)
          },

        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      financeChart.setOption(financeOption);
    },

    // 财政支出
    drawFiscalRevenueCharts() {
      // 基于准备好的dom，初始化echarts实例
      var fiscalRevenueChart = echarts.init(document.getElementById('fiscalrevenue'));
      // 指定图表的配置项和数据
      var fiscalRevenueOption = {
        title: {
          text: '国家财政主要收入项目',
          left: 'center',
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
          top: '30%',
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
            name: '增值税(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08040103)
          },
          {
            name: '消费税(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08040104)
          },
          {
            name: '企业所得税(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08040108)
          },
          {
            name: '个人所得税(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08040109)
          },
          {
            name: '土地增值税(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A0804010G)
          },
          {
            name: '关税(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A0804010K)
          },
          {
            name: '罚没收入(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A0804010S)
          },

        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      fiscalRevenueChart.setOption(fiscalRevenueOption);
    },
    // 基尼系数图表
    drawFiscalExpenditureCharts() {
      // 基于准备好的dom，初始化echarts实例
      var fiscalExpenditureChart = echarts.init(document.getElementById('fiscalexpenditure '));
      // 指定图表的配置项和数据
      var fiscalExpenditureOption = {
        title: {
          text: '国家财政主要支出项目',
          left: 'center'
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
          top: '30%',
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
            name: '一般公共服务(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08050102)
          },
          {
            name: '国防(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08050105)
          },
          {
            name: '公共安全(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08050106)
          },
          {
            name: '教育(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08050108)
          },
          {
            name: '科学技术(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A08050109)
          },
          {
            name: '社会保障和就业(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A0805010B)
          },
          {
            name: '医疗卫生(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A0805010C)
          },
          {
            name: '交通运输(亿元)',
            type: this.chartsType,
            data: this.nationalFinanceArr(this.NationalFinance.A0805010G)
          },
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      fiscalExpenditureChart.setOption(fiscalExpenditureOption);
    },
    drawBarChart_Finance() {
      this.isBarActive_Finance = true;
      this.isLineActive_Finance = false;
      this.chartsType = "bar"
      this.drawFinanceCharts()

    },
    drawLineChart_Finance() {
      this.isBarActive_Finance = false;
      this.isLineActive_Finance = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawFinanceCharts()
    },
    drawBarChart_FiscalRevenue() {
      this.isBarActive_FiscalRevenue = true;
      this.isLineActive_FiscalRevenue = false;
      this.chartsType = "bar"
      this.drawFiscalRevenueCharts()

    },
    drawLineChart_FiscalRevenue() {
      this.isBarActive_FiscalRevenue = false;
      this.isLineActive_FiscalRevenue = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawFiscalRevenueCharts()
    },
    drawBarChart_FiscalExpenditure() {
      this.isBarActive_FiscalExpenditure = true;
      this.isLineActive_FiscalExpenditure = false;
      this.chartsType = "bar"
      this.drawFiscalExpenditureCharts()

    },
    drawLineChart_FiscalExpenditure() {
      this.isBarActive_FiscalExpenditure = false;
      this.isLineActive_FiscalExpenditure = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawFiscalExpenditureCharts()
    }

  }
};
</script>