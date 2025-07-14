<template>
    <div>
      <div class="nav-wrapper">
        <nav class="nav-container">
        <router-link to="/MajorProvincial/ProvincialGDP" class="nav" :class="{ active: $route.path.startsWith('/MajorProvincial/ProvincialGDP') }">GDP</router-link>
        <router-link to="/MajorProvincial/ProvincialPopulation" class="nav"
          :class="{ active: $route.path === '/MajorProvincial/ProvincialPopulation' }">人口</router-link>
        <router-link to="/MajorProvincial/ProvincialRealEstate" class="nav"
          :class="{ active: $route.path.startsWith('/MajorProvincial/ProvincialRealEstate') }">房地产</router-link>
        <router-link to="/MajorProvincial/ProvincialFinance" class="nav"
          :class="{ active: $route.path === '/MajorProvincial/ProvincialFinance' }">财政</router-link>
        <router-link to="/MajorProvincial/ProvincialEducation" class="nav" :class="{ active: $route.path === '/MajorProvincial/ProvincialEducation' }">教育</router-link>
        <router-link to="/MajorProvincial/ProvincialMedical" class="nav" :class="{ active: $route.path === '/MajorProvincial/ProvincialMedical' }">医疗</router-link>
        <router-link to="/MajorProvincial/ProvincialLiving" class="nav"
        :class="{ active: $route.path === '/MajorProvincial/ProvincialLiving' }">生活</router-link>
      </nav>
      </div>
  
      <router-view></router-view> <!-- 用于显示子路由的内容 -->
    </div>
  </template>
  
  <script>
  
  // 因为路由配置已经处理了组件的引入
  
  export default {
    name: 'MajorProvincial'
  };
  </script>
  
  