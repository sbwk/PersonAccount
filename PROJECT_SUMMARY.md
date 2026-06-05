# PersonAccount 项目总结

## 项目概述

PersonAccount 是一个个人账号存储管理系统，用于安全地管理个人在各平台的账号信息。

### 核心功能

- 🔒 **安全加密** - 使用 PBKDF2+SHA256 和 Fernet 加密
- 📝 **账号管理** - CRUD 操作
- 🔍 **快速搜索** - 按关键词筛选
- 🎯 **分类管理** - 支持自定义分类
- ⚠️ **到期提醒** - 付费账号提醒（规划中）

## 项目结构

```
PersonAccount/
├── python/                      # Python 后端
│   ├── src/                     # 源代码
│   │   ├── __init__.py
│   │   ├── main.py              # 程序入口
│   │   ├── cli.py               # 命令行接口
│   │   └── core/                # 核心模块
│   │       ├── __init__.py
│   │       ├── crypto.py        # 加密模块
│   │       └── vault.py         # 仓库模块
│   ├── tests/                   # 测试文件
│   ├── pyproject.toml           # 项目配置
│   ├── requirements.txt         # 依赖列表
│   ├── README.md                # 使用文档
│   ├── LICENSE                  # MIT 许可证
│   ├── CONTRIBUTING.md          # 贡献指南
│   ├── CODE_OF_CONDUCT.md       # 行为准则
│   ├── SECURITY.md              # 安全策略
│   ├── MANIFEST.in              # 打包配置
│   ├── release.py               # 发布脚本
│   ├── install.sh               # Linux/Mac 安装脚本
│   ├── install.bat              # Windows 安装脚本
│   └── .github/                 # GitHub 配置
│       ├── workflows/           # GitHub Actions
│       │   ├── ci.yml           # CI 配置
│       │   └── publish.yml      # 发布配置
│       ├── ISSUE_TEMPLATE/      # Issue 模板
│       └── PULL_REQUEST_TEMPLATE.md
├── docs/                        # 项目文档
│   ├── README.md
│   ├── requirements.md          # 需求文档
│   ├── mvp-design.md            # 设计文档
│   ├── prototype.md             # 原型说明
│   └── tasks.md                 # 任务拆分
├── README.md                    # 项目总览
├── Makefile                     # 构建命令
└── .gitignore                   # Git 忽略规则
```

## 技术栈

### 后端 (Python)
- Python 3.8+
- cryptography - 加密库
- pytest - 测试框架

### 前端 (规划中)
- React + TypeScript
- Vite

## 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/PersonAccount.git
cd PersonAccount/python

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 或使用 Makefile
make install
```

### 运行

```bash
# 直接运行
python src/main.py

# 或安装包后
pip install -e .
personaccount

# 或使用 Makefile
make init
```

## 发布流程

### 发布到 GitHub

```bash
# 初始化 Git
git init
git add .
git commit -m "feat: 初始版本"
git remote add origin https://github.com/YOUR_USERNAME/PersonAccount.git
git push -u origin main

# 创建标签
git tag v0.1.0
git push origin v0.1.0
```

### 发布到 PyPI

```bash
# 构建
cd python
python -m build

# 上传
twine upload dist/*
```

## 版本历史

### v0.1.0 (2026-06-05)
- 初始版本
- 基础账号 CRUD 功能
- 加密存储
- 命令行界面
- GitHub 发布配置

## 待办事项

### v0.2.0
- [ ] 密码生成器
- [ ] 一键复制功能
- [ ] 到期提醒
- [ ] 软删除/回收站

### v0.3.0
- [ ] 图形界面 (GUI)
- [ ] 浏览器扩展
- [ ] 数据导入/导出

## 许可证

MIT License - 详见 [LICENSE](python/LICENSE)

## 贡献

欢迎提交 Issue 和 Pull Request！详见 [CONTRIBUTING.md](python/CONTRIBUTING.md)

## 联系方式

- 项目 Issues: https://github.com/YOUR_USERNAME/PersonAccount/issues
- 邮件：your-email@example.com
