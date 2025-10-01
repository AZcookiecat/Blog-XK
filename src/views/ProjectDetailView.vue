<template>
  <div class="project-detail-container">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        返回项目列表
      </button>
    </div>

    <!-- 项目详情 -->
    <div v-if="project" class="project-detail">
      <!-- 项目头部 -->
      <header class="project-detail-header">
        <div class="project-icon-large">
          <i :class="project.icon"></i>
        </div>
        <h1 class="project-detail-title">{{ project.title }}</h1>
      </header>

      <!-- 项目描述 -->
      <section class="project-description">
        <h2 class="section-title">项目介绍</h2>
        <p class="project-detail-description">{{ project.description }}</p>
      </section>

      <!-- 项目功能 -->
      <section class="project-features" v-if="project.features && project.features.length > 0">
        <h2 class="section-title">核心功能</h2>
        <ul class="features-list">
          <li v-for="feature in project.features" :key="feature" class="feature-item">
            <i class="fas fa-check-circle"></i>
            {{ feature }}
          </li>
        </ul>
      </section>

      <!-- 技术栈 -->
      <section class="project-tech-stack">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-stack-tags">
          <span v-for="tag in project.tags" :key="tag" class="tech-tag">{{ tag }}</span>
        </div>
      </section>

      <!-- 项目链接 -->
      <section class="project-links">
        <h2 class="section-title">项目链接</h2>
        <div class="links-container">
          <a 
            v-if="project.githubLink" 
            :href="project.githubLink" 
            target="_blank" 
            rel="noopener noreferrer"
            class="project-detail-link"
          >
            <i class="fab fa-github"></i>
            GitHub仓库
          </a>
          <a 
            v-if="project.demoLink" 
            :href="project.demoLink" 
            target="_blank" 
            rel="noopener noreferrer"
            class="project-detail-link"
          >
            <i class="fas fa-external-link-alt"></i>
            在线演示
          </a>
        </div>
      </section>

      <!-- 项目截图 -->
      <section class="project-screenshots" v-if="project.screenshots && project.screenshots.length > 0">
        <h2 class="section-title">项目截图</h2>
        <div class="screenshots-grid">
          <div 
            v-for="screenshot in project.screenshots" 
            :key="screenshot.path"
            class="screenshot-item"
          >
            <img 
              :src="screenshot.path" 
              :alt="screenshot.caption || project.title + '截图'"
              class="screenshot-image"
              @click="openImageModal(screenshot.path, screenshot.caption || project.title)"
              loading="lazy"
            >
            <p v-if="screenshot.caption" class="screenshot-caption">{{ screenshot.caption }}</p>
          </div>
        </div>
      </section>
    </div>

    <!-- 未找到项目提示 -->
    <div v-else class="not-found">
      <i class="fas fa-search fa-3x"></i>
      <p>未找到该项目</p>
    </div>

    <!-- 图片查看模态框 -->
    <div v-if="showImageModal" class="image-modal-overlay" @click="closeImageModal">
      <div class="image-modal-content" @click.stop>
        <button class="image-modal-close" @click="closeImageModal">
          <i class="fas fa-times"></i>
        </button>
        <img :src="currentImagePath" :alt="currentImageTitle" class="image-modal-image">
        <div class="image-modal-caption">{{ currentImageTitle }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 导入图片资源
import projectImage1 from '../assets/1EFA3EA1614871308E7A161E34598E50.jpg';
import screenshot1 from '../assets/屏幕截图 2025-10-01 182555.png';
import screenshot2 from '../assets/屏幕截图 2025-10-01 183547.png';
import screenshot3 from '../assets/屏幕截图 2025-10-01 183622.png';

// 项目详细数据
const projectsData = [
  {
    id: '1',
    title: '元生湘缘——湘绣传统文化元宇宙平台',
    description: '基于Vue 3和Vite开发的湘绣传统文化元宇宙展示平台，旨在通过数字化手段展示和传承湘绣这一非物质文化遗产，让更多人了解和欣赏湘绣的魅力。平台采用现代化的前端技术栈，打造了沉浸式的用户体验，结合元宇宙概念，为用户提供了全新的湘绣文化体验方式。',
    icon: 'fab fa-vuejs fa-3x',
    tags: ['Vue.js', 'Node.js', 'Vite', '元宇宙', '非物质文化遗产', '湘绣'],
    githubLink: 'https://github.com/AZcookiecat/XiangXiu',
    demoLink: 'https://xiangxiu.netlify.app/',
    features: [
      '湘绣作品3D展示',
      '湘绣历史文化介绍',
      '湘绣制作工艺虚拟体验',
      '互动式学习模块',
      '社区分享功能'
    ],
    screenshots: [
      {
        path: screenshot1,
        caption: '元生湘缘平台首页'
      }
    ]
  },
  {
    id: '2',
    title: '麓水云传——湖湘文化数字化平台',
    description: '麓水云传——湖湘文化数字化平台是一个致力于通过数字化手段展示、传播和传承湖湘文化精髓的综合性Web应用。平台汇集了湖湘地区的历史文化、名人故事、传统艺术、特色美食等内容，通过图文、音频、视频等多种形式进行展示，让用户能够全方位地了解湖湘文化的魅力。',
    icon: 'fab fa-vuejs fa-3x',
    tags: ['Vue.js', 'Node.js', '文化传承', '湖湘文化', '数字化平台'],
    githubLink: 'https://github.com/AZcookiecat/huxiangwenhua',
    demoLink: 'https://huxiangwenhua.netlify.app/',
    features: [
      '湖湘文化内容展示',
      '文化地图导航',
      '互动式文化体验',
      '文化知识问答',
      '用户贡献内容功能'
    ],
    screenshots: [
      {
        path: screenshot2,
        caption: '麓水云传平台首页'
      }
    ]
  },
  {
    id: '3',
    title: 'LIDAR-RUN',
    description: 'LIDAR-RUN是一个专注于激光雷达数据处理与可视化的Web应用。该项目旨在为开发者和研究人员提供一个便捷的工具，用于处理、分析和展示激光雷达数据。平台支持多种格式的激光雷达数据导入，提供丰富的数据处理算法，并能够以3D形式直观地展示处理结果。',
    icon: 'fab fa-vuejs fa-3x',
    tags: ['Vue.js', 'Node.js', '激光雷达', '数据可视化', '3D展示'],
    githubLink: 'https://github.com/AZcookiecat/LIDAR-RUN',
    demoLink: 'https://lidar-run.netlify.app/',
    features: [
      '多格式激光雷达数据导入',
      '数据预处理与清洗',
      '点云数据可视化',
      '数据分析工具',
      '结果导出功能'
    ],
    screenshots: [
      {
        path: screenshot3,
        caption: 'LIDAR-RUN点云数据可视化界面'
      }
    ]
  }
]

export default {
  name: 'ProjectDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const showImageModal = ref(false)
    const currentImagePath = ref('')
    const currentImageTitle = ref('')
    
    // 获取当前项目
    const project = computed(() => {
      const id = route.params.id
      return projectsData.find(p => p.id === id)
    })
    
    // 返回上一页
    const goBack = () => {
      router.push('/projects')
    }
    
    // 打开图片模态框
    const openImageModal = (imagePath, imageTitle) => {
      currentImagePath.value = imagePath
      currentImageTitle.value = imageTitle
      showImageModal.value = true
      // 防止背景滚动
      document.body.style.overflow = 'hidden'
    }
    
    // 关闭图片模态框
    const closeImageModal = () => {
      showImageModal.value = false
      // 恢复背景滚动
      document.body.style.overflow = ''
    }
    
    // 组件挂载时设置页面标题
    onMounted(() => {
      if (project.value) {
        document.title = project.value.title + ' - 项目详情'
      }
    })
    
    // 组件销毁时恢复背景滚动
  onBeforeUnmount(() => {
    document.body.style.overflow = ''
  })
    
    return {
      project,
      showImageModal,
      currentImagePath,
      currentImageTitle,
      goBack,
      openImageModal,
      closeImageModal
    }
  }
}
</script>

