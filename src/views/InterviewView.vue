<template>
  <div class="interview-container">
    <header class="interview-header">
      <h1 class="section-title">面试准备</h1>
      <p class="section-subtitle">技术面试题集</p>
    </header>

    <section class="interview-intro">
      <p class="intro-text">
        这里收集了常见的技术面试题目，帮助你系统地学习和准备面试。
        点击问题查看答案，再次点击收起。
      </p>
    </section>

    <!-- 类别选择 -->
    <section class="category-tabs">
      <button 
        v-for="category in categories" 
        :key="category.id"
        class="category-tab"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </section>

    <!-- 问题列表 -->
    <section class="question-list">
      <div 
        v-for="(question, index) in currentQuestions" 
        :key="question.id"
        class="question-item"
      >
        <div 
          class="question-header"
          @click="toggleAnswer(question.id)"
        >
          <span class="question-number">{{ index + 1 }}</span>
          <h3 class="question-title">{{ question.title }}</h3>
          <i 
            class="fas fa-chevron-right question-arrow"
            :class="{ rotated: expandedQuestions.includes(question.id) }"
          ></i>
        </div>
        
        <transition name="slide">
          <div 
            v-if="expandedQuestions.includes(question.id)"
            class="answer-content"
          >
            <div v-html="renderMarkdown(question.answer)"></div>
            
            <div class="question-tags">
              <span class="tag" v-for="tag in question.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import { interviewQuestions, getInterviewQuestionsByCategory } from '../data/interviewQuestions.js';

export default {
  name: 'InterviewView',
  data() {
    return {
      categories: [
        { id: 'frontend', name: '前端' },
        { id: 'backend', name: '后端' },
        { id: 'algorithm', name: '算法' }
      ],
      selectedCategory: 'frontend',
      expandedQuestions: [],
      questions: {}
    };
  },
  
  computed: {
    currentQuestions() {
      return this.questions[this.selectedCategory] || [];
    }
  },
  
  created() {
    // 预加载所有问题数据
    this.loadAllQuestions();
  },
  
  methods: {
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      // 切换类别时收起所有展开的答案
      this.expandedQuestions = [];
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    toggleAnswer(questionId) {
      const index = this.expandedQuestions.indexOf(questionId);
      if (index > -1) {
        this.expandedQuestions.splice(index, 1);
      } else {
        this.expandedQuestions.push(questionId);
      }
    },
    
    loadAllQuestions() {
      this.categories.forEach(category => {
        this.questions[category.id] = getInterviewQuestionsByCategory(category.id);
      });
    },
    
    // Markdown渲染函数
    renderMarkdown(markdown) {
      if (!markdown) return '';
      
      // 按行分割文本进行处理
      const lines = markdown.split('\n');
      let html = '';
      let inList = false;
      let listType = '';
      let codeBlockActive = false;
      let codeBlockContent = '';
      
      lines.forEach(line => {
        // 处理代码块
        if (line.startsWith('```')) {
          if (!codeBlockActive) {
            // 开始代码块
            codeBlockActive = true;
            codeBlockContent = '';
          } else {
            // 结束代码块
            codeBlockActive = false;
            html += `<pre><code>${codeBlockContent}</code></pre>`;
          }
          return;
        }
        
        // 在代码块内部，直接添加内容
        if (codeBlockActive) {
          codeBlockContent += line + '\n';
          return;
        }
        
        // 处理标题
        if (line.match(/^#{1,6}\s/)) {
          // 确保结束当前列表
          if (inList) {
            html += listType === 'ul' ? '</ul>' : '</ol>';
            inList = false;
          }
          
          const level = line.match(/^#{1,6}/)[0].length;
          const content = line.substring(level + 1).trim();
          html += `<h${level}>${content}</h${level}>`;
          return;
        }
        
        // 处理无序列表
        if (line.match(/^\-\s/)) {
          const content = line.substring(2).trim();
          
          if (!inList || listType !== 'ul') {
            // 开始新的无序列表或从有序列表切换
            if (inList) {
              html += listType === 'ul' ? '</ul>' : '</ol>';
            }
            inList = true;
            listType = 'ul';
            html += '<ul>';
          }
          
          html += `<li>${content}</li>`;
          return;
        }
        
        // 处理有序列表
        if (line.match(/^\d+\.\s/)) {
          const content = line.substring(line.indexOf('.') + 2).trim();
          
          if (!inList || listType !== 'ol') {
            // 开始新的有序列表或从无序列表切换
            if (inList) {
              html += listType === 'ul' ? '</ul>' : '</ol>';
            }
            inList = true;
            listType = 'ol';
            html += '<ol>';
          }
          
          html += `<li>${content}</li>`;
          return;
        }
        
        // 处理普通文本行
        // 确保结束当前列表
        if (inList) {
          html += listType === 'ul' ? '</ul>' : '</ol>';
          inList = false;
        }
        
        // 非空行添加为段落
        if (line.trim()) {
          html += `<p>${line.trim()}</p>`;
        }
      });
      
      // 确保关闭所有打开的标签
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
      }
      
      return html;
    }
  }
}
</script>

<style scoped>
.interview-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.interview-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: black;
}

