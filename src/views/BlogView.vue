<template>
  <div class="blog-container">
    <header class="blog-header">
      <h1 class="blog-title">技术博客</h1>
      <p class="blog-subtitle">记录学习历程，分享技术心得</p>
    </header>

    <!-- 搜索区域 -->
    <section class="search-section">
      <div class="search-container">
        <input 
          type="text" 
          class="search-input"
          placeholder="输入关键词搜索标题、摘要或标签..."
          v-model="searchKeyword"
          @input="handleSearch"
        >
        <input 
          type="date" 
          class="date-input"
          v-model="searchDate"
          @change="handleSearch"
        >
        <button 
          class="search-button"
          @click="handleSearch"
          :disabled="!searchKeyword && !searchDate"
        >
          <i class="fas fa-search"></i> 搜索
        </button>
        <button 
          class="clear-button"
          v-if="searchKeyword || searchDate"
          @click="clearSearch"
        >
          <i class="fas fa-times"></i> 清除
        </button>
      </div>
      <div class="search-results-info" v-if="showSearchInfo">
        找到 {{ filteredBlogs.length }} 篇相关博客
      </div>
    </section>

    <!-- 筛选区域 -->
    <section class="filter-section">
      <div class="filter-group">
        <h3 class="filter-title">合集筛选</h3>
        <div class="filter-tags">
          <button 
            class="filter-tag" 
            :class="{ active: selectedCollection === 'all' }"
            @click="selectedCollection = 'all'"
          >
            全部
          </button>
          <button 
            v-for="collection in collectionFilters" 
            :key="collection"
            class="filter-tag"
            :class="{ active: selectedCollection === collection }"
            @click="selectedCollection = collection"
          >
            {{ collection }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <h3 class="filter-title">技术栈筛选</h3>
        <div class="filter-tags">
          <button 
            class="filter-tag" 
            :class="{ active: selectedTech === 'all' }"
            @click="selectedTech = 'all'"
          >
            全部
          </button>
          <button 
            v-for="tech in techFilters" 
            :key="tech"
            class="filter-tag"
            :class="{ active: selectedTech === tech }"
            @click="selectedTech = tech"
          >
            {{ tech }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <h3 class="filter-title">软件筛选</h3>
        <div class="filter-tags">
          <button 
            class="filter-tag" 
            :class="{ active: selectedSoftware === 'all' }"
            @click="selectedSoftware = 'all'"
          >
            全部
          </button>
          <button 
            v-for="software in softwareFilters" 
            :key="software"
            class="filter-tag"
            :class="{ active: selectedSoftware === software }"
            @click="selectedSoftware = software"
          >
            {{ software }}
          </button>
        </div>
      </div>
    </section>

    <!-- 博客列表 -->
    <section class="blog-list">
      <div 
        v-for="blog in filteredBlogs" 
        :key="blog.id"
        class="blog-card"
      >
        <h2 class="blog-card-title">
          <router-link :to="`/blog/${blog.id}`" class="blog-link">
            {{ blog.title }}
            <PinnedBadge v-if="blog.pinned" />
          </router-link>
        </h2>
        <p class="blog-card-summary">{{ blog.summary }}</p>
        <div class="blog-card-meta">
          <div class="blog-card-tags">
            <CollectionTag :collection="blog.collection" />
            <span 
              v-for="tag in blog.techTags" 
              :key="tag"
              class="tag tech-tag"
            >
              {{ tag }}
            </span>
            <span 
              v-for="tag in blog.softwareTags" 
              :key="tag"
              class="tag software-tag"
            >
              {{ tag }}
            </span>
          </div>
          <div class="blog-card-info">
            <span class="blog-date">{{ blog.date }}</span>
            <span class="blog-author">作者：{{ blog.author }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 无内容提示 -->
    <div v-if="filteredBlogs.length === 0" class="empty-state">
      <i class="fas fa-search fa-3x"></i>
      <p>没有找到匹配的博客文章</p>
    </div>
  </div>
</template>

<script>
import PinnedBadge from '../components/PinnedBadge.vue'
import CollectionTag from '../components/CollectionTag.vue'

export default {
  name: 'BlogView',
  components: {
    PinnedBadge,
    CollectionTag
  },
  data() {
    return {
      selectedTech: 'all',
      selectedSoftware: 'all',
      selectedCollection: 'all',
      techFilters: [
        'Vue3', 'JavaScript', 'HTML', 'CSS', 'Python', 
        'C#', 'Django', 'Flask', 'MySQL', 'node.js', 'git', 'Markdown', 'yaml', 'Hadoop', 'Linux', '机器学习', '决策树', '数据分析', '大数据', '数据挖掘', '深度学习', 'AI'
      ],
      softwareFilters: [
        'VScode', 'wireshark', 'unity', '教程', 'github', 'Git LFS', 'sourcetree', '算法实现'
      ],
      collectionFilters: [], // 合集筛选列表会在加载博客时动态生成
      // 博客数据
      blogs: [],
      // 搜索相关状态
      searchKeyword: '',
      searchDate: '',
      showSearchInfo: false
    }
  },
  computed: {
    filteredBlogs() {
      // 先筛选后排序，置顶博客排在前面
      const filtered = this.blogs.filter(blog => {
        // 合集筛选
        const collectionMatch = this.selectedCollection === 'all' || 
                               (blog.collection && blog.collection === this.selectedCollection)
        
        // 技术栈筛选
        const techMatch = this.selectedTech === 'all' || 
                          blog.techTags.some(tag => tag === this.selectedTech)
        
        // 软件筛选
        const softwareMatch = this.selectedSoftware === 'all' || 
                              blog.softwareTags.some(tag => tag === this.selectedSoftware)
        
        // 搜索关键词筛选
        const keywordMatch = !this.searchKeyword || 
                            blog.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                            blog.summary.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                            blog.techTags.some(tag => tag.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
                            blog.softwareTags.some(tag => tag.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
                            (blog.collection && blog.collection.toLowerCase().includes(this.searchKeyword.toLowerCase()))
        
        // 日期筛选
        const dateMatch = !this.searchDate || blog.date === this.searchDate
        
        return collectionMatch && techMatch && softwareMatch && keywordMatch && dateMatch
      })
      
      // 排序：置顶博客在前，然后按日期降序
      return filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
      });
    }
  },
  methods: {
    // 处理搜索
    handleSearch() {
      this.showSearchInfo = true
      // 防抖处理，避免频繁搜索
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        // 搜索逻辑已经在computed属性中实现
      }, 300)
    },
    
    // 清除搜索条件
    clearSearch() {
      this.searchKeyword = ''
      this.searchDate = ''
      this.showSearchInfo = false
    },
    
    // 加载博客文件的方法，从blogs文件夹读取Markdown文件
    async loadBlogFiles() {
      try {
        // 使用import.meta.glob动态导入blogs目录下的所有md文件（包括子目录）
        const markdownFiles = import.meta.glob(['/blogs/*.md', '/blogs/*/*.md'], { as: 'raw' });
        
        // 清空现有博客数据
        this.blogs = [];
        
        // 遍历所有文件并解析
        let id = 1;
        for (const [path, contentPromise] of Object.entries(markdownFiles)) {
          try {
            // 获取文件名
            const fileName = path.split('/').pop();
            
            // 加载文件内容
            const content = await contentPromise();
            
            // 解析文件元数据
            const blogData = this.parseBlogMetadata(content, fileName, id.toString());
            
            // 添加到博客数组
            this.blogs.push(blogData);
            
            id++;
          } catch (fileError) {
            console.error(`处理文件 ${path} 失败:`, fileError);
          }
        }
        
        // 动态生成合集筛选列表
        const collections = [...new Set(this.blogs.map(blog => blog.collection).filter(Boolean))];
        this.collectionFilters = collections.sort();
        
        console.log('博客文件加载完成:', this.blogs);
        
      } catch (error) {
        console.error('加载博客文件失败:', error);
        // 如果出错，添加一些默认的模拟数据
        this.addDefaultBlogs();
        // 为默认数据生成合集列表
        const collections = [...new Set(this.blogs.map(blog => blog.collection).filter(Boolean))];
        this.collectionFilters = collections.sort();
      }
    },
    
    // 解析博客文件的元数据
    parseBlogMetadata(content, fileName, id) {
      // 解析标题（通常是第一个#后面的内容）
      const titleMatch = content.match(/#\s+([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : '无标题博客';
      
      // 解析日期（寻找日期格式的文本）
      const dateMatch = content.match(/\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];
      
      // 解析作者（寻找作者: 或类似格式）
      const authorMatch = content.match(/作者[:：]\s*([^\n]+)/i);
      const author = authorMatch ? authorMatch[1].trim() : '井上川';
      
      // 解析标签（从文件头部寻找techTags或tools）
      let techTags = [];
      let softwareTags = [];
      
      const techTagsMatch = content.match(/techTags:\s*([^\n]+)/i);
      if (techTagsMatch) {
        techTags = techTagsMatch[1].split(',')
          .map(tag => tag.trim());
        // 添加新标签到筛选列表
        techTags.forEach(tag => {
          if (!this.techFilters.includes(tag)) {
            this.techFilters.push(tag);
          }
        });
      }
      
      const softwareTagsMatch = content.match(/softwareTags:\s*([^\n]+)/i);
      if (softwareTagsMatch) {
        softwareTags = softwareTagsMatch[1].split(',')
          .map(tag => tag.trim());
        // 添加新标签到筛选列表
        softwareTags.forEach(tag => {
          if (!this.softwareFilters.includes(tag)) {
            this.softwareFilters.push(tag);
          }
        });
      }
      
      
      // 解析置顶标记
      const pinnedMatch = content.match(/pinned:\s*(true|false)/i);
      const pinned = pinnedMatch ? pinnedMatch[1].toLowerCase() === 'true' : false;
      
      // 解析合集标记
      const collectionMatch = content.match(/collection:\s*([^\n]+)/i);
      const collection = collectionMatch ? collectionMatch[1].trim() : '';
      
      // 生成摘要（优先从metadata中获取专门的summary字段）
      const summaryMatch = content.match(/summary:\s*([^\n]+)/i);
      let summary = '暂无摘要';
      
      if (summaryMatch) {
        summary = summaryMatch[1].trim();
      } else {
        // 如果没有专门的summary字段，才使用第一段内容作为后备
        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim() && !p.startsWith('#'));
        if (paragraphs.length > 0) {
          summary = paragraphs[0].replace(/#/g, '').substring(0, 150) + '...';
        }
      }
      
      // 构建博客数据对象
      return {
        id,
        title,
        summary,
        date,
        author,
        techTags,
        softwareTags,
        pinned,
        collection,
        contentPath: `../../${fileName}` // 相对路径，用于详情页加载
      };
    },
    
    // 添加默认博客数据（当加载失败时使用）
    addDefaultBlogs() {
      this.blogs = [
        {          id: '1',          title: 'GitHub大文件推送限制问题解决方案报告',          summary: '本文详细介绍了在GitHub中推送大文件时遇到的问题及解决方案，包括Git LFS的使用、文件分割等多种方法...',          date: '2024-09-15',          author: '井上川',          techTags: ['git', 'GitHub'],          softwareTags: ['VScode', 'github'],          pinned: true,          collection: 'Git进阶教程',          contentPath: '../../GitHub大文件推送限制问题解决方案报告.md'        },        {          id: '2',          title: 'Vue3入门指南',          summary: '本文介绍了Vue3的核心特性、性能改进和使用方法，包括组合式API、Teleport、Suspense等新特性...',          date: '2024-09-10',          author: '井上川',          techTags: ['Vue3', 'JavaScript'],          softwareTags: ['VScode', 'github'],          pinned: false,          collection: '前端框架学习',          contentPath: '../../vue3-introduction.md'        },        {          id: '3',          title: 'Python数据分析实战',          summary: '本文介绍了如何使用Python进行数据分析，包括Pandas、NumPy和Matplotlib等库的使用方法...',          date: '2024-09-05',          author: '井上川',          techTags: ['Python', '数据分析'],          softwareTags: ['VScode', 'jupyter'],          pinned: false,          collection: 'Python数据分析',          contentPath: '../../python-data-analysis.md'        }
      ];
    }
  },
  mounted() {
    this.loadBlogFiles()
  },
  
  beforeUnmount() {
    // 清理定时器
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
}
</script>

<style scoped>
.blog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.blog-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.search-section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.search-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  min-width: 300px;
  padding: 0.8rem 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.date-input {
  padding: 0.8rem 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-button {
  padding: 0.8rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-button:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.search-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.clear-button {
  padding: 0.8rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-button:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
}

.search-results-info {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-align: center;
  transition: color 0.3s ease;
}

.blog-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.blog-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.filter-section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
  transition: color 0.3s ease;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.filter-tag {
  padding: 0.5rem 1.2rem;
  border: 2px solid #3498db;
  background-color: white;
  color: #3498db;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-tag:hover {
  background-color: #3498db;
  color: white;
  transform: translateY(-1px);
}

.filter-tag.active {
  background-color: #3498db;
  color: white;
}

.filter-tag:first-child {
  order: -1; /* 确保"全部"选项始终在最前面 */
  background-color: #2c3e50;
  border-color: #2c3e50;
  color: white;
}

.filter-tag:first-child:hover,
.filter-tag:first-child.active {
  background-color: #1a252f;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.blog-card {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #3498db;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.blog-card-title {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  position: relative;
  transition: color 0.3s ease;
}



.blog-link {
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.blog-link:hover {
  color: #3498db;
}

.blog-card-summary {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

.blog-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  transition: border-color 0.3s ease;
}

.blog-card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tech-tag {
  background-color: #e8f4fd;
  color: #3498db;
}

.software-tag {
  background-color: #f0e6fa;
  color: #9b59b6;
}

.blog-card-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.blog-date,
.blog-author {
  font-size: 0.9rem;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.empty-state i {
  margin-bottom: 1rem;
  color: #bdc3c7;
  transition: color 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-container {
    padding: 1rem;
  }
  
  .blog-title {
    font-size: 2rem;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .search-input {
    min-width: auto;
    width: 100%;
  }
  
  .date-input {
    width: 100%;
  }
  
  .search-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }
  
  .blog-card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .blog-card-info {
    align-items: flex-start;
  }
}

/* 深色模式样式 */
.dark .blog-container {
  color: #e0e0e0;
}

.dark .search-section {
  background-color: #2d2d2d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark .search-input {
  background-color: #34495e;
  border-color: #5dade2;
  color: #ffffff;
}

.dark .search-input::placeholder {
  color: #999999;
}

.dark .search-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

.dark .date-input {
  background-color: #34495e;
  border-color: #5dade2;
  color: #ffffff;
}

.dark .date-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

.dark .search-results-info {
  color: #999999;
}

.dark .blog-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.dark .filter-section {
  background-color: #2d2d2d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark .filter-title {
  color: #ffffff;
}

.dark .filter-tag {
  background-color: #34495e;
  color: #ffffff;
  border-color: #5dade2;
}

.dark .filter-tag:hover {
  background-color: #3498db;
  color: white;
}

.dark .filter-tag.active {
  background-color: #3498db;
  color: white;
  border-color: #5dade2;
}

.dark .filter-tag:first-child {
  background-color: #1a252f;
  border-color: #2c3e50;
  color: white;
}

.dark .filter-tag:first-child:hover,
.dark .filter-tag:first-child.active {
  background-color: #1a252f;
}

.dark .blog-card {
  background-color: #2d2d2d;
  color: #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-left: 4px solid #3498db;
}

.dark .blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.dark .blog-card-title {
  color: #ffffff;
}

.dark .blog-link {
  color: #3498db;
}

.dark .blog-link:hover {
  color: #5dade2;
}

.dark .blog-card-summary {
  color: #cccccc;
}

.dark .blog-card-meta {
  border-top: 1px solid #404040;
}

.dark .tag, .dark .tech-tag, .dark .software-tag {
  background-color: #34495e;
  color: #5dade2;
}

.dark .blog-date,
.dark .blog-author {
  color: #999999;
}

.dark .empty-state {
  color: #777;
}

.dark .empty-state i {
  color: #555;
}
</style>