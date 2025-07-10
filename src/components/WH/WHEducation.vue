<template>
  <ChartPage
    v-if="returnData"
    :chartMetaList="charts"
    :returnData="returnData"
    :showToggles="false" ></ChartPage>
</template>

<script>
import ChartPage from '@/components/common/ChartPage.vue';
import { WHEducationCharts } from '@/config/chartMetaWH.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'WHEducation',
  components: { ChartPage },
  data() {
    return {
      charts: WHEducationCharts.charts,
      returnData: null,
      config: WHEducationCharts.source
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
