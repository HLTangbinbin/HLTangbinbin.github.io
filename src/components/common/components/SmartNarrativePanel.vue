<template>
  <transition name="el-fade-in">
    <div v-if="store.enableSmartAnalysis.value && store.viewModeDisplay.value === 'chart' && store.smartNarrative.value"
      class="smart-narrative-panel">
      <div class="narrative-title">
        <el-icon>
          <MagicStick />
        </el-icon> 数据解读
      </div>
      <div class="narrative-content" v-html="store.smartNarrative.value"></div>
    </div>
  </transition>
</template>

<script setup>
import { inject } from 'vue';
import { MagicStick } from '@element-plus/icons-vue';

// 注入上帝状态机获取所有相关状态
const store = inject('chartStore');
</script>

<style scoped>
/* AI 智能洞察面板专属样式 */
.smart-narrative-panel {
  background: linear-gradient(135deg, #f0fcfd 0%, #ffffff 100%);
  border-left: 4px solid #0bc2d6;
  padding: 16px 20px;
  border-radius: 12px;
  margin: 0 auto 16px;
  width: 95%;
  max-width: 1500px;
  box-shadow: 0 4px 16px rgba(11, 194, 214, 0.08);
  box-sizing: border-box;
}

.narrative-title {
  font-size: 15px;
  font-weight: 700;
  color: #0bc2d6;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.narrative-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
  letter-spacing: 0.5px;
}

/* 因为 v-html 渲染的内容是不受 scoped 直接控制的，所以必须用 :deep() 穿透 */
.narrative-content :deep(strong) {
  color: #0f172a;
  margin: 0 3px;
  font-weight: 600;
}
</style>