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
import { NationalFinanceCharts } from '@/config/chartMetaNation.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'NationalFinance',
  components: { ChartPage },
  data() {
    return {
      charts: NationalFinanceCharts.charts,
      returnData: null,
      config: NationalFinanceCharts.source
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
