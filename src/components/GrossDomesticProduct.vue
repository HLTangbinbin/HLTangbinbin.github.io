<template>
  <div class="container">
    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_GDP_HG }" @click="drawBarChart_GDP_HG"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_GDP_HG }" @click="drawLineChart_GDP_HG"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="gdp_hg"></div>

    <!-- 为下方的按钮添加上边距 style="margin-top -->
    <div class="buttons">
      <button class="button" :class="{ 'is-active': isBarActive_GDP_CS }" @click="drawBarChart_GDP_CS"
        style="margin-top: 50px;">柱状图</button>
      <button class="button" :class="{ 'is-active': isLineActive_GDP_CS }" @click="drawLineChart_GDP_CS"
        style="margin-top: 50px;">折线图</button>
    </div>
    <div class="chart-container" id="gdp_cs"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { sortYearMonths } from './CommonUtil';

export default {

  data() {
    return {
      GDP_Type: {
        A020102: 'A020102',     //  国内生产总值
        A020103: 'A020103',     //  第一产业增加值
        A020104: 'A020104',     //  第二产业增加值
        A020105: 'A020105',     //  第三产业增加值
        A0101: 'A0101',         //  地区生产总值

      },
      CityCode: {
        BJ: '110000', //   北京
        SH: '310000', //   上海
        GZ: '440100', //   广州
        SZ: '440300', //   深圳
        HZ: '330100', //   杭州
        CD: '510100', //   成都
        WH: '420100', //   武汉
        NJ: '320100', //   南京
        CQ: '500000', //   重庆
        XA: '610100', //   西安
        ZZ: '410100', //   郑州
        HF: '340100', //   合肥
        YC: '420500', //   宜昌
      },
      Dbcode: {
        hgnd: 'hgnd', //   国家年度数据
        csnd: 'csnd', //   城市年度数据


      },
      isBarActive_GDP_HG: false,
      isLineActive_GDP_HG: false,
      isBarActive_GDP_CS: false,
      isLineActive_GDP_CS: false,
      dataListHG: null,
      dataListCS: null,
      chartsType: null
    };
  },
  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      // 读取本地的 JSON 文件
      fetch('gdpData.json')
        .then(response => response.json())
        .then(data => {
          console.log('请求成功GDP数据:', data);
          console.log('请adda数据:', data.sj);
          this.returnData = data;
          // 处理数据绘制图表
          this.drawBarChart_GDP_HG();
          this.drawBarChart_GDP_CS();
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    // 国内生产总值
    dataArr_GDP_HG(gdpType) {
      return this.returnData.dataListHG.filter(dataListHGObj => {
        return dataListHGObj.code.search(gdpType) != -1 && dataListHGObj.value != 0;
      }).sort(function (a, b) {
        return sortYearMonths(a.date, b.date);
      }).map(item => {
        // 筛选纵坐标：value
        return Number(item.value);
      })
    },
    // 地区生产总值
    dataArr_GDP_CS(cityCode) {
      return this.returnData.dataListCS.filter(dataListCSObj => {
        return dataListCSObj.code.search(this.GDP_Type.A0101) != -1 && dataListCSObj.cityCode.search(cityCode) != -1 && dataListCSObj.value != 0;
      }).sort(function (a, b) {
        return sortYearMonths(a.date, b.date);
      }).map(item => {
        // 筛选纵坐标：value
        return Number(item.value);
      })
    },

    drawChart_GDP_HG() {
      // 基于准备好的dom，初始化echarts实例
      var gdphgChart = echarts.init(document.getElementById('gdp_hg'));
      // 指定图表的配置项和数据
      var gdphgOption = {
        title: {
          text: '国民经济核算',
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
          top: '25%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          data: this.returnData.sj[0].sort()
        },
        yAxis: {},
        series: [
          {
            name: '国内生产总值(亿元)',
            type: this.chartsType,
            data: this.dataArr_GDP_HG(this.GDP_Type.A020102)
          },
          {
            name: '第一产业增加值(亿元)',
            type: this.chartsType,
            data: this.dataArr_GDP_HG(this.GDP_Type.A020103)
          },
          {
            name: '第二产业增加值(亿元)',
            type: this.chartsType,
            data: this.dataArr_GDP_HG(this.GDP_Type.A020104)
          },
          {
            name: '第三产业增加值(亿元)',
            type: this.chartsType,
            data: this.dataArr_GDP_HG(this.GDP_Type.A020105)
          },

        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      gdphgChart.setOption(gdphgOption);
    },
    // 地区生产总值
    drawChart_GDP_CS() {
      // 基于准备好的dom，初始化echarts实例
      var gdpcsChart = echarts.init(document.getElementById('gdp_cs'));
      // 指定图表的配置项和数据
      var gdpcsOption = {
        title: {
          text: '地区生产总值（当年价格）',
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
          data: this.returnData.sj[0].sort()
        },
        yAxis: {

        },
        series: [
          {
            name: '北京',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.BJ)
          },
          {
            name: '上海',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.SH)
          },
          {
            name: '广州',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.GZ)
          },
          {
            name: '深圳',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.SZ)
          },
          {
            name: '杭州',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.HZ)
          },
          {
            name: '成都',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.CD)
          },
          {
            name: '武汉',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.WH)
          },
          {
            name: '南京',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.NJ)
          },
          {
            name: '重庆',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.CQ)
          },
          {
            name: '西安',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.XA)
          },
          {
            name: '合肥',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.HF)
          },
          {
            name: '郑州',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.ZZ)
          },
          {
            name: '宜昌',
            type: this.chartsType,
            data: this.dataArr_GDP_CS(this.CityCode.YC)
          },

        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      gdpcsChart.setOption(gdpcsOption);
    },
    drawBarChart_GDP_HG() {
      this.isBarActive_GDP_HG = true;
      this.isLineActive_GDP_HG = false;
      // 在这里绘制柱状图
      this.chartsType = "bar"
      this.drawChart_GDP_HG()

    },
    drawLineChart_GDP_HG() {
      this.isBarActive_GDP_HG = false;
      this.isLineActive_GDP_HG = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawChart_GDP_HG()
    },
    drawBarChart_GDP_CS() {
      this.isBarActive_GDP_CS = true;
      this.isLineActive_GDP_CS = false;
      // 在这里绘制柱状图
      this.chartsType = "bar"
      this.drawChart_GDP_CS()

    },
    drawLineChart_GDP_CS() {
      this.isBarActive_GDP_CS = false;
      this.isLineActive_GDP_CS = true;
      // 在这里绘制折线图
      this.chartsType = "line"
      this.drawChart_GDP_CS()
    }
  }
};
</script>
