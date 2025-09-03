/**
 * 博客类别筛选和统计功能
 * 通过统计carbox li3-box的id来统计文章数量
 */
(function() {
  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
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

    // 通过id统计文章数量
    blogPosts.forEach(post => {
      // 获取文章的id
      const postId = post.id;
      
      // 根据id更新类别计数
      if (categoryCounts.hasOwnProperty(postId)) {
        categoryCounts[postId]++;
        // 添加类别属性
        post.setAttribute('data-category', postId);
      } else {
        // 默认分类为'frontend'
        categoryCounts.frontend++;
        post.setAttribute('data-category', 'frontend');
      }
    });
 
    // 更新类别标签上的数量显示
    categoryTags.forEach(tag => {
      // 保留原始标签文本（移除可能存在的数字部分）
      const originalText = tag.textContent.replace(/\s*\(\d+\)/, '').trim();
      tag.textContent = originalText;
      
      let category = 'all';

      // 根据标签文本确定对应的类别
      if (originalText.includes('前端技术')) {
        category = 'frontend';
      } else if (originalText.includes('人工智能')) {
        category = 'ai';
      } else if (originalText.includes('数据分析')) {
        category = 'dataanalysis';
      } else if (originalText.includes('网络安全')) {
        category = 'network-security';
      } else if (originalText.includes('数据库')) {
        category = 'database';
      } else if (originalText.includes('Python')) {
        category = 'python';
      }

      // 如果是全部文章标签
      if (originalText.includes('全部文章')) {
        category = 'all';
      }

      // 在右上角显示统计结果
      if (categoryCounts.hasOwnProperty(category)) {
        // 查找或创建i元素
        let countElement = tag.querySelector('i');
        if (!countElement) {
          countElement = document.createElement('i');
          tag.appendChild(countElement);
        }
        // 设置统计数字
        countElement.textContent = categoryCounts[category];
      }
    });

    // 为类别标签添加点击筛选功能
    categoryTags.forEach(tag => {
      tag.addEventListener('click', function() {
        // 移除所有标签的active状态
        categoryTags.forEach(t => t.classList.remove('active'));
        // 为当前点击的标签添加active状态
        this.classList.add('active');

        const tagText = this.textContent;
        let targetCategory = 'all';

        // 根据点击的标签确定要显示的类别
        if (tagText.includes('前端技术')) {
          targetCategory = 'frontend';
        } else if (tagText.includes('人工智能')) {
          targetCategory = 'ai';
        } else if (tagText.includes('数据分析')) {
          targetCategory = 'dataanalysis';
        } else if (tagText.includes('网络安全')) {
          targetCategory = 'network-security';
        } else if (tagText.includes('数据库')) {
          targetCategory = 'database';
        } else if (tagText.includes('Python')) {
          targetCategory = 'python';
        }

        // 筛选显示文章
        blogPosts.forEach(post => {
          if (targetCategory === 'all' || post.getAttribute('data-category') === targetCategory) {
            post.style.display = 'block';
          } else {
            post.style.display = 'none';
          }
        });
      });
    });

    // 设置默认选中'全部文章'
    const allCategory = document.querySelector('.time-tags-wrap span.all');
    if (allCategory) {
      allCategory.classList.add('active');
    }
  });
})();