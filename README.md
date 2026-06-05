# PersonAccount

个人账号存储管理系统 - 安全地管理您的个人账号信息

[![Python CI](https://github.com/YOUR_USERNAME/PersonAccount/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/PersonAccount/actions/workflows/ci.yml)
[![PyPI version](https://badge.fury.io/py/personaccount.svg)](https://badge.fury.io/py/personaccount)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/YOUR_USERNAME/PersonAccount/blob/main/python/LICENSE)

## 🌟 功能特性

- 🔒 **安全加密** - 使用 PBKDF2+SHA256 派生密钥，Fernet 对称加密
- 📝 **账号管理** - 添加、编辑、删除、查看账号信息
- 🔍 **快速搜索** - 按名称、登录账号、类别搜索
- 🎯 **分类管理** - 支持自定义账号分类
- ⚠️ **到期提醒** - 付费账号到期/续费提醒

## 📦 安装

### 从 PyPI 安装

```bash
pip install personaccount
```

### 从源码安装

```bash
git clone https://github.com/YOUR_USERNAME/PersonAccount.git
cd PersonAccount/python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -e .
```

## 🚀 快速开始

```bash
# 启动程序
personaccount

# 或使用简短命令
pa
```

### 首次使用

1. 运行 `personaccount`
2. 选择"初始化新仓库"
3. 设置主密码（至少 8 位）
4. 开始管理您的账号

## 📖 文档

- [使用指南](python/README.md) - 详细的使用说明
- [贡献指南](python/CONTRIBUTING.md) - 如何贡献代码
- [发布指南](python/GITHUB_RELEASE.md) - GitHub 发布流程

## 🔒 安全说明

- 主密码用于派生加密密钥，不会存储
- 使用随机盐值防止彩虹表攻击
- 加密密钥通过 PBKDF2 迭代派生（100,000 次）
- 所有账号数据加密后存储

## 📁 项目结构

```
PersonAccount/
├── python/           # Python 后端
│   ├── src/          # 源代码
│   ├── tests/        # 测试
│   └── README.md     # Python 包文档
├── docs/             # 项目文档
├── Makefile          # 构建命令
└── README.md         # 本文件
```

## 🛠️ 开发

```bash
# 安装开发依赖
pip install -e ".[dev]"

# 运行测试
pytest

# 代码格式化
black src/
ruff check src/
```

## 📄 许可证

MIT License - 详见 [LICENSE](python/LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详见 [贡献指南](python/CONTRIBUTING.md)

## 📞 联系方式

- 项目 Issues: https://github.com/YOUR_USERNAME/PersonAccount/issues
