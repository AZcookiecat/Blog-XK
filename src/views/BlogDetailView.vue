<template>
  <div class="blog-detail-container">
    <!-- 阅读进度条 -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle fa-3x"></i>
      <p>{{ error }}</p>
      <router-link to="/blog" class="back-link">返回博客列表</router-link>
    </div>
    
    <div v-else class="blog-detail-content">
      <!-- 移动端目录按钮 -->
      <div class="toc-mobile-toggle" @click="toggleTocMobile" v-if="isMobile && tableOfContents.length > 0">
        <i class="fas fa-list"></i>
        目录
      </div>
      
      <!-- 移动端目录面板 -->
      <div class="toc-mobile-panel" v-if="isMobile && showTocMobile && tableOfContents.length > 0">
        <div class="toc-mobile-header">
          <h3>目录</h3>
          <button class="toc-mobile-close" @click="toggleTocMobile">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <nav class="table-of-contents">
          <ul>
            <li v-for="item in tableOfContents" :key="item.id">
              <a 
                :href="'#' + item.id" 
                @click.prevent="scrollToSection(item.id)"
                @mouseenter="previewSection(item.id)"
                @mouseleave="cancelPreview"
                :class="{ active: activeSection === item.id }"
                :style="{ paddingLeft: (item.level - 1) * 15 + 'px' }"
                class="toc-link"
                title="点击跳转到该章节"
              >
                {{ item.text }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      <!-- 桌面端左侧目录 -->
      <aside class="blog-sidebar" v-if="!isMobile && tableOfContents.length > 0">
        <nav class="table-of-contents">
          <h3>目录</h3>
          <ul>
            <li v-for="item in tableOfContents" :key="item.id">
              <a 
                :href="'#' + item.id" 
                @click.prevent="scrollToSection(item.id)"
                @mouseenter="previewSection(item.id)"
                @mouseleave="cancelPreview"
                :class="{ active: activeSection === item.id }"
                :style="{ paddingLeft: (item.level - 1) * 15 + 'px' }"
                class="toc-link"
                title="点击跳转到该章节"
              >
                {{ item.text }}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <header class="blog-detail-header">
        <h1 class="blog-detail-title">{{ blog.title }}</h1>
        <div class="blog-detail-meta">
          <span class="blog-date">{{ blog.date }}</span>
          <span class="blog-author">作者：{{ blog.author }}</span>
        </div>
        <!-- 显示合集 -->
        <div class="blog-detail-collection" v-if="blog.collection">
          <span class="collection-tag">
            <i class="fas fa-book-open"></i> 合集：{{ blog.collection }}
          </span>
        </div>
        
        <!-- 显示techTags和softwareTags -->
        <div class="blog-detail-tags" v-if="(blog.techTags && blog.techTags.length > 0) || (blog.softwareTags && blog.softwareTags.length > 0)">
          <span 
            v-for="tag in blog.techTags" 
            :key="tag + '-tech'"
            class="tag tech-tag"
          >
            {{ tag }}
          </span>
          <span 
            v-for="tag in blog.softwareTags" 
            :key="tag + '-software'"
            class="tag software-tag"
          >
            {{ tag }}
          </span>
        </div>

      </header>
      
      <main class="blog-detail-body">
        <div v-html="renderedContent"></div>
      </main>
      
      <footer class="blog-detail-footer">
        <router-link to="/blog" class="back-link">
          <i class="fas fa-arrow-left"></i>
          返回博客列表
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'

export default {
  name: 'BlogDetailView',
  data() {
    return {
      loading: true,
      error: '',
      blog: {
        title: '',
        date: '',
        author: '',
        techTags: [],
        softwareTags: [],
        content: ''
      },
      renderedContent: '',
      tableOfContents: [], // 目录数据
      activeSection: '', // 当前激活的章节ID
      isMobile: false, // 是否为移动端视图
      showTocMobile: false, // 移动端是否显示目录
      previewTimer: null, // 预览计时器
      progress: 0 // 阅读进度百分比
    }
  },
  async mounted() {
    const blogId = this.$route.params.id
    await this.loadBlogDetail(blogId)
    
    // 检测窗口大小
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)
    
    // 添加滚动监听
    window.addEventListener('scroll', this.handleScroll)
  },
  
  beforeUnmount() {
    // 移除事件监听
    window.removeEventListener('resize', this.checkScreenSize)
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.loadBlogDetail(newId)
      },
      immediate: false
    }
  },
  methods: {
    async loadBlogDetail(id) {
      this.loading = true
      this.error = ''
      
      try {
        // 从实际的博客文件中查找对应ID的博客
        const blogData = await this.findBlogById(id)
        
        if (!blogData) {
          throw new Error('博客文章不存在')
        }
        
        this.blog = { ...blogData }
        
        // 加载并解析Markdown内容
        const content = await this.loadMarkdownContent(blogData.contentPath)
        
        // 过滤掉文件头部的元数据信息，使用更精确的匹配方式
        // 只移除文档开头的元数据块，保留内容中的标题和标签
        let filteredContent = content;
        
        // 先尝试移除文档开头的元数据块（如果有）
        const metadataBlockRegex = /^(?:---\s*\n)([\s\S]*?)(?:\n---\s*\n)/;
        if (metadataBlockRegex.test(filteredContent)) {
          filteredContent = filteredContent.replace(metadataBlockRegex, '');
        }
        
        // 然后移除其他可能的单行元数据（如果有）
        const metadataLines = [
          /^pinned:\s*(true|false)\s*$/im,
          /^techTags:.*$/im,
          /^softwareTags:.*$/im,
          /^tools:.*$/im,
          /^author:.*$/im,
          /^date:.*$/im
        ];
        
        metadataLines.forEach(regex => {
          filteredContent = filteredContent.replace(regex, '');
        });
        
        filteredContent = filteredContent.trim(); // 移除前后空白
        
        // 解析Markdown内容中的标题，生成目录
        this.generateTableOfContents(filteredContent)
        
        // 解析并渲染Markdown内容
        this.renderedContent = marked.parse(filteredContent)
        
        // 添加图片错误处理和章节ID
        this.$nextTick(() => {
          // 确保先找到博客内容容器
          const blogBody = document.querySelector('.blog-detail-body');
          if (blogBody) {
            // 获取容器内的所有图片元素
            const images = blogBody.querySelectorAll('img');
            images.forEach(img => {
              img.addEventListener('error', this.handleImageError);
              // 替换picsum.photos的fastly域名链接
              if (img.src.includes('fastly.picsum.photos')) {
                img.src = img.src.replace('fastly.picsum.photos', 'picsum.photos');
              }
            });
            
            // 为标题元素添加ID
            this.addIdsToHeadings(blogBody);
            
            // 检查初始滚动位置，高亮当前章节
            this.handleScroll();
          }
        });
        
      } catch (err) {
        this.error = err.message || '加载博客详情失败'
        console.error('加载博客详情时出错:', err)
      } finally {
        this.loading = false
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
      
      // 解析标签（从文件头部寻找techTags）
      let techTags = [];
      
      const techTagsMatch = content.match(/techTags:\s*([^\n]+)/i);
      if (techTagsMatch) {
        techTags = techTagsMatch[1].split(',').map(tag => tag.trim());
      }
      // 如果没有找到techTags，就使用空数组，不显示任何标签
      
      // 解析softwareTags标签
      let softwareTags = [];
      const softwareTagsMatch = content.match(/softwareTags:\s*([^\n]+)/i);
      if (softwareTagsMatch) {
        softwareTags = softwareTagsMatch[1].split(',').map(tag => tag.trim());
      }
      
      // 解析置顶标记
      const pinnedMatch = content.match(/pinned:\s*(true|false)/i);
      const pinned = pinnedMatch ? pinnedMatch[1].toLowerCase() === 'true' : false;
      
      // 解析合集标记
      const collectionMatch = content.match(/collection:\s*([^\n]+)/i);
      const collection = collectionMatch ? collectionMatch[1].trim() : '';
      
      // 构建博客数据对象
      return {
        id,
        title,
        date,
        author,
        techTags,
        softwareTags,
        pinned,
        collection,
        contentPath: `../../${fileName}` // 相对路径，用于详情页加载
      };
    },
    
    // 从所有博客文件中查找指定ID的博客
    async findBlogById(id) {
      try {
        // 使用import.meta.glob动态导入blogs目录下的所有md文件（包括子目录）
        const markdownFiles = import.meta.glob(['/blogs/*.md', '/blogs/*/*.md'], { as: 'raw' });
        
        // 遍历所有文件并查找匹配的ID
        let fileId = 1;
        for (const [path, contentPromise] of Object.entries(markdownFiles)) {
          if (fileId.toString() === id) {
            // 获取文件名
            const fileName = path.split('/').pop();
            
            // 加载文件内容
            const content = await contentPromise();
            
            // 解析文件元数据
            return this.parseBlogMetadata(content, fileName, id);
          }
          fileId++;
        }
        
        return null; // 未找到匹配的博客
      } catch (error) {
        console.error('查找博客失败:', error);
        return null;
      }
    },
    
    // 解析Markdown内容中的标题，生成目录
    generateTableOfContents(content) {
      const toc = [];
      const headingRegex = /^(#{1,6})\s+([^\n]+)/gm;
      let match;
      
      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = this.slugify(text);
        
        toc.push({
          id,
          text,
          level
        });
      }
      
      this.tableOfContents = toc;
    },
    
    // 将文本转换为URL友好的ID
    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')        // 空格替换为连字符
        .replace(/[^\w\-]+/g, '')    // 移除非单词字符
        .replace(/\-\-+/g, '-')      // 替换多个连字符为单个
        .replace(/^-+/, '')          // 移除开头的连字符
        .replace(/-+$/, '');         // 移除结尾的连字符
    },
    
    // 为标题元素添加ID
    addIdsToHeadings(container) {
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      headings.forEach((heading, index) => {
        const text = heading.textContent.trim();
        const id = this.slugify(text);
        heading.id = id;
        
        // 如果有重复ID，添加索引
        if (document.querySelectorAll(`#${id}`).length > 1) {
          heading.id = `${id}-${index}`;
        }
      });
    },
    
    // 跳转到指定章节
    scrollToSection(id) {
      const element = document.getElementById(id);
      if (element) {
        // 添加一些顶部偏移量，确保标题不会被导航栏遮挡
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // 高亮当前章节
        this.activeSection = id;
        
        // 在移动端点击后关闭目录
        if (this.isMobile) {
          this.showTocMobile = false;
        }
      }
    },
    
    // 处理滚动事件，高亮当前阅读的章节并更新阅读进度
    handleScroll() {
      // 计算阅读进度
      this.updateReadingProgress();
      
      const sections = document.querySelectorAll('.blog-detail-body h1, .blog-detail-body h2, .blog-detail-body h3, .blog-detail-body h4, .blog-detail-body h5, .blog-detail-body h6');
      let currentSection = '';
      
      // 找到当前可见的最上面的章节
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) { // 当章节顶部距离视窗顶部小于等于100px时，视为当前章节
          currentSection = section.getAttribute('id');
        }
      });
      
      if (currentSection !== this.activeSection) {
        this.activeSection = currentSection;
        // 当章节改变时，自动滚动目录到当前章节
        this.scrollTocToActiveSection();
      }
    },
    
    // 更新阅读进度
    updateReadingProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
      
      this.progress = Math.max(0, Math.min(100, scrollPercent));
    },
    
    // 滚动目录到当前激活的章节
    scrollTocToActiveSection() {
      // 桌面端目录滚动
      const desktopToc = document.querySelector('.blog-sidebar .table-of-contents');
      if (desktopToc) {
        const activeLink = desktopToc.querySelector('.toc-link.active');
        if (activeLink) {
          desktopToc.scrollTop = activeLink.offsetTop - 50; // 添加一些偏移量
        }
      }
      
      // 移动端目录滚动
      const mobileToc = document.querySelector('.toc-mobile-panel .table-of-contents');
      if (mobileToc) {
        const activeLink = mobileToc.querySelector('.toc-link.active');
        if (activeLink) {
          mobileToc.scrollTop = activeLink.offsetTop - 50; // 添加一些偏移量
        }
      }
    },
    
    // 检测窗口大小，判断是否为移动端
    checkScreenSize() {
      this.isMobile = window.innerWidth < 768;
      // 在移动端默认不显示目录
      if (this.isMobile) {
        this.showTocMobile = false;
      }
    },
    
    // 预览章节（鼠标悬停时显示预览效果）
    previewSection(id) {
      // 延迟执行，避免快速掠过多个链接时频繁触发
      this.previewTimer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // 添加临时的高亮效果
          element.classList.add('section-preview');
          
          // 可以在这里添加一个小的预览框或者其他效果
          // 简单实现：滚动到预览位置，但不改变当前的activeSection
          const originalActiveSection = this.activeSection;
          
          // 轻微滚动到目标章节附近，但不真正激活
          const offset = 150;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          // 只在当前视图中没有显示该章节时才滚动
          if (Math.abs(elementPosition) > 200) {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // 恢复原来的激活状态
            setTimeout(() => {
              this.activeSection = originalActiveSection;
            }, 100);
          }
        }
      }, 500); // 500ms延迟，减少不必要的预览
    },
    
    // 取消预览
    cancelPreview() {
      // 清除预览计时器
      if (this.previewTimer) {
        clearTimeout(this.previewTimer);
        this.previewTimer = null;
      }
      
      // 移除所有预览高亮效果
      const previewElements = document.querySelectorAll('.section-preview');
      previewElements.forEach(el => {
        el.classList.remove('section-preview');
      });
    },
    
    // 切换移动端目录显示状态
    toggleTocMobile() {
      this.showTocMobile = !this.showTocMobile;
    },
    
    handleImageError(event) {
      // 图片加载失败时的处理
      const img = event.target;
      console.warn('图片加载失败:', img.src);
      // 可以设置一个备用图片
      // img.src = '/images/placeholder.jpg';
    },
    
    async loadMarkdownContent(path) {
      try {
        // 使用Vite的动态导入功能加载Markdown文件（包括子目录）
        // 注意：在实际生产环境中，需要确保路径正确且文件存在
        const relativePath = path.replace(/^\.\.\//, '/');
        
        // 使用import.meta.glob动态导入项目根目录下的blogs文件夹及其子目录中的Markdown文件
        const markdownFiles = import.meta.glob(['/blogs/*.md', '/blogs/*/*.md'], { as: 'raw' });
        
        // 获取文件名
        const fileName = path.split('/').pop();
        
        // 找到匹配的文件路径
        // 对于子目录中的文件，路径可能包含文件夹名，所以我们需要更宽松的匹配
        const fileKey = Object.keys(markdownFiles).find(key => 
          key.includes(fileName)
        );
        
        if (fileKey) {
          // 加载并返回文件内容
          const content = await markdownFiles[fileKey]();
          return content;
        } else {
          // 直接返回博客ID对应的文件内容，避免使用fetch
          throw new Error('博客文件不存在或无法访问');
        }
      } catch (error) {
        console.error('加载Markdown文件失败:', error);
        return `# 加载失败\n\n无法加载博客内容: ${error.message || '未知错误'}`;
      }
    }
  }
}
</script>

