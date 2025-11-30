<template>
  <ClickSpark 
    sparkColor="rgba(184,111,211,1)"
    sparkSize="30"
    sparkRadius="60"
    sparkCount="14"
    duration="900"
    easing="ease-out"
    extraScale="1"
  >
    <div class="app">
      <!-- 头部导航 -->
      <CardNav 
        :items="navItems"
        logoAlt="Ciin7mo Logo"
        :baseColor="isDarkMode ? '#1a1a1a' : '#fff'"
        :menuColor="isDarkMode ? '#fff' : '#000'"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
        @switch-change="handleSwitchChange"
      />
      

      <!-- 主内容区 -->
      <main class="content">
        <router-view />
      </main>

       <!-- 页脚 -->
      <footer class="footer">
        <div class="footer-content">
          <p>版权所有 2025 Ciin7mo的个人博客 <span style="font-size: 12px; color: #999;">本站已安全运行<span class="time-animation">{{ daysRunning }}</span>天<span class="time-animation">{{ hoursRunning }}</span>时 现在时间：<span v-for="(char, index) in currentTime.split('')" :key="`time-${char}-${index}`" :class="{ 'time-animation': /\d/.test(char) }">
                {{ char }}
             </span> {{ dayOfWeek }}</span>
          </p>
        </div>
      </footer>
      
      <!-- 回到顶部按钮 -->
      <BackToTop />
      <BottomDock />
    </div>
  </ClickSpark>
</template>


<script>
import CardNav from './components/CardNav.vue';
import BackToTop from './components/BackToTop.vue';
import BottomDock from './components/BottomDock.vue';
import ClickSpark from './components/ClickSpark.vue';

export default {
  components: {
    CardNav,
    BackToTop,
    BottomDock,
    ClickSpark
  },
  data() {
    return {
      // 导航栏数据
      navItems: [
        {  
          label: "首页", 
          bgColor: "#121113",         
          textColor: "#fff",          
          links: [            
            { label: "", href: "/", ariaLabel: "首页" }       
          ]        
        },
        {
          label: "博客",
          bgColor: "#170D27",
          textColor: "#fff",
          links: [
            { label: "", href: "/blog", ariaLabel: "查看所有博客文章" }
          ]
        },
        {
          label: "协作",
          bgColor: "#271E37",
          textColor: "#fff",
          links: [
            { label: "", href: "/collaboration", ariaLabel: "协作项目列表" }
          ]
        },
        {
          label: "面试",
          bgColor: "#372E47",
          textColor: "#fff",
          links: [
            { label: "", href: "/interview", ariaLabel: "面试题集合" }
          ]
        }
      ],
      // 初始运行时间设置为2025年3月12日
      initialRunDate: new Date(2025, 2, 12),
      timer: null,
      mediaQueryListener: null,
      // 黑白模式状态，默认使用localStorage保存的设置或根据系统偏好自动选择
      isDarkMode: localStorage.getItem('darkMode') === 'true' || 
                  (localStorage.getItem('darkMode') === null && 
                  window.matchMedia('(prefers-color-scheme: dark)').matches),
      // 先初始化为空字符串，在mounted中设置实际时间
      currentTimeValue: ''
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
      return this.currentTimeValue;
    },
    // 获取星期几
    dayOfWeek() {
      const now = new Date();
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return days[now.getDay()];
    }
  },
  
  methods: {
    // 获取当前时间并处理基于时间的自动主题切换
    getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      // 基于时间的自动主题切换逻辑
      const hour = now.getHours();
      
      // 检查是否应该自动切换主题（避免与用户手动切换冲突）
      // 只有当localStorage中没有darkMode设置或用户没有手动切换过才自动切换
      if (!localStorage.getItem('userToggledDarkMode')) {
        // 22点-7点：自动切换为深色模式
        if (hour >= 22 || hour < 7) {
          if (!this.isDarkMode) {
            this.isDarkMode = true;
            localStorage.setItem('darkMode', true);
            this.updateDarkModeClass();
          }
        }
        // 7点-17点：自动切换为浅色模式
        else if (hour >= 7 && hour < 17) {
          if (this.isDarkMode) {
            this.isDarkMode = false;
            localStorage.setItem('darkMode', false);
            this.updateDarkModeClass();
          }
        }
        // 17点-22点：每小时20%的进度切换深色模式
        else if (hour >= 17 && hour < 22) {
          // 计算当前小时相对于17点的进度百分比
          const hourProgress = ((hour - 17) + (minutes / 60) + (seconds / 3600)) / 5;
          const darkLevel = Math.min(Math.floor(hourProgress * 5), 4); // 0-4，对应0%-80%
          
          // 当达到20%、40%、60%、80%的进度时切换为深色模式
          if (darkLevel >= 1 && !this.isDarkMode) {
            this.isDarkMode = true;
            localStorage.setItem('darkMode', true);
            this.updateDarkModeClass();
          }
        }
      }
      
      return `${hours}:${minutes}:${seconds}`;
    },
    
    // 切换黑白模式
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      // 保存到localStorage，使设置在页面刷新后保持
      localStorage.setItem('darkMode', this.isDarkMode);
      // 设置用户手动切换标志，防止自动切换覆盖用户选择
      localStorage.setItem('userToggledDarkMode', 'true');
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
    },
    
    // 处理开关变化
    handleSwitchChange(isDark) {
      this.isDarkMode = isDark;
      localStorage.setItem('darkMode', this.isDarkMode);
      // 设置用户手动切换标志，防止自动切换覆盖用户选择
      localStorage.setItem('userToggledDarkMode', 'true');
      this.updateDarkModeClass();
    }
  },
  
  mounted() {
    // 初始化时设置黑暗模式
    this.updateDarkModeClass();
    
    // 初始化当前时间
    this.currentTimeValue = this.getCurrentTime();
    
    // 设置定时器每秒更新时间
    this.timer = setInterval(() => {
      // 更新时间数据
      this.currentTimeValue = this.getCurrentTime();
      // 确保动画效果
      this.$nextTick(() => {
        const timeElements = document.querySelectorAll('.time-animation');
        timeElements.forEach(el => {
          // 重置动画
          el.style.animation = 'none';
          // 强制重绘
          void el.offsetWidth;
          // 重新触发动画
          el.style.animation = 'pulse 0.5s ease-in-out';
        });
      });
    }, 1000);
    
    // 移除旧的监听器，使用props和事件来处理
  },
  
  beforeUnmount() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    // 清除媒体查询监听器
    if (this.mediaQueryListener) {
      this.mediaQueryListener.removeEventListener('change', this.handleMediaQueryChange);
    }
  }
}
</script>

