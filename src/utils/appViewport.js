import { ref, readonly } from 'vue';
import { getThemeMode } from './theme.js';

const windowWidth = ref(typeof window === 'undefined' ? 1024 : window.innerWidth);
const themeMode = ref(getThemeMode());

let listenerAttached = false;

function syncWindowWidth() {
  windowWidth.value = window.innerWidth;
}

function syncThemeMode(event) {
  themeMode.value = event?.detail || getThemeMode();
}

function ensureViewportListeners() {
  if (listenerAttached || typeof window === 'undefined') return;
  window.addEventListener('resize', syncWindowWidth);
  window.addEventListener('themechange', syncThemeMode);
  listenerAttached = true;
}

export function useAppViewport() {
  ensureViewportListeners();

  return {
    windowWidth: readonly(windowWidth),
    themeMode: readonly(themeMode),
  };
}
