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
import { useRoute } from "vue-router";
import { ref, computed, watch, onMounted, nextTick } from "vue";

export default {
  name: "NavBar",
  props: {
    navItems: { type: Array, required: true },
    basePath: { type: String, required: true }
  },
  setup(props) {
    const route = useRoute();
    const wrapper = ref(null);

    const items = computed(() =>
      props.navItems.map(item => ({
        ...item,
        fullPath: `${props.basePath.replace(/\/$/, "")}/${item.path}`
      }))
    );

    const isActive = path => route.path.startsWith(path);

    const scrollToActive = () => {
      nextTick(() => {
        const wrapperEl = wrapper.value;
        const activeEl = wrapperEl?.querySelector(".nav-link.active");
        if (activeEl && wrapperEl) {
          const offset =
            activeEl.offsetLeft + activeEl.offsetWidth / 2 - wrapperEl.offsetWidth / 2;
          wrapperEl.scrollTo({ left: offset, behavior: "smooth" });
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
/* 基础样式 */
.nav-wrapper {
  max-width: 1500px;
  margin: 0 auto;
  overflow-x: auto;
  white-space: nowrap;
  width: 95%;
  padding: 12px 0 16px;
  -webkit-overflow-scrolling: touch;
  text-align: center;
}

.nav-wrapper::-webkit-scrollbar {
  display: none;
}

.nav-container {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
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
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.nav-link.active {
  background-color: #0bc2d6;
  color: #fff;
}

.nav-link:not(.active):hover {
  background-color: #f0f9ff;
  color: #0bc2d6;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-container {
    padding: 8px 12px; /* 减小容器内边距 */
  }
  
  .nav-link {
    padding: 8px 16px; /* 减小链接内边距 */
    margin: 0 6px; /* 减小链接间距 */
    font-size: 0.9rem; /* 稍微减小字体大小 */
    border-radius: 18px; /* 调整圆角 */
  }
  
  .nav-wrapper {
    padding: 8px 0 12px; /* 减小容器上下内边距 */
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 6px 10px; /* 进一步减小容器内边距 */
  }
  
  .nav-link {
    padding: 8px 14px; /* 进一步调整内边距 */
    margin: 0 4px; /* 进一步减小间距 */
    font-size: 0.85rem; /* 进一步减小字体大小 */
    border-radius: 16px; /* 调整圆角 */
  }
  
  .nav-wrapper {
    padding: 6px 0 10px; /* 进一步减小容器上下内边距 */
  }
}

/* 触摸目标优化 */
.nav-link::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 20px);
  height: calc(100% + 20px);
}


/* 响应式调整 */
@media (max-width: 768px) {
  .nav-link::after {
    width: calc(100% + 16px);
    height: calc(100% + 16px);
  }
  
  .nav-link.active::before {
    bottom: -4px;
    width: 4px;
    height: 4px;
  }
}

@media (max-width: 480px) {
  .nav-link::after {
    width: calc(100% + 12px);
    height: calc(100% + 12px);
  }
  
  .nav-link.active::before {
    bottom: -3px;
    width: 3px;
    height: 3px;
  }
}
</style>