<style scoped>
/* 阅读进度条样式 */
.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: transparent;
  z-index: 1000;
}

.progress-bar {
  height: 100%;
  background-color: #4ab3df;
  transition: width 0.2s ease;
}

.blog-detail-container {
  max-width: 1200px;
  margin: 0 0 0 260px;
  padding: 2rem;
  min-height: 100vh;
  background-color: white;
  position: relative;
  width: calc(100% - 260px);
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 0;
  color: #7f8c8d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4ab3df;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state i {
  margin-bottom: 1rem;
  color: #e74c3c;
}

.blog-detail-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
}

.blog-detail-title {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  line-height: 1.4;
}

.blog-detail-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  color: #7f8c8d;
}

.blog-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.3rem 0.8rem;
  background-color: #f8f9fa;
  color: #4ab3df;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 合集标签样式 */
.blog-detail-collection {
  margin-bottom: 1rem;
}

.blog-detail-collection .collection-tag {
  background-color: #eafaf1;
  color: #2ecc71;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;
}

.blog-detail-body {
  margin-bottom: 3rem;
}

.blog-detail-body :deep(h2),
.blog-detail-body :deep(h3),
.blog-detail-body :deep(h4),
.blog-detail-body :deep(h5),
.blog-detail-body :deep(h6) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

