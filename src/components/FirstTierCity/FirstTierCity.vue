<template>
  <div>
    <NavBar :navItems="navItems" :basePath="$route.matched[0].path" />
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/utils/NavBar.vue';
import { navConfig } from '@/config/navConfig';

export default {
  name: 'FirstTierCity',
  components: { NavBar },
  computed: {
    navItems() {
      const group = navConfig.find(i => i.path === this.$route.matched[0]?.path);
      return group?.children || [];
    }
  }
};
</script>