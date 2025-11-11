<template>
  <div class="dock-outer">
    <div class="dock-panel">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="dock-item"
        @mouseenter="hoveredItem = index"
        @mouseleave="hoveredItem = -1"
        @click="item.onClick"
      >
        <div class="dock-icon">
          <i :class="item.iconClass"></i>
        </div>
        <div v-if="hoveredItem === index" class="dock-label">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomDock',
  data() {
    return {
      hoveredItem: -1
    }
  },
  computed: {
    items() {
      return [
        {
          label: '返回',
          iconClass: 'fas fa-arrow-left',
          onClick: this.handleBack
        },
        {
          label: '首页',
          iconClass: 'fas fa-home',
          onClick: this.handleHome
        },
        {
          label: '博客',
          iconClass: 'fas fa-book',
          onClick: this.handleBlog
        },
        {
          label: '协作',
          iconClass: 'fas fa-users',
          onClick: this.handleCollaboration
        },
        {
          label: '面试',
          iconClass: 'fas fa-question-circle',
          onClick: this.handleInterview
        },
        {
          label: '刷新',
          iconClass: 'fas fa-sync-alt',
          onClick: this.handleRefresh
        }
      ]
    }
  },
  methods: {
    handleBack() {
      window.history.back()
    },
    handleHome() {
      this.$router.push('/')
    },
    handleBlog() {
      this.$router.push('/blog')
    },
    handleCollaboration() {
      this.$router.push('/collaboration')
    },
    handleInterview() {
      this.$router.push('/interview')
    },
    handleRefresh() {
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.dock-outer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  max-width: 100%;
  z-index: 9998;
  pointer-events: none; /* 允许点击穿透dock-outer */
}

.dock-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  gap: 0.75rem;
  border-radius: 1rem;
  background-color: rgba(6, 0, 16, 0.9); /* 半透明背景 */
  border: 1px solid #222;
  padding: 0.5rem;
  backdrop-filter: blur(10px); /* 背景模糊效果 */
  margin-bottom: 2.2rem;
  pointer-events: auto; /* 确保面板内元素可点击 */
}

.dock-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: rgba(6, 0, 16, 0.5);
  border: 1px solid #222;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.dock-item:hover {
  background-color: rgba(74, 179, 223, 0.2);
  border-color: #4ab3df;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.dock-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.dock-label {
  position: absolute;
  top: -2rem;
  left: 50%;
  width: fit-content;
  white-space: nowrap;
  border-radius: 0.375rem;
  border: 1px solid #222;
  background-color: rgba(6, 0, 16, 0.9);
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: #fff;
  transform: translateX(-50%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

/* 浅色模式样式 */
:root:not(.dark) .dock-panel {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: #ddd;
}

:root:not(.dark) .dock-item {
  background-color: rgba(255, 255, 255, 0.8);
  border-color: #ddd;
}

:root:not(.dark) .dock-icon {
  color: #333;
}

:root:not(.dark) .dock-label {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: #ddd;
  color: #333;
}

:root:not(.dark) .dock-item:hover {
  background-color: rgba(74, 179, 223, 0.1);
  border-color: #4ab3df;
}

/* 深色模式样式 */
.dark .dock-panel {
  background-color: rgba(26, 26, 26, 0.9);
  border-color: #333;
}

.dark .dock-item {
  background-color: rgba(26, 26, 26, 0.8);
  border-color: #333;
}

.dark .dock-label {
  background-color: rgba(26, 26, 26, 0.95);
  border-color: #333;
}

.dark .dock-item:hover {
  background-color: rgba(74, 179, 223, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .dock-panel {
    gap: 0.5rem;
    padding: 0.375rem;
    margin-bottom: 0.375rem;
  }
  
  .dock-item {
    width: 45px;
    height: 45px;
  }
  
  .dock-icon {
    font-size: 18px;
  }
  
  .dock-label {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
    top: -1.8rem;
  }
}

@media (max-width: 480px) {
  .dock-panel {
    gap: 0.375rem;
    padding: 0.3rem;
    margin-bottom: 0.25rem;
  }
  
  .dock-item {
    width: 40px;
    height: 40px;
  }
  
  .dock-icon {
    font-size: 16px;
  }
}
</style>