# GitHub 发布指南

本指南将帮助您将 PersonAccount 发布到 GitHub。

## 前提条件

1. 拥有 GitHub 账号
2. 已安装 Git 和 Python 3.8+
3. 已安装 GitHub CLI (可选，但推荐)

## 步骤 1: 创建 GitHub 仓库

### 方法 A: 使用 GitHub 网页
1. 访问 https://github.com/new
2. 仓库名称：`PersonAccount`
3. 描述：个人账号存储管理系统
4. 选择 Public（公开）
5. 不要初始化 README（我们将推送现有代码）
6. 点击 "Create repository"

### 方法 B: 使用 GitHub CLI
```bash
gh repo create PersonAccount --public --description "个人账号存储管理系统"
```

## 步骤 2: 初始化 Git 并推送代码

```bash
# 进入项目目录
cd D:\Dev\Claude\01.PersonAccount

# 初始化 Git（如果尚未初始化）
git init

# 添加远程仓库
# 将 YOUR_USERNAME 替换为您的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/PersonAccount.git

# 添加所有文件
git add .

# 提交
git commit -m "feat: 初始版本 - PersonAccount v0.1.0"

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 步骤 3: 创建 Git 标签

```bash
# 创建版本标签
git tag v0.1.0

# 推送标签到 GitHub
git push origin v0.1.0
```

## 步骤 4: 配置 PyPI 发布（可选）

如果您想将包发布到 PyPI：

1. 注册 PyPI 账号：https://pypi.org/account/register/
2. 生成 API Token：https://pypi.org/manage/account/token/
3. 在 GitHub 仓库中设置 Secret：
   - 进入仓库 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - 名称：`PYPI_API_TOKEN`
   - 值：您的 PyPI API Token

## 步骤 5: 创建 GitHub Release

### 方法 A: 使用 GitHub 网页
1. 访问 https://github.com/YOUR_USERNAME/PersonAccount/releases/new
2. Tag version: `v0.1.0`
3. Release title: `PersonAccount v0.1.0`
4. 描述更新内容
5. 点击 "Publish release"

### 方法 B: 使用 GitHub CLI
```bash
gh release create v0.1.0 --title "PersonAccount v0.1.0" --notes "初始版本发布"
```

## 步骤 6: 发布到 PyPI（可选）

```bash
# 进入 Python 目录
cd python

# 安装构建工具
pip install build twine

# 构建包
python -m build

# 上传到 PyPI
twine upload dist/*
```

## 验证发布

### 检查 GitHub 仓库
- 访问 https://github.com/YOUR_USERNAME/PersonAccount
- 确认所有文件已正确上传
- 确认 README 正确显示

### 检查 PyPI（如果发布）
- 访问 https://pypi.org/project/personaccount/
- 确认包信息正确

### 测试安装
```bash
# 测试从 PyPI 安装
pip install personaccount

# 测试命令行
personaccount
```

## 后续维护

### 发布新版本
```bash
# 更新版本号（pyproject.toml 和 src/__init__.py）
# 然后：
git tag v0.2.0
git push origin v0.2.0
gh release create v0.2.0 --title "PersonAccount v0.2.0" --notes "更新说明"
```

### 查看 CI/CD 状态
- 访问 https://github.com/YOUR_USERNAME/PersonAccount/actions
- 确认 GitHub Actions 运行成功

## 故障排除

### 问题：推送被拒绝
```bash
# 如果远程已有内容，先拉取
git pull origin main --rebase
git push origin main
```

### 问题：权限错误
```bash
# 配置 Git 凭据
git config --global credential.helper store
# 然后再次推送，输入用户名和密码
```

### 问题：PyPI 上传失败
- 确认 API Token 正确
- 确认版本号未重复
- 检查网络连接

## 资源链接

- [GitHub Docs](https://docs.github.com/)
- [PyPI Docs](https://pypi.org/help/)
- [Python Packaging Guide](https://packaging.python.org/)
