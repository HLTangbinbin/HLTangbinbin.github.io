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
        imageSrc: './images/providentFund.jpg', // 图片路径
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
        const scaledWidth = this.imgWidth * this.currentScale;
        const scaledHeight = this.imgHeight * this.currentScale;
  
        // 根据当前缩放比例更新图片样式
        this.imageStyle = {
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transform: `scale(1)`, // 应用当前缩放比例
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
        align-items: flex-start;
        width: 100%;
        height: 100%;
        padding-top: 50px;
        padding-bottom: 50px;
        overflow: hidden;
        touch-action: none;
    }

    /* 大屏幕设置 */
    @media (min-width: 769px) {
        img {
            max-width: 100%; /* 确保图片在大屏幕上撑满容器 */
        }
    }

    /* 移动设备设置 */
    @media (max-width: 768px) {
        img {
            max-width: 100%; /* 移动设备图片保持原始大小 */
            height: auto;    /* 自动调整高度，保持图片比例 */
        }
    }
  </style>