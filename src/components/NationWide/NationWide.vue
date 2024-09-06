

<template>
    <div>
      <nav class="sub-nav-container">
        <router-link to="/NationWide/RealEstate" class="sub-nav" :class="{ active: $route.path.startsWith('/NationWide/RealEstate') }">房地产</router-link>
        <router-link to="/NationWide/GrossDomesticProduct" class="nav" :class="{ active: $route.path === '/NationWide/GrossDomesticProduct' }">经济</router-link>
        <router-link to="/NationWide/NationalFinance" class="nav" :class="{ active: $route.path === '/NationWide/NationalFinance' }">财政</router-link>
        <router-link to="/NationWide/FinancialIndustry" class="nav" :class="{ active: $route.path === '/NationWide/FinancialIndustry' }">金融</router-link>
        <router-link to="/NationWide/ForeignTrade" class="nav" :class="{ active: $route.path === '/NationWide/ForeignTrade' }">外贸</router-link>
        <router-link to="/NationWide/PopulationCorrelation" class="nav" :class="{ active: $route.path === '/NationWide/PopulationCorrelation' }">人口</router-link>
        <router-link to="/NationWide/EducationSector" class="nav" :class="{ active: $route.path === '/NationWide/EducationSector' }">教育</router-link>
        <router-link to="/NationWide/MedicalTreatment" class="nav" :class="{ active: $route.path === '/NationWide/MedicalTreatment' }">医疗</router-link>
        <router-link to="/NationWide/IndicesData" class="nav" :class="{ active: $route.path === '/NationWide/IndicesData' }">指数</router-link>
        <router-link to="/NationWide/LivingStandards" class="nav" :class="{ active: $route.path === '/NationWide/LivingStandards' }">生活</router-link>
      </nav>
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

<style>

.sub-nav-container {
  display: flex; /* 使用 flex 布局 */
  justify-content: center; /* 居中子元素 */
  align-items: center;
  background-color: #fff;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 20px auto; /* 使容器整体居中 */
  width: fit-content; /* 根据子元素内容自适应宽度 */
}

.sub-nav {
  text-decoration: none;
  color: #000;
  padding: 10px 20px;
  margin: 0 10px;
  font-weight: bold;
  border-radius: 20px;
  transition: background-color 0.3s, color 0.3s;
}

.sub-nav.active {
  color: #fff;
  background-color: #0bc2d6;
}

</style>