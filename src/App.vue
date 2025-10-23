<template>
  <div class="app" :class="{ 'dark-mode': isDarkMode }">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-brand">
          <span class="brand-name">Ciin7mo</span>
          <span class="brand-subtitle">Personal Blog</span>
        </router-link>
        
        <div class="navbar-menu">
          <router-link to="/" class="navbar-link" :class="{ active: $route.path === '/' }">
            <i class="fas fa-home"></i>
            首页
          </router-link>
          <router-link to="/blog" class="navbar-link" :class="{ active: $route.path.startsWith('/blog') && $route.path !== '/blog/' }">
            <i class="fas fa-book"></i>
            博客
          </router-link>
          <router-link to="/projects" class="navbar-link" :class="{ active: $route.path === '/projects' }">
            <i class="fas fa-code"></i>
            项目
          </router-link>
          
          <router-link to="/collaboration" class="navbar-link" :class="{ active: $route.path === '/collaboration' }">
            <i class="fas fa-users"></i>
            协作
          </router-link>
          
          <router-link to="/contact" class="navbar-link" :class="{ active: $route.path === '/contact' }">
            <i class="fas fa-envelope"></i>
            联系我
          </router-link>
          
          <!-- 黑白模式切换按钮 -->
          <button 
            class="dark-mode-toggle"
            @click="toggleDarkMode"
            title="切换黑白模式"
          >
            <i v-if="isDarkMode" class="fas fa-sun"></i>
            <i v-else class="fas fa-moon"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 版权所有  2025 Ciin7mo的个人博客 本站已安全运行 <span class="time-animation">{{ daysRunning }}</span> 天 <span class="time-animation">{{ hoursRunning }}</span> 时 现在时间：
          <span v-for="char in currentTime.split('')" :key="char" :class="{ 'time-animation': /\\d/.test(char) }">
            {{ char }}
          </span> {{ dayOfWeek }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 初始运行时间设置为2025年3月12日
      initialRunDate: new Date(2025, 2, 12),
      timer: null,
      mediaQueryListener: null,
      // 黑白模式状态，默认使用localStorage保存的设置或根据系统偏好自动选择
      isDarkMode: localStorage.getItem('darkMode') === 'true' || 
                  (localStorage.getItem('darkMode') === null && 
                  window.matchMedia('(prefers-color-scheme: dark)').matches)
    };
  },
  computed: {
    // 计算网站已运行的天数和小时数
    daysRunning() {
      const now = new Date();
      const diffTime = Math.abs(now - this.initialRunDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    hoursRunning() {
      const now = new Date();
      const diffTime = Math.abs(now - this.initialRunDate);
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return diffHours;
    },
    // 获取当前时间
    currentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    // 获取星期几
    dayOfWeek() {
      const now = new Date();
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return days[now.getDay()];
    }
  },
  methods: {
    // 切换黑白模式
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      // 保存到localStorage，使设置在页面刷新后保持
      localStorage.setItem('darkMode', this.isDarkMode);
      this.updateDarkModeClass();
    },
    
    updateDarkModeClass() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-body');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-body');
      }
    }
  },
  
  mounted() {
    // 设置定时器每秒更新时间
    this.timer = setInterval(() => {
      this.$forceUpdate();
    }, 1000);
    
    // 设置暗黑模式样式
    this.updateDarkModeClass();
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQueryListener = (e) => {
      // 只有在没有用户设置的情况下才响应系统主题变化
      if (!localStorage.getItem('darkMode')) {
        this.isDarkMode = e.matches;
        this.updateDarkModeClass();
      }
    }
    mediaQuery.addEventListener('change', this.mediaQueryListener);
  },
  
  beforeUnmount() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    // 移除系统主题变化的监听
    if (this.mediaQueryListener) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* App容器样式 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  transition: background-color 0.3s ease;
}

/* 导航栏样式 */
.navbar {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.navbar-brand {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.brand-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #3498db;
  transition: color 0.3s ease;
}

.brand-subtitle {
  font-size: 0.8rem;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.navbar-link:hover {
  background-color: #f8f9fa;
  color: #3498db;
}

.navbar-link.active {
  background-color: #e8f4fd;
  color: #3498db;
}

/* 黑白模式切换按钮样式 */
.dark-mode-toggle {
  background: none;
  border: 2px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #2c3e50;
  font-size: 1.2rem;
}

.dark-mode-toggle:hover {
  background-color: #3498db;
  color: white;
}

.main-content {
  flex-grow: 1;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 黑白模式（暗黑模式）样式 */
.dark {
  color-scheme: dark;
}

.dark .app {
  background-color: #121212;
  color: #e0e0e0;
}

.dark .navbar {
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .navbar-brand,
.dark .navbar-link {
  color: #e0e0e0;
}

.dark .brand-name {
  color: #64b5f6;
}

.dark .brand-subtitle {
  color: #b0b0b0;
}

.dark .navbar-link:hover {
  background-color: #2a2a2a;
  color: #64b5f6;
}

.dark .navbar-link.active {
  background-color: #1e3a5f;
  color: #64b5f6;
}

.dark .dark-mode-toggle {
  color: #e0e0e0;
  border-color: #64b5f6;
}

.dark .dark-mode-toggle:hover {
  background-color: #64b5f6;
  color: white;
}

.dark .footer {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
  color: #ffffff;
}

.dark p {
  color: #cccccc;
}

.dark a {
  color: #64b5f6;
  transition: color 0.3s ease;
}

.dark a:hover {
  color: #90caf9;
}

.dark button {
  background-color: #34495e;
  color: #ffffff;
  border: 1px solid #5dade2;
  transition: all 0.3s ease;
}

.dark button:hover {
  background-color: #3498db;
  border-color: #5dade2;
}

.dark .card, .dark .blog-card, .dark .project-card {
  background-color: #1e1e1e;
  color: #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-color: #333;
}

.dark .blog-card:hover, .dark .project-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.dark .tag, .dark .project-tag {
  background-color: #34495e;
  color: #64b5f6;
}

.dark .dark-body {
  background-color: #121212;
  color: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }
  
  .navbar-menu {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .navbar-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
