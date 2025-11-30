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

    <!-- 主内容区域 - 左右布局 -->
    <div class="main-content">
      <!-- 左侧筛选区域 -->
      <aside class="sidebar">
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
      </aside>

      <!-- 右侧博客列表区域 -->
      <main class="content">
        <!-- 博客列表 - 瀑布流布局 -->
        <section class="blog-masonry">
          <div 
            v-for="blog in filteredBlogs" 
            :key="blog.id"
            class="masonry-card"
          >
            <!-- 置顶徽章移到右上角 -->
            <div class="card-header">
              <PinnedBadge v-if="blog.pinned" class="pinned-badge" />
            </div>
            
            <h2 class="blog-card-title">
              <router-link :to="`/blog/${blog.id}`" class="blog-link">
                {{ blog.title }}
              </router-link>
            </h2>
            <p class="blog-card-summary">{{ blog.summary }}</p>
            
            <!-- 重构为两栏布局 -->
            <div class="blog-card-meta">
              <!-- 左侧标签区域 -->
              <div class="left-section">
                <!-- 技术栈标签 -->
                <div class="tech-tags-section">
                  <CollectionTag :collection="blog.collection" />
                  <span 
                    v-for="tag in blog.techTags" 
                    :key="tag"
                    class="tag tech-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <!-- 软件标签 -->
                <div class="software-tags-section">
                  <span 
                    v-for="tag in blog.softwareTags" 
                    :key="tag"
                    class="tag software-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              
              <!-- 右侧信息区域 -->
              <div class="right-section">
                <div class="blog-card-info">
                  <span class="blog-date">{{ blog.date }}</span>
                  <span class="blog-author">作者：{{ blog.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 无内容提示 -->
        <div v-if="filteredBlogs.length === 0" class="empty-state">
          <i class="fas fa-search fa-3x"></i>
          <p>没有找到匹配的博客文章</p>
        </div>
      </main>
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
        'C#', 'Django', 'Flask', 'MySQL', 'node.js', 'git', 'Markdown', 'yaml', 'Linux', 'Netlify'
      ],
      softwareFilters: [
        'VScode', 'wireshark', 'unity', '教程', 'github', 'Git LFS', 'sourcetree', 
      ],
      collectionFilters: [],
      blogs: [],
      searchKeyword: '',
      searchDate: '',
      showSearchInfo: false
    }
  },
  computed: {
    filteredBlogs() {
      const filtered = this.blogs.filter(blog => {
        const collectionMatch = this.selectedCollection === 'all' || 
                               (blog.collection && blog.collection === this.selectedCollection)
        
        const techMatch = this.selectedTech === 'all' || 
                          blog.techTags.some(tag => tag === this.selectedTech)
        
        const softwareMatch = this.selectedSoftware === 'all' || 
                              blog.softwareTags.some(tag => tag === this.selectedSoftware)
        
        const keywordMatch = !this.searchKeyword || 
                            blog.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                            blog.summary.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                            blog.techTags.some(tag => tag.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
                            blog.softwareTags.some(tag => tag.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
                            (blog.collection && blog.collection.toLowerCase().includes(this.searchKeyword.toLowerCase()))
        
        const dateMatch = !this.searchDate || blog.date === this.searchDate
        
        return collectionMatch && techMatch && softwareMatch && keywordMatch && dateMatch
      })
      
      return filtered.sort((a, b) => {
        // 先按置顶状态排序（置顶的在前）
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        
        // 如果都是置顶文章，确保GitHub大文件推送限制问题解决方案报告跟在网页组协作指南文章之后
        if (a.pinned && b.pinned) {
          // 网页组协作指南文章应该排在GitHub大文件推送限制问题解决方案报告之前
          if (b.title.includes('GitHub大文件推送限制') && a.title.includes('网页组协作指南')) {
            return -1;
          }
          if (a.title.includes('GitHub大文件推送限制') && b.title.includes('网页组协作指南')) {
            return 1;
          }
        }
        
        // 其他情况按日期排序
        return new Date(b.date) - new Date(a.date);
      });
    }
  },
  methods: {
    handleSearch() {
      this.showSearchInfo = true
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {}, 300)
    },
    
    clearSearch() {
      this.searchKeyword = ''
      this.searchDate = ''
      this.showSearchInfo = false
    },
    
    async loadBlogFiles() {
      try {
        const markdownFiles = import.meta.glob(['/blogs/*.md', '/blogs/*/*.md'], { as: 'raw' });
        
        this.blogs = [];
        
        let id = 1;
        for (const [path, contentPromise] of Object.entries(markdownFiles)) {
          try {
            const fileName = path.split('/').pop();
            const content = await contentPromise();
            const blogData = this.parseBlogMetadata(content, fileName, id.toString());
            this.blogs.push(blogData);
            id++;
          } catch (fileError) {
            console.error(`处理文件 ${path} 失败:`, fileError);
          }
        }
        
        const collections = [...new Set(this.blogs.map(blog => blog.collection).filter(Boolean))];
        this.collectionFilters = collections.sort();
        
      } catch (error) {
        console.error('加载博客文件失败:', error);
        this.addDefaultBlogs();
        const collections = [...new Set(this.blogs.map(blog => blog.collection).filter(Boolean))];
        this.collectionFilters = collections.sort();
      }
    },
    
    parseBlogMetadata(content, fileName, id) {
      const titleMatch = content.match(/#\s+([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : '无标题博客';
      
      const dateMatch = content.match(/\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];
      
      const authorMatch = content.match(/作者[:：]\s*([^\n]+)/i);
      const author = authorMatch ? authorMatch[1].trim() : '井上川';
      
      let techTags = [];
      let softwareTags = [];
      
      const techTagsMatch = content.match(/techTags:\s*([^\n]+)/i);
      if (techTagsMatch) {
        techTags = techTagsMatch[1].split(',')
          .map(tag => tag.trim());
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
        softwareTags.forEach(tag => {
          if (!this.softwareFilters.includes(tag)) {
            this.softwareFilters.push(tag);
          }
        });
      }
      
      const pinnedMatch = content.match(/pinned:\s*(true|false)/i);
      const pinned = pinnedMatch ? pinnedMatch[1].toLowerCase() === 'true' : false;
      
      const collectionMatch = content.match(/collection:\s*([^\n]+)/i);
      const collection = collectionMatch ? collectionMatch[1].trim() : '';
      
      const summaryMatch = content.match(/summary:\s*([^\n]+)/i);
      let summary = '暂无摘要';
      
      if (summaryMatch) {
        summary = summaryMatch[1].trim();
      } else {
        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim() && !p.startsWith('#'));
        if (paragraphs.length > 0) {
          summary = paragraphs[0].replace(/#/g, '').substring(0, 150) + '...';
        }
      }
      
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
        contentPath: `../../${fileName}`
      };
    },
    
    addDefaultBlogs() {
      this.blogs = [
      ];
    }
  },
  mounted() {
    this.loadBlogFiles()
  },
  
  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  }
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

