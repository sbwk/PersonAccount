# PersonAccount - 推送到 GitHub 指南

## 当前状态

✅ 项目已初始化
✅ Git 仓库已创建
✅ 首次提交已完成 (commit: c5491b0)
✅ 分支已重命名为 main

## 推送到 GitHub 的步骤

### 步骤 1: 在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 仓库名称：`PersonAccount`
3. 描述：个人账号存储管理系统
4. 选择 **Public** (公开)
5. **不要** 勾选 "Add a README file"
6. 点击 "Create repository"

### 步骤 2: 推送代码到 GitHub

在项目中执行以下命令：

```bash
# 添加远程仓库 (将 YOUR_USERNAME 替换为您的 GitHub 用户名)
git remote add origin https://github.com/YOUR_USERNAME/PersonAccount.git

# 推送代码
git push -u origin main
```

### 步骤 3: 创建版本标签

```bash
# 创建 v0.1.0 标签
git tag v0.1.0

# 推送标签到 GitHub
git push origin v0.1.0
```

### 步骤 4: 创建 GitHub Release

1. 访问 https://github.com/YOUR_USERNAME/PersonAccount/releases/new
2. Tag version: `v0.1.0`
3. Release title: `PersonAccount v0.1.0`
4. 填写发布说明（见下方模板）
5. 点击 "Publish release"

#### Release 说明模板

```markdown
## PersonAccount v0.1.0 - 初始版本

### 🎉 功能特性

- 🔒 安全加密存储 (PBKDF2+SHA256, Fernet)
- 📝 账号 CRUD 操作
- 🔍 快速搜索和分类管理
- 💻 命令行界面
- 📦 完整的 Python 包结构
- 🚀 GitHub Actions CI/CD

### 📦 安装

```bash
pip install personaccount
```

### 📖 文档

- [使用指南](python/README.md)
- [贡献指南](python/CONTRIBUTING.md)

### 🐛 已知问题

- 初始版本，部分功能仍在开发中

### 📝 变更日志

- 初始化项目结构
- 实现核心加密模块
- 实现仓库管理模块
- 实现命令行界面
- 添加测试用例
- 配置 GitHub Actions
```

## 后续步骤

### 配置 PyPI 发布（可选）

1. 注册 PyPI 账号：https://pypi.org/account/register/
2. 生成 API Token：https://pypi.org/manage/account/token/
3. 在 GitHub 仓库设置 Secret：
   - Settings → Secrets and variables → Actions
   - 添加：`PYPI_API_TOKEN`

### 配置 GitHub Pages（可选）

如果需要项目网站，可以启用 GitHub Pages。

## 验证清单

- [ ] 代码已推送到 GitHub
- [ ] 标签已创建并推送
- [ ] Release 已发布
- [ ] README 正确显示
- [ ] CI Actions 运行成功

## 常用 Git 命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline

# 添加新文件
git add <filename>

# 提交变更
git commit -m "描述"

# 推送到远程
git push origin main

# 拉取更新
git pull origin main
```

## 问题排查

### 推送失败：权限错误
```bash
# 使用 HTTPS 推送
git remote set-url origin https://github.com/YOUR_USERNAME/PersonAccount.git
git push -u origin main
```

### 推送失败：远程已有内容
```bash
# 先拉取再推送
git pull origin main --rebase
git push -u origin main
```

## 联系支持

如有问题，请访问：
- GitHub Issues: https://github.com/YOUR_USERNAME/PersonAccount/issues
