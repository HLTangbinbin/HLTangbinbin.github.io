<template>
    <ChartPage
      v-if="returnData && currentConfig"
      :chartMetaList="currentConfig.charts"
      :returnData="returnData"
      :config="currentConfig.source"
      :showToggles="true" 
    />
    <div v-else-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">数据加载中，请稍候...</div>
    </div>
  </template>
  
  <script setup>
  import { shallowRef, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import ChartPage from '@/components/common/ChartPage.vue';
  import { loadChartData } from '@/config/dataLoader.js';
  import { logger } from '@/utils/Logger.js';
  
  import * as WH from '@/config/chartMetaWH.js';
  import * as City from '@/config/chartMetaCity.js';
  import * as Province from '@/config/chartMetaProvince.js';
  import * as Nation from '@/config/chartMetaNation.js';
  
  // 建立 路由名称 -> 具体图表配置 的字典映射 (解决名字不一致的问题)
  const configMap = {
    'WHNewHouse': WH.WHNewHouseCharts,
    'WHSecondHandHouse': WH.WHSecondHouseCharts,
    'WHGDP': WH.WHGDPCharts,
    'WHPopulation': WH.WHPopulationCharts,
    'WHFinance': WH.WHFinanceCharts,
    'WHRealEstateInvest': WH.WHRealEstateInvestCharts,
    'WHRealEstateSell': WH.WHRealEstateSellCharts,
    'WHEducation': WH.WHEducationCharts,
    'WHMedical': WH.WHMedicalCharts,
  
    'CityGDP': City.CityGDPCharts,
    'CityPopulation': City.CityPopulationCharts,
    'CityFinance': City.CityFinanceCityCharts,
    'CityRealEstateInvest': City.CityRealEstateInvestCharts,
    'CityRealEstateSell': City.CityRealEstateSellCharts,
    'CityRealEstatePriceIndices': City.CityRealEstatePriceIndicesCharts,
    'CityEducation': City.CityEducationCharts,
    'CityMedical': City.CityMedicalCharts,
  
    'ProvincialGDP': Province.ProvincialGDPCharts,
    'ProvincialPopulation': Province.ProvincialPopulationCharts,
    'ProvincialFinance': Province.ProvincialFinanceCharts,
    'ProvincialRealEstateInvest': Province.ProvincialRealEstateInvestCharts,
    'ProvincialRealEstateSell': Province.ProvincialRealEstateSellCharts,
    'ProvincialEducation': Province.ProvincialEducationCharts,
    'ProvincialMedical': Province.ProvincialMedicalCharts,
    'ProvincialLiving': Province.ProvincialLivingCharts,
  
    'GrossDomesticProduct': Nation.GDPCharts,
    'PopulationBasic': Nation.PopulationBasicCharts,
    'PopulationSpot': Nation.PopulationSpotCharts,
    'NationalFinance': Nation.NationalFinanceCharts,
    'RealEstateInvest': Nation.RealEstateInvestCharts,
    'RealEstateSell': Nation.RealEstateSaleCharts,
    'EducationSchool': Nation.EducationSchoolCharts,
    'EducationTeacher': Nation.EducationTeacherCharts,
    'EducationStudent': Nation.EducationStudentCharts,
    'MedicalTreatment': Nation.MedicalCharts,
    'MarriageStatus': Nation.MarriageCharts,
    'SocialRetailgoods': Nation.SocialRetailgoodsCharts,
    'FinancialCurrency': Nation.FinancialCurrencyCharts,
    'FinancialSocialFinancing': Nation.FinancialSocialFinancingCharts,
    'FinancialSecurity': Nation.FinancialSecurityCharts,
    'FinancialInsurance': Nation.FinancialInsuranceCharts,
    'ForeignTrade': Nation.ForeignTradeCharts,
    'IndicesData': Nation.IndicesCharts,
    'TouristIndustry': Nation.TouristIndustryCharts,
    'AccommodationAndCateringIndustry': Nation.AccommodationAndCateringIndustryCharts,
    'LivingStandards': Nation.LivingStandardsCharts,
    'TransportationAndTelecommunications': Nation.TransportationAndTelecommunicationsCharts
  };
  
  const route = useRoute();
  // 使用 shallowRef 提升 ECharts 渲染性能
  const currentConfig = shallowRef(null);
  const returnData = shallowRef(null);
  const loading = shallowRef(false);
  
  watch(() => route.path, async () => {
    // 从路由路径中提取最后一段（例如 '/WH/WHGDP' -> 'WHGDP'）
    const pathKey = route.path.split('/').pop();
    
    if (configMap[pathKey]) {
      loading.value = true;
      currentConfig.value = configMap[pathKey];
      try {
        returnData.value = await loadChartData(currentConfig.value.source);
      } catch (e) {
        logger.error(`[${pathKey}] 加载数据失败`, e);
      } finally {
        loading.value = false;
      }
    }
  }, { immediate: true });
  </script>