<template>
  <div class="card-nav-container" :class="className">
    <nav ref="navRef" class="card-nav" :class="{ open: isExpanded }" :style="{ backgroundColor: baseColor, height: isExpanded ? expandedHeight + 'px' : '60px' }">
      <div class="card-nav-top">
        <div
          class="hamburger-menu"
          :class="{ open: isHamburgerOpen }"
          @click="toggleMenu"
          role="button"
          :aria-label="isExpanded ? '关闭菜单' : '打开菜单'"
          tabindex="0"
          :style="{ color: menuColor || '#000' }"
        >
          <div class="hamburger-line"></div>
          <div class="hamburger-line"></div>
        </div>

        <div class="logo-container">
          <img v-if="logo" :src="logo" :alt="logoAlt" class="logo" />
          <span v-else class="logo-text">Ciin7mo</span>
        </div>

        <div class="toggle-switch" @click="toggleSwitch">
          <div class="toggle-slider" :class="{ active: isSwitchOn }">
            <div class="toggle-dot"></div>
          </div>
        </div>
      </div>

      <div class="card-nav-content" :aria-hidden="!isExpanded">
        <div class="nav-card"
              v-for="(item, idx) in displayItems"
              :key="`${item.label}-${idx}`"
              :ref="el => setCardRef(el, idx)"
              :style="{ backgroundColor: item.bgColor, color: item.textColor, animationDelay: idx * 0.08 + 's' }"
              @click="handleCardClick(item)"
        >
          <div class="nav-card-label">{{ item.label }}</div>
          <div class="nav-card-links">
            <a
              v-for="(lnk, i) in item.links"
              :key="`${lnk.label}-${i}`"
              class="nav-card-link"
              :href="lnk.href || '#'"
              :aria-label="lnk.ariaLabel"
              @click.prevent="handleLinkClick(lnk)"
            >
              {{ lnk.label }}
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'CardNav',
  props: {
    logo: {
      type: String,
      default: null
    },
    logoAlt: {
      type: String,
      default: 'Logo'
    },
    items: {
      type: Array,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    ease: {
      type: String,
      default: 'power3.out'
    },
    baseColor: {
      type: String,
      default: '#fff'
    },
    menuColor: {
      type: String,
      default: '#000'
    },
    buttonBgColor: {
      type: String,
      default: '#111'
    },
    buttonTextColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      isHamburgerOpen: false,
      isExpanded: false,
      cardsRef: [],
      expandedHeight: 0,
      isSwitchOn: localStorage.getItem('darkMode') === 'true' || 
                 (localStorage.getItem('darkMode') === null && 
                 window.matchMedia('(prefers-color-scheme: dark)').matches)
    };
  },
  computed: {
    displayItems() {
      return this.items || [];
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    // 初始化时设置当前主题
    this.updateDarkMode(this.isSwitchOn);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    setCardRef(el, index) {
      if (el) {
        this.cardsRef[index] = el;
      }
    },
    calculateHeight() {
      const navEl = this.$refs.navRef;
      if (!navEl) return 180; // 减小默认高度

      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        const contentEl = navEl.querySelector('.card-nav-content');
        if (contentEl) {
          const wasVisible = contentEl.style.visibility;
          const wasPointerEvents = contentEl.style.pointerEvents;
          const wasPosition = contentEl.style.position;
          const wasHeight = contentEl.style.height;

          contentEl.style.visibility = 'visible';
          contentEl.style.pointerEvents = 'auto';
          contentEl.style.position = 'static';
          contentEl.style.height = 'auto';

          const topBar = 60;
          const padding = 8; // 减小内边距
          const contentHeight = contentEl.scrollHeight;

          contentEl.style.visibility = wasVisible;
          contentEl.style.pointerEvents = wasPointerEvents;
          contentEl.style.position = wasPosition;
          contentEl.style.height = wasHeight;

          return topBar + contentHeight + padding;
        }
      }
      return 180; // 减小默认高度
    },
    handleResize() {
      if (this.isExpanded) {
        this.expandedHeight = this.calculateHeight();
      }
    },
    toggleMenu() {
      if (!this.isExpanded) {
        this.isHamburgerOpen = true;
        this.expandedHeight = this.calculateHeight();
        // 在下一个动画帧设置isExpanded以触发CSS过渡
        this.$nextTick(() => {
          this.isExpanded = true;
        });
      } else {
        this.isHamburgerOpen = false;
        this.isExpanded = false;
        // 动画结束后重置高度
        setTimeout(() => {
          if (!this.isExpanded) {
            this.expandedHeight = 0;
          }
        }, 300);
      }
    },
    handleLinkClick(link) {
      console.log('Link clicked:', link);
      // 确保链接点击功能正常工作
      if (link.href) {
        // 检查是否是锚点链接（#开头）
        if (link.href.startsWith('#')) {
          // 平滑滚动到锚点位置
          this.smoothScrollToAnchor(link.href);
        } else if (this.$router && link.href.startsWith('/')) {
          // 如果是站内链接，使用Vue Router
          this.$router.push(link.href);
        } else {
          window.open(link.href, '_blank');
        }
      }
      
      // 点击链接后关闭菜单
      if (this.isExpanded) {
        this.toggleMenu();
      }
    },
    // 平滑滚动到锚点位置
    smoothScrollToAnchor(anchor) {
      const element = document.querySelector(anchor);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    },
    // 添加导航卡点击事件，点击卡片本身也能导航
    handleCardClick(item) {
      console.log('Card clicked:', item);
      if (item.links && item.links.length > 0) {
        // 如果卡片有链接，优先使用第一个链接
        const firstLink = item.links[0];
        if (firstLink.href) {
          // 检查是否是锚点链接
          if (firstLink.href.startsWith('#')) {
            // 使用平滑滚动
            this.smoothScrollToAnchor(firstLink.href);
          } else if (this.$router && firstLink.href.startsWith('/')) {
            this.$router.push(firstLink.href);
          } else {
            window.open(firstLink.href, '_blank');
          }
        }
      }
      
      // 点击卡片后关闭菜单
      if (this.isExpanded) {
        this.toggleMenu();
      }
    },
    toggleSwitch() {
      this.isSwitchOn = !this.isSwitchOn;
      this.updateDarkMode(this.isSwitchOn);
      // 保存到localStorage
      localStorage.setItem('darkMode', this.isSwitchOn);
      console.log('主题状态:', this.isSwitchOn ? '深色模式' : '浅色模式');
      // 通知父组件状态变化
      this.$emit('switch-change', this.isSwitchOn);
    },
    
    updateDarkMode(isDark) {
      // 更新文档的深色模式类
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-body');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-body');
      }
      
      // 触发事件通知父组件
      this.$emit('switch-change', isDark);
    }
  }
};
</script>

