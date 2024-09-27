<template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Medical_Hospital }" @click="drawBarChart_Medical_Hospital"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Medical_Hospital }" @click="drawLineChart_Medical_Hospital"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="hospital"></div>
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Medical_BedsPer }" @click="drawBarChart_Medical_BedsPer"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Medical_BedsPer }" @click="drawLineChart_Medical_BedsPer"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="bedsper"></div>

    </div>
  </template>
  
  <script>
  
  import { params_province, sendRequest, drawCommonChart } from '../CommonUtil';
  export default {
  
    data() {
      return {
        EChartType_Medical_Provincial: {
          HP: 'hospital',
          BP: 'bedsper',
        },
  
        isBarActive_Medical_Hospital: false,
        isLineActive_Medical_Hospital: false,
        isBarActive_Medical_BedsPer: false,
        isLineActive_Medical_BedsPer: false,

        returnData: null,
        chartType: null
      };
    },
    mounted() {
      this.loadData();
    },
  
    methods: {
      loadData() {
        if (process.env.VUE_APP_REQUEST_IS_LOCAL === 'true') {
          this.requestWithLocalJson()
        } else {
          this.requestWithAPI()
        }
      },
      requestWithLocalJson() {
        // 读取本地数据
        fetch('province.json')
          .then(response => response.json())
          .then(data => {
            console.log('读取本地数据:', data);
            // 列表数据
            this.returnData = data;
            // 处理数据绘制图表
            this.drawChartWithBtn()
          })
          .catch(error => {
            console.error('Error fetching data:', error)
          })
      },
      async requestWithAPI() {
        try {
          this.returnData = await sendRequest(params_province);
          console.log("响应处理后的数据：", this.returnData)
          this.drawChartWithBtn()
        } catch (error) {
          console.error('接口外部调用失败:', error);
        }
      },
      drawChartWithBtn() {
        if (this.returnData) {
          this.drawBarChart_Medical_Hospital()
          this.drawBarChart_Medical_BedsPer()

        }
      },
      drawBarChart_Medical_Hospital() {
        this.isBarActive_Medical_Hospital = true;
        this.isLineActive_Medical_Hospital = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Medical_Provincial.HP)
  
      },
      drawLineChart_Medical_Hospital() {
        this.isBarActive_Medical_Hospital = false;
        this.isLineActive_Medical_Hospital = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Medical_Provincial.HP)
      },
      drawBarChart_Medical_BedsPer() {
        this.isBarActive_Medical_BedsPer = true;
        this.isLineActive_Medical_BedsPer = false;
        this.chartType = "bar"
        this.drawChartWithParams(this.EChartType_Medical_Provincial.BP)
  
      },
      drawLineChart_Medical_BedsPer() {
        this.isBarActive_Medical_BedsPer = false;
        this.isLineActive_Medical_BedsPer = true;
        // 在这里绘制折线图
        this.chartType = "line"
        this.drawChartWithParams(this.EChartType_Medical_Provincial.BP)
      },
     
      drawChartWithParams(echrtId) {
        // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
        let basicParams = {};
        let typeArr = [];
        let provinceCodeArr = [];

        // 年度数据
        switch (echrtId) {
          case this.EChartType_Medical_Provincial.HP:
            // A0O0102-医院个数
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '医院个数(个)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' }
            typeArr = ['A0O0102'];
            break;
        case this.EChartType_Medical_Provincial.BP:
            // A0O0604-每万人医疗机构床位数
            basicParams = { echrtId: echrtId, chartType: this.chartType, title: '每万人医疗机构床位数(个)', subtitle: '', exceptName: '', unit: '', legendTop: '10%', gridTop: '30%', dbCode: 'nd' , min: '35', max: '90'}
            typeArr = ['A0O0604'];
            break;
          default:
            break;
        }
        provinceCodeArr = ['110000', '120000', '130000', '140000', 
                            '150000', '210000', '220000', '230000', 
                            '310000', '320000', '330000', '340000', '350000','360000', '370000', 
                            '410000', '420000', '430000','440000', '450000', '460000',
                            '500000', '510000', '520000','530000', '510000', '540000',
                            '610000', '620000', '630000','640000', '650000']
        drawCommonChart(basicParams, typeArr, this.returnData, provinceCodeArr)
      }
  
    }
  };
  </script>