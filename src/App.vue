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
          :class="{ active: $route.path.startsWith('/FirstTierCity') }">一线城市</router-link>
        <router-link to="/MajorProvincial" class="nav"
          :class="{ active: $route.path.startsWith('/MajorProvincial') }">省份</router-link>
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
.nav-wrapper::-webkit-scrollbar {
  display: none;
  /* 隐藏滚动条 */
}

.nav-container {
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

.nav-container::-webkit-scrollbar {
  display: none;
  /* 隐藏滚动条 */
}
.nav-wrapper {
  -ms-overflow-style: none;  /* IE 和 Edge 隐藏滚动条 */
  scrollbar-width: none;  /* Firefox 隐藏滚动条 */
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


.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.buttons {
  display: flex;
  justify-content: center;
}

.button {
  display: flex;
  padding: 10px 10px;
  font-size: 16px;
  color: #fff;
  background-color: #ccc;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 20px;
  margin-right: 20px;
}

.is-active {
  color: #fff;
  background-color: #0bc2d6;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  width: 95%;
  height: 600px;
}

.chart-container-month {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  width: 95%;
  height: 1000px;
}
</style>
