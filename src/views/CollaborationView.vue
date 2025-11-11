<template>
  <div class="collaboration-container">
    <div class="page-header">
      <h1><i class="fas fa-users"></i> 网页组协作</h1>
      <p>查看开发任务，了解项目进度</p>
    </div>

    <div class="collaboration-content">
      <!-- 项目概览 -->
      <div class="section">
        <h2 class="section-title">
          <i class="fas fa-chart-pie"></i> 项目概览
        </h2>
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-number">{{ totalProjects }}</div>
            <div class="stat-label">活跃项目</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ totalTasks }}</div>
            <div class="stat-label">总任务数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ completedTasks }}</div>
            <div class="stat-label">已完成</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ pendingTasks }}</div>
            <div class="stat-label">进行中</div>
          </div>
        </div>
      </div>

      <!-- 开发任务板块 -->
      <div class="section">
        <h2 class="section-title">
          <i class="fas fa-tasks"></i> 开发任务
        </h2>

        <!-- 任务过滤器 -->
        <div class="task-filters">
          <button 
            v-for="filter in taskFilters" 
            :key="filter.value"
            :class="['filter-btn', { active: activeFilter === filter.value }]"
            @click="activeFilter = filter.value"
          >
            {{ filter.label }}
          </button>
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索任务..."
              class="search-input"
            >
          </div>
        </div>

        <!-- 任务看板 -->
        <div class="task-kanban">
          <div class="kanban-column" v-for="status in taskStatuses" :key="status.value">
            <div class="column-header" :class="`status-${status.value}`">
              <span class="status-icon">{{ status.icon }}</span>
              <h3>{{ status.label }}</h3>
              <span class="task-count">{{ getTasksByStatus(status.value).length }}</span>
            </div>
            <div class="column-body">
              <div 
                v-for="task in getTasksByStatus(status.value)" 
                :key="task.id"
                class="task-card"
                :class="{ 'high-priority': task.priority === 'high' }"
              >
                <div class="task-header">
                  <span class="task-id">#{{ task.id }}</span>
                  <span 
                    class="task-priority"
                    :class="`priority-${task.priority}`"
                  >
                    {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
                  </span>
                </div>
                <h4 class="task-title">{{ task.title }}</h4>
                <p class="task-description">{{ task.description }}</p>
                <div class="task-meta">                  <div class="task-assignee">
                    <img 
                      :src="getAvatarUrl(task.assignee.avatar)" 
                      :alt="task.assignee.name" 
                      class="assignee-avatar"
                      loading="lazy"
                      :width="30"
                      :height="30"
                    >
                    <span>{{ task.assignee.name }}</span>
                  </div>
                  <div class="task-due">
                    <i class="far fa-calendar-alt"></i>
                    {{ formatDate(task.dueDate) }}
                  </div>
                </div>
                <div class="task-actions">
                  <button class="action-btn" @click="viewTaskDetails(task)">
                    <i class="fas fa-eye"></i> 详情
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 团队成员 -->
      <div class="section">
        <h2 class="section-title">
          <i class="fas fa-user-friends"></i> 团队成员
        </h2>
        <div class="team-members">
          <div class="member-card" v-for="member in teamMembers" :key="member.id">
            <img 
  :src="getAvatarUrl(member.avatar)" 
  :alt="member.name" 
  class="member-avatar"
  loading="lazy"
  :width="80"
  :height="80"
>
            <div class="member-info">
              <h4>{{ member.name }}</h4>
                <p class="member-role">{{ member.role }}</p>
                <a v-if="member.website" :href="member.website" target="_blank" class="member-website">访问个人主页</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务详情模态框 -->
    <div v-if="showTaskDetails" class="modal-overlay" @click.self="closeTaskDetails">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3>任务详情</h3>
          <button class="close-btn" @click="closeTaskDetails">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-header">
            <div class="detail-id">#{{ selectedTask.id }}</div>
            <h2 class="detail-title">{{ selectedTask.title }}</h2>
            <div class="detail-meta">
              <span 
                class="detail-priority"
                :class="`priority-${selectedTask.priority}`"
              >
                {{ selectedTask.priority === 'high' ? '高优先级' : 
                   selectedTask.priority === 'medium' ? '中优先级' : '低优先级' }}
              </span>
              <span class="detail-status" :class="`status-${selectedTask.status}`">
                {{ getStatusLabel(selectedTask.status) }}
              </span>
            </div>
          </div>
          <div class="detail-content">
            <h4>任务描述</h4>
            <p>{{ selectedTask.description }}</p>
          </div>
          <div class="detail-info">
            <div class="info-item">
              <strong>发布人：</strong>
              <img 
                :src="getAvatarUrl(selectedTask.assignee.avatar)" 
                :alt="selectedTask.assignee.name" 
                class="small-avatar"
                loading="lazy"
                :width="24"
                :height="24"
              >
              {{ selectedTask.assignee.name }}
            </div>
            <div class="info-item">
              <strong>创建日期：</strong>
              {{ formatDate(selectedTask.createdDate) }}
            </div>
            <div class="info-item">
              <strong>截止日期：</strong>
              {{ formatDate(selectedTask.dueDate) }}
            </div>
          </div>
          
          <!-- 任务详情Markdown内容 -->
          <div class="task-markdown-section">
            <h4>任务详情文档</h4>
            <div class="markdown-content" v-html="taskMarkdownContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  data() {
    return {
      // 任务状态配置
      taskStatuses: [
        { value: 'todo', label: '待办', icon: '📝' },
        { value: 'in_progress', label: '进行中', icon: '🔄' },
        { value: 'completed', label: '已完成', icon: '✅' }
      ],
      // 任务过滤器
      taskFilters: [
        { value: 'all', label: '全部' },
        { value: 'high', label: '高优先级' },
        { value: 'overdue', label: '逾期任务' }
      ],
      activeFilter: 'all',
      searchQuery: '',
      // 模态框状态
      showTaskDetails: false,
      selectedTask: null,
      taskMarkdownContent: '', // 存储解析后的任务markdown内容
      // 模拟数据
      teamMembers: [
        { id: 1, name: '向烁安', role: '全栈开发', avatar: '/avatar/head.jpg', website: 'https://blog-xk.netlify.app/' },
        { id: 2, name: '万郅轩', role: '全栈开发', avatar: '/avatar/微信图片_2025-10-23_123708_657.jpg', website: '' },
        { id: 3, name: '李神洲', role: '项目负责人', avatar: '/avatar/微信图片_2025-10-23_123802_269.jpg', website: '' },
        { id: 4, name: '宋雨昕', role: '前端开发', avatar: '/avatar/微信图片_2025-10-23_130009_179.jpg', website: '' },
        { id: 5, name: '宁妍', role: '', avatar: '/avatar/微信图片_2025-10-23_123808_511.jpg', website: 'https://yy-11-nn-website.netlify.app/' },
        { id: 6, name: '汤青榕', role: '', avatar: '/avatar/微信图片_2025-10-23_123813_525.jpg', website: 'https://ttt0507rrr.netlify.app/' },
        { id: 7, name: '王海', role: '', avatar: '/avatar/微信图片_2025-10-23_123828_698.jpg', website: 'https://haihaisea.netlify.app/' },
        { id: 8, name: '余思哲', role: '', avatar: '/avatar/微信图片_2025-10-23_123822_747.jpg', website: 'https://mufengblog.netlify.app/' },
        { id: 9, name: '胡富喻', role: '', avatar: '/avatar/微信图片_2025-10-23_123838_958.jpg', website: '' }
      ],
      tasks: [
        {
          id: 1,
          title: '个人博客网页构建',
          description: '构建一个属于自己的个人博客网页，展示个人项目、技术博客和个人介绍。谨记：先实现再优化',
          status: 'completed',
          priority: 'high',
          assignee: { id: 1, name: '向烁安', avatar: '/avatar/head.jpg' },
          createdDate: '2025-10-23',
          dueDate: '2025-11-5'
        },
        {
          id: 2,
          title: '个人网页内容完善',
          description: '继续完善个人博客网页的内容，包括添加项目展示、技术博客和个人介绍。',
          status: 'in_progress',
          priority: 'high',
          assignee: { id: 1, name: '向烁安', avatar: '/avatar/head.jpg' },
          createdDate: '2025-11-13',
          dueDate: '2025-11-20'
        }
      ]
    };
  },
  computed: {
    // 计算属性：总项目数
    totalProjects() {
      // 这里使用模拟数据，实际应用中应该从API获取
      return 3;
    },
    // 计算属性：总任务数
    totalTasks() {
      return this.tasks.length;
    },
    // 计算属性：已完成任务数
    completedTasks() {
      return this.tasks.filter(task => task.status === 'completed').length;
    },
    // 计算属性：进行中任务数
    pendingTasks() {
      return this.tasks.filter(task => task.status !== 'completed').length;
    },
    // 计算属性：过滤后的任务
    filteredTasks() {
      let tasks = [...this.tasks];
      
      // 应用过滤器
      if (this.activeFilter === 'mine') {
        // 假设当前用户是张三（ID为1）
        tasks = tasks.filter(task => task.assignee.id === 1);
      } else if (this.activeFilter === 'high') {
        tasks = tasks.filter(task => task.priority === 'high');
      } else if (this.activeFilter === 'overdue') {
        const today = new Date();
        tasks = tasks.filter(task => 
          task.status !== 'completed' && new Date(task.dueDate) < today
        );
      }
      
      // 应用搜索
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        tasks = tasks.filter(task => 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        );
      }
      
      return tasks;
    }
  },
  // 组件挂载时预加载关键头像
  mounted() {
    // 预加载团队成员和任务的头像
    this.preloadAvatars();
  },
  methods: {
    
    // 预加载头像图片
    preloadAvatars() {
      const avatarUrls = new Set();
      
      // 收集所有团队成员的头像URL
      this.teamMembers.forEach(member => {
        if (member.avatar) {
          avatarUrls.add(this.getAvatarUrl(member.avatar));
        }
      });
      
      // 收集所有任务中的头像URL
      this.tasks.forEach(task => {
        if (task.assignee && task.assignee.avatar) {
          avatarUrls.add(this.getAvatarUrl(task.assignee.avatar));
        }
      });
      
      // 预加载头像图片
      avatarUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    },
    
    // 生成头像URL，支持占位图
    getAvatarUrl(avatar) {
      // 如果是绝对URL或已经是导入的图片对象，直接返回
      if (typeof avatar === 'string' && (avatar.startsWith('http') || avatar.startsWith('https'))) {
        return avatar;
      }
      
      // 处理相对路径 - 在Vue/Vite项目中，应该使用正确的资源引用方式
      // 移除/src前缀，因为部署后这个路径不存在
      if (typeof avatar === 'string' && avatar.startsWith('/src/')) {
        // 在Vite项目中，public文件夹下的资源可以通过根路径直接访问
        // 因此我们需要将头像图片移动到public/avatar文件夹下
        // 这里我们将/src/avatar/替换为/avatar/
        return avatar.replace('/src/avatar/', '/avatar/');
      }
      
      // 直接返回其他情况
      return avatar;
    },
    // 获取指定状态的任务
    getTasksByStatus(status) {
      return this.filteredTasks.filter(task => task.status === status);
    },
    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    // 获取状态标签
    getStatusLabel(status) {
      const statusConfig = this.taskStatuses.find(s => s.value === status);
      return statusConfig ? statusConfig.label : status;
    },
    // 查看任务详情
    viewTaskDetails(task) {
      this.selectedTask = { ...task };
      this.showTaskDetails = true;
      this.loadTaskMarkdown(task.id);
    },
    // 加载任务markdown内容
    async loadTaskMarkdown(taskId) {
      try {
        // 重置内容为加载中状态
        this.taskMarkdownContent = '<p style="text-align: center; color: #666;">加载中...</p>';
        
        // 尝试加载对应编号的md文件
        // 文件位于task文件夹中，命名格式为 "任务{id}.md"
        const response = await fetch(`/task/任务${taskId}.md`);
        
        if (response.ok) {
          const markdown = await response.text();
          // 确保marked可用
          if (marked && typeof marked.parse === 'function') {
            this.taskMarkdownContent = marked.parse(markdown);
          } else {
            this.taskMarkdownContent = '<p>Markdown解析器加载失败，请刷新页面重试。</p>';
          }
        } else {
          // 如果文件不存在，显示默认内容
          this.taskMarkdownContent = '<p>暂无任务详情文档。</p>';
        }
      } catch (error) {
        console.error('加载任务详情失败:', error);
        this.taskMarkdownContent = `<p>加载任务详情失败：${error.message || '未知错误'}</p>`;
      }
    },
    // 关闭任务详情
    closeTaskDetails() {
      this.showTaskDetails = false;
      this.selectedTask = null;
    }
  }
};
</script>

