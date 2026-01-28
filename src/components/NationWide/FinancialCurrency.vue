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
  import { FinancialCurrencyCharts } from '@/config/chartMetaNation.js';
  
  import { loadChartData } from '@/config/dataLoader.js';
  import { logger } from '@/utils/Logger.js';
  
  export default {
    name: 'FinancialCurrency',
    components: { ChartPage },
    data() {
      return {
        charts: FinancialCurrencyCharts.charts,
        returnData: null,
        config: FinancialCurrencyCharts.source
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
  