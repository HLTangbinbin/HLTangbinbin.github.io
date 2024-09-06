<template>
  <div>
    <div>
      <h1 class="main-title">大唐统计局</h1>
    </div>
    <nav class="nav-container">
      <!-- startsWith 解决主导航栏和子导航栏联动问题 -->
      <router-link to="/WH" class="nav" :class="{ active: $route.path.startsWith('/WH') }">武汉</router-link>
      <router-link to="/FirstTierCity" class="nav"
        :class="{ active: $route.path.startsWith('/FirstTierCity') }">一线城市</router-link>
      <router-link to="/NationWide" class="nav"
        :class="{ active: $route.path.startsWith('/NationWide') }">全国</router-link>
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
  background-color: #fff;
  /* 设置背景颜色为灰色 */
}

.nav-container {
  display: flex;
  /* 使用 flex 布局 */
  justify-content: center;
  /* 居中子元素 */
  align-items: center;
  background-color: #fff;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 50px auto;
  /* 使容器整体居中 */
  width: fit-content;
  /* 根据子元素内容自适应宽度 */

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
  /* 使用 !important 提高优先级 */
  background-color: #0bc2d6 !important;
  /* 使用 !important 提高优先级 */
}
</style>
