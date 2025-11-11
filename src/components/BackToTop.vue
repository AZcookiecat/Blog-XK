<template>
  <button 
    class="back-to-top"
    v-show="showButton"
    @click="scrollToTop"
    aria-label="回到顶部"
  >
    <i class="fas fa-arrow-up"></i>
  </button>
</template>

<script>
export default {
  name: 'BackToTop',
  data() {
    return {
      showButton: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      // 当页面滚动超过300px时显示按钮
      this.showButton = window.pageYOffset > 300
    },
    scrollToTop() {
      // 平滑滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color, #4ab3df);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 9999;
  /* 确保是完美的圆形 */
  padding: 0;
  overflow: hidden;
}

/* 悬停和点击时变为白色背景黑色箭头 */
.back-to-top:hover,
.back-to-top:active {
  background-color: white;
  color: black;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.back-to-top:active {
  transform: translateY(-1px);
}

/* 深色模式样式 */
.dark .back-to-top {
  background-color: var(--primary-color-dark, #4ab3df);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 深色模式下悬停和点击时也变为白色背景黑色箭头 */
.dark .back-to-top:hover,
.dark .back-to-top:active {
  background-color: white;
  color: black;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
}
</style>