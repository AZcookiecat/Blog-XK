<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <header class="header">
      <div class="header-content">
        <div class="avatar-container">
          <img src="../assets/1EFA3EA1614871308E7A161E34598E50.jpg" alt="个人头像" class="avatar">
        </div>
        <div class="personal-info">
          <h1 class="header-title">Ciin7mo</h1>
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
    <section class="tech-stack-section" id="tech-stack">
      <h2 class="section-title">技术栈</h2>
      
      <!-- 三栏技术栈布局 -->
      <div class="tech-stack-grid">
        <!-- 编程语言 -->
        <div class="tech-category">
          <h3 class="category-title">编程语言</h3>
          <div class="tech-items">
            <div class="tech-item" v-for="lang in programmingLanguages" :key="lang.name" :class="{ 'animate': isAnimated }">
              <div class="tech-icon">
                <i :class="lang.icon"></i>
              </div>
              <div class="tech-info">
                <div class="name-percentage">
                  <span class="tech-name">{{ lang.name }}</span>
                  <span class="proficiency-text">{{ lang.proficiency }}%</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-progress" :style="{ width: lang.proficiency + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 框架与技术 -->
        <div class="tech-category">
          <h3 class="category-title">框架与技术</h3>
          <div class="tech-items">
            <div class="tech-item" v-for="framework in frameworks" :key="framework.name" :class="{ 'animate': isAnimated }">
              <div class="tech-icon">
                <i :class="framework.icon"></i>
              </div>
              <div class="tech-info">
                <div class="name-percentage">
                  <span class="tech-name">{{ framework.name }}</span>
                  <span class="proficiency-text">{{ framework.proficiency }}%</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-progress" :style="{ width: framework.proficiency + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 数据库 -->
        <div class="tech-category">
          <h3 class="category-title">数据库</h3>
          <div class="tech-items">
            <div class="tech-item" v-for="db in databases" :key="db.name" :class="{ 'animate': isAnimated }">
              <div class="tech-icon">
                <i :class="db.icon"></i>
              </div>
              <div class="tech-info">
                <div class="name-percentage">
                  <span class="tech-name">{{ db.name }}</span>
                  <span class="proficiency-text">{{ db.proficiency }}%</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-progress" :style="{ width: db.proficiency + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 其他技术栈 -->
      <div class="other-tech-stack">
        <h3 class="category-title">其他技术</h3>
        <div class="tech-stack-container">
          <div class="tech-item" v-for="tech in otherTech" :key="tech.name" :class="{ 'animate': isAnimated }">
              <div class="tech-icon">
                <i :class="tech.icon"></i>
              </div>
              <div class="tech-info">
                <div class="name-percentage">
                  <span class="tech-name">{{ tech.name }}</span>
                  <span class="proficiency-text">{{ tech.proficiency }}%</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-progress" :style="{ width: tech.proficiency + '%' }"></div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>

    <!-- 项目展示 -->
    <section class="projects-section" id="projects">
      <h2 class="section-title">
        <i class="fas fa-code"></i>
        项目展示
      </h2>
      <div class="projects-grid">
        <router-link 
          v-for="project in projects" 
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="project-card-link"
        >
          <div class="project-card" :class="{ 'animate': isAnimated }">
            <div class="project-card-header">
              <div class="project-card-icon">
                <i :class="project.icon"></i>
              </div>
              <h3 class="project-card-title">{{ project.title }}</h3>
            </div>
            <p class="project-card-description">{{ project.description }}</p>
            <div class="project-card-tags">
              <span v-for="tag in project.tags" :key="tag" class="project-tag">{{ tag }}</span>
            </div>
            <div class="project-card-footer">
              <span class="view-details">点击查看详情</span>
              <div class="project-card-links">
                <a 
                  v-if="project.githubLink" 
                  :href="project.githubLink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="project-link"
                  @click.stop
                >
                  <i class="fab fa-github"></i>
                  GitHub
                </a>
                <a 
                  v-if="project.demoLink" 
                  :href="project.demoLink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="project-link"
                  @click.stop
                >
                  <i class="fas fa-external-link-alt"></i>
                  演示
                </a>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 荣誉展示 -->
    <section class="honors-section" id="honors">
      <h2 class="section-title">
        <i class="fas fa-trophy"></i>
        荣誉成就
      </h2>
      <div class="honors-list">
        <div 
          v-for="honor in honors" 
          :key="honor.id"
          class="honor-item" :class="{ 'animate': isAnimated }"
        >
          <div class="honor-date">{{ honor.date }}</div>
          <div class="honor-content">
            <h3 class="honor-title">{{ honor.title }}</h3>
            <p class="honor-description">{{ honor.description }}</p>
          </div>
          <!-- 荣誉图片展示 -->
          <div v-if="honor.imagePath" class="honor-image-container">
            <img 
              :src="honor.imagePath" 
              :alt="honor.title"
              class="honor-image"
              loading="lazy"
              @click="openImageModal(honor.imagePath, honor.title)"
              style="cursor: pointer;"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- 图片查看模态框 -->
    <div v-if="showImageModal" class="image-modal-overlay" @click="closeImageModal">
      <img :src="currentImagePath" :alt="currentImageTitle" class="image-modal-image">
      <div class="image-modal-hint">按ESC键关闭</div>
    </div>

    <!-- 联系信息 -->
    <section class="contact-section" id="contact">
      <h2 class="section-title">
        <i class="fas fa-paper-plane"></i>
        联系我
      </h2>
      
      <!-- 左右两栏布局容器 -->
      <div class="contact-layout">
        <!-- 左侧：联系链接 -->
        <div class="contact-left">
          <h3 class="contact-left-title">联系方式</h3>
          <div class="contact-links">
            <a href="https://github.com/AZcookiecat" class="contact-link" target="_blank" rel="noopener noreferrer">
              <div class="contact-icon">
                <i class="fab fa-github fa-2x"></i>
              </div>
              <div class="contact-link-content">
                <span class="contact-link-title">GitHub</span>
                <p class="contact-link-description">查看我的代码和项目</p>
              </div>
            </a>
            
            <a href="mailto:3424255277@qq.com" class="contact-link" target="_blank" rel="noopener noreferrer">
              <div class="contact-icon">
                <i class="fas fa-envelope fa-2x"></i>
              </div>
              <div class="contact-link-content">
                <span class="contact-link-title">Email</span>
                <p class="contact-link-description">发送邮件给我</p>
              </div>
            </a>
            
            <div class="contact-link wechat-container">
              <div class="contact-icon wechat-icon">
                <i class="fab fa-weixin fa-2x"></i>
              </div>
              <div class="contact-link-content">
                <span class="contact-link-title">微信</span>
                <p class="contact-link-description">扫码添加好友</p>
              </div>
              <!-- 微信二维码弹窗 -->
              <div class="qrcode-popup">
                <div class="qrcode-content">
                  <p class="qrcode-text">扫一扫添加微信</p>
                  <div class="qrcode-placeholder">
                    <img src="../assets/微信图片_20251104145940_79_3.jpg" alt="微信二维码" class="qrcode-image">
                  </div>
                  <p class="qrcode-hint">微信号: XK_180920</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：联系表单 -->
        <div class="contact-right">
          <div class="contact-form-section">
            <h3 class="contact-form-title">发送消息</h3>
            <form class="contact-form">
              <div class="form-group">
                <input type="text" placeholder="您的姓名" class="form-input">
              </div>
              <div class="form-group">
                <input type="email" placeholder="您的邮箱" class="form-input">
              </div>
              <div class="form-group">
                <textarea placeholder="您的消息" rows="4" class="form-input"></textarea>
              </div>
              <button type="submit" class="form-submit-btn">
                <i class="fas fa-paper-plane"></i>
                发送消息
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// 导入图片资源
import honorImage1 from '../assets/FF3440EC3D42C496BBA952DB6F65F862.jpg';
import honorImage2 from '../assets/9B9FA0C5AC80E4B5107A1CEB067461ED.jpg';

export default {
  name: 'HomeView',
  data() {
    return {
      isAnimated: false,
      // 编程语言
      programmingLanguages: [
        { name: 'HTML', icon: 'fab fa-html5', proficiency: 95 },
        { name: 'CSS', icon: 'fab fa-css3-alt', proficiency: 90 },
        { name: 'JavaScript', icon: 'fab fa-js', proficiency: 90 },
        { name: 'Python', icon: 'fab fa-python', proficiency: 85 },
        { name: 'C#', icon: 'fab fa-cuttlefish', proficiency: 60 },
        
      ],
      // 框架与技术
      frameworks: [
        { name: 'Vue.js', icon: 'fab fa-vuejs', proficiency: 88 },
        { name: 'Node.js', icon: 'fab fa-node-js', proficiency: 80 },
        { name: 'Django', icon: 'fab fa-python', proficiency: 65 },
        { name: 'Flask', icon: 'fab fa-python', proficiency: 75 },
      ],
      // 数据库
      databases: [
        { name: 'MySQL', icon: 'fas fa-database', proficiency: 85 },
      ],
      // 其他技术
      otherTech: [
        { name: 'Git', icon: 'fab fa-git', proficiency: 90 },
        { name: 'Linux', icon: 'fab fa-linux', proficiency: 20 },
      ],
      // 项目数据
      projects: [
        {
          id: '1',
          title: '元生湘缘——湘绣传统文化元宇宙平台',
          description: '基于Vue 3和Vite开发的湘绣传统文化元宇宙展示平台，旨在通过数字化手段展示和传承湘绣这一非物质文化遗产，让更多人了解和欣赏湘绣的魅力',
          icon: 'fab fa-vuejs fa-2x',
          tags: ['Vue.js', 'Node.js'],
          githubLink: 'https://github.com/AZcookiecat/XiangXiu',
          demoLink: 'https://xiangxiu.netlify.app/'
        },
        {
          id: '2',
          title: '麓水云传——湖湘文化数字化平台',
          description: '基于Vue 3和Vite开发的湖湘文化数字化平台，旨在通过数字化手段展示和传承湖湘这一非物质文化遗产，让更多人了解和欣赏湖湘的魅力',
          icon: 'fab fa-vuejs fa-2x',
          tags: ['Vue.js', 'Node.js'],
          githubLink: 'https://github.com/AZcookiecat/huxiangwenhua',
          demoLink: 'https://huxiangwenhua.netlify.app/'
        },
        {
          id: '3',
          title: 'LIDAR-RUN',
          description: '',
          icon: 'fab fa-vuejs fa-2x',
          tags: ['Vue.js', 'Node.js'],
          githubLink: 'https://github.com/AZcookiecat/LIDAR-RUN',
          demoLink: 'https://lidar-run.netlify.app/'
        },
      ],
      // 荣誉数据
      honors: [
        {
          id: '1',
          title: '元生湘缘——元宇宙数字湘绣生态系统',
          description: '第十八届中国大学生计算机设计大赛中南地区赛三等奖',
          date: '2025年',
          imagePath: honorImage1
        },
        {
          id: '2',
          title: '湘缘——湘绣传统文化元宇宙实验平台',
          description: '湘缘——湘绣传统文化元宇宙实验平台计算机软件著作权',
          date: '2025年',
          imagePath: honorImage2
        }
      ],
      // 图片模态框相关状态
      showImageModal: false,
      currentImagePath: '',
      currentImageTitle: ''
    }
  },
  mounted() {
    // 添加滚动动画效果
    this.startAnimation()
    window.addEventListener('scroll', this.handleScroll)
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
    // 打开图片模态框
    openImageModal(imagePath, imageTitle) {
      this.currentImagePath = imagePath;
      this.currentImageTitle = imageTitle;
      this.showImageModal = true;
      // 添加键盘事件监听
      document.addEventListener('keydown', this.handleKeydown);
    },
    // 关闭图片模态框
    closeImageModal() {
      this.showImageModal = false;
      // 移除键盘事件监听
      document.removeEventListener('keydown', this.handleKeydown);
    },
    // 处理键盘事件
    handleKeydown(event) {
      // 按下ESC键时关闭模态框
      if (event.key === 'Escape' || event.key === 'Esc') {
        this.closeImageModal();
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    // 确保移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeydown);
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
  border-radius: 10px;
  color: black;
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
  border-bottom: 2px solid #4ab3df;
  padding-bottom: 0.5rem;
  display: inline-block;
  transition: color 0.3s ease;
}

/* 技术栈部分样式 */
.tech-stack-section {
  padding: 2rem 0;
}

/* 三栏网格布局 */
.tech-stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

/* 技术类别样式 */
  .tech-category {
    background-color: white;
    padding: 1.2rem;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .category-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #4ab3df;
    text-align: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  /* 技术项目容器 */
  .tech-items {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  /* 其他技术栈部分 */
  .other-tech-stack {
    margin-top: 1rem;
  }
  
  .tech-stack-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.8rem;
    margin-top: 1rem;
  }
  
  .tech-item {
    background-color: white;
    padding: 0.8rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.8rem;
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
  
  .tech-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  }
  
  .tech-icon {
    font-size: 1.8rem;
    color: #3498db;
    flex-shrink: 0;
  }
  
  .tech-info {
    flex: 1;
    min-width: 0;
  }
  
  .name-percentage {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.2rem;
  }
  
  .tech-name {
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
    transition: color 0.3s ease;
  }
  
  .skill-bar {
    width: 100%;
    height: 6px;
    background-color: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
    transition: background-color 0.3s ease;
  }
  
  .skill-progress {
    height: 100%;
    background-color: #4ab3df;
    border-radius: 2px;
    transition: width 1s ease-in-out;
  }
  
  .proficiency-text {
    font-size: 0.9rem;
    color: #7f8c8d;
    font-weight: 500;
    text-align: right;
    transition: color 0.3s ease;
    min-width: 40px;
  }

  /* 深色模式 - 技术栈样式 */
  .dark .tech-category,
  .dark .tech-item {
    background-color: #2d2d2d;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .dark .category-title {
    color: #4ab3df;
    border-bottom-color: #444;
  }

  .dark .tech-name {
    color: #e0e0e0;
  }

  .dark .skill-bar {
    background-color: #444;
  }

  .dark .proficiency-text {
    color: #bbb;
  }

  .dark .tech-item:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
    background-color: #333;
  }

  .dark .section-title {
    color: #e0e0e0;
    border-bottom-color: #4ab3df;
  }

.contact-section {
  padding: 2rem 0;
}

.contact-description {
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  transition: color 0.3s ease;
}

/* 左右两栏布局容器 */
.contact-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;
}

/* 左侧：联系链接 */
.contact-left {
  flex: 1;
  min-width: 300px;
  text-align: left;
}

.contact-left-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-link {
  display: flex;
  align-items: center;
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 1.2rem;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  gap: 1rem;
}

.contact-link:hover {
  transform: translateX(5px);
  background-color: #f8f9fa;
  color: #4ab3df;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #e8f4fd;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.contact-link:hover .contact-icon {
  background-color: #4ab3df;
  color: white;
  transform: scale(1.1);
}

.contact-link-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.contact-link-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  transition: color 0.3s ease;
}

.contact-link-description {
  font-size: 0.9rem;
  color: #777;
  margin: 0;
  opacity: 0.9;
  transition: color 0.3s ease;
  line-height: 1.4;
}

/* 微信二维码弹窗 */
.wechat-container {
  cursor: pointer;
}

.qrcode-popup {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 10px;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  min-width: 250px;
}

.qrcode-popup::before {
  content: '';
  position: absolute;
  top: 100%;
  right: 50px;
  transform: translateX(-50%);
  border: 10px solid transparent;
  border-top-color: white;
}

.wechat-container:hover .qrcode-popup {
  opacity: 1;
  visibility: visible;
  margin-bottom: 15px;
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.qrcode-text {
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #333;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  color: #3498db;
  overflow: hidden;
}

.qrcode-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.qrcode-hint {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* 右侧：联系表单 */
.contact-right {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
}

.contact-form-section {
  width: 100%;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.contact-form-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
  transition: color 0.3s ease;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input {
  padding: 0.8rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #4ab3df;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 150px;
}

.form-submit-btn {
  background: #4ab3df;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.form-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.form-submit-btn:active {
  transform: translateY(0);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .contact-layout {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-left,
  .contact-right {
    width: 100%;
    max-width: 500px;
  }
  
  .contact-left {
    text-align: center;
  }
  
  .contact-left-title {
    text-align: center;
  }
  
  .contact-link {
    text-align: left;
  }
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
  background-color: #4ab3df;
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

/* 修改header样式以匹配协作页面 */
.dark .header {
  background: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .header::before {
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
}

/* 将所有标题文字改为白色 */
.dark .header-title,
.dark .header-subtitle {
  color: #ffffff !important;
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

.dark .contact-left-title {
  color: #ffffff;
  border-bottom-color: #4ab3df;
}

.dark .contact-link {  
  color: #3498db;  
  background-color: #2d2d2d;  
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);  
}

.dark .contact-link:hover {  
  color: #4ab3df;  
  background-color: #34495e;  
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);  
}

.dark .contact-description {
  color: #cccccc;
}

.dark .contact-icon {
  background-color: #34495e;
  color: #3498db;
}

.dark .contact-link:hover .contact-icon {
  background-color: #3498db;
  color: #ffffff;
}

.dark .contact-link-title {
  color: #3498db;
}

.dark .contact-link-description {
  color: #999999;
}

.dark .qrcode-popup {
  background-color: #2d2d2d;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.dark .qrcode-popup::before {
  border-bottom-color: #2d2d2d;
}

.dark .qrcode-text {
  color: #ffffff;
}

.dark .qrcode-placeholder {
  background-color: #34495e;
}

.dark .qrcode-hint {
  color: #cccccc;
}

.dark .contact-form-section {
  background-color: #2d2d2d;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .contact-form-title {
  color: #ffffff;
  border-bottom-color: #3498db;
}

.dark .form-input {
  background-color: #34495e;
  border-color: #4a5568;
  color: #ffffff;
}

.dark .form-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.dark .form-input::placeholder {
  color: #999999;
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
/* 项目展示样式 */
.projects-section {
  margin-bottom: 2rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.project-card-link {
  text-decoration: none;
  color: inherit;
}

.project-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.project-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-card-icon {
  color: #3498db;
  flex-shrink: 0;
}

.project-card-title {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0;
  transition: color 0.3s ease;
}

.project-card-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1rem;
  flex-grow: 1;
  transition: color 0.3s ease;
}

.project-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.project-tag {
  padding: 0.2rem 0.6rem;
  background-color: #e8f4fd;
  color: #3498db;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-card-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.view-details {
  display: block;
  text-align: center;
  color: #3498db;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.project-card:hover .view-details {
  color: #2980b9;
}

.project-card-links {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  color: #3498db;
  text-decoration: none;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.project-link:hover {
  background-color: #3498db;
  color: white;
}

/* 暗黑模式样式 */
.dark .project-card {
  background-color: #2d2d2d;
  color: #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.dark .project-card-title {
  color: #ffffff;
}

.dark .project-card-description {
  color: #cccccc;
}

.dark .project-tag {
  background-color: #34495e;
  color: #4ab3df;
}

.dark .project-link {
  background-color: #34495e;
  color: #3498db;
}

.dark .project-link:hover {
  background-color: #3498db;
  color: white;
}

/* 动画效果 */
.project-card.animate {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.project-card.animate:nth-child(1) { animation-delay: 0.1s; }
.project-card.animate:nth-child(2) { animation-delay: 0.2s; }
.project-card.animate:nth-child(3) { animation-delay: 0.3s; }
.project-card.animate:nth-child(4) { animation-delay: 0.4s; }
.project-card.animate:nth-child(5) { animation-delay: 0.5s; }
.project-card.animate:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 荣誉展示样式 */
.honors-section {
  margin-bottom: 2rem;
}

.honors-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.honor-item {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.honor-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.honor-date {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
  min-width: 100px;
  text-align: center;
}

.honor-content {
  flex-grow: 1;
}

.honor-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.honor-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  transition: color 0.3s ease;
}

.honor-image-container {
  flex-shrink: 0;
}

.honor-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.honor-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 图片模态框样式 */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
  padding: 2rem;
}

.image-modal-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 5px;
  cursor: default;
}

.image-modal-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
}

/* 暗黑模式样式 - 荣誉部分 */
.dark .honor-item {
  background-color: #2d2d2d;
  color: #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.dark .honor-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
}

.dark .honor-date {
  background-color: #3498db;
  color: white;
}

.dark .honor-title {
  color: #ffffff;
}

.dark .honor-description {
  color: #cccccc;
}

.dark .honor-image {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .image-modal-overlay {
  background-color: rgba(0, 0, 0, 0.95);
}

/* 荣誉项动画 */
.honor-item.animate {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.honor-item.animate:nth-child(1) { animation-delay: 0.1s; }
.honor-item.animate:nth-child(2) { animation-delay: 0.2s; }
.honor-item.animate:nth-child(3) { animation-delay: 0.3s; }

/* 响应式调整 */
@media (max-width: 768px) {
  .honor-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .honor-date {
    min-width: auto;
    align-self: flex-start;
  }
  
  .honor-image-container {
    align-self: center;
  }
  
  .honor-image {
    width: 200px;
    height: 200px;
  }
}
</style>