/* 隐藏main部分的h1标签 */
.blog-detail-body :deep(h1) {
  display: none;
}

.blog-detail-body :deep(h2) {
  font-size: 1.6rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.blog-detail-body :deep(h3) {
  font-size: 1.4rem;
}

/* 恢复main部分的p标签显示 */
.blog-detail-body :deep(p) {
  margin-bottom: 1.5rem;
  line-height: 1.8;
  color: #333;
}

.blog-detail-body :deep(ul),
.blog-detail-body :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.blog-detail-body :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.8;
}

.blog-detail-body :deep(pre) {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.blog-detail-body :deep(code) {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

.blog-detail-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.blog-detail-body :deep(blockquote) {
    border-left: 4px solid #4ab3df;
    padding-left: 1rem;
    margin-left: 0;
    margin-bottom: 1.5rem;
    color: #7f8c8d;
    font-style: italic;
  }

  /* 图片样式 - 使用max-width控制，最大高度限制 */
.blog-detail-body :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 400px;
  margin: 1rem auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
  
  /* 表格样式 */
  .blog-detail-body :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }
  
  .blog-detail-body :deep(th),
  .blog-detail-body :deep(td) {
    padding: 0.75rem;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .blog-detail-body :deep(th) {
    background-color: #f8f9fa;
    font-weight: 600;
  }

  .blog-detail-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
  }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #4ab3df;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 目录样式 */
  .blog-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 260px;
    height: 100vh;
    padding: 2rem 1rem;
    overflow-y: auto;
    background-color: #fff;
    border-right: 1px solid #eee;
    transition: all 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    z-index: 100;
  }
  
  /* 目录链接样式增强 */
  .toc-link {
    position: relative;
    transition: all 0.2s ease;
  }
  
  .toc-link:hover {
    transform: translateX(3px);
  }
  
  /* 章节预览高亮样式 */
  .section-preview {
    animation: highlight 0.3s ease-in-out;
    background-color: rgba(74, 179, 223, 0.1);
    border-left: 3px solid #4ab3df;
    padding-left: 15px;
    margin-left: -15px;
    margin-right: -15px;
    border-radius: 0 4px 4px 0;
  }
  
  @keyframes highlight {
    0% {
      background-color: transparent;
      border-left-color: transparent;
    }
    100% {
      background-color: rgba(74, 179, 223, 0.1);
      border-left-color: #4ab3df;
    }
  }

