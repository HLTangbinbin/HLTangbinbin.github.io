<template>
    <div>
      <nav class="sub-nav-container">
        <router-link to="/FirstTierCity/CityGDP" class="sub-nav" :class="{ active: $route.path === '/FirstTierCity/CityGDP' }">GDP</router-link>
        <router-link to="/FirstTierCity/CityPopulation" class="sub-nav" :class="{ active: $route.path === '/FirstTierCity/CityPopulation' }">人口</router-link>
        <router-link to="/FirstTierCity/CityRealEstate" class="sub-nav" :class="{ active: $route.path.startsWith('/FirstTierCity/CityRealEstate') }">房地产</router-link>
        <router-link to="/FirstTierCity/CityNationalFinance" class="sub-nav" :class="{ active: $route.path === '/FirstTierCity/CityNationalFinance' }">财政</router-link>
        <router-link to="/FirstTierCity/CityEHC" class="sub-nav" :class="{ active: $route.path === '/FirstTierCity/CityEHC' }">教卫文</router-link>
      </nav>
      <router-view></router-view> <!-- 用于显示子路由的内容 -->
    </div>
  </template>
  
  <script>

  // 因为路由配置已经处理了组件的引入
  
  export default {
    name: 'FirstTierCity'
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