<style scoped>
.project-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.back-button-container {
  margin-bottom: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #2980b9;
  transform: translateX(-3px);
}

.project-detail-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.project-icon-large {
  margin-bottom: 1.5rem;
  animation: fadeIn 0.5s ease-in-out;
}

.project-detail-title {
  font-size: 2.2rem;
  margin: 0;
  font-weight: 700;
  line-height: 1.3;
  animation: fadeIn 0.7s ease-in-out;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #3498db;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.project-description,
.project-features,
.project-tech-stack,
.project-links,
.project-screenshots {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.project-detail-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin: 0;
  transition: color 0.3s ease;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-item i {
  color: #3498db;
  font-size: 1.2rem;
  margin-top: 0.3rem;
  flex-shrink: 0;
}

.tech-stack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.tech-tag {
  padding: 0.5rem 1rem;
  background-color: #e8f4fd;
  color: #3498db;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.links-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.project-detail-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.project-detail-link:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.screenshot-item {
  text-align: center;
  transition: all 0.3s ease;
}

.screenshot-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.screenshot-image:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.screenshot-caption {
  margin-top: 0.8rem;
  font-size: 0.9rem;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.not-found {
  text-align: center;
  padding: 4rem;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.not-found i {
  margin-bottom: 1rem;
  color: #bdc3c7;
  transition: color 0.3s ease;
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
  animation: fadeIn 0.3s ease-in-out;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  animation: zoomIn 0.3s ease-in-out;
}

.image-modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.image-modal-close:hover {
  color: #3498db;
}

.image-modal-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 5px;
}

.image-modal-caption {
  text-align: center;
  color: white;
  margin-top: 1rem;
  font-size: 1rem;
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
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-detail-container {
    padding: 1rem;
  }
  
  .project-detail-title {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .project-detail-description,
  .feature-item {
    font-size: 1rem;
  }
  
  .screenshots-grid {
    grid-template-columns: 1fr;
  }
  
  .image-modal-close {
    top: -30px;
    right: 0;
  }
}

/* 深色模式样式 */
.dark .project-detail-container {
  color: #e0e0e0;
}

.dark .project-detail-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.dark .section-title {
  color: #ffffff;
  border-color: #5dade2;
}

.dark .project-description,
.dark .project-features,
.dark .project-tech-stack,
.dark .project-links,
.dark .project-screenshots {
  background-color: #2d2d2d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark .project-detail-description,
.dark .feature-item {
  color: #cccccc;
}

.dark .feature-item {
  border-color: #404040;
}

.dark .feature-item i {
  color: #5dade2;
}

.dark .tech-tag {
  background-color: #34495e;
  color: #5dade2;
}

.dark .project-detail-link {
  background-color: #5dade2;
}

.dark .project-detail-link:hover {
  background-color: #3498db;
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.5);
}

.dark .screenshot-caption {
  color: #999999;
}

.dark .not-found {
  color: #777;
}

.dark .not-found i {
  color: #555;
}

.dark .back-button {
  background-color: #5dade2;
}

.dark .back-button:hover {
  background-color: #3498db;
}
</style>