<template>
  <div>
    <div>
    <h1 class="main-title">武汉房地产与金融数据</h1>
    </div>
    <nav class="nav-container">
      <router-link to="/newhouse" class="nav" :class="{ active: $route.path === '/newhouse' }">新房</router-link>
      <router-link to="/secondhand" class="nav" :class="{ active: $route.path === '/secondhand' }">二手房</router-link>
      <router-link to="/socialfinancing" class="nav" :class="{ active: $route.path === '/socialfinancing' }">社会融资增量</router-link>
      <router-link to="/currencyissue" class="nav" :class="{ active: $route.path === '/currencyissue' }">货币M2统计数据</router-link>
    </nav>
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
  background-color: #fff; /* 设置背景颜色为灰色 */
}
.nav-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px; /* 添加底部间距 */
  background-color: #fff; /* 设置背景颜色为灰色 */
}

.nav {
  text-decoration: none;
  background-color: #ccc;
  color: #fff; /* 设置文字颜色为黑色 */
  padding: 10px 20px;
  /* border-radius: 5px; */
  transition: background-color 0.3s ease;
}

.nav.active {
  color: #fff !important; /* 使用 !important 提高优先级 */
  background-color: #0bc2d6 !important; /* 使用 !important 提高优先级 */
}
</style>
