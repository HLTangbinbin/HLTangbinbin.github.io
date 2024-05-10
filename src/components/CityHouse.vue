<template>
    <div class="container">
      <!-- 为下方的按钮添加上边距 style="margin-top -->
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_HousePrice }" @click="drawBarChart_HousePrice" style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_HousePrice }" @click="drawLineChart_HousePrice" style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="cityHousePrice"></div>
      <!-- 为下方的按钮添加上边距 style="margin-top -->
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_NewHouse }" @click="drawBarChart_NewHouse" style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_NewHouse }" @click="drawLineChart_NewHouse" style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="cityHouseNew"></div>

       <!-- 为下方的按钮添加上边距 style="margin-top -->
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_OldHouse }" @click="drawBarChart_OldHouse" style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_OldHouse }" @click="drawLineChart_OldHouse" style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="cityHouseOld"></div>
    </div>
  </template>
    
    <script>
    import * as echarts from 'echarts';
    import { sortYearMonths } from './CommonUtil';
    export default {
  
      data() {
        return {
          CityHouse_Type : {
            A030C : 'A030C',     //   住宅商品房平均销售价格
            A010804 : 'A010804', //   新建商品住宅销售价格指数(上月=100)
            A010807 : 'A010807', //   二手房住宅销售价格指数(上月=100)
            
         },
         CityHouse_Code : {
             BJ : '110000', //   北京
             SH : '310000', //   上海
             GZ : '440100', //   广州
             SZ : '440300', //   深圳
             CD : '510100', //   成都
             WH : '420100', //   武汉
             NJ : '320100', //   南京
             CQ : '500000', //   重庆
             XA : '610100', //   西安
             ZZ : '410100', //   郑州
             HF : '340100', //   合肥
             YC : '420500', //   宜昌
          },
          CityHouse_Dbcode : {
            csnd : 'csnd', //   城市年度数据
            csyd : 'csyd', //   城市月度数据
            
         },
          isBarActive_HousePrice: false,
          isLineActive_HousePrice: false,
          isBarActive_NewHouse: false,
          isLineActive_NewHouse: false,
          isBarActive_OldHouse: false,
          isLineActive_OldHouse: false,
          cityHouseDataList: null,
          chartsType: null
        };
      },
      mounted() {
        this.loadData();
      },
  
      methods: {
        loadData() {
          // 请求cityHouse数据
          fetch('cityHouseData.json')
            .then(response => response.json())
            .then(data => {
              this.cityHouseDataList = data.cityHouseData
              console.log('请求成功cityHouseNew数据:', this.cityHouseDataList);
              // 处理数据绘制图表
              this.drawBarChart_HousePrice();
              this.drawBarChart_NewHouse();
              this.drawBarChart_OldHouse();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
        // 按照类型与字段名称
        dataArr(type,cityCode,dbcode) {
          return this.cityHouseDataList.filter( cityHouseDataListObj => {
                return cityHouseDataListObj.code.search(type) != -1 && cityHouseDataListObj.cityCode.search(cityCode) != -1 && cityHouseDataListObj.dbcode.search(dbcode) != -1;
            }).sort(function(a,b) {
              return sortYearMonths(a.date, b.date);
          }).map(item => {
                return Number(item.value);
          })
        },
       
        // 获取时间横坐标数组数据
        axisArr(type,cityCode,dbcode) {
            return this.cityHouseDataList.filter(cityHouseDataListObj => {
              return cityHouseDataListObj.code.search(type) != -1 && cityHouseDataListObj.cityCode.search(cityCode) != -1  && cityHouseDataListObj.dbcode.search(dbcode) != -1;
          }).sort(function(a,b) {
              return sortYearMonths(a.date, b.date);
          }).map(item => {
              return Number(item.date);
            })
          },
        // 商品住宅销售价格
        drawCityHousePrice() {
          // 基于准备好的dom，初始化echarts实例
          var cityHousePriceChart = echarts.init(document.getElementById('cityHousePrice'));
          // 指定图表的配置项和数据
          var cityHousePriceOption = {
              title: {
                  text: '住宅商品房平均销售价格',
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
                  data: this.axisArr(this.CityHouse_Type.A030C,this.CityHouse_Code.BJ,this.CityHouse_Dbcode.csnd)
              },
              yAxis: {
  
              },
              series: [
                  {
                      name: '北京',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.BJ,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '上海',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.SH,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '广州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.GZ,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '深圳',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.SZ,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '杭州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.HZ,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '成都',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.CD,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '武汉',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.WH,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '南京',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.NJ,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '重庆',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.CQ,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '西安',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.XA,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '合肥',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.HF,this.CityHouse_Dbcode.csnd)
                  },
                  {
                      name: '郑州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A030C,this.CityHouse_Code.ZZ,this.CityHouse_Dbcode.csnd)
                  },
                  
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          cityHousePriceChart.setOption(cityHousePriceOption);
        },

        // 新房图表
        drawCityHouseNew() {
          // 基于准备好的dom，初始化echarts实例
          var cityHouseNewChart = echarts.init(document.getElementById('cityHouseNew'));
          // 指定图表的配置项和数据
          var cityHouseNewOption = {
              title: {
                  text: '新建商品住宅销售价格指数(上月=100)',
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
                  data: this.axisArr(this.CityHouse_Type.A010804,this.CityHouse_Code.BJ,this.CityHouse_Dbcode.csyd)
              },
              yAxis: {
                min: '98', // 这里不是0，所以最后一个月为0的时候折线图显示在上一个月落点处
                max: '101'
              },
              series: [
                  {
                      name: '北京',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.BJ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '上海',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.SH,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '广州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.GZ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '深圳',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.SZ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '杭州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.HZ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '成都',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.CD,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '武汉',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.WH,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '南京',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.NJ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '重庆',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.CQ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '西安',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.XA,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '合肥',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.HF,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '郑州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.ZZ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '宜昌',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010804,this.CityHouse_Code.YC,this.CityHouse_Dbcode.csyd)
                  },
                  
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          cityHouseNewChart.setOption(cityHouseNewOption);
        },

        // 二手房图表
        drawCityHouseOld() {
          // 基于准备好的dom，初始化echarts实例
          var cityHouseOldChart = echarts.init(document.getElementById('cityHouseOld'));
          // 指定图表的配置项和数据
          var cityHouseOldOption = {
              title: {
                  text: '二手住宅销售价格指数(上月=100)',
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
                  data: this.axisArr(this.CityHouse_Type.A010807,this.CityHouse_Code.BJ,this.CityHouse_Dbcode.csyd)
              },
              yAxis: {
                min: '98', // 这里不是0，所以最后一个月为0的时候折线图显示在上一个月落点处
                max: '101'
              },
              series: [
                  {
                      name: '北京',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.BJ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '上海',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.SH,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '广州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.GZ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '深圳',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.SZ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '杭州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.HZ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '成都',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.CD,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '武汉',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.WH,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '南京',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.NJ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '重庆',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.CQ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '西安',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.XA,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '合肥',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.HF,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '郑州',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.ZZ,this.CityHouse_Dbcode.csyd)
                  },
                  {
                      name: '宜昌',
                      type: this.chartsType,
                      data: this.dataArr(this.CityHouse_Type.A010807,this.CityHouse_Code.YC,this.CityHouse_Dbcode.csyd)
                  },
                  
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          cityHouseOldChart.setOption(cityHouseOldOption);
        },
        drawBarChart_HousePrice() {
          this.isBarActive_HousePrice = true;
          this.isLineActive_HousePrice = false;
          // 在这里绘制柱状图
          this.chartsType = "bar"
          this.drawCityHousePrice()
   
        },
        drawLineChart_HousePrice() {
          this.isBarActive_HousePrice = false;
          this.isLineActive_HousePrice = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawCityHousePrice()
        },
        drawBarChart_NewHouse() {
          this.isBarActive_NewHouse = true;
          this.isLineActive_NewHouse = false;
          // 在这里绘制柱状图
          this.chartsType = "bar"
          this.drawCityHouseNew()
   
        },
        drawLineChart_NewHouse() {
          this.isBarActive_NewHouse = false;
          this.isLineActive_NewHouse = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawCityHouseNew()
        },
        drawBarChart_OldHouse() {
          this.isBarActive_OldHouse = true;
          this.isLineActive_OldHouse = false;
          // 在这里绘制柱状图
          this.chartsType = "bar"
          this.drawCityHouseOld()
   
        },
        drawLineChart_OldHouse() {
          this.isBarActive_OldHouse = false;
          this.isLineActive_OldHouse = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawCityHouseOld()
        }
      }
    };
    </script>
  
  
<style>

.buttons {
  top: '100px'
}

</style>