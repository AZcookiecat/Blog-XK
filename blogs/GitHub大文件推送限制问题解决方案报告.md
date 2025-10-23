# GitHub大文件推送限制问题解决方案报告
pinned: true
author: Ciin7mo
date: 2025-10-01
techTags: git
softwareTags: github, Git LFS

## 问题概述

在尝试将Unity WebGL项目推送到GitHub远程仓库时，遇到了GitHub的文件大小限制问题。具体来说，`public/static/湘绣/Build/湘绣.data`文件（大小约647MB）超过了GitHub允许的100MB单个文件大小限制，导致推送失败并显示`pre-receive hook declined`和`GH001: Large files detected`错误。

## 问题分析

1. **GitHub文件大小限制**：GitHub对单个文件的大小限制为100MB，超过此限制的文件无法直接推送到仓库。
2. **Unity WebGL构建文件特性**：Unity WebGL项目会生成几个大文件，特别是`.data`和`.wasm`文件，这些文件通常超过GitHub的大小限制。
3. **Git LFS (Large File Storage) 解决方案**：Git LFS是GitHub提供的专门用于管理大文件的工具，可以将大文件存储在Git LFS服务器上，而在Git仓库中只保留指针。

## 解决方案与操作步骤

我们通过完全重置Git仓库并正确配置Git LFS的方法解决了这个问题。以下是详细的操作步骤：

### 步骤1：备份重要配置文件

```powershell
# 备份.gitignore文件，以便后续使用
Copy-Item .gitignore .gitignore.backup -Force
```

### 步骤2：删除现有Git仓库

```powershell
# 删除现有的.git文件夹，完全重置Git环境
Remove-Item .git -Recurse -Force
```

### 步骤3：重新初始化Git仓库

```powershell
# 在当前目录重新初始化Git仓库
git init
```

### 步骤4：安装并配置Git LFS

```powershell
# 安装Git LFS
git lfs install

# 为Unity WebGL构建文件配置LFS跟踪规则
git lfs track "public/static/湘绣/Build/*.data" "public/static/湘绣/Build/*.wasm" "public/static/湘绣/Build/*.framework.js" "public/static/湘绣/Build/*.loader.js"
```

### 步骤5：恢复.gitignore文件

```powershell
# 恢复之前备份的.gitignore文件
Copy-Item .gitignore.backup .gitignore -Force
```

### 步骤6：添加并提交所有文件

```powershell
# 先添加.gitignore和.gitattributes文件，确保Git LFS规则正确应用
git add .gitignore .gitattributes

# 添加所有其他文件
git add .

# 提交所有更改
git commit -m "Initial commit with Git LFS configured for large Unity WebGL files"
```

### 步骤7：关联GitHub远程仓库

```powershell
# 将本地仓库与GitHub远程仓库关联
git remote add origin https://github.com/AZcookiecat/XiangXiu.git
```

### 步骤8：检查并重命名分支

```powershell
# 检查当前分支
git branch

# 将master分支重命名为main（GitHub默认使用main分支）
git branch -M main
```

### 步骤9：推送代码到GitHub

```powershell
# 使用强制推送选项将代码推送到GitHub
git push -f origin main
```

## 解决方案验证

通过执行上述步骤，我们成功解决了GitHub大文件推送限制问题：

1. **LFS对象上传成功**：4个LFS对象（总计约717MB）全部成功上传。
2. **代码推送成功**：所有代码文件（总计88个对象，约29.13MiB）成功推送到GitHub。
3. **远程仓库更新成功**：GitHub远程仓库的main分支现在指向了最新提交。

## 经验总结与建议

1. **项目初始化阶段就配置Git LFS**：对于包含大文件（如Unity构建文件、多媒体资源等）的项目，建议在项目初始化阶段就配置Git LFS，避免后续出现推送限制问题。
2. **注意GitHub分支命名**：GitHub现在默认使用main分支而非master分支，在推送前确保本地分支名称与远程分支名称一致。
3. **定期备份重要配置文件**：在进行仓库重置等操作前，务必备份重要的配置文件（如.gitignore），以便后续恢复使用。
4. **了解Git LFS的使用限制**：虽然Git LFS解决了大文件存储问题，但GitHub对免费用户的LFS存储空间和带宽有一定限制，超出限制可能需要付费。

## 附录：关键文件清单

- `.gitignore`：包含了需要忽略的文件和目录规则
- `.gitattributes`：包含了Git LFS的跟踪规则
- `public/static/湘绣/Build/湘绣.data`：Unity WebGL构建的主要数据文件（约647MB）
- `public/static/湘绣/Build/湘绣.wasm`：Unity WebGL构建的WebAssembly文件
- `public/static/湘绣/Build/湘绣.framework.js`：Unity WebGL构建的框架JavaScript文件
- `public/static/湘绣/Build/湘绣.loader.js`：Unity WebGL构建的加载器JavaScript文件

---
