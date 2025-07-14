<template>
  <div>
    <div class="nav-wrapper">
      <nav class="nav-container">
      <router-link to="/WH/WHNewHouse" class="nav"
        :class="{ active: $route.path.startsWith('/WH/WHNewHouse') }">新房</router-link>
      <router-link to="/WH/WHSecondHandHouse" class="nav"
        :class="{ active: $route.path === '/WH/WHSecondHandHouse' }">二手房</router-link>
      <router-link to="/WH/WHGDP" class="nav" :class="{ active: $route.path === '/WH/WHGDP' }">GDP</router-link>
      <router-link to="/WH/WHPopulation" class="nav"
        :class="{ active: $route.path === '/WH/WHPopulation' }">人口</router-link>
      <router-link to="/WH/WHRealEstate" class="nav"
        :class="{ active: $route.path.startsWith('/WH/WHRealEstate') }">房地产</router-link>
      <router-link to="/WH/WHFinance" class="nav"
        :class="{ active: $route.path === '/WH/WHFinance' }">财政</router-link>
      <router-link to="/WH/WHEducation" class="nav" :class="{ active: $route.path === '/WH/WHEducation' }">教育</router-link>
      <router-link to="/WH/WHMedical" class="nav" :class="{ active: $route.path === '/WH/WHMedical' }">医疗</router-link>
    </nav>
    </div>

    <router-view></router-view> <!-- 用于显示子路由的内容 -->
  </div>
</template>

<script>

// 因为路由配置已经处理了组件的引入

export default {
  name: 'WH'
};
</script>


