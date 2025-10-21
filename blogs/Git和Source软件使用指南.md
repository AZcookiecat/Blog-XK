# Git和SourceTree软件使用完全指南
pinned: true
author: 井上川
date: 2025-10-21
techTags: Git, Source, 版本控制, 协作开发
softwareTags: Git, SourceTree, VS Code
## 概述

本文档详细介绍Git版本控制系统的使用方法，以及如何通过SourceTree和VS Code等工具提高开发效率。无论您是个人开发者还是团队协作，掌握这些工具都能帮助您更好地管理代码版本，追踪变更，避免代码丢失，并实现高效的团队协作。

## Git基础

### 1. Git安装

#### Windows系统

1. 访问[Git官网](https://git-scm.com/download/win)下载最新版本的Git安装程序
2. 运行安装程序，按照向导完成安装
3. 安装完成后，打开命令提示符或Git Bash验证安装：
4. 或点击以下链接获取百度网盘资源
    [Git下载](https://pan.baidu.com/s/1d2CHCB4-zlj2Xex_tc4MKQ?pwd=hutb)
    [SourceTree下载](https://pan.baidu.com/s/1gcFFiAUsN0OKDoP-OB7x3w?pwd=hutb)

```bash
git --version
```

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

1. 访问[SourceTree官网](https://www.sourcetreeapp.com/)下载并安装
2. 首次运行需要配置账户信息（可选GitHub、GitLab等）
3. 克隆现有仓库或添加本地仓库

### 2. 基本操作

#### 克隆仓库

1. 点击"Clone/New"
2. 输入仓库URL和本地目标路径
3. 点击"Clone"完成克隆

#### 提交更改

1. 查看未暂存文件列表
2. 勾选需要暂存的文件
3. 输入提交信息
4. 点击"Commit"完成提交

#### 推送更改

1. 提交后，点击"Push"按钮
2. 选择需要推送的分支
3. 点击"OK"完成推送

#### 分支管理

1. 在分支标签页可以查看、创建、切换分支
2. 通过右键菜单可以合并、删除分支

## VS Code中的Git集成

### 1. 基本功能

VS Code内置了Git支持，可以直接在编辑器中进行常用的Git操作：

1. **源代码控制**：通过左侧边栏的源代码控制图标访问
2. **暂存更改**：点击文件旁边的"+"图标
3. **提交更改**：输入提交信息后点击勾号
4. **查看更改**：点击文件可以查看具体的更改内容

### 2. 扩展功能

可以安装以下扩展增强Git功能：

- **GitLens**：提供更丰富的Git历史查看功能
- **Git History**：可视化Git历史
- **Git Graph**：以图形化方式显示Git提交历史

## 团队协作最佳实践

### 1. 分支策略

推荐使用Git Flow分支策略：

- `main`：主分支，始终保持稳定
- `develop`：开发分支，包含最新开发功能
- `feature/*`：特性分支，用于开发新功能
- `release/*`：发布分支，用于准备发布版本
- `hotfix/*`：热修复分支，用于修复生产环境问题

### 2. 代码审查

1. 创建Pull/Merge Request
2. 团队成员进行代码审查
3. 解决评论和建议
4. 合并到目标分支

### 3. 提交规范

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