.main-content {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: fit-content;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.content {
  flex: 1;
  min-width: 0;
}

.blog-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  border-radius: 10px;
  color: black;
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
  border-color: #4ab3df;
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
  border-color: #4ab3df;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-button {
  padding: 0.8rem 1.5rem;
  background-color: #4ab3df;
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
  background-color: #4ab3df;
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
  background-color: #fafbfc;
  padding: 1.5rem;
  transition: background-color 0.3s ease;
}

.filter-group {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.filter-group:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.filter-title {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.filter-tag {
  padding: 0.4rem 1rem;
  border: 1px solid #e0e0e0;
  background-color: white;
  color: #555;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  text-transform: capitalize;
}

.filter-tag:hover {
  background-color: #f5f5f5;
  border-color: #4ab3df;
  color: #4ab3df;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-tag.active {
  background-color: #4ab3df;
  color: white;
  border-color: #4ab3df;
  box-shadow: 0 2px 6px rgba(52, 152, 219, 0.3);
}

.filter-tag:first-child {
  order: -1;
  background-color: #2c3e50;
  border-color: #2c3e50;
  color: white;
  text-transform: none;
}

.filter-tag:first-child:hover,
.filter-tag:first-child.active {
  background-color: #1a252f;
  border-color: #1a252f;
  box-shadow: 0 2px 6px rgba(44, 62, 80, 0.3);
}

.blog-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 0 auto;
}

.masonry-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #4ab3df;
  position: relative;
  break-inside: avoid;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.masonry-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .blog-masonry {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .blog-masonry {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
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
  color: #4ab3df;
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

.card-header {
  position: relative;
  height: 0;
}

.pinned-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  z-index: 10;
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

/* 两栏布局 */
.blog-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  transition: border-color 0.3s ease;
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tech-tags-section,
.software-tags-section {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.right-section {
  display: flex;
  align-items: center;
  margin-left: auto; /* 自动左边距使其靠右 */
  padding-left:7rem;
  min-width: 180px;
  flex-shrink: 0; /* 防止被压缩 */
}

.blog-card-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 右对齐 */
  white-space: nowrap; /* 确保不换行 */
  overflow: visible; /* 允许内容超出容器 */
  text-overflow: clip; /* 不显示省略号 */
  text-align: right; /* 文本右对齐 */
  padding-right: 10px; /* 距离右边框10px */
}

/* 确保博客卡片有足够的宽度来容纳右侧信息 */
@media (max-width: 768px) {
  .blog-masonry {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .blog-card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .right-section {
    margin-left: 0;
    min-width: auto;
    width: 100%;
  }
  
  .blog-card-info {
    align-items: flex-start;
    width: 100%;
  }
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

@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
  
  .filter-section {
    padding: 1.2rem;
  }
  
  .filter-group {
    margin-bottom: 1.2rem;
    padding-bottom: 1.2rem;
  }
}

@media (max-width: 768px) {
  .blog-container {
    padding: 1rem;
  }
  
  .blog-title {
    font-size: 2rem;
  }
  
  .main-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .sidebar {
    width: 100%;
    position: static;
    top: auto;
    border-radius: 8px;
  }
  
  .filter-section {
    padding: 1rem;
  }
  
  .filter-group {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
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

.dark .blog-container {
  color: #ffffff !important;
}

.dark .search-section {
  background-color: #2d2d2d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark .search-input {
  background-color: #34495e;
  border-color: #4ab3df;
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
  border-color: #4ab3df;
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
  background: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .blog-title,
.dark .blog-subtitle {
  color: #ffffff !important;
}

.dark .sidebar {
  background-color: #2d2d2d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.dark .filter-section {
  background-color: #2d2d2d;
}

.dark .filter-group {
  border-bottom-color: #404040;
}

.dark .main-content {
  gap: 2rem;
}

.dark .filter-title {
  color: #ffffff;
}

.dark .filter-tag {
  background-color: #34495e;
  color: #e0e0e0;
  border-color: #4ab3df;
}

.dark .filter-tag:hover {
  background-color: #4a5f78;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark .filter-tag.active {
  background-color: #3498db;
  color: white;
  border-color: #4ab3df;
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
  border-left: 4px solid #4ab3df;
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
  color: #4ab3df;
}

.dark .blog-card-summary {
  color: #cccccc;
}

.dark .blog-card-meta {
  border-top: 1px solid #404040;
}

.dark .tag,
.dark .tech-tag,
.dark .software-tag {
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

.dark .empty-state i { color: #555; }

  /* 深色模式 - 博客卡片增强样式 */
  .dark .masonry-card {
    background-color: #2d2d2d;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border-left: 4px solid #4ab3df;
  }

  .dark .masonry-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  }

  .dark .tag {
    background-color: #34495e;
    color: #e0e0e0;
  }

  .dark .tech-tag {
    background-color: #2c3e50;
    color: #4ab3df;
  }

  .dark .software-tag {
    background-color: #2c3e50;
    color: #9b59b6;
  }

  .dark .blog-card-meta {
    border-top-color: #404040;
  }

  .dark .right-section {
    border-left: 1px solid #404040;
  }
</style>