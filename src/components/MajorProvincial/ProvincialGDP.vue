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
import { ProvincialGDPCharts } from '@/config/chartMetaProvince.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'ProvincialGDP',
  components: { ChartPage },
  data() {
    return {
      charts: ProvincialGDPCharts.charts,
      returnData: null,
      config: ProvincialGDPCharts.source
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
