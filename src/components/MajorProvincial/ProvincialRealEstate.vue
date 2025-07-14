<template>
    <div>
        <div class="nav-wrapper">
            <nav class="nav-container">
                <router-link to="/MajorProvincial/ProvincialRealEstate/ProvincialRealEstateInvest" class="nav"
                    :class="{ active: $route.path === '/MajorProvincial/ProvincialRealEstate/ProvincialRealEstateInvest' }">投资</router-link>
                <router-link to="/MajorProvincial/ProvincialRealEstate/ProvincialRealEstateSell" class="nav"
                    :class="{ active: $route.path === '/MajorProvincial/ProvincialRealEstate/ProvincialRealEstateSell' }">销售</router-link>
            </nav>
        </div>

        <router-view></router-view> <!-- 用于显示子路由的内容 -->
    </div>
</template>

<script>
// 不需要在这里直接引入 RealEstateInvest 和 RealEstateSell
// 因为路由配置已经处理了组件的引入

export default {
    name: 'ProvincialRealEstate'
};
</script>