# 网页组协作指南：Git和SourceTree软件使用完全指南
pinned: true
author: Ciin7mo
date: 2025-10-21
techTags: Git, Source
softwareTags: Git, SourceTree, VS Code

## 概述

本文档详细介绍Git版本控制系统的使用方法，以及如何通过SourceTree和VS Code等工具提高开发效率。无论您是个人开发者还是团队协作，掌握这些工具都能帮助您更好地管理代码版本，追踪变更，避免代码丢失，并实现高效的团队协作。

## Git基础

### 1. Git安装

#### Windows系统

1. 访问[Git官网](https://git-scm.com/download/win)下载最新版本的Git安装程序（一般较慢，建议用镜像网站）[镜像网站](https://registry.npmmirror.com/binary.html?path=git-for-windows)(不要选带有rc0,rc1的，都是预发布版本)
![mirror](../src/blogimgs//屏幕截图%202025-10-23%20142946.png)
进入之后下载64位的安装程序
![exe](../src/blogimgs/屏幕截图%202025-10-23%20143223.png)
2. 找到你下载的安装目录，双击进行安装，一路next，最后出现安装路径时候可以放在你设置的盘下，尽量不放C盘。
3. 安装完成后，打开命令提示符或Git Bash验证安装：
```bash
git --version
```
![version](../src/blogimgs/屏幕截图%202025-10-23%20144116.png)
4. 或点击以下链接获取百度网盘资源
   [Git下载](https://pan.baidu.com/s/1d2CHCB4-zlj2Xex_tc4MKQ?pwd=hutb)
    


### 2. Git配置

初次使用Git前，需要配置用户名和邮箱：

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

查看配置信息：

```bash
git config --list
```
![git](../src/blogimgs/屏幕截图%202025-10-23%20144400.png)
添加环境变量，找到git安装目录，找到下面图片的cmd目录添加至环境变量Path中
![env](../src/blogimgs/屏幕截图%202025-10-23%20143748.png)
配置完成之后输入以下命令检查配置是否成功：
```bash
git 
```
![git](../src/blogimgs/屏幕截图%202025-10-23%20144131.png)


## Git工作流程

### 1. 基本工作流程

1. **初始化仓库**：

```bash
mkdir myproject
cd myproject
git init
```

2. **添加文件到暂存区**：

```bash
git add .  # 添加所有文件
git add filename.txt  # 添加单个文件
```

3. **提交更改**：

```bash
git commit -m "Initial commit"
```

4. **查看状态**：

```bash
git status
```

5. **查看提交历史**：

```bash
git log
```

### 2. 分支管理

创建分支：

```bash
git branch feature-branch
```

切换分支：

```bash
git checkout feature-branch
```

创建并切换分支：

```bash
git checkout -b feature-branch
```

合并分支：

```bash
git checkout main
git merge feature-branch
```

删除分支：

```bash
git branch -d feature-branch
```

## SourceTree使用

### 1. 安装与配置

1. 访问[SourceTree官网](https://www.sourcetreeapp.com/)或者获取百度网盘资源[SourceTree下载](https://pan.baidu.com/s/1gcFFiAUsN0OKDoP-OB7x3w?pwd=hutb)下载并安装
2. 首次运行需要配置账户信息（可选GitHub、GitLab等）
3. 克隆现有仓库或添加本地仓库

### 2. 基本操作

#### 克隆仓库

1. 点击"Clone/New"
![clone](../src/blogimgs/屏幕截图%202025-10-23%20150354.png)
2. 输入仓库URL和本地目标路径
![clone](../src/blogimgs/屏幕截图%202025-10-23%20150414.png)
3. 点击"Clone"完成克隆
4. 克隆完成后，您可以在SourceTree中查看和管理您的仓库
![index](../src/blogimgs/屏幕截图%202025-10-23%20150430.png)
未暂存文件为已更改但未准备提交文件
已暂存文件为已更改且准备提交文件
上方可查看当前分支、提交信息、暂存文件列表等

#### 提交更改

1. 查看未暂存文件列表
2. 勾选需要暂存的文件
3. 输入提交信息
4. 点击"Commit"完成提交

#### 推送更改

1. 提交后，点击"Push"按钮
2. 选择需要推送的分支
3. 点击"OK"完成推送

#### 将本地项目推送到GitHub

如果您有一个本地项目需要推送到GitHub，请按照以下步骤操作：

1. **在GitHub上创建新仓库**
   - 登录您的GitHub账号
   - 点击右上角的"+"按钮，选择"New repository"
   - 填写仓库名称、描述（可选）
   - 选择公开或私有仓库
   - 不要勾选"Initialize this repository with a README"（因为我们要推送现有项目）
   - 点击"Create repository"
   - 复制生成的仓库URL（如 https://github.com/yourusername/repositoryname.git）

2. **在SourceTree中添加远程仓库**
   - 打开SourceTree，加载您的本地Git仓库
   - 点击顶部菜单栏中的"Repository" → "Repository Settings"
   - 在左侧导航中选择"Remotes"
   - 点击"Add"
   - 名称填写"origin"（标准远程仓库名称）
   - URL/路径粘贴刚才从GitHub复制的仓库URL
   - 点击"OK"保存设置

3. **推送本地分支到远程仓库**
   - 返回SourceTree主界面
   - 确保您在要推送的分支上（通常是main或master）
   - 点击顶部工具栏中的"Push"按钮
   - 在弹出的推送对话框中，确保勾选了要推送的分支
   - 首次推送时，您需要勾选"Push all branches"或选择特定分支
   - 点击"OK"开始推送
   - 如果提示输入GitHub凭据，请输入您的GitHub用户名和密码（或个人访问令牌）

4. **确认推送成功**
   - 推送完成后，您可以在SourceTree中看到远程分支信息
   - 您也可以访问GitHub仓库页面，确认文件已成功上传

5. **常见问题与解决方案**
   - **推送失败并提示权限问题**：确保您的GitHub凭据正确，并且您对该仓库有推送权限
   - **找不到远程仓库**：检查远程URL是否正确，尝试重新添加远程仓库
   - **分支不存在于远程**：确保您选择了正确的本地分支进行推送

通过这种方式，您可以轻松地将本地开发的项目推送到GitHub，实现代码的云端存储和团队协作。

#### 分支管理

1. 在分支标签页可以查看、创建、切换分支
2. 通过右键菜单可以合并、删除分支



### 提交规范

遵循以下提交消息规范：

```
<类型>: <描述>

[可选的详细描述]

[可选的关闭问题引用]
```

类型包括：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码风格调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具变动

## 常见问题解决方案

### 1. 撤销本地修改

撤销工作区修改：

```bash
git checkout -- filename.txt  # 撤销单个文件
git checkout -- .  # 撤销所有文件
```

### 2. 撤销暂存

```bash
git reset HEAD filename.txt  # 撤销单个文件
git reset HEAD  # 撤销所有文件
```

### 3. 合并冲突解决

1. 当合并出现冲突时，Git会标记冲突文件
2. 使用VS Code或SourceTree的冲突解决工具
3. 手动编辑文件，解决冲突
4. 标记冲突已解决：

```bash
git add filename.txt
git commit -m "Resolve merge conflict"
```

### 4. 忽略文件

创建`.gitignore`文件，列出不需要跟踪的文件：

```
# 日志文件
*.log

# 构建输出
dist/
build/

# 依赖
node_modules/

# 编辑器文件
.vscode/
.idea/
*.swp
*.swo
```

## 总结

掌握Git和相关Source软件的使用，对于提高开发效率和团队协作至关重要。通过本文介绍的基础操作、工作流程和最佳实践，您应该能够有效地管理代码版本，避免常见问题，并与团队成员高效协作。

在实际项目中，建议根据团队规模和项目特点，选择适合的工具和工作流程，并在实践中不断优化和改进。