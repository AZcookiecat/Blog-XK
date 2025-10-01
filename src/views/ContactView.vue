<template>
  <div class="contact-container">
    <h1 class="contact-title">联系我</h1>
    
    <div class="contact-content">
      <!-- 联系表单 -->
      <div class="contact-form-section">
        <h2 class="contact-subtitle">反馈与建议</h2>
        <p class="contact-description">如果您对网站有任何改进建议或问题，请随时留言，我会尽快回复您！</p>
        
        <form 
          class="contact-form" 
          name="contact-form" 
          method="POST" 
          data-netlify="true" 
          @submit.prevent="handleSubmit"
        >
          <!-- 隐藏字段用于Netlify -->
          <input type="hidden" name="form-name" value="contact-form" />
          
          <!-- 名称字段 -->
          <div class="form-group">
            <label for="name">您的名称</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              v-model="formData.name"
              required 
              placeholder="请输入您的名称"
              class="form-input"
            />
          </div>
          
          <!-- 电子邮件字段 -->
          <div class="form-group">
            <label for="email">电子邮箱</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              v-model="formData.email"
              required 
              placeholder="请输入您的电子邮箱"
              class="form-input"
            />
          </div>
          
          <!-- 主题字段 -->
          <div class="form-group">
            <label for="subject">主题</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              v-model="formData.subject"
              required 
              placeholder="请输入留言主题"
              class="form-input"
            />
          </div>
          
          <!-- 留言内容字段 -->
          <div class="form-group">
            <label for="message">留言内容</label>
            <textarea 
              id="message" 
              name="message" 
              v-model="formData.message"
              required 
              placeholder="请输入您的建议或问题..."
              rows="6" 
              class="form-textarea"
            ></textarea>
          </div>
          
          <!-- 提交按钮 -->
          <div class="form-group">
            <button 
              type="submit" 
              class="form-submit" 
              :disabled="isSubmitting"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isSubmitting ? '发送中...' : '发送留言' }}
            </button>
          </div>
        </form>
        
        <!-- 提交成功提示 -->
        <div v-if="submitSuccess" class="submit-success">
          <i class="fas fa-check-circle success-icon"></i>
          <p>感谢您的留言！我会尽快回复您。</p>
        </div>
      </div>
      
      <!-- 联系方式 -->
      <div class="contact-info-section">
        <h2 class="contact-subtitle">联系方式</h2>
        <div class="contact-info-list">
          <div class="contact-info-item">
            <i class="fas fa-envelope contact-icon"></i>
            <div class="contact-info-content">
              <h3>电子邮箱</h3>
              <a href="mailto:3424255277@qq.com" class="contact-link">3424255277@qq.com</a>
            </div>
          </div>
          
          <div class="contact-info-item">
            <i class="fab fa-github contact-icon"></i>
            <div class="contact-info-content">
              <h3>GitHub</h3>
              <a href="https://github.com/AZcookiecat" target="_blank" rel="noopener noreferrer" class="contact-link">github.com/AZcookiecat</a>
            </div>
          </div>
        </div>
        
        <!-- 工作时间 -->
        <div class="working-hours">
          <h3>回复时间</h3>
          <p>一般会在24-48小时内回复您的留言</p>
        </div>
      </div>
    </div>
    
    <!-- 页脚提示 -->
    <div class="contact-footer">
      <p>本网站由Netlify提供技术支持，留言将通过Netlify Forms安全提交</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      isSubmitting: false,
      submitSuccess: false
    };
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true;
      
      try {
        // 由于使用Netlify Forms，这里只需要处理原生表单提交
        // Netlify会自动拦截表单提交并处理
        const form = document.querySelector('form[name="contact-form"]');
        const formData = new FormData(form);
        
        // 模拟表单提交过程
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 显示提交成功信息
        this.submitSuccess = true;
        this.formData = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
        
        // 重置表单
        form.reset();
        
        // 5秒后隐藏成功信息
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      } catch (error) {
        console.error('表单提交失败:', error);
        alert('表单提交失败，请稍后重试。');
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  mounted() {
    // 设置页面标题
    document.title = '联系我 - 井上川的个人博客';
  }
};
</script>

<style scoped>
.contact-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 70vh;
}

.contact-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.contact-form-section,
.contact-info-section {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.contact-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.contact-description {
  margin-bottom: 1.5rem;
  color: #555;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.form-input,
.form-textarea {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
  color: #2c3e50;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-submit {
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.form-submit:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.form-submit:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.submit-success {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid #c3e6cb;
  animation: fadeIn 0.3s ease-in-out;
}

.success-icon {
  font-size: 1.5rem;
  color: #28a745;
}

.contact-info-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.contact-info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  font-size: 1.8rem;
  color: #3498db;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.contact-info-content h3 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.contact-link {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  text-decoration: underline;
  color: #2980b9;
}

.working-hours {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 5px;
  border-left: 4px solid #3498db;
}

.working-hours h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.working-hours p {
  color: #555;
  transition: color 0.3s ease;
}

.contact-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  color: #7f8c8d;
  font-size: 0.9rem;
  transition: color 0.3s ease, border-color 0.3s ease;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-container {
    padding: 1rem;
  }
  
  .contact-title {
    font-size: 2rem;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .contact-form-section,
  .contact-info-section {
    padding: 1.5rem;
  }
}

/* 深色模式样式 */
.dark .contact-title {
  color: #ffffff;
}

.dark .contact-form-section,
.dark .contact-info-section {
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark .contact-subtitle {
  color: #ffffff;
}

.dark .contact-description {
  color: #cccccc;
}

.dark .form-group label {
  color: #e0e0e0;
}

.dark .form-input,
.dark .form-textarea {
  background-color: #2d2d2d;
  border-color: #404040;
  color: #e0e0e0;
}

.dark .form-input:focus,
.dark .form-textarea:focus {
  border-color: #5dade2;
  box-shadow: 0 0 0 3px rgba(93, 173, 226, 0.2);
}

.dark .form-submit {
  background-color: #5dade2;
}

.dark .form-submit:hover:not(:disabled) {
  background-color: #3498db;
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.5);
}

.dark .submit-success {
  background-color: #155724;
  color: #d4edda;
  border-color: #28a745;
}

.dark .success-icon {
  color: #28a745;
}

.dark .contact-info-content h3 {
  color: #e0e0e0;
}

.dark .contact-link {
  color: #5dade2;
}

.dark .contact-link:hover {
  color: #3498db;
}

.dark .working-hours {
  background-color: #2a2a2a;
  border-left-color: #5dade2;
}

.dark .working-hours h3 {
  color: #e0e0e0;
}

.dark .working-hours p {
  color: #cccccc;
}

.dark .contact-footer {
  color: #999999;
  border-top-color: #404040;
}
</style>