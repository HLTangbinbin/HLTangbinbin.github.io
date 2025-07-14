<template>
    <div>
      <div class="nav-wrapper">
        <nav class="nav-container">
        <router-link to="/NationWide/RealEstate/RealEstateInvest" class="nav" :class="{ active: $route.path === '/NationWide/RealEstate/RealEstateInvest' }">投资</router-link>
        <router-link to="/NationWide/RealEstate/RealEstateSell" class="nav" :class="{ active: $route.path === '/NationWide/RealEstate/RealEstateSell' }" >销售</router-link>
      </nav>
      </div>

      <router-view></router-view> <!-- 用于显示子路由的内容 -->
    </div>
  </template>
  
  <script>
  // 不需要在这里直接引入 RealEstateInvest 和 RealEstateSell
  // 因为路由配置已经处理了组件的引入
  
  export default {
    name: 'RealEstate'
  };
  </script>
  