.table-of-contents h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.table-of-contents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.table-of-contents li {
  margin-bottom: 0.5rem;
}

.table-of-contents a {
  display: block;
  padding: 0.4rem 0.6rem;
  color: #7f8c8d;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-of-contents a:hover {
  background-color: #f8f9fa;
  color: #4ab3df;
}

.table-of-contents a.active {
  background-color: rgba(74, 179, 223, 0.1);
  color: #4ab3df;
  font-weight: 500;
}

/* 移动端目录样式 */
.toc-mobile-toggle {
  display: none;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  background-color: #4ab3df;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(74, 179, 223, 0.4);
  transition: all 0.3s ease;
}

.toc-mobile-toggle:hover {
  background-color: #3a9bc8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 179, 223, 0.5);
}

.toc-mobile-panel {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  transition: all 0.3s ease;
}

.toc-mobile-panel .table-of-contents {
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background-color: white;
  padding: 1.5rem;
  overflow-y: auto;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
}

.toc-mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.toc-mobile-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toc-mobile-close:hover {
  background-color: #f8f9fa;
  color: #2c3e50;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .blog-detail-container {
    margin-left: 0;
    width: 100%;
    padding: 1.5rem;
  }
  
  .blog-sidebar {
    display: none;
  }
  
  .toc-mobile-toggle {
    display: flex;
  }
  
  .toc-mobile-panel {
    display: block;
  }
  
  .blog-detail-header {
    margin-top: 2rem;
  }
}

