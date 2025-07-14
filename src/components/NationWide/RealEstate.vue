<template>
  <div>
    <!-- 自动判断当前 basePath 与 navItems -->
    <NavBar :navItems="navItems" :basePath="basePath" />
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/utils/NavBar.vue';
import { navConfig } from '@/config/navConfig';

export default {
  name: 'RealEstate',
  components: { NavBar },
  computed: {
    navItems() {
      const matched = this.$route.matched;
      const basePath = matched[0]?.path;
      const secondPath = matched[1]?.path;

      const group = navConfig.find(i => i.path === basePath);
      if (!group) return [];

      const second = group.children?.find(i => `${basePath}/${i.path}` === secondPath);
      if (second?.children) {
        return second.children;
      }

      return group.children || [];
    },
    basePath() {
      const matched = this.$route.matched;
      if (matched.length >= 2) {
        return matched[1].path;
      }
      return matched[0]?.path || '';
    }
  }
};
</script>