<style scoped>
.collaboration-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: black;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.page-header p {
  color: black;
  font-size: 1.1rem;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #ecf0f1;
}

.section-title i {
  margin-right: 0.5rem;
  color: #4ab3df;
}

/* 统计卡片样式 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #4ab3df;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

/* 任务过滤器样式 */
.task-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #bdc3c7;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  color: #000; /* 设置为黑色 */
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #f8f9fa;
  color: #000; /* 设置为黑色 */
}

.filter-btn.active {
  background: #4ab3df;
  color: #000; /* 设置为黑色 */
  border-color: #4ab3df;
}

.search-box {
  margin-left: auto;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 20px;
  width: 200px;
}

/* 看板样式 */
.task-kanban {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.kanban-column {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  font-weight: bold;
}

.status-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.status-todo {
  background: #e3f2fd;
  color: #333; /* 修改为深色，确保可见 */
}

.status-in_progress {
  background: #fff3e0;
  color: #333; /* 修改为深色，确保可见 */
}

.status-completed {
  background: #e8f5e9;
  color: #333; /* 修改为深色，确保可见 */
}

.task-count {
  background: rgba(255, 255, 255, 0.8);
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.column-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 200px;
}

.task-card {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #3498db;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-card.high-priority {
  border-left-color: #e74c3c;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.task-id {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: bold;
}

.task-priority {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
}

.priority-high {
  background: #ffebee;
  color: #333; /* 修改为深色，确保可见 */
}

.priority-medium {
  background: #fff3e0;
  color: #333; /* 修改为深色，确保可见 */
}

.priority-low {
  background: #e8f5e9;
  color: #333; /* 修改为深色，确保可见 */
}

.task-title {
  margin: 0.5rem 0;
  color: #2c3e50;
}

.task-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 0.8rem;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assignee-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.task-due {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.4rem;
  border: 1px solid #bdc3c7;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #000; /* 设置为黑色 */
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f8f9fa;
  color: #000; /* 设置为黑色 */
}

.add-new-card {
  border: 2px dashed #bdc3c7;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  color: #000; /* 设置为黑色 */
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-new-card:hover {
  border-color: #3498db;
  color: #000; /* 设置为黑色 */
}

/* 团队成员样式 */
.team-members {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.member-card:hover {
  background: #e8f4fd;
  transform: translateY(-2px);
}

.member-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.member-info {
  flex: 1;
}

.member-info h4 {
  margin: 0 0 0.2rem 0;
  color: #2c3e50;
}

.member-role {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.member-website {
    display: inline-block;
    margin-top: 8px;
    padding: 4px 12px;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.85rem;
    transition: background-color 0.3s;
  }
  
  .member-website:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000; /* 设置为黑色 */
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel {
  padding: 0.8rem 1.5rem;
  border: 1px solid #bdc3c7;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #000; /* 设置为黑色 */
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f8f9fa;
  color: #000; /* 设置为黑色 */
}

.btn-save {
  padding: 0.8rem 1.5rem;
  border: none;
  background: #3498db;
  color: #000; /* 设置为黑色 */
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  background: #3a9bc8;
  color: #000; /* 设置为黑色 */
}

/* 任务详情样式 */
.detail-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.detail-id {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.detail-title {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.detail-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.detail-priority,
.detail-status {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #333; /* 设置为深色，确保可见 */
}

.detail-content {
  margin-bottom: 2rem;
}

.detail-content h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.detail-content p {
  color: #7f8c8d;
  line-height: 1.6;
}

.detail-info {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
  }
  
  /* 任务markdown内容区域样式 */
  .task-markdown-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
  }
  
  .markdown-content {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 6px;
    line-height: 1.7;
  }
  
  .markdown-content h1,
  .markdown-content h2,
  .markdown-content h3,
  .markdown-content h4,
  .markdown-content h5,
  .markdown-content h6 {
    color: #2c3e50;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .markdown-content p {
    margin-bottom: 1rem;
  }
  
  .markdown-content ul,
  .markdown-content ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  .markdown-content li {
    margin-bottom: 0.5rem;
  }
  
  .markdown-content blockquote {
    border-left: 4px solid #4ab3df;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    color: #7f8c8d;
    font-style: italic;
  }
  
  .markdown-content code {
    background: #ecf0f1;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9rem;
  }
  
  .markdown-content pre {
    background: #ecf0f1;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
  }
  
  .markdown-content pre code {
    background: transparent;
    padding: 0;
  }
  
  .markdown-content img {
    max-width: 100%;
    height: auto;
    max-height: 400px;
    margin: 1rem auto;
    display: block;
    border-radius: 4px;
    overflow: hidden;
  }

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.small-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}



.detail-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-action {
  padding: 0.8rem 1.5rem;
  border: 1px solid #bdc3c7;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #000; /* 设置为黑色 */
  transition: all 0.3s ease;
}

.btn-action:hover {
  background: #f8f9fa;
  color: #000; /* 设置为黑色 */
}

.btn-primary {
  background: #3498db;
  color: #000; /* 设置为黑色 */
  border-color: #3498db;
}

.btn-primary:hover {
  background: #2980b9;
  color: #000; /* 设置为黑色 */
}

/* 深色模式样式 */
.dark .section {
  background: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .page-header h1,
.dark .section-title {
  color: #ffffff;
}

.dark .page-header p {
  color: #b0b0b0;
}

.dark .stat-card {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.dark .filter-btn {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: #444;
}

.dark .filter-btn:hover {
  background: #333;
}

.dark .filter-btn.active {
  background: #1a5c7a;
  border-color: #4ab3df;
}

.dark .search-input {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: #444;
}

.dark .task-kanban {
  background: transparent;
}

.dark .kanban-column {
  background: #2a2a2a;
}

.dark .task-card {
  background: #1e1e1e;
  color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .task-card.high-priority {
  border-left-color: #ef5350;
}

.dark .task-title {
  color: #ffffff;
}

.dark .task-description,
.dark .task-meta {
  color: #b0b0b0;
}

.dark .member-card {
  background: #2a2a2a;
}

.dark .member-card:hover {
  background: #1e3a5f;
}

.dark .member-info h4 {
  color: #ffffff;
}

.dark .member-role {
  color: #b0b0b0;
}

.dark .member-stats {
  color: #4ab3df;
}

.dark .modal-content {
  background: #1e1e1e;
  color: #e0e0e0;
}

.dark .modal-header h3,
.dark .form-group label,
.dark .detail-title,
.dark .detail-content h4 {
  color: #ffffff;
}

.dark .form-input {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: #444;
}

.dark .btn-cancel {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: #444;
}

.dark .btn-cancel:hover {
  background: #333;
}

.dark .detail-content p {
  color: #b0b0b0;
}

.dark .detail-info {
    background: #2a2a2a;
  }
  
  /* 深色模式下的markdown内容样式 */
  .dark .task-markdown-section {
    border-top-color: #444;
  }
  
  .dark .markdown-content {
    background: #2a2a2a;
  }
  
  .dark .markdown-content h1,
  .dark .markdown-content h2,
  .dark .markdown-content h3,
  .dark .markdown-content h4,
  .dark .markdown-content h5,
  .dark .markdown-content h6 {
    color: #ffffff;
  }
  
  .dark .markdown-content p,
  .dark .markdown-content li {
    color: #b0b0b0;
  }
  
  .dark .markdown-content blockquote {
    color: #8e8e8e;
    border-left-color: #4ab3df;
  }
  
  .dark .markdown-content code,
  .dark .markdown-content pre {
    background: #1e1e1e;
  }

.dark .btn-action {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: #444;
}

.dark .btn-action:hover {
  background: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .collaboration-container {
    padding: 1rem;
  }
  
  .section {
    padding: 1rem;
  }
  
  .task-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    margin-left: 0;
  }
  
  .search-input {
    width: 100%;
  }
  
  .task-kanban {
    grid-template-columns: 1fr;
  }
  
  .team-members {
    grid-template-columns: 1fr;
  }
  
  .detail-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}
</style>