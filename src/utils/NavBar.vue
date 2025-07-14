<template>
  <div class="nav-wrapper" ref="wrapper">
    <nav class="nav-container">
      <router-link
        v-for="item in items"
        :key="item.path"
        :to="item.fullPath"
        class="nav-link"
        :class="{ active: isActive(item.fullPath) }"
      >
        {{ item.label }}
      </router-link>
    </nav>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted, nextTick } from 'vue';

export default {
  name: 'NavBar',
  props: {
    navItems: {
      type: Array,
      required: true
    },
    basePath: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute();
    const wrapper = ref(null);

    const items = computed(() =>
      props.navItems.map(item => ({
        ...item,
        fullPath: `${props.basePath.replace(/\/$/, '')}/${item.path}`
      }))
    );

    const isActive = path => route.path.startsWith(path);

    const scrollToActive = () => {
      nextTick(() => {
        const wrapperEl = wrapper.value;
        const activeEl = wrapperEl?.querySelector('.nav-link.active');
        if (activeEl && wrapperEl) {
          const offset =
            activeEl.offsetLeft + activeEl.offsetWidth / 2 - wrapperEl.offsetWidth / 2;
          wrapperEl.scrollTo({ left: offset, behavior: 'smooth' });
        }
      });
    };

    onMounted(scrollToActive);
    watch(() => route.path, scrollToActive);

    return { wrapper, items, isActive };
  }
};
</script>

<style scoped>
.nav-wrapper {
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  padding: 12px 0;
  -webkit-overflow-scrolling: touch;
}
.nav-wrapper::-webkit-scrollbar {
  display: none;
}
.nav-container {
  display: inline-flex;
  padding: 10px 16px;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 -4px 12px rgba(0, 0, 0, 0.08);
  margin: 0 auto;
}
.nav-link {
  padding: 10px 20px;
  margin: 0 10px;
  font-weight: bold;
  border-radius: 20px;
  text-decoration: none;
  color: #000;
  transition: 0.3s;
}
.nav-link.active {
  background-color: #0bc2d6;
  color: #fff;
}
</style>