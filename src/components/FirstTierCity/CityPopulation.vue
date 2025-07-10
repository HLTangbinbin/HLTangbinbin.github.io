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
import { CityPopulationCharts } from '@/config/chartMetaCity.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'CityPopulation',
  components: { ChartPage },
  data() {
    return {
      charts: CityPopulationCharts.charts,
      returnData: null,
      config: CityPopulationCharts.source
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
