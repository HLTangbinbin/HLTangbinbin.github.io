<template>
    <div id="image-container">
      <div id="image-wrapper">
        <img
          ref="image"
          :src="imageSrc"
          :style="imageStyle"
          @load="onImageLoad"
          alt="加载失败"
        />
      </div>
    </div>
  </template>
  
  <script>
  import Hammer from 'hammerjs'; // 引入 Hammer.js
  
  export default {
    data() {
      return {
        imageSrc: '/images/providentFund.jpg', // 图片路径
        imgWidth: 0, // 原始图片宽度
        imgHeight: 0, // 原始图片高度
        currentScale: 1, // 实时缩放比例
        imageStyle: { // 确保 imageStyle 被初始化
          width: '0px',
          height: '0px',
          transform: 'scale(1)', // 初始缩放
          transformOrigin: 'center center', // 从左上角开始缩放
        },
      };
    },
    mounted() {
      const imageElement = this.$refs.image; // 获取图片元素
      const hammer = new Hammer(imageElement); // 创建 Hammer 实例
      hammer.get('pinch').set({ enable: true }); // 启用捏合手势
  
      hammer.on('pinchmove', (e) => {
        const newScale = Math.max(0.5, Math.min(this.currentScale * e.scale, 3)); // 限制缩放范围 0.5-3 倍
        if (newScale !== this.currentScale) {
          this.currentScale = newScale;
          this.updateImageStyle(); // 更新样式
        }
      });
  
      hammer.on('pinchend', () => {
        hammer.get('pinch').manager.stop(); // 重置手势状态
      });
    },
    methods: {
      onImageLoad(event) {
        const img = event.target;
        this.imgWidth = img.naturalWidth;
        this.imgHeight = img.naturalHeight;
        this.updateImageStyle(); // 初始化样式
      },
      updateImageStyle() {
        const scaledWidth = this.imgWidth * 1; // 初始宽度为原始宽度的 1 倍
        const scaledHeight = this.imgHeight * 1; // 初始高度为原始高度的  倍
  
        // 根据当前缩放比例更新图片样式
        this.imageStyle = {
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transform: `scale(${this.currentScale})`, // 应用当前缩放比例
          transformOrigin: 'center center', // 从左上角缩放
        };
      },
    },
  };
  </script>
  
  <style scoped>
  #image-container {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 垂直对齐方式改为顶部对齐 */
    width: 100%;
    height: 100%; /* 高度减去顶部留白 */
    padding-top: 50px;
    padding-bottom: 50px;
    overflow: hidden; /* 防止图片溢出 */
    touch-action: none; /* 禁用浏览器默认手势 */
  }
  
  #image-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 垂直对齐方式改为顶部对齐 */
  }
  
  img {
    max-width: none; /* 防止图片被限制 */
    max-height: none;
    will-change: transform; /* 优化性能 */
  }
  </style>