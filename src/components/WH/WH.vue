<template>
    <div>
      <nav class="sub-nav-container">
        <router-link
          to="/WH/newhouse"
          class="sub-nav"
          :class="{ active: $route.path === '/WH/newhouse' }"
        >新房</router-link>
        <router-link
          to="/WH/secondhandhouse"
          class="sub-nav"
          :class="{ active: $route.path === '/WH/secondhandhouse' }"
        >二手房</router-link>
        <router-link
          to="/WH/gdp"
          class="sub-nav"
          :class="{ active: $route.path === '/WH/gdp' }"
        >GDP</router-link>
        <router-link
          to="/WH/population"
          class="sub-nav"
          :class="{ active: $route.path === '/WH/population' }"
        >人口</router-link>
        <router-link
          to="/WH/realestate"
          class="sub-nav"
          :class="{ active: $route.path === '/WH/realestate' }"
        >房地产</router-link>
        <router-link
          to="/WH/nationalfinance"
          class="sub-nav"
          :class="{ active: $route.path === '/WH/nationalfinance' }"
        >财政</router-link>
        <router-link
          to="/WH/ehc"
          class="sub-nav"
          :class="{ active: $route.path === '/WH/ehc' }"
        >教卫文</router-link>
      </nav>
      <router-view></router-view> <!-- 用于显示子路由的内容 -->
    </div>
  </template>
  
  <script>

  // 因为路由配置已经处理了组件的引入
  
  export default {
    name: 'WH'
  };
  </script>
  