.back-link:hover {
  background-color: #3a9bc8;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-detail-container {
    padding: 1rem;
  }
  
  .blog-detail-title {
    font-size: 1.8rem;
  }
  
  .blog-detail-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* 深色模式样式 */
.dark .blog-detail-container {
  background-color: #2d2d2d;
  color: #e0e0e0;
}

.dark .blog-detail-title {
  color: #ffffff;
}

.dark .blog-detail-meta {
  color: #999999;
}

.dark .blog-detail-header {
  border-bottom-color: #404040;
}

.dark .blog-detail-collection .collection-tag {
  background-color: #2d3e32;
  color: #4cd137;
}

/* 深色模式目录样式 */
.dark .blog-sidebar {
  background-color: #1e1e1e;
  border-right-color: #333;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
}

.dark .table-of-contents h3 {
  color: #ffffff;
}

.dark .table-of-contents a {
  color: #999999;
}

.dark .table-of-contents a:hover {
  background-color: #2d2d2d;
  color: #4ab3df;
}

.dark .table-of-contents a.active {
  background-color: rgba(74, 179, 223, 0.15);
  color: #4ab3df;
}

.dark .section-preview {
  background-color: rgba(74, 179, 223, 0.15);
  border-left-color: #4ab3df;
  animation: highlight-dark 0.3s ease-in-out;
}

