<template>
    <div>
      <div class="nav-wrapper">
        <nav class="sub-nav-container">
        <router-link to="/MajorProvincial/ProvincialGDP" class="sub-nav" :class="{ active: $route.path.startsWith('/MajorProvincial/ProvincialGDP') }">GDP</router-link>
        <router-link to="/MajorProvincial/ProvincialPopulation" class="sub-nav"
          :class="{ active: $route.path === '/MajorProvincial/ProvincialPopulation' }">人口</router-link>
        <router-link to="/MajorProvincial/ProvincialRealEstate" class="sub-nav"
          :class="{ active: $route.path.startsWith('/MajorProvincial/ProvincialRealEstate') }">房地产</router-link>
        <router-link to="/MajorProvincial/ProvincialFinance" class="sub-nav"
          :class="{ active: $route.path === '/MajorProvincial/ProvincialFinance' }">财政</router-link>
        <router-link to="/MajorProvincial/ProvincialLiving" class="sub-nav"
          :class="{ active: $route.path === '/MajorProvincial/ProvincialLiving' }">生活</router-link>
        <router-link to="/MajorProvincial/ProvincialEducation" class="sub-nav" :class="{ active: $route.path === '/MajorProvincial/ProvincialEducation' }">教育</router-link>
        <router-link to="/MajorProvincial/ProvincialMedical" class="sub-nav" :class="{ active: $route.path === '/MajorProvincial/ProvincialMedical' }">医疗</router-link>
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
  
  
  <style>
  
  /* 外层容器，允许滑动但不会强制撑满全屏 */
  .nav-wrapper {
    display: flex;
    justify-content: safe center;
    overflow-x: auto; /* 允许水平滚动 */
    white-space: nowrap; /* 防止子元素换行 */
    width: 100%; /* 占满可用宽度 */
    padding-bottom: 10px; /* 防止底部被遮挡 */
    box-sizing: border-box; /* 确保 padding 不影响元素宽度 */
    -webkit-overflow-scrolling: touch; /* 启用惯性滚动 */
  }
  
  .sub-nav-container {
    display: inline-flex;
    /* 保证子元素水平排列并自适应宽度 */
    justify-content: safe center;
    align-items: center;
    background-color: #fff;
    border-radius: 50px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
    white-space: nowrap;
    /* 防止换行 */
    width: auto;
    /* 自动根据内容自适应宽度 */
    margin: 0 auto;
    /* 确保居中 */
  }
  
  .sub-nav-container::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
  }
  .nav-wrapper {
    -ms-overflow-style: none;  /* IE 和 Edge 隐藏滚动条 */
    scrollbar-width: none;  /* Firefox 隐藏滚动条 */
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