<template>
  <ChartPage
    v-if="returnData"
    :chartMetaList="charts"
    :returnData="returnData"
    :showToggles="false" ></ChartPage>
</template>

<script>
import ChartPage from '@/components/common/ChartPage.vue';
import { MarriageCharts } from '@/config/chartMetaNation.js';

import { loadChartData } from '@/config/dataLoader.js';

export default {
  name: 'MarriageStatus',
  components: { ChartPage },
  data() {
    return {
      charts: MarriageCharts.charts,
      returnData: null,
      config: MarriageCharts.source
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
