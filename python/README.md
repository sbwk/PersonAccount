# PersonAccount

个人账号存储管理系统 - 安全地管理您的个人账号信息

## 功能特性

- 🔒 **安全加密** - 使用 PBKDF2+SHA256 派生密钥，Fernet 对称加密
- 📝 **账号管理** - 添加、编辑、删除、查看账号信息
- 🔍 **快速搜索** - 按名称、登录账号、类别搜索
- 🎯 **分类管理** - 支持自定义账号分类
- ⚠️ **到期提醒** - 付费账号到期/续费提醒

## 安装

### 从 PyPI 安装（推荐）

```bash
pip install personaccount
```

### 从源码安装

```bash
# 克隆仓库
git clone https://github.com/your-username/personaccount.git
cd personaccount

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 安装包
pip install -e .
```

## 快速开始

### 命令行使用

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

### 主要功能

- **解锁仓库** - 使用主密码解密账号数据
- **查看账号** - 列出所有账号记录
- **搜索账号** - 关键词快速查找
- **添加账号** - 录入新账号信息
- **查看详情** - 查看完整账号信息
- **编辑/删除** - 管理现有账号

## 数据结构

### 账号字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 账号名称 |
| category | string | 是 | 账号类型 |
| login | string | 是 | 登录账号 |
| password | string | 是 | 密码（加密存储） |
| url | string | 否 | 官网/登录地址 |
| registered_at | date | 否 | 注册日期 |
| level | string | 否 | 账号等级 |
| expires_at | date | 否 | 有效期 |
| billing | object | 否 | 缴费信息 |
| note | string | 否 | 备注 |

## 安全说明

- 🔐 主密码用于派生加密密钥，不会存储
- 🧂 使用随机盐值防止彩虹表攻击
- 🔑 加密密钥通过 PBKDF2 迭代派生（100,000 次）
- 💾 所有账号数据加密后存储为 `vault.dat`
- ⚠️ 请妥善保管主密码，丢失后无法恢复数据

## 存储位置

- **仓库文件**: `~/.personaccount/vault.dat`
- **设置文件**: `~/.personaccount/settings.json`

## 开发

```bash
# 安装开发依赖
pip install -e ".[dev]"

# 运行测试
pytest

# 代码格式化
black src/
ruff check src/
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 版本历史

### v0.1.0
- 初始版本
- 基础账号 CRUD 功能
- 加密存储
- 命令行界面
