

<template>
    <div>
    <div class="nav-wrapper">
      <nav class="nav-container">
        <router-link to="/NationWide/GrossDomesticProduct" class="nav" :class="{ active: $route.path.startsWith('/NationWide/GrossDomesticProduct') }">GDP</router-link>
        <router-link to="/NationWide/NationalFinance" class="nav" :class="{ active: $route.path === '/NationWide/NationalFinance' }">财政</router-link>
        <router-link to="/NationWide/FinancialIndustry" class="nav" :class="{ active: $route.path === '/NationWide/FinancialIndustry' }">金融</router-link>
        <router-link to="/NationWide/ForeignTrade" class="nav" :class="{ active: $route.path === '/NationWide/ForeignTrade' }">外贸</router-link>
        <router-link to="/NationWide/PopulationCorrelation" class="nav" :class="{ active: $route.path === '/NationWide/PopulationCorrelation' }">人口</router-link>
        <router-link to="/NationWide/RealEstate" class="nav" :class="{ active: $route.path.startsWith('/NationWide/RealEstate') }">房地产</router-link>
        <router-link to="/NationWide/SocialRetailgoods" class="nav" :class="{ active: $route.path === '/NationWide/SocialRetailgoods' }">社零</router-link>
        <router-link to="/NationWide/EducationSector" class="nav" :class="{ active: $route.path === '/NationWide/EducationSector' }">教育</router-link>
        <router-link to="/NationWide/MedicalTreatment" class="nav" :class="{ active: $route.path === '/NationWide/MedicalTreatment' }">医疗</router-link>
        <router-link to="/NationWide/MarriageStatus" class="nav" :class="{ active: $route.path === '/NationWide/MarriageStatus' }">婚姻</router-link>
        <router-link to="/NationWide/IndicesData" class="nav" :class="{ active: $route.path === '/NationWide/IndicesData' }">指数</router-link>
        <router-link to="/NationWide/LivingStandards" class="nav" :class="{ active: $route.path === '/NationWide/LivingStandards' }">生活</router-link>
        <router-link to="/NationWide/ProvidentFund" class="nav" :class="{ active: $route.path === '/NationWide/ProvidentFund' }">公积金</router-link>
      </nav>
    </div>

      <router-view></router-view> <!-- 用于显示子路由的内容 -->
    </div>

  </template>
  
  <script>
  // 不需要在这里直接引入 RealEstateInvest 和 RealEstateSell
  // 因为路由配置已经处理了组件的引入
  
  export default {
    name: 'NationWide'
  };
  </script>

