<template>
  <ChartPage
    v-if="returnData"
    :chartMetaList="charts"
    :returnData="returnData"
    :config="config" 
    :showToggles="true" ></ChartPage>
</template>

<script>
import ChartPage from '@/components/common/ChartPage.vue';
import { FinancialIndustryCharts } from '@/config/chartMetaNation.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'FinancialIndustry',
  components: { ChartPage },
  data() {
    return {
      charts: FinancialIndustryCharts.charts,
      returnData: null,
      config: FinancialIndustryCharts.source
    };
  },
  async mounted() {
    try {
      this.returnData = await loadChartData(
        this.config
      );
    } catch (e) {
      console.error('加载数据失败', e);
    }
  }
};

</script>
