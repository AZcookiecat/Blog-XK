# 静态网页部署Netlify教程
pinned: false
author: Ciin7mo
date: 2025-10-23
techTags: Netlify, Git
softwareTags: SourceTree

## 概述

Netlify是一个现代化的静态网站托管平台，提供了简单、高效的部署流程和强大的功能。本教程将详细介绍如何将静态网页部署到Netlify，包括两种常见的项目类型：基础HTML项目和Vue.js项目。通过Netlify部署，您可以获得CDN加速、自动部署、HTTPS支持等优势，让您的网站更专业、更快速。

## 前提条件

在开始部署之前，您需要准备以下内容：

1. **GitHub账号** - Netlify可以直接从GitHub仓库拉取代码
2. **Git环境** - 用于版本控制和提交代码
3. **项目代码** - 您的HTML项目或Vue项目

## 第一部分：基础HTML项目部署

### 步骤1：准备HTML项目

确保您的HTML项目结构清晰，根据网站复杂度，可以采用单页面或多页面结构：

#### 单页面HTML项目结构

```
your-project/
├── index.html          # 主页面
├── css/                # 样式文件目录
│   └── style.css
├── js/                 # JavaScript文件目录
│   └── script.js
└── images/             # 图片资源目录
```

#### 多页面HTML项目结构

对于包含多个页面的网站，推荐使用以下结构：

```
your-project/
├── index.html          # 首页
├── about.html          # 关于页面
├── contact.html        # 联系页面
├── services.html       # 服务页面
├── css/                # 样式文件目录
│   ├── style.css       # 通用样式
│   ├── header.css      # 头部样式
│   └── footer.css      # 底部样式
├── js/                 # JavaScript文件目录
│   ├── main.js         # 通用脚本
│   └── utils/          # 工具函数目录
├── images/             # 图片资源目录
│   ├── logo/           # Logo图片
│   ├── products/       # 产品图片
│   └── banners/        # 横幅图片
├── fonts/              # 字体文件目录
├── pdfs/               # PDF文档目录
└── favicon.ico         # 网站图标
```

多页面项目注意事项：
- 页面间的链接使用相对路径，例如：`<a href="about.html">关于我们</a>`
- 共享资源（CSS、JS、图片）集中存放在专用目录中
- 考虑使用统一的页眉和页脚设计，保持网站风格一致
- 确保所有页面都有适当的标题和元数据

### 步骤2：创建GitHub仓库

1. 登录您的GitHub账号
2. 点击右上角的"+"按钮，选择"New repository"
3. 填写仓库名称（例如：`simple-html-website`）
4. 选择公开或私有仓库
5. 勾选"Initialize this repository with a README"
6. 点击"Create repository"

### 步骤3：将本地项目推送到GitHub

打开命令行工具，执行以下命令：

```bash
# 进入项目目录
cd your-project

# 初始化Git仓库
git init

# 添加文件到暂存区
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库地址
git remote add origin https://github.com/your-username/simple-html-website.git

# 推送到GitHub
git push -u origin master
```
也可以采用SourceTree工具，具体操作请参考[网页组协作指南：Git和SourceTree软件使用完全指南](./Git和Source软件使用指南.md)。

### 步骤4：在Netlify上部署

