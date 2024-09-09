  <template>
    <div class="container">
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_Indices }" @click="drawBarChart_Indices"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_Indices }" @click="drawLineChart_Indices"
          style="margin-top: 50px;">折线图</button>
      </div>

      <div class="chart-container" id="priceIndices"></div>

      <!-- 为下方的按钮添加上边距 style="margin-top -->
      <div class="buttons">
        <button class="button" :class="{ 'is-active': isBarActive_PMI }" @click="drawBarChart_PMI"
          style="margin-top: 50px;">柱状图</button>
        <button class="button" :class="{ 'is-active': isLineActive_PMI }" @click="drawLineChart_PMI"
          style="margin-top: 50px;">折线图</button>
      </div>
      <div class="chart-container" id="pmi"></div>
    </div>
  </template>

<script>

import { params_indices, sendRequest, drawCommonChart } from '../CommonUtil';
export default {

  data() {
    return {
      EChartType_Indices: {
        PI: 'priceIndices',
        PM: 'pmi',
      },

      isBarActive_Indices: false,
      isLineActive_Indices: false,
      isBarActive_PMI: false,
      isLineActive_PMI: false,
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
      // 读取本地指数数据
      fetch('indices.json')
        .then(response => response.json())
        .then(data => {
          console.log('读取本地数据指数数据:', data);
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
        this.returnData = await sendRequest(params_indices);
        console.log("响应处理后的数据：", this.returnData)
        this.drawChartWithBtn()
      } catch (error) {
        console.error('接口外部调用失败:', error);
      }
    },
    drawChartWithBtn() {
      if (this.returnData) {
        this.drawBarChart_Indices();
        this.drawBarChart_PMI();
      }
    },

    drawBarChart_Indices() {
      this.isBarActive_Indices = true;
      this.isLineActive_Indices = false;
      // 在这里绘制柱状图
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Indices.PI);

    },
    drawLineChart_Indices() {
      this.isBarActive_Indices = false;
      this.isLineActive_Indices = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Indices.PI);
    },
    drawBarChart_PMI() {
      this.isBarActive_PMI = true;
      this.isLineActive_PMI = false;
      // 在这里绘制柱状图
      this.chartType = "bar"
      this.drawChartWithParams(this.EChartType_Indices.PM);

    },
    drawLineChart_PMI() {
      this.isBarActive_PMI = false;
      this.isLineActive_PMI = true;
      // 在这里绘制折线图
      this.chartType = "line"
      this.drawChartWithParams(this.EChartType_Indices.PM)
    },
    drawChartWithParams(echrtId) {
      // basicParams-包含echrtId、title、legendTop、gridTop、xAxisDataArr
      let basicParams = {};
      let typeArr = [];
      let subtitle = ''
      switch (echrtId) {
        case this.EChartType_Indices.PI:
          subtitle = 'CPI消费者物价指数反映一定时期内城乡居民所购买的 \n 生活消费品和服务项目价格变动趋势和程度的相对数 \n PPI生产者物价指数用来衡量制造商出厂价的平均变化 \n 生产者物价指数比预期数值高时，表明有通货膨胀的风险 \n 生产者物价指数比预期数值低时，则表明有通货紧缩的风险 ',
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '价格指数', subtitle: subtitle, exceptName: '价格指数', unit: '', legendTop: '25%', gridTop: '40%', sj: '0', min: '94', max: '101' }
          // A01010101-CPI 上年同比 A01030101-CPI 上月环比 A01080101-PPI 上年同比  A01080701-PPI 上月环比
          typeArr = ['A01010101', 'A01030101', 'A01080101', 'A01080701'];
          break;
        case this.EChartType_Indices.PM:
          subtitle = 'PMI是一套月度发布的、综合性的经济监测指标体系 \n PMI指数50%为荣枯分水线 \n PMI略大于50,说明经济在缓慢前进 \n PMI略小于50说明经济在慢慢走向衰退',
          basicParams = { echrtId: echrtId, chartType: this.chartType, title: '采购经理指数', subtitle: subtitle, exceptName: '采购经理指数商务活动产出', unit: '', legendTop: '20%', gridTop: '35%', sj: '0', min: '48', max: '57' }
          // A0B0101-制造业采购指数 A0B0201-非制造业采购指数 A0B0301-综合采购指数
          typeArr = ['A0B0101', 'A0B0201', 'A0B0301'];
          break;
        default:
          break;
      }
      drawCommonChart(basicParams, typeArr, this.returnData)
    }
  }
};
</script>


