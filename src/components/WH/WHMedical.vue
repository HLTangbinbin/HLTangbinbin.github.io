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
import { WHMedicalCharts } from '@/config/chartMetaWH.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'WHMedical',
  components: { ChartPage },
  data() {
    return {
      charts: WHMedicalCharts.charts,
      returnData: null,
      config: WHMedicalCharts.source
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
