<template>
    <div class="generic-layout">
      <NavBar :navItems="navItems" :basePath="currentBasePath" />
      <router-view />
    </div>
  </template>
  
  <script>
  import NavBar from '@/components/common/NavBar.vue';
  
  export default {
    name: 'GenericLayout',
    components: { NavBar },
    // 传统的 props 声明，ESLint 绝对不会报错
    props: {
      navItems: {
        type: Array,
        default: () => []
      },
      currentBasePath: {
        type: String,
        default: ''
      }
    }
  };
  </script>