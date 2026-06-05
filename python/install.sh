#!/bin/bash
# PersonAccount 快速安装脚本

set -e

echo "========================================"
echo "  PersonAccount 快速安装脚本"
echo "========================================"

# 检查 Python 版本
python_version=$(python3 --version 2>&1 | cut -d' ' -f2)
echo "检测到 Python 版本：$python_version"

# 创建虚拟环境
echo ""
echo "正在创建虚拟环境..."
python3 -m venv venv

# 激活虚拟环境
echo "正在激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo ""
echo "正在安装依赖..."
pip install --upgrade pip
pip install -r requirements.txt

# 安装开发依赖（可选）
echo ""
read -p "是否安装开发依赖（black, ruff, pytest）? (y/N): " install_dev
if [ "$install_dev" = "y" ] || [ "$install_dev" = "Y" ]; then
    pip install -e ".[dev]"
    echo "✓ 开发依赖安装完成"
fi

# 测试安装
echo ""
echo "正在测试安装..."
python -c "from src import __version__; print(f'PersonAccount 版本：{__version__}')"

echo ""
echo "========================================"
echo "  安装完成！"
echo "========================================"
echo ""
echo "使用方法:"
echo "  source venv/bin/activate  # 激活虚拟环境"
echo "  personaccount             # 启动程序"
echo ""
echo "或者使用 Makefile:"
echo "  make install    # 安装依赖"
echo "  make dev        # 安装开发依赖"
echo "  make init       # 启动程序"
echo ""
