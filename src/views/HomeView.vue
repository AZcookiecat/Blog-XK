<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <header class="header">
      <div class="header-content">
        <div class="avatar-container">
          <img src="../assets/1EFA3EA1614871308E7A161E34598E50.jpg" alt="个人头像" class="avatar">
        </div>
        <div class="personal-info">
          <h1 class="header-title">井上川</h1>
          <p class="header-subtitle">Frontend Developer & Full Stack Enthusiast</p>
          <div class="personal-meta">
            <span class="location"><i class="fas fa-map-marker-alt"></i> 湖南长沙</span>
            <span class="experience"><i class="fas fa-briefcase"></i> 开发小白</span>
          </div>
          <p class="personal-bio">
            专注于构建美观、高效且用户友好的Web应用，热衷于前端技术和全栈开发。
            热爱分享知识，不断学习新技术，追求卓越的代码质量。
          </p>
          <div class="header-social-links">
            <a href="https://github.com/AZcookiecat" class="social-link github" title="GitHub"><i class="fab fa-github"></i></a>
            <a href="mailto:example@mail.com" class="social-link email" title="Email"><i class="fas fa-envelope"></i></a>
          </div>
        </div>
      </div>
    </header>


    <!-- 技术栈展示 -->
    <section class="tech-stack-section">
      <h2 class="section-title">技术栈</h2>
      <div class="tech-stack-container">
        <div class="tech-item" v-for="tech in techStack" :key="tech.name" :class="{ 'animate': isAnimated }">
          <div class="tech-icon">
            <i :class="tech.icon"></i>
          </div>
          <span class="tech-name">{{ tech.name }}</span>
          <div class="skill-bar">
            <div class="skill-progress" :style="{ width: tech.proficiency + '%' }"></div>
          </div>
          <span class="proficiency-text">{{ tech.proficiency }}%</span>
        </div>
      </div>
    </section>

    <!-- 快速链接 -->
    <section class="quick-links">
      <router-link to="/blog" class="quick-link">
        <i class="fas fa-book"></i>
        <span>查看博客</span>
      </router-link>
      <router-link to="/projects" class="quick-link">
        <i class="fas fa-code"></i>
        <span>项目展示</span>
      </router-link>
    </section>

    <!-- 访客计数可视化板块 -->
    <section class="visitor-counter-section">
      <h2 class="section-title">访客统计</h2>
      <div class="visitor-stats-grid">
        <!-- 统计卡片 -->
        <div class="stats-card">
          <div class="stats-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ totalVisits.toLocaleString() }}</div>
            <div class="stats-label">总访问量</div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ todayVisits.toLocaleString() }}</div>
            <div class="stats-label">今日访问</div>
          </div>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="chart-container">
        <canvas ref="visitorChart"></canvas>
      </div>
    </section>

     <!-- 联系信息 -->
    <section class="contact-section">
      <h2 class="section-title">联系我</h2>
      <div class="contact-links">
        <a href="https://github.com/AZcookiecat" class="contact-link" target="_blank">
          <i class="fab fa-github fa-2x"></i>
          <span>GitHub</span>
        </a>
        <a href="mailto:example@mail.com" class="contact-link">
          <i class="fas fa-envelope fa-2x"></i>
          <span>Email</span>
        </a>
        <a href="#" class="contact-link" target="_blank">
          <i class="fab fa-weixin fa-2x"></i>
          <span>微信</span>
        </a>
      </div>
    </section>

  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

// 注册Chart.js组件
Chart.register(...registerables);

