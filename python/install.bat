@echo off
REM PersonAccount 快速安装脚本 (Windows)

echo ========================================
echo   PersonAccount 快速安装脚本
echo ========================================
echo.

REM 检查 Python 版本
python --version
echo.

REM 创建虚拟环境
echo 正在创建虚拟环境...
python -m venv venv

REM 激活虚拟环境
echo 正在激活虚拟环境...
call venv\Scripts\activate.bat

REM 安装依赖
echo.
echo 正在安装依赖...
pip install --upgrade pip
pip install -r requirements.txt

REM 安装开发依赖（可选）
echo.
set /p install_dev="是否安装开发依赖（black, ruff, pytest）? (y/N): "
if "%install_dev%"=="y" (
    pip install -e ".[dev]"
    echo ✓ 开发依赖安装完成
)

REM 测试安装
echo.
echo 正在测试安装...
python -c "from src import __version__; print('PersonAccount 版本：' + __version__)"

echo.
echo ========================================
echo   安装完成！
echo ========================================
echo.
echo 使用方法:
echo   venv\Scripts\activate    # 激活虚拟环境
echo   personaccount            # 启动程序
echo.
echo 或者使用 Makefile:
echo   make install    # 安装依赖
echo   make dev        # 安装开发依赖
echo   make init       # 启动程序
echo.

pause