@keyframes highlight {
  0% {
    background-color: transparent;
    border-left-color: transparent;
  }
  100% {
    background-color: rgba(74, 179, 223, 0.1);
    border-left-color: #4ab3df;
  }
}

@keyframes highlight-dark {
  0% {
    background-color: transparent;
    border-left-color: transparent;
  }
  100% {
    background-color: rgba(74, 179, 223, 0.15);
    border-left-color: #4ab3df;
  }
}

/* 深色模式下博客内容样式 */
.dark .blog-detail-body :deep(p) {
  color: #e0e0e0;
}

.dark .blog-detail-body :deep(h1),
.dark .blog-detail-body :deep(h2),
.dark .blog-detail-body :deep(h3),
.dark .blog-detail-body :deep(h4),
.dark .blog-detail-body :deep(h5),
.dark .blog-detail-body :deep(h6) {
  color: #ffffff;
}

/* 深色模式下列表样式 */
.dark .blog-detail-body :deep(ul),
.dark .blog-detail-body :deep(ol) {
  color: #e0e0e0;
}

/* 深色模式下图片样式 */
.dark .blog-detail-body :deep(img) {
  max-width: 100%;
  height: auto;
  max-height: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dark .blog-detail-body :deep(ul),
.dark .blog-detail-body :deep(ol),
.dark .blog-detail-body :deep(li) {
  color: #e0e0e0;
}

.dark .blog-detail-body :deep(pre) {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.dark .blog-detail-body :deep(code) {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.dark .blog-detail-body :deep(blockquote) {
  color: #b0b0b0;
  border-left-color: #4ab3df;
}

.dark .blog-detail-body :deep(a) {
  color: #4ab3df;
}

.dark .blog-detail-body :deep(a:hover) {
  color: #3a9bc8;
}
</style>