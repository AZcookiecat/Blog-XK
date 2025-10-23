# Ciin7mo的个人博客

一个基于Vue 3构建的个人博客网站，具有简约但专业的设计风格，适合程序员展示个人信息、技术栈、博客文章和项目荣誉。

## 功能特性

### 首页
- 个人信息展示
- 技术栈展示（带动画效果）
- 联系信息（带图标）
- 快速导航链接

### 博客页面
- 分类筛选功能
  - 按技术栈分类（Vue3, JavaScript, HTML, CSS, Python, C#, Django, Flask, MySQL, node.js, git）
  - 按软件分类（VScode, wireshark, unity, github）
- 博客文章列表展示
  - 标题和简述
  - 技术栈和软件标签
  - 发布时间和作者信息
- Markdown格式的博客内容展示

### 项目展示页面
- 个人项目展示
- 荣誉成就展示

## 项目结构

```
├── src/
│   ├── views/           # 页面组件
│   │   ├── HomeView.vue      # 首页
│   │   ├── BlogView.vue      # 博客列表页
│   │   ├── BlogDetailView.vue # 博客详情页
│   │   └── ProjectView.vue   # 项目展示页
│   ├── router/          # 路由配置
│   │   └── index.js     # 路由定义
│   ├── assets/          # 静态资源
│   ├── components/      # 通用组件
│   ├── App.vue          # 应用根组件
│   ├── main.js          # 应用入口
│   └── style.css        # 全局样式
├── blogs/               # 博客文章（Markdown格式）
├── public/              # 静态资源
├── package.json         # 项目配置和依赖
├── vite.config.js       # Vite配置
└── .gitignore           # Git忽略规则
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 添加博客文章

要添加新的博客文章，只需在`blogs`目录下创建Markdown格式的文件，并遵循以下格式：

```markdown
---
title: 文章标题
date: 发布日期（YYYY-MM-DD格式）
author: 作者名称
techTags: 技术栈标签1,技术栈标签2
softwareTags: 软件标签1,软件标签2
---

# 文章内容

这里是Markdown格式的文章内容...
```

## 技术栈

- Vue 3
- Vue Router
- Vite
- Markdown (marked库)
- FontAwesome (图标库)

## License

MIT
