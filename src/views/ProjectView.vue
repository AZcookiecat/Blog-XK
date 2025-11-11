<template>
  <div class="project-container">
    <header class="project-header">
      <h1 class="project-title">项目与荣誉</h1>
      <p class="project-subtitle">我的作品与成就展示</p>
    </header>

    <!-- 项目展示 -->
    <section class="projects-section">
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
          <div class="project-card">
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
    <section class="honors-section">
      <h2 class="section-title">
        <i class="fas fa-trophy"></i>
        荣誉成就
      </h2>
      <div class="honors-list">
        <div 
          v-for="honor in honors" 
          :key="honor.id"
          class="honor-item"
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
  </div>
</template>

<script>
// 导入图片资源
import honorImage1 from '../assets/FF3440EC3D42C496BBA952DB6F65F862.jpg';
import honorImage2 from '../assets/9B9FA0C5AC80E4B5107A1CEB067461ED.jpg';

export default {
  name: 'ProjectView',
  data() {
    return {
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
  methods: {
    // 打开图片模态框
    openImageModal(imagePath, imageTitle) {
      this.currentImagePath = imagePath;
      this.currentImageTitle = imageTitle;
      this.showImageModal = true;
      // 不再阻止背景滚动，允许用户上下滑动页面
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
  // 组件销毁时移除事件监听
  beforeUnmount() {
    // 确保移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeydown);
  }
}</script>

<style scoped>
.project-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.project-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  border-radius: 10px;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.project-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.project-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #4ab3df;
  padding-bottom: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.projects-section,
.honors-section {
  margin-bottom: 4rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
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
  color: #4ab3df;
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
  color: #4ab3df;
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
  background-color: #4ab3df;
  color: white;
}

.honors-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  background-color: #4ab3df;
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
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.honor-image:hover {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-container {
    padding: 1rem;
  }

  .project-header {
    margin-bottom: 2rem;
  }

  .project-title {
    font-size: 2rem;
  }

  .project-card {
    padding: 1rem;
  }

  .project-card-icon {
    font-size: 1.5rem;
  }

  .project-card-title {
    font-size: 1.2rem;
  }

  .honor-item {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .honor-date {
    min-width: auto;
  }

  .honor-image {
    width: 100px;
    height: 100px;
  }

  /* 移动端模态框样式 */
  .image-modal-content {
    margin: 10% auto;
    max-width: 90%;
    max-height: 80vh;
  }

  .image-modal-image {
    max-height: 70vh;
  }
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
  animation: fadeIn 0.3s ease;
  cursor: zoom-out;
  /* 确保模态框在最顶层 */
  z-index: 9999;
  /* 允许页面滚动 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.image-modal-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  pointer-events: auto;
  user-select: none;
}

.image-modal-overlay > img {
  pointer-events: auto;
}

.image-modal-image {
  max-width: 95%;
  max-height: 95vh;
  object-fit: contain;
  cursor: default;
  animation: zoomIn 0.3s ease;
  /* 确保图片完美居中 */
  position: relative;
  top: 0;
  left: 0;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 深色模式样式 */
.dark .project-container {
  color: #e0e0e0;
}

.dark .project-card-link {
  color: inherit;
}

.dark .view-details {
  color: #4ab3df;
}

.dark .project-card:hover .view-details {
  color: #3498db;
}

.dark .project-card-footer {
  border-top-color: #404040;
}

.dark .project-header {
  background: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .project-title,
.dark .project-subtitle {
  color: #ffffff !important;
}

.dark .section-title {
  color: #ffffff;
  border-bottom-color: #4ab3df;
}

.dark .project-card {
  background-color: #2d2d2d;
  color: #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.dark .project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.dark .project-card-icon {
  color: #3498db;
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

.dark .image-modal-content {
  background-color: #2d2d2d;
}

.dark .image-modal-close {
  background: rgba(255, 255, 255, 0.1);
}

.dark .image-modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dark .image-modal-caption {
  color: #e0e0e0;
}
</style>