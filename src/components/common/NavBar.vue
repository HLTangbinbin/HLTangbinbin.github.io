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
/* =========================================================
   🏠 1. 最外层包裹器 (控制整体外边距、横向滚动)
========================================================= */
.nav-wrapper {
  max-width: 1500px;
  margin: 0 auto;
  overflow-x: auto;
  white-space: nowrap;
  width: 95%;
  /* 🌟 调整：大幅缩小上下外围的留白 (原 12px 0 16px -> 8px 0 10px) */
  padding: 8px 0 10px; 
  -webkit-overflow-scrolling: touch;
  text-align: center;
}

/* 隐藏横向滚动条，保持底部清爽 */
.nav-wrapper::-webkit-scrollbar {
  display: none;
}

/* =========================================================
   📦 2. 导航条底板 (那个带阴影的白色大圆角胶囊)
========================================================= */
.nav-container {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  /* 🌟 调整：压低白色底板的高度 (原 10px 16px -> 6px 12px) */
  padding: 8px 14px; 
  background: #fff;
  border-radius: 999px; /* 极致圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 -2px 8px rgba(0, 0, 0, 0.02); /* 阴影调弱一点，更显高级 */
  margin: 0 auto;
}

/* =========================================================
   🔘 3. 单个导航按钮 (如：GDP、人口、财政)
========================================================= */
.nav-link {
  /* 🌟 调整：压扁按钮本身的高度，拉近文字边缘 (原 10px 20px -> 6px 16px) */
  padding: 8px 18px; 
  /* 🌟 调整：缩小按钮之间的左右间隙 (原 0 10px -> 0 4px) */
  margin: 0 4px; 
  font-weight: bold;
  border-radius: 20px;
  text-decoration: none;
  color: #000;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

/* 选中时的状态：青色背景，白色文字 */
.nav-link.active {
  background-color: #0bc2d6;
  color: #fff;
}

/* 未选中时的悬浮状态：浅蓝背景，青色文字 */
.nav-link:not(.active):hover {
  background-color: #f0f9ff;
  color: #0bc2d6;
}

/* =========================================================
   📱 4. 平板端适配 (max-width: 768px)
========================================================= */
@media (max-width: 768px) {
  .nav-wrapper {
    /* 平板进一步缩小外围留白 */
    padding: 6px 0 8px; 
  }

  .nav-container {
    /* 平板进一步压扁底板 */
    padding: 4px 8px; 
  }
  
  .nav-link {
    /* 平板按钮缩减 */
    padding: 6px 14px; 
    margin: 0 2px; /* 按钮挨得更紧 */
    font-size: 0.9rem; 
    border-radius: 18px; 
  }
}

/* =========================================================
   📱 5. 移动端小屏适配 (max-width: 480px)
========================================================= */
@media (max-width: 480px) {
  .nav-wrapper {
    /* 手机端极限压缩外围留白 */
    padding: 4px 0 6px; 
  }

  .nav-container {
    /* 手机端极限压扁底板 */
    padding: 4px 6px; 
  }
  
  .nav-link {
    /* 手机端按钮极限缩减 */
    padding: 4px 12px; 
    margin: 0 2px; 
    font-size: 0.85rem; 
    border-radius: 16px; 
  }
}

/* =========================================================
   👆 6. 触摸目标优化 (隐形扩大点击热区，防误触)
========================================================= */
.nav-link::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 12px); /* 因为间距变小了，热区外扩也适当缩小，防止重叠 */
  height: calc(100% + 12px);
}

/* 平板端热区微调 */
@media (max-width: 768px) {
  .nav-link::after {
    width: calc(100% + 8px);
    height: calc(100% + 8px);
  }
  
  /* 如果你的 active 带有下方小圆点，这里控制它的大小 */
  .nav-link.active::before {
    bottom: -4px;
    width: 4px;
    height: 4px;
  }
}

/* 手机端热区微调 */
@media (max-width: 480px) {
  .nav-link::after {
    width: calc(100% + 6px);
    height: calc(100% + 6px);
  }
  
  .nav-link.active::before {
    bottom: -3px;
    width: 3px;
    height: 3px;
  }
}
</style>