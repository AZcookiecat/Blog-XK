/**
 * 博客类别筛选和统计功能
 * 不修改原有HTML结构，通过内容分析自动归类
 */
(function() {
  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    // 类别映射：关键词 -> 类别
    const categoryMap = {
      'vue': 'frontend',
      'react': 'frontend',
      'html': 'frontend',
      'css': 'frontend',
      'js': 'frontend',
      '人工智能': 'ai',
      '数据分析': 'dataanalysis',
      '网络安全': 'network-security',
      'mysql': 'database',
      '数据库': 'database',
      'python': 'python',
    };
 
    // 获取所有文章项
    const blogPosts = document.querySelectorAll('.carbox.li3-box');
    // 获取所有类别标签
    const categoryTags = document.querySelectorAll('.time-tags-wrap span');
 
    // 初始化类别计数
    const categoryCounts = {
      'all': blogPosts.length,
      'frontend': 0,
      'ai': 0,
      'dataanalysis': 0,
      'network-security': 0,
      'database': 0,
      'python': 0
    };
 
    // 为每篇文章自动添加类别属性并统计
    blogPosts.forEach(post => {
      const addressLeft = post.querySelector('.address-left');
      if (addressLeft) {
        const text = addressLeft.textContent.toLowerCase();
        let postCategory = null;
 
        // 根据关键词判断类别
        for (const [keyword, category] of Object.entries(categoryMap)) {
          if (text.includes(keyword)) {
            postCategory = category;
            break;
          }
        }
 
        // 默认分类为'frontend'（如果没有匹配到其他类别）
        if (!postCategory) {
          postCategory = 'frontend';
        }
 
        // 添加类别属性
        post.setAttribute('data-category', postCategory);
        // 更新计数
        categoryCounts[postCategory]++;
      }
    });
 
    // 更新类别计数显示
    for (const [category, count] of Object.entries(categoryCounts)) {
      const categoryElement = document.querySelector(`.time-tags-wrap span.${category}`);
      if (categoryElement) {
        const countElement = categoryElement.querySelector('i');
        if (countElement) {
          countElement.textContent = count;
        }
      }
    }
 
    // 添加筛选功能
    categoryTags.forEach(tag => {
      // 只处理带有类别class的标签
      for (const category of Object.keys(categoryCounts)) {
        if (tag.classList.contains(category)) {
          tag.addEventListener('click', function() {
            const selectedCategory = category;
 
            // 更新选中状态
            categoryTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
 
            // 筛选文章
            blogPosts.forEach(post => {
              if (selectedCategory === 'all' || post.getAttribute('data-category') === selectedCategory) {
                post.style.display = 'block';
              } else {
                post.style.display = 'none';
              }
            });
          });
          break;
        }
      }
    });
 
    // 设置默认选中'全部文章'
    const allCategory = document.querySelector('.time-tags-wrap span.all');
    if (allCategory) {
      allCategory.classList.add('active');
    }
  });
})();