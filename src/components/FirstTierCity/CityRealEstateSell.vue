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
import { CityRealEstateSellCharts } from '@/config/chartMetaCity.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'CityRealEstateSell',
  components: { ChartPage },
  data() {
    return {
      charts: CityRealEstateSellCharts.charts,
      returnData: null,
      config: CityRealEstateSellCharts.source
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