.interview-intro {
  text-align: center;
  margin-bottom: 2rem;
}

.intro-text {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

/* 类别标签 */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  color: #4ab3df;
}

.category-tab {
  padding: 0.75rem 1.5rem;
  color: black;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
}

.category-tab:hover {
  background: #e9ecef;
  border-color: #4ab3df;
}

.category-tab.active {
  background: #4ab3df;
  color: white;
  border-color: #4ab3df;
}

/* 问题列表 */
.question-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-item {
  border: 2px solid #e0e0e0;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.question-item:hover {
  border-color: #4ab3df;
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.1);
}

/* 问题头部 */
.question-header {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
}

.question-header:hover {
  background: #f8f9fa;
}

.question-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #4ab3df;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 1rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.question-title {
  flex: 1;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.question-arrow {
  font-size: 0.875rem;
  color: #666;
  margin-left: 1rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.question-arrow.rotated {
  transform: rotate(90deg);
  color: #007bff;
}

/* 答案内容 */
.answer-content {
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  line-height: 1.8;
  color: #444;
}

.answer-content h1,
.answer-content h2,
.answer-content h3,
.answer-content h4,
.answer-content h5,
.answer-content h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
}

.answer-content h1 { font-size: 1.8rem; }
.answer-content h2 { font-size: 1.5rem; }
.answer-content h3 { font-size: 1.3rem; }
.answer-content h4 { font-size: 1.1rem; }
.answer-content h5 { font-size: 1rem; }
.answer-content h6 { font-size: 0.9rem; }

.answer-content ul {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.answer-content li {
  margin-bottom: 0.5rem;
}

.answer-content pre {
  background: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #e0e0e0;
}

.answer-content code {
  font-family: 'Courier New', Courier, monospace;
  background: #fff;
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
  border: 1px solid #e0e0e0;
}

.answer-content pre code {
  background: none;
  padding: 0;
  border: none;
}

/* 标签 */
.question-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.tag {
  font-size: 0.85rem;
  padding: 0.4rem 0.9rem;
  background: #007bff;
  color: white;
  border-radius: 2rem;
  font-weight: 500;
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 1000px;
}

/* 深色模式样式 */
.dark .interview-container {
  color: #e0e0e0;
}

/* header样式与其他页面保持一致 */
.dark .interview-header {
  background: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 0.5rem;
}

.dark .section-title,
.dark .section-subtitle {
  color: #ffffff !important;
}

.dark .intro-text {
  color: #cccccc;
}

/* 类别标签 */
.dark .category-tab {
  background: #2d2d2d;
  color: #e0e0e0;
  border-color: #444;
}

.dark .category-tab:hover {
  background: #333;
  border-color: #4ab3df;
}

.dark .category-tab.active {
  background: #4ab3df;
  color: white;
  border-color: #4ab3df;
}

/* 问题项 */
.dark .question-item {
  border-color: #444;
  background: #2d2d2d;
}

.dark .question-item:hover {
  border-color: #3498db;
  box-shadow: 0 2px 10px rgba(52, 152, 219, 0.2);
}

/* 问题头部 */
.dark .question-header {
  background: #2a2a2a;
}

.dark .question-header:hover {
  background: #333;
}

.dark .question-number {
  background: #3498db;
}

.dark .question-title {
  color: #ffffff;
}

.dark .question-arrow {
  color: #888;
}

/* 答案内容 */
.dark .answer-content {
  background: #2a2a2a;
  border-top-color: #444;
  color: #cccccc;
}

.dark .answer-content h1,
.dark .answer-content h2,
.dark .answer-content h3,
.dark .answer-content h4,
.dark .answer-content h5,
.dark .answer-content h6 {
  color: #ffffff;
}

.dark .answer-content pre {
  background: #1e1e1e;
  border-color: #444;
  color: #e0e0e0;
}

.dark .answer-content code {
  background: #1e1e1e;
  border-color: #444;
  color: #e0e0e0;
}

.dark .answer-content ul {
  color: #cccccc;
}

.dark .answer-content li {
  color: #cccccc;
}

/* 标签 */
.dark .question-tags {
  border-top-color: #444;
}

.dark .tag {
  background: #34495e;
  color: #4ab3df;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .interview-container {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .category-tabs {
    gap: 0.75rem;
  }
  
  .category-tab {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .question-header {
    padding: 1rem;
    flex-wrap: wrap;
  }
  
  .question-number {
    width: 2rem;
    height: 2rem;
    font-size: 0.9rem;
    margin-right: 0.75rem;
  }
  
  .question-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .answer-content {
    padding: 1rem;
  }
  
  .question-tags {
    gap: 0.5rem;
  }
  
  .tag {
    font-size: 0.8rem;
    padding: 0.3rem 0.75rem;
  }
}
</style>