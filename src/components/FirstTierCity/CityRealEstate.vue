<template>
    <div>
        <div class="nav-wrapper">
            <nav class="nav-container">
                <router-link to="/FirstTierCity/CityRealEstate/CityRealEstateInvest" class="nav"
                    :class="{ active: $route.path === '/FirstTierCity/CityRealEstate/CityRealEstateInvest' }">投资</router-link>
                <router-link to="/FirstTierCity/CityRealEstate/CityRealEstateSell" class="nav"
                    :class="{ active: $route.path === '/FirstTierCity/CityRealEstate/CityRealEstateSell' }">销售</router-link>
                <router-link to="/FirstTierCity/CityRealEstate/CityRealEstatePriceIndices" class="nav"
                    :class="{ active: $route.path === '/FirstTierCity/CityRealEstate/CityRealEstatePriceIndices' }">价格指数</router-link>
            </nav>
        </div>

        <router-view></router-view> <!-- 用于显示子路由的内容 -->
    </div>
</template>

<script>
// 不需要在这里直接引入 RealEstateInvest 和 RealEstateSell
// 因为路由配置已经处理了组件的引入

export default {
    name: 'CityRealEstate'
};
</script>