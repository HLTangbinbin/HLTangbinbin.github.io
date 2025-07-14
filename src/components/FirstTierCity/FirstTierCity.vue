<template>
  <div>
    <div class="nav-wrapper">
      <nav class="nav-container">
      <router-link to="/FirstTierCity/CityGDP" class="nav"
        :class="{ active: $route.path === '/FirstTierCity/CityGDP' }">GDP</router-link>
      <router-link to="/FirstTierCity/CityPopulation" class="nav"
        :class="{ active: $route.path === '/FirstTierCity/CityPopulation' }">人口</router-link>
      <router-link to="/FirstTierCity/CityRealEstate" class="nav"
        :class="{ active: $route.path.startsWith('/FirstTierCity/CityRealEstate') }">房地产</router-link>
      <router-link to="/FirstTierCity/CityFinance" class="nav"
        :class="{ active: $route.path === '/FirstTierCity/CityFinance' }">财政</router-link>
      <router-link to="/FirstTierCity/CityEducation" class="nav"
        :class="{ active: $route.path === '/FirstTierCity/CityEducation' }">教育</router-link>
      <router-link to="/FirstTierCity/CityMedical" class="nav"
        :class="{ active: $route.path === '/FirstTierCity/CityMedical' }">医疗</router-link>
    </nav>
    </div>

    <router-view></router-view> <!-- 用于显示子路由的内容 -->
  </div>
</template>

<script>

// 因为路由配置已经处理了组件的引入

export default {
  name: 'FirstTierCity'
};
</script>

