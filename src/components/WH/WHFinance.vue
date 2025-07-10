<template>
  <ChartPage
    v-if="returnData"
    :chartMetaList="charts"
    :returnData="returnData"
    :showToggles="false" ></ChartPage>
</template>

<script>
import ChartPage from '@/components/common/ChartPage.vue';
import { WHFinanceCharts } from '@/config/chartMetaWH.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'WHFinance',
  components: { ChartPage },
  data() {
    return {
      charts: WHFinanceCharts.charts,
      returnData: null,
      config: WHFinanceCharts.source
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
