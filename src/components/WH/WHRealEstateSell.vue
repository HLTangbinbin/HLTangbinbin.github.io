<template>
  <ChartPage
    v-if="returnData"
    :chartMetaList="charts"
    :returnData="returnData"
    :config="config" 
    :showToggles="false" ></ChartPage>
</template>

<script>
import ChartPage from '@/components/common/ChartPage.vue';
import { WHRealEstateSellCharts } from '@/config/chartMetaWH.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'WHRealEstateSell',
  components: { ChartPage },
  data() {
    return {
      charts: WHRealEstateSellCharts.charts,
      returnData: null,
      config: WHRealEstateSellCharts.source
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
