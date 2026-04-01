<template>
  <div class="app-root">
    <header class="app-header">
      <div class="title-cluster">
        <h1 class="main-title">大唐统计局</h1>
        <button class="theme-toggle" type="button" @click="toggleTheme" :aria-label="themeLabel" :title="themeLabel">
          <span class="theme-label">{{ theme === 'dark' ? '白天' : '暗黑' }}</span>
          <svg v-if="theme === 'dark'" viewBox="0 0 24 24" class="theme-icon" aria-hidden="true">
            <path
              d="M6.76 4.84 5.35 3.43 3.93 4.84l1.42 1.41 1.41-1.41ZM1 13h3v-2H1v2Zm10 10h2v-3h-2v3Zm9.07-18.16-1.41-1.41-1.42 1.41 1.42 1.41 1.41-1.41ZM17.24 19.16l1.41 1.41 1.42-1.41-1.42-1.41-1.41 1.41ZM20 13h3v-2h-3v2ZM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0-5h-2v3h2V1Z"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="theme-icon" aria-hidden="true">
            <path
              d="M21.75 15.5A9 9 0 0 1 10.5 2.25a.75.75 0 0 0-.82 1.18A7.5 7.5 0 1 0 20.57 14.3a.75.75 0 0 0 1.18-.8Z"
            />
          </svg>
        </button>
      </div>
    </header>
    
    <NavBar :navConfig="navConfig" />

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">系统初始化中...</div>
    </div>

    <router-view v-else></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";
import { navConfig } from "@/config/navConfig";

export default {
  name: "App",
  components: { NavBar },
  data() {
    return {
      loading: true,
      theme: 'light',
      navConfig 
    };
  },
  async mounted() {
    this.initTheme();

    // 地图准备就绪后，关闭全屏Loading并放行渲染
    setTimeout(() => {
      this.loading = false;
    }, 300);
  },
  computed: {
    themeLabel() {
      return this.theme === 'dark' ? '切换到日间模式' : '切换到暗黑模式';
    }
  },
  methods: {
    initTheme() {
      const savedTheme = window.localStorage.getItem('datang-theme');
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', this.theme);
      window.dispatchEvent(new CustomEvent('themechange', { detail: this.theme }));
    },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.theme);
      window.localStorage.setItem('datang-theme', this.theme);
      window.dispatchEvent(new CustomEvent('themechange', { detail: this.theme }));
    }
  }
};
</script>

<style>
/* CSS 保持你原本的完全不变，无需修改这里的内容 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* 禁止右键菜单（可选） */
body, html, #app {
  -webkit-touch-callout: none; /* iOS Safari */
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.app-root {
  min-height: 100vh;
  padding-bottom: 30px;
  background-color: var(--bg-page);
}

.app-header {
  width: min(95%, 1240px);
  margin: 0 auto;
  padding: 16px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-cluster {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-width: 0;
}

.main-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  line-height: 1;
}

.theme-toggle {
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--border-default);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--color-accent-strong);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.theme-toggle:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}

.theme-icon {
  width: 15px;
  height: 15px;
  fill: currentColor;
}

.theme-label {
  display: inline-flex;
  align-items: center;
}

.page-wrapper {
  padding-top: 20px;
  padding-bottom: 60px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-overlay);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 6px solid var(--color-accent);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.loading-text {
  font-size: 18px;
  color: var(--color-accent-strong);
  font-weight: bold;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .app-header {
    width: 96%;
    padding: 12px 0 8px;
  }

  .title-cluster {
    gap: 14px;
  }

  .main-title {
    font-size: 20px;
  }

  .theme-toggle {
    height: 30px;
    padding: 0 10px;
    font-size: 12px;
    gap: 5px;
  }

  .theme-icon {
    width: 13px;
    height: 13px;
  }
}
</style>
