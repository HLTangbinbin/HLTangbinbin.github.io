  <template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Indices}" @click="drawBarChart_Indices" style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Indices }" @click="drawLineChart_Indices" style="margin-top: 50px;">折线图</button>
      </div>
     
      <div class="chart-container" id="priceIndices"></div>

       <!-- 为下方的按钮添加上边距 style="margin-top -->
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_PMI }" @click="drawBarChart_PMI" style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_PMI }" @click="drawLineChart_PMI" style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="pmi"></div>
    </div>
  </template>
    
    <script>
    import * as echarts from 'echarts';
    import { sortYearMonths } from './CommonUtil';
    export default {
  
      data() {
        return {
          IndicesType : {
            CPI_A01010101 : 'A01010101', //  CPI 上年同比
            CPI_A01030101 : 'A01030101', //  CPI 上月环比
            PPI_A01080101 : 'A01080101', //  PPI 上年同比
            PPI_A01080701 : 'A01080701', //  PPI 上月环比
            PMI_A0B0101 :   'A0B0101',   //  制造业采购指数
            PMI_A0B0201 :   'A0B0201',   //  非制造业采购指数
            PMI_A0B0301 :   'A0B0301'    //  综合采购指数
        },
          isBarActive_Indices: false,
          isLineActive_Indices: false,
          isBarActive_PMI: false,
          isLineActive_PMI: false,
          returnData: null,
          chartsType: null
        };
      },
      mounted() {
        this.loadData();
      },
  
      methods: {
        loadData() {
          // 请求priceIndices数据
          fetch('indices.json')
            .then(response => response.json())
            .then(data => {
              this.returnData = data
              console.log('请求成功priceIndices数据:', data);
              // 处理数据绘制图表
              this.drawBarChart_Indices();
              this.drawBarChart_PMI();
            })
            .catch(error => {
              console.error('Error fetching data:', error)
            })
        },
        // 按照类型与字段名称
        dataArr(type) {
          return this.returnData.dataList.filter( returnDataObj => {
                return returnDataObj.code.search(type) != -1 && returnDataObj.value !=0;
            }).sort(function(a,b) {
              return sortYearMonths(a.date, b.date);
          }).map(item => {
                return Number(item.value);
          })
        },

        // cpi图表
        drawPriceIndicesChat() {
          // 基于准备好的dom，初始化echarts实例
          var priceIndicesChart = echarts.init(document.getElementById('priceIndices'));
          // 指定图表的配置项和数据
          var priceIndicesOption = {
              title: {
                  text: '价格指数',
                  subtext: 'CPI消费者物价指数反映一定时期内城乡居民所购买的 \n 生活消费品和服务项目价格变动趋势和程度的相对数 \n PPI生产者物价指数用来衡量制造商出厂价的平均变化 \n 生产者物价指数比预期数值高时，表明有通货膨胀的风险 \n 生产者物价指数比预期数值低时，则表明有通货紧缩的风险 ',
                  left: 'center',
                  top: 'top',
                  
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
                  top: '25%'
              },
              grid: {
                  left: '1%',
                  right: '1%',
                  top: '40%',
                  bottom: '1%',
                  containLabel: true
              },
              xAxis: {
                  type: 'category',
                  data: this.returnData.sj[0].sort()
              },
              yAxis: {
                min: '94', // 这里不是0，所以最后一个月为0的时候折线图显示在上一个月落点处
                max: '101'
              },
              series: [
                  {
                      name: 'CPI同比(上年=100)',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.CPI_A01010101)
                  },
                  {
                      name: 'CPI环比(上月=100)',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.CPI_A01030101)
                  },
                  {
                      name: 'PPI同比(上年=100)',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PPI_A01080101)
                  },
                  {
                      name: 'PPI环比(上月=100)',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PPI_A01080701)
                  }
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          priceIndicesChart.setOption(priceIndicesOption);
        },

         // pmi图表
         drawPMIChart() {
          // 基于准备好的dom，初始化echarts实例
          var pmiChart = echarts.init(document.getElementById('pmi'));
          // 指定图表的配置项和数据
          var pmiOption = { 
              title: {
                  text: '采购经理指数',
                  subtext: 'PMI是一套月度发布的、综合性的经济监测指标体系 \n PMI指数50%为荣枯分水线 \n PMI略大于50,说明经济在缓慢前进 \n PMI略小于50说明经济在慢慢走向衰退',
                  left: 'center',
                  top: 'top',
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
                min: '48',
                max: '57'
              },
              series: [
                  {
                      name: '制造业PMI',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PMI_A0B0101)
                  },
                  {
                      name: '非制造业PMI',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PMI_A0B0201)
                  },
                  {
                      name: '综合PMI',
                      type: this.chartsType,
                      data: this.dataArr(this.IndicesType.PMI_A0B0301)
                  }
              ]
          };
          // 使用刚指定的配置项和数据显示图表。
          pmiChart.setOption(pmiOption);
        },
       
        drawBarChart_Indices() {
          this.isBarActive_Indices = true;
          this.isLineActive_Indices = false;
          // 在这里绘制柱状图
          this.chartsType = "bar"
          this.drawPriceIndicesChat();
   
        },
        drawLineChart_Indices() {
          this.isBarActive_Indices = false;
          this.isLineActive_Indices = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawPriceIndicesChat();
        },
        drawBarChart_PMI() {
          this.isBarActive_PMI = true;
          this.isLineActive_PMI = false;
          // 在这里绘制柱状图
          this.chartsType = "bar"
          this.drawPMIChart();
   
        },
        drawLineChart_PMI() {
          this.isBarActive_PMI = false;
          this.isLineActive_PMI = true;
          // 在这里绘制折线图
          this.chartsType = "line"
          this.drawPMIChart()
        }
      }
    };
    </script>
  
  
  