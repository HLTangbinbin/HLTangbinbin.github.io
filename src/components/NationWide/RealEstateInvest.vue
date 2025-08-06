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
import { RealEstateInvestCharts } from '@/config/chartMetaNation.js';

import { loadChartData } from '@/config/dataLoader.js';
import { logger } from '@/utils/Logger.js';

export default {
  name: 'RealEstateInvest',
  components: { ChartPage },
  data() {
    return {
      charts: RealEstateInvestCharts.charts,
      returnData: null,
      config: RealEstateInvestCharts.source
    };
  },
  async mounted() {
    try {
      this.returnData = await loadChartData(
        this.config
      );
    } catch (e) {
      logger.error('加载数据失败', e);
    }
  }
};

</script>
