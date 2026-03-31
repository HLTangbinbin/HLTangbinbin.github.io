<template>
  <div class="super-nav-wrapper">
    <div class="nav-track scrollable-track" ref="mainTrack">

      <div class="nav-section level-1">
        <router-link v-for="l1 in navConfig" :key="l1.path" :to="l1.path" class="nav-pill l1-pill"
          :class="{ active: isL1Active(l1.path) }">
          {{ l1.label }}
        </router-link>
      </div>

      <div class="nav-divider" v-if="currentL2Items.length > 0"></div>

      <div class="nav-section level-2 scrollable-sub-track" v-if="currentL2Items.length > 0">
        <router-link v-for="l2 in currentL2Items" :key="l2.fullPath" :to="l2.fullPath" class="nav-pill l2-pill"
          :class="{ active: isL2Active(l2.fullPath) }">
          {{ l2.label }}
        </router-link>
      </div>

      <div class="nav-divider" v-if="currentL3Items.length > 0"></div>

      <div class="nav-section level-3" v-if="currentL3Items.length > 0">
        <router-link v-for="l3 in currentL3Items" :key="l3.fullPath" :to="l3.fullPath" class="nav-pill l3-pill"
          active-class="active">
          {{ l3.label }}
        </router-link>
      </div>

    </div>
  </div>
</template>

<script>
import { computed, watch, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "NavBar",
  props: {
    navConfig: { type: Array, required: true }
  },
  setup(props) {
    const route = useRoute();
    const mainTrack = ref(null);

    const currentL1 = computed(() => {
      return props.navConfig.find(l1 => {
        const p = l1.path.startsWith('/') ? l1.path : `/${l1.path}`;
        return route.path.startsWith(p);
      }) || props.navConfig[0];
    });

    const currentL2Items = computed(() => {
      if (!currentL1.value || !currentL1.value.children) return [];
      const p1 = currentL1.value.path.startsWith('/') ? currentL1.value.path : `/${currentL1.value.path}`;
      return currentL1.value.children.map(l2 => ({
        ...l2,
        fullPath: `${p1}/${l2.path.replace(/^\//, '')}`
      }));
    });

    const currentL3Items = computed(() => {
      for (const l1 of props.navConfig) {
        const p1 = l1.path.startsWith('/') ? l1.path : `/${l1.path}`;
        if (route.path.startsWith(p1) && l1.children) {
          for (const l2 of l1.children) {
            const p2 = `${p1}/${l2.path.replace(/^\//, '')}`;
            if (route.path.startsWith(p2) && l2.children && l2.children.length > 0) {
              return l2.children.map(l3 => ({
                ...l3,
                fullPath: `${p2}/${l3.path.replace(/^\//, '')}`
              }));
            }
          }
        }
      }
      return [];
    });

    const isL1Active = (path) => {
      const p = path.startsWith('/') ? path : `/${path}`;
      return route.path.startsWith(p);
    };

    const isL2Active = (path) => route.path.startsWith(path);
    // 智能滚动居中逻辑（彻底修复向左不回滚的问题）
    const scrollToActive = () => {
      nextTick(() => {
        const activeEl = document.querySelector('.l3-pill.active') ||
          document.querySelector('.l2-pill.active') ||
          document.querySelector('.l1-pill.active');

        if (!activeEl) return;

        // 直接使用浏览器原生 API，无论向左向右，强制在父容器中水平居中平滑滚动！
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      });
    };

    onMounted(scrollToActive);
    watch(() => route.path, scrollToActive);

    return { currentL2Items, currentL3Items, isL1Active, isL2Active, mainTrack };
  }
};
</script>

<style scoped>
.super-nav-wrapper {
  width: 95%;
  max-width: 1200px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
}

.nav-track {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  background: var(--bg-card);
  border-radius: 30px;
  padding: 12px 12px;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-soft);
  box-sizing: border-box;
  position: relative;
  /* 配合 offsetLeft 计算偏移量 */
}

.nav-section {
  display: flex;
  align-items: center;
}

.level-1 {
  flex-shrink: 0;
}

.level-3 {
  flex-shrink: 0;
}

.level-2 {
  flex: 0 1 auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.level-2::-webkit-scrollbar {
  display: none;
}

/* 分隔线加粗加深，存在感增强 */
.nav-divider {
  width: 2px;
  height: 22px;
  background-color: var(--border-strong);
  border-radius: 2px;
  margin: 0 12px;
  flex-shrink: 0;
}

/* 统一字体加粗与所有层级的高亮状态 */
.nav-pill {
  padding: 6px 16px;
  margin: 0 3px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
  position: relative;
}

.nav-pill:not(.active):hover {
  color: var(--color-accent-strong);
  background-color: var(--bg-card-soft);
}

/* 一切层级激活效果众生平等，保持视觉锚点高度一致 */
.nav-pill.active {
  background-color: var(--color-accent-fill) !important;
  color: var(--color-accent-contrast) !important;
  border: 1px solid rgba(var(--color-accent-rgb), 0.18);
  box-shadow: inset 0 0 0 1px rgba(var(--color-accent-rgb), 0.08);
}

@media (max-width: 768px) {
  .super-nav-wrapper {
    margin: 0 auto 10px;
  }

  .nav-track {
    padding: 6px 8px;
    border-radius: 12px;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .nav-track::-webkit-scrollbar {
    display: none;
  }

  .level-2 {
    overflow-x: visible;
  }

  .nav-pill {
    padding: 5px 14px;
    font-size: 13px;
    margin: 0 2px;
  }

  .nav-divider {
    margin: 0 8px;
  }
}
</style>