1. **登录Netlify**
   - 访问 [Netlify官网](https://www.netlify.com/)
   - 使用GitHub账号登录（推荐，方便后续操作）

2. **创建新站点**
   - 点击页面右上角的"New site from Git"，或点击添加新项目，导入已有项目
   ![Add New Project](../src/blogimgs/屏幕截图%202025-10-23%20133211.png)
   - 选择"GitHub"作为Git提供商
   ![Github](../src/blogimgs/屏幕截图%202025-10-23%20133221.png)
   - 授权Netlify访问您的GitHub账号
   - 搜索并选择您刚创建的仓库
   ![Select Repository](../src/blogimgs/屏幕截图%202025-10-23%20133309.png)

3. **配置部署设置**
   - **Branch to deploy**: 选择 `master` 或 `main`
   - **Build command**: 对于基础HTML项目，留空
   - **Publish directory**: 输入 `.` (表示根目录)
   - 点击"Deploy site"

4. **等待部署完成**
   - Netlify会自动开始构建和部署过程
   - 部署完成后，您将看到一个随机生成的URL，可以通过这个URL访问您的网站

### 步骤5：自定义域名（可选）

1. 在Netlify站点页面，点击"Domain settings"
2. 选择"Add custom domain"
3. 输入您已注册的域名
4. 按照提示在您的域名注册商处设置DNS记录

## 第二部分：Vue项目部署

### 步骤1：准备Vue项目

确保您的Vue项目可以正常构建。对于使用Vue CLI或Vite创建的项目，构建命令通常为：

```bash
# Vue CLI项目
npm run build

# Vite项目
npm run build
```

执行构建命令后，应该会生成一个`dist`目录，其中包含编译后的静态文件。

### 步骤2：创建GitHub仓库

同基础HTML项目的步骤2。

### 步骤3：将Vue项目推送到GitHub

```bash
# 进入项目目录
cd your-vue-project

# 创建.gitignore文件（如果没有的话）
# 至少包含以下内容：
# node_modules/
# dist/
# .env.local
# .env.*.local

# 初始化Git仓库（如果尚未初始化）
git init

# 添加文件到暂存区
git add .

# 提交更改
git commit -m "Initial Vue project"

# 添加远程仓库地址
git remote add origin https://github.com/your-username/vue-website.git

# 推送到GitHub
git push -u origin master
```

### 步骤4：在Netlify上部署Vue项目

1. **登录Netlify并连接GitHub仓库**
   - 同基础HTML项目的步骤4.1-4.3

2. **配置Vue项目部署设置**
   - **Branch to deploy**: 选择 `master` 或 `main`
   - **Build command**: 根据您的项目类型选择
     - Vue CLI项目: `npm run build`
     - Vite项目: `npm run build`
   - **Publish directory**: 输入 `dist` (Vue项目构建后的输出目录)
   - 点击"Deploy site"

3. **等待部署完成**
   - Netlify会自动安装依赖、构建项目并部署
   - 部署完成后，您可以通过生成的URL访问您的Vue应用

### 步骤5：配置路由（针对使用Vue Router的项目）

如果您的Vue项目使用了Vue Router的历史模式，需要在Netlify中配置重定向规则，以确保直接访问子路由时能够正确加载。

1. 在项目根目录创建一个名为 `_redirects` 的文件，内容如下：

```
/*  /index.html  200
```

2. 确保这个文件会被复制到构建输出目录中
   - 对于Vue CLI项目，将`_redirects`文件放在`public`目录下
   - 对于Vite项目，将`_redirects`文件放在`public`目录下

3. 提交并推送更改到GitHub，Netlify会自动重新部署

## 高级功能

### 环境变量设置

如果您的项目需要使用环境变量，可以在Netlify中进行配置：

1. 在Netlify站点页面，点击"Build & deploy" → "Environment"
2. 点击"Edit variables"添加您的环境变量
3. 格式：NAME=value
4. 保存后，后续的构建会自动使用这些环境变量

### 自动部署配置

Netlify默认会在您推送到指定分支时自动触发部署，如果您想自定义部署行为：

1. 在Netlify站点页面，点击"Build & deploy" → "Continuous Deployment"
2. 您可以配置以下选项：
   - 选择要监控的分支
   - 启用或禁用自动部署
   - 设置部署预览选项

### 表单处理

Netlify提供了简单的表单处理功能，无需后端服务器：

1. 在您的HTML或Vue组件中添加表单：

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact">
  <div>
    <label>Name: <input type="text" name="name"></label>
  </div>
  <div>
    <label>Email: <input type="email" name="email"></label>
  </div>
  <div>
    <label>Message: <textarea name="message"></textarea></label>
  </div>
  <div>
    <button type="submit">Send</button>
  </div>
</form>
```

2. 提交的表单数据可以在Netlify控制面板中查看和管理

## 常见问题及解决方案

### 部署失败

**问题**: 部署过程中出现错误

**解决方案**:
- 查看构建日志，找出具体错误信息
- 确保package.json中包含正确的依赖和脚本
- 检查构建命令是否正确
- 确保Node.js版本兼容（可以在Netlify中指定Node.js版本）

### 路由问题

**问题**: 直接访问子路由时出现404错误

**解决方案**:
- 确保已创建并正确配置`_redirects`文件
- 检查Vue Router的配置是否正确

### 资源加载失败

**问题**: 图片、CSS或JavaScript文件无法加载

**解决方案**:
- 使用相对路径引用资源
- 对于Vue项目，确保使用正确的资源导入方式
- 检查构建输出目录中是否包含所有必要的资源文件

## 总结

通过本教程，您已经学会了如何将基础HTML项目和Vue项目部署到Netlify平台。Netlify提供了简单易用的部署流程和强大的功能，特别适合静态网站和单页应用的托管。无论是个人博客、项目展示还是企业网站，Netlify都能提供稳定、高效的托管服务。

开始使用Netlify，享受现代化的部署体验吧！