export default {
  name: 'HomeView',
  data() {
    return {
      isAnimated: false,
      totalVisits: 0,
      todayVisits: 0,
      weeklyData: [],
      visitorChart: null,
      techStack: [
        { name: 'Vue 3', icon: 'fab fa-vuejs', proficiency: 90 },
        { name: 'JavaScript', icon: 'fab fa-js', proficiency: 95 },
        { name: 'HTML5', icon: 'fab fa-html5', proficiency: 90 },
        { name: 'CSS3', icon: 'fab fa-css3-alt', proficiency: 85 },
        { name: 'Python', icon: 'fab fa-python', proficiency: 80 },
        { name: 'C#', icon: 'fas fa-code', proficiency: 70 },
        { name: 'Django', icon: 'fab fa-python', proficiency: 65 },
        { name: 'Flask', icon: 'fab fa-python', proficiency: 75 },
        { name: 'MySQL', icon: 'fas fa-database', proficiency: 80 },
        { name: 'Node.js', icon: 'fab fa-node-js', proficiency: 85 },
        { name: 'Git', icon: 'fab fa-git', proficiency: 90 },
      ]
    }
  },
  mounted() {
    // 添加滚动动画效果
    this.startAnimation()
    window.addEventListener('scroll', this.handleScroll)
    
    // 初始化访问统计
    this.initVisitorStats();
    
    // 创建访客统计图表
    this.createVisitorChart();
  },
methods: {
      startAnimation() {
        // 延迟启动动画，让用户有时间看到初始状态
        setTimeout(() => {
          this.isAnimated = true
        }, 500)
      },
      handleScroll() {
        const scrollPosition = window.scrollY
        const techSection = document.querySelector('.tech-stack-section')
        if (techSection) {
          const techSectionPosition = techSection.offsetTop
          const windowHeight = window.innerHeight
          
          // 当技术栈区域进入视口时，重新触发动画
          if (scrollPosition + windowHeight > techSectionPosition + 100 && !this.isAnimated) {
            this.isAnimated = true
          }
        }
      },
      // 初始化访客统计
      initVisitorStats() {
      const today = new Date().toLocaleDateString();
      
      // 从本地存储获取访问数据
      const stats = JSON.parse(localStorage.getItem('visitorStats')) || {
        totalVisits: 0,
        dailyVisits: {},
        weeklyData: { labels: [], data: [] }
      };
      
      // 检查是否是新访问者（当天首次访问）
      if (!localStorage.getItem('lastVisit') || localStorage.getItem('lastVisit') !== today) {
        // 更新总访问量
        stats.totalVisits++;
        
        // 更新今日访问量
        stats.dailyVisits[today] = (stats.dailyVisits[today] || 0) + 1;
        
        // 更新最近访问时间
        localStorage.setItem('lastVisit', today);
        
        // 保存更新后的数据
        localStorage.setItem('visitorStats', JSON.stringify(stats));
      }
      
      // 更新一周数据
      this.updateWeeklyData(stats);
      
      // 设置数据
      this.totalVisits = stats.totalVisits;
      this.todayVisits = stats.dailyVisits[today] || 0;
      this.weeklyData = stats.weeklyData;
    },
    
    // 更新一周访问数据
    updateWeeklyData(stats) {
      const today = new Date();
      const days = [];
      const labels = [];
      
      // 生成最近7天的日期和标签
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toLocaleDateString();
        labels.push(date.toLocaleDateString('zh-CN', { weekday: 'short' }));
        
        // 从dailyVisits获取当天的访问量，如果没有则为0
        days.push(stats.dailyVisits[dateStr] || 0);
      }
      
      // 更新weeklyData
      stats.weeklyData = {
        labels,
        data: days
      };
      
      // 保存更新后的数据
      localStorage.setItem('visitorStats', JSON.stringify(stats));
    },
    
    // 生成默认的一周数据
    generateDefaultWeeklyData() {
      const days = [];
      const labels = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('zh-CN', { weekday: 'short' }));
        days.push(Math.floor(Math.random() * 50) + 10); // 随机生成10-60之间的访问量
      }
      
      return {
        labels,
        data: days
      };
    },
    

    
    // 创建访客统计图表
    createVisitorChart() {
      const ctx = this.$refs.visitorChart.getContext('2d');
      
      // 检查是否处于深色模式
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      this.visitorChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.weeklyData.labels,
          datasets: [{
            label: '访问量',
            data: this.weeklyData.data,
            backgroundColor: isDarkMode ? 'rgba(52, 152, 219, 0.2)' : 'rgba(102, 126, 234, 0.2)',
            borderColor: isDarkMode ? 'rgba(52, 152, 219, 1)' : 'rgba(102, 126, 234, 1)',
            borderWidth: 3,
            pointBackgroundColor: isDarkMode ? 'rgba(52, 152, 219, 1)' : 'rgba(102, 126, 234, 1)',
            pointBorderColor: isDarkMode ? '#ffffff' : '#ffffff',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: isDarkMode ? 'rgba(44, 62, 80, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              titleColor: isDarkMode ? '#ffffff' : '#2c3e50',
              bodyColor: isDarkMode ? '#cccccc' : '#7f8c8d',
              borderColor: isDarkMode ? 'rgba(52, 152, 219, 0.5)' : 'rgba(102, 126, 234, 0.5)',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `访问量: ${context.parsed.y}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                drawBorder: false
              },
              ticks: {
                color: isDarkMode ? '#cccccc' : '#7f8c8d',
                stepSize: 10
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: isDarkMode ? '#cccccc' : '#7f8c8d'
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart'
          }
        }
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.visitorChart) {
      this.visitorChart.destroy();
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  transition: color 0.3s ease;
}

.header {
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.avatar-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.personal-info {
  max-width: 600px;
  text-align: center;
}

.header-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.header-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.personal-meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

.personal-meta span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.personal-bio {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.95;
  transition: color 0.3s ease;
}

.header-social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background-color: white;
  color: #667eea;
  transform: translateY(-3px);
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
  display: inline-block;
  transition: color 0.3s ease;
}

.tech-stack-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.tech-item {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.tech-item.animate {
  opacity: 1;
  transform: translateY(0);
}

.tech-item:nth-child(1) { transition-delay: 0.1s; }
.tech-item:nth-child(2) { transition-delay: 0.2s; }
.tech-item:nth-child(3) { transition-delay: 0.3s; }
.tech-item:nth-child(4) { transition-delay: 0.4s; }
.tech-item:nth-child(5) { transition-delay: 0.5s; }
.tech-item:nth-child(6) { transition-delay: 0.6s; }
.tech-item:nth-child(7) { transition-delay: 0.7s; }
.tech-item:nth-child(8) { transition-delay: 0.8s; }
.tech-item:nth-child(9) { transition-delay: 0.9s; }
.tech-item:nth-child(10) { transition-delay: 1.0s; }
.tech-item:nth-child(11) { transition-delay: 1.1s; }

.tech-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  color: #3498db;
}

.tech-name {
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
}

  .skill-bar {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

  .skill-progress {
  height: 100%;
  background-color: #3498db;
  border-radius: 4px;
  transition: width 1s ease-in-out;
}

  .proficiency-text {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
  transition: color 0.3s ease;
}

.contact-section {
  text-align: center;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 8px;
}

.contact-link:hover {
  background-color: #f8f9fa;
  transform: translateY(-3px);
  color: #2980b9;
}

.contact-link span {
  margin-top: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.quick-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(52, 152, 219, 0.3);
}

.quick-link:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

/* 访客计数板块样式 */
.visitor-counter-section {
  text-align: center;
}

.visitor-counter-container {
  display: flex;
  justify-content: center;
}

.counter-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 15px;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  min-width: 200px;
  transition: transform 0.3s ease;
}

.counter-card:hover {
  transform: translateY(-5px);
}

.counter-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.counter-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.counter-label {
  font-size: 1rem;
  opacity: 0.8;
}

.counter-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
}

/* 访客计数板块样式 */
.visitor-counter-section {
  text-align: center;
  padding: 2rem 0;
}

.visitor-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 15px;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.stats-icon {
  font-size: 2rem;
  opacity: 0.9;
  min-width: 40px;
}

.stats-content {
  text-align: left;
}

.stats-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stats-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.chart-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: 300px;
  transition: background-color 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }
  
  .header-title {
    font-size: 2rem;
  }
  
  .avatar-container {
    width: 100px;
    height: 100px;
  }
  
  .tech-item {
    width: 130px;
  }
  
  .contact-links {
    gap: 1rem;
  }
  
  .quick-links {
    flex-direction: column;
    align-items: center;
  }
  
  .quick-link {
    width: 200px;
    justify-content: center;
  }
  
  .visitor-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-card {
    padding: 1.25rem;
  }
  
  .stats-value {
    font-size: 1.5rem;
  }
  
  .chart-container {
    height: 250px;
    padding: 1rem;
  }
}

/* 深色模式样式 */
.dark .home-container {
  color: #e0e0e0;
}

.dark .header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.dark .header::before {
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
}

.dark .tech-item {
  background-color: #34495e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .tech-item:hover {
  background-color: #2c3e50;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.dark .section-title,
.dark .tech-name {
  color: #ffffff;
}

.dark .personal-bio,
.dark .proficiency-text,
.dark .contact-link span {
  color: #cccccc;
}

.dark .skill-bar {
  background-color: #4a5568;
}

.dark .contact-link {
  color: #3498db;
}

.dark .contact-link:hover {
  color: #5dade2;
  background-color: #2c3e50;
}

.dark .quick-link {
  background-color: #34495e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .quick-link:hover {
  background-color: #3498db;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

/* 深色模式下的访客统计样式 */
.dark .stats-card {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.dark .stats-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}

.dark .chart-container {
  background: #34495e;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
</style>