<template>
  <div>
    <div>
    <h1 class="main-title">大唐统计局</h1>
    </div>
    <nav class="nav-container">
            <!-- startsWith 解决主导航栏和子导航栏联动问题 -->
      <router-link to="/WH" class="nav" :class="{ active: $route.path.startsWith ('/WH')}">武汉</router-link>
      <router-link to="/FirstTierCity" class="nav" :class="{ active: $route.path.startsWith ('/FirstTierCity') }">一线城市</router-link>
      <router-link to="/NationWide" class="nav" :class="{ active: $route.path.startsWith ('/NationWide')}">全国</router-link>
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
  overflow-x: auto; /* 启用水平滚动条 */
  /** white-space: nowrap; /* 防止换行 */
  white-space: wrap; /* 换行：移动端换行显示 */
  flex-wrap: wrap;
  -webkit-overflow-scrolling: touch; /* 在移动设备上优化滚动 */
  display: flex;
  justify-content: safe center; /* 解决居中滚动时左边无法显示全的问题 */
  margin-top: 20px; /* 添加底部间距 */
  background-color: #fff; /* 设置背景颜色为灰色 */
  border-radius: 40px;
  box-shadow: 0 5px 10px rgb(0, 0, 0, 0.25);
  
}

.nav {
  display:block;
  text-decoration: none;
  background-color: #fff;
  color: #000; /* 设置文字颜色为黑色 */
  padding: 10px 10px;
  margin: 10px 10px;
  font-weight: bold;
  border-radius: 40px;
}

.nav.active {
  color: #fff !important; /* 使用 !important 提高优先级 */
  background-color: #0bc2d6 !important; /* 使用 !important 提高优先级 */
}


</style>
