<template>
  <div class="provident-fund-container">
    <p class="hint-text">点击下方图片可全屏放大查看</p>
    
    <el-image
      class="fund-image"
      :src="imageSrc"
      :preview-src-list="[imageSrc]"
      fit="contain"
      hide-on-click-modal
    >
      <template #placeholder>
        <div class="image-slot">数据图片加载中...</div>
      </template>
      <template #error>
        <div class="image-slot">图片加载失败，请检查网络</div>
      </template>
    </el-image>
  </div>
</template>

<script>
export default {
  name: 'ProvidentFund',
  data() {
    return {
      imageSrc: './images/providentFund.jpg',
    };
  }
};
</script>

<style scoped>
.provident-fund-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.hint-text {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
}

.fund-image {
  width: 95%;
  max-width: 1000px;
  border-radius: 8px;
  box-shadow: var(--shadow-soft);
  cursor: pointer; /* 提示用户可点击 */
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
  background: var(--bg-card-soft);
  color: var(--text-muted);
  font-size: 14px;
}
</style>
