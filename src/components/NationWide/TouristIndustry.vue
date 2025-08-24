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
  import { TouristIndustryCharts } from '@/config/chartMetaNation.js';
  
  import { loadChartData } from '@/config/dataLoader.js';
  import { logger } from '@/utils/Logger.js';
  
  export default {
    name: 'TouristIndustry',
    components: { ChartPage },
    data() {
      return {
        charts: TouristIndustryCharts.charts,
        returnData: null,
        config: TouristIndustryCharts.source
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