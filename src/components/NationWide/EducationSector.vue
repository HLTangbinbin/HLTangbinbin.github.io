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
import { EducationSectorCharts } from '@/config/chartMetaNation.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'EducationSector',
  components: { ChartPage },
  data() {
    return {
      charts: EducationSectorCharts.charts,
      returnData: null,
      config: EducationSectorCharts.source
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
