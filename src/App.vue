<template>
  <div>
    <div>
      <h1 class="main-title">大唐统计局</h1>
    </div>
    <div class="nav-wrapper" >
      <nav class="nav-container">
        <!-- startsWith 解决主导航栏和子导航栏联动问题 -->
        <router-link to="/WH" class="nav" :class="{ active: $route.path.startsWith('/WH') }">武汉</router-link>
        <router-link to="/FirstTierCity" class="nav"
          :class="{ active: $route.path.startsWith('/FirstTierCity') }">城市</router-link>
        <router-link to="/MajorProvincial" class="nav"
          :class="{ active: $route.path.startsWith('/MajorProvincial') }">省市</router-link>
        <router-link to="/NationWide" class="nav"
          :class="{ active: $route.path.startsWith('/NationWide') }">全国</router-link>
      </nav>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>


<style>
.main-title {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #fff;
  /* 设置背景颜色为灰色 */
}
.nav-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  white-space: nowrap;
  width: 100%;
  padding: 12px 0 16px;
  box-sizing: border-box;
  background-color: #fff;
  text-align: center; /* ✅ 保证内容水平居中 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.nav-wrapper::-webkit-scrollbar {
  display: none;
}

.nav-container {
  display: inline-flex; /* ✅ 结合 text-align: center 实现内容居中 */
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border-radius: 999px;
  padding: 10px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 -4px 12px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.nav {
  text-decoration: none;
  color: #000;
  padding: 10px 20px;
  margin: 0 10px;
  font-weight: bold;
  border-radius: 20px;
  transition: background-color 0.3s, color 0.3s;
}

.nav.active {
  color: #fff !important;
  background-color: #0bc2d6 !important;
}



</style>