<style>
/* 全局CSS变量定义 */
:root {
  --background-color: #ffffff;
  --text-color: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --secondary-color: #4ab3df;
  --hover-color: #3a9bc8;
  --card-background: #ffffff;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 深色模式变量 */
.dark {
  --background-color: #121212;
  --text-color: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #333333;
  --secondary-color: #4ab3df;
  --hover-color: #3a9bc8;
  --card-background: #1e1e1e;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 全局禁用深色模式下所有文本元素的下划线和底部边框 */
.dark * {
  text-decoration: none;
  border-bottom: none;
}

/* 深色模式下的body样式 */
.dark-body {
  background-color: var(--background-color);
  color: var(--text-color);
}

/* 确保深色模式下的基础元素样式 */
.dark a {
  color: var(--secondary-color);
}

.dark a:hover {
  color: var(--hover-color);
}

.dark button {
  background-color: var(--card-background);
  color: var(--text-color);
  border-color: var(--border-color);
}

.dark input,
.dark textarea {
  background-color: var(--card-background);
  color: var(--text-color);
  border-color: var(--border-color);
}

.dark ::-webkit-scrollbar {
  background-color: #2c2c2c;
}

.dark ::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 10px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}
</style>

<style scoped>
/* 动画定义 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
    color: var(--secondary-color);
  }
  100% {
    transform: scale(1);
  }
}

/* 时间动画样式 */
.time-animation {
  animation: pulse 0.5s ease-in-out;
}

/* App容器样式 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 头部导航样式 */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
}

.header-brand {
  text-decoration: none;
}

.brand-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  letter-spacing: -0.02em;
}

/* 导航菜单样式 */
.header-nav {
  display: flex;
  gap: 2.5rem;
}

.nav-link {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
  letter-spacing: 0.02em;
}

.nav-link:hover {
  color: var(--secondary-color);
}

.nav-link.active {
  color: var(--secondary-color);
}

.nav-link.active::after,
.nav-link:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--secondary-color);
  transition: width 0.3s ease;
}

/* 主内容区样式 */
.content {
  flex-grow: 1;
  max-width: 1440px;
  width: 100%;
  margin: 4rem auto;
  padding: 0 2rem;
}

/* 页脚样式 */
.footer {
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: 4rem;
  position: relative;
  min-height: 60px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.footer p {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding-bottom: 0.5rem;
  padding-top: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  line-height: 1.6;
  width: 100%;
  text-align: center;
}

/* 主内容区样式 */
.content {
  flex-grow: 1;
  max-width: 1440px;
  width: 100%;
  margin: 4rem auto;
  padding: 0 2rem;
  transition: background-color 0.3s ease;
}

/* 为所有卡片和容器添加深色模式支持 */
.dark .card,
.dark .container,
.dark .section {
  background-color: var(--card-background);
  color: var(--text-color);
  border-color: var(--border-color);
}

/* 为代码块添加深色模式支持 */
.dark pre,
.dark code {
  background-color: #2d2d2d;
  color: #e0e0e0;
  border-color: #444;
}

/* 为表单元素添加深色模式支持 */
.dark input[type="text"],
.dark input[type="email"],
.dark input[type="password"],
.dark input[type="search"],
.dark select,
.dark textarea {
  background-color: var(--card-background);
  color: var(--text-color);
  border-color: var(--border-color);
}

/* 确保图片在深色模式下不会有白色背景 */
.dark img {
  background-color: transparent;
}

/* 为列表项添加深色模式支持 */
.dark ul,
.dark ol {
  color: var(--text-color);
}

.dark li {
  border: none;
}

/* 为表格添加深色模式支持 */
.dark table {
  border-color: var(--border-color);
}

.dark th,
.dark td {
  border-color: var(--border-color);
  background-color: var(--card-background);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-container,
  .content,
  .footer-container {
    max-width: 100%;
    padding: 0 1.5rem;
  }
  
  .header-nav {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    height: auto;
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }
  
  .header-nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
  }
  
  .content {
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  .footer {
    padding: 2rem 0;
  }
}
</style>