<style scoped>
.card-nav-container {
  position: absolute;
  top: 2em;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  z-index: 99;
  box-sizing: border-box;
}

.card-nav {
  display: block;
  padding: 0;
  background-color: white;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  will-change: height;
  transition: height 0.4s ease;
}

.card-nav-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.45rem 0.55rem 1.1rem;
  z-index: 2;
}

.hamburger-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 6px;
}

.hamburger-menu:hover .hamburger-line {
  opacity: 0.75;
}

.hamburger-line {
  width: 30px;
  height: 2px;
  background-color: currentColor;
  transition:
    transform 0.25s ease,
    opacity 0.2s ease,
    margin 0.3s ease;
  transform-origin: 50% 50%;
}

.hamburger-menu.open .hamburger-line:first-child {
  transform: translateY(4px) rotate(45deg);
}

.hamburger-menu.open .hamburger-line:last-child {
  transform: translateY(-4px) rotate(-45deg);
}

.logo-container {
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.logo {
  height: 28px;
}

.logo-text {
  font-family: 'LogoFont', sans-serif;
  font-size: 1.4rem;
  font-weight: normal;
  color: #000;
  line-height: 1.2;
  letter-spacing: 0.02em;
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  width: 48px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.toggle-slider {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  border-radius: 24px;
  position: relative;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  padding: 2px;
  box-sizing: border-box;
}

.toggle-slider.active {
  background-color: #345ea7;
}

.toggle-dot {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  left: 2px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-slider.active .toggle-dot {
  transform: translateX(24px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .toggle-switch {
    display: none;
  }
}

.card-nav-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  padding: 0.4rem; /* 减小内边距 */
  display: flex;
  align-items: flex-end;
  gap: 8px; /* 减小间距 */
  visibility: hidden;
  pointer-events: none;
  z-index: 1;
}

.card-nav.open .card-nav-content {
  visibility: visible;
  pointer-events: auto;
}

.nav-card {
  height: 100%;
  flex: 1 1 0;
  min-width: 0;
  border-radius: calc(0.75rem - 0.2rem);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px 12px; /* 减小内边距 */
  gap: 6px; /* 减小间距 */
  user-select: none;
  cursor: pointer; /* 添加指针样式表示可点击 */
  opacity: 0;
  transform: translateY(30px); /* 减小移动距离 */
  animation: fadeInUp 0.4s ease forwards;
}

.nav-card:hover {
  transform: translateY(-2px); /* 悬停效果 */
  transition: transform 0.2s ease;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-card-label {
  font-weight: 400;
  font-size: 18px; /* 减小字体大小 */
  letter-spacing: -0.5px;
}

.nav-card-links {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-card-link {
  font-size: 14px; /* 小字 */
  cursor: pointer;
  text-decoration: none;
  color: white; /* 确保文字为白色 */
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 0; /* 增加点击区域 */
}

.nav-card-link:hover {
  /* 移除hover效果，保持颜色不变 */
  text-decoration: none;
}

.nav-card-link-icon {
  font-size: 12px;
}

@media (max-width: 768px) {
  .card-nav-container {
    width: 90%;
    top: 1.2em;
  }

  .card-nav-top {
    padding: 0.5rem 1rem;
    justify-content: space-between;
  }

  .hamburger-menu {
    order: 2;
  }

  .logo-container {
    position: static;
    transform: none;
    order: 1;
  }

  .card-nav-cta-button {
    display: none;
  }

  .card-nav-content {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 0.5rem;
    bottom: 0;
    justify-content: flex-start;
  }

  .nav-card {
    height: auto;
    min-height: 50px; /* 减小高度 */
    flex: 1 1 auto;
    max-height: none;
  }

  .nav-card-label {
    font-size: 16px; /* 减小字体大小 */
  }

  .nav-card-link {
    font-size: 13px; /* 减小字体大小 */
  }
}

/* 适配暗黑模式 */
:global(.dark) .card-nav {
  background-color: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

:global(.dark) .logo-text {
  color: #fff;
}

:global(.dark) .toggle-slider {
  background-color: #333;
}

:global(.dark) .toggle-slider.active {
  background-color: #345ea7;
}

/* 确保黑暗模式下的其他元素样式 */
:global(.dark) .hamburger-line {
  background-color: #fff;
}

/* 目录在深色模式下的样式优化 */
:global(.dark) .nav-card {
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

:global(.dark) .nav-card:hover {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.15);
}

:global(.dark) .nav-card-label {
  color: #f0f0f0;
}

:global(.dark) .nav-card-link {
  color: #d0d0d0;
}

:global(.dark) .nav-card-link:hover {
  color: #fff;
  text-decoration: underline;
}

:global(.dark) .logo {
  filter: brightness(1.2);
}

/* 确保暗黑模式下的下拉菜单过渡效果 */
:global(.dark) .card-nav-content {
  background: transparent;
}

/* 适配移动端深色模式 */
@media (max-width: 768px) {
  :global(.dark) .card-nav {
    background-color: #1a1a1a;
  }
  
  :global(.dark) .card-nav-top {
    background-color: #1a1a1a;
  }
}
</style>