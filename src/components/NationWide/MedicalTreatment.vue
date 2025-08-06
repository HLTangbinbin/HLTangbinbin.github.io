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
import { MedicalCharts } from '@/config/chartMetaNation.js';

import { loadChartData } from '@/config/dataLoader.js';
import { logger } from '@/utils/Logger.js';

export default {
  name: 'MedicalTreatment',
  components: { ChartPage },
  data() {
    return {
      charts: MedicalCharts.charts,
      returnData: null,
      config: MedicalCharts.source
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
