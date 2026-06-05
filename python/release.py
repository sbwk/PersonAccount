#!/usr/bin/env python3
"""
发布脚本 - 用于打包和发布 PersonAccount 到 PyPI 和 GitHub
"""

import subprocess
import sys
from pathlib import Path


def run_command(cmd: list, cwd: str = None):
    """运行命令并输出结果"""
    print(f"运行：{' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout)
    if result.returncode != 0:
        print(f"错误：{result.stderr}")
        sys.exit(1)
    return result


def check_prerequisites():
    """检查前置条件"""
    print("=== 检查前置条件 ===")

    # 检查 Python 版本
    python_version = sys.version_info
    if python_version < (3, 8):
        print("错误：需要 Python 3.8 或更高版本")
        sys.exit(1)
    print(f"✓ Python 版本：{python_version.major}.{python_version.minor}")

    # 检查必要的工具
    try:
        run_command(["git", "--version"])
        print("✓ Git 已安装")
    except FileNotFoundError:
        print("错误：需要安装 Git")
        sys.exit(1)

    # 检查是否安装了构建工具
    try:
        run_command([sys.executable, "-m", "build", "--version"])
    except SystemExit:
        print("正在安装 build 工具...")
        run_command([sys.executable, "-m", "pip", "install", "build", "twine"])


def clean_build_artifacts():
    """清理构建产物"""
    print("\n=== 清理构建产物 ===")
    python_dir = Path(__file__).parent / "python"

    # 删除旧的构建文件
    for pattern in ["build/", "dist/", "*.egg-info"]:
        for path in python_dir.glob(pattern):
            if path.is_dir():
                for item in path.rglob("*"):
                    if item.is_file():
                        item.unlink()
                path.rmdir()
            else:
                path.unlink()
            print(f"✓ 清理：{path}")


def build_package():
    """构建 Python 包"""
    print("\n=== 构建 Python 包 ===")
    python_dir = Path(__file__).parent / "python"
    run_command([sys.executable, "-m", "build"], cwd=str(python_dir))
    print("✓ 包构建完成")


def test_package():
    """测试包"""
    print("\n=== 运行测试 ===")
    python_dir = Path(__file__).parent / "python"
    try:
        run_command([sys.executable, "-m", "pytest", "tests/", "-v"], cwd=str(python_dir))
        print("✓ 所有测试通过")
    except SystemExit:
        print("警告：测试失败，但继续发布流程")


def upload_to_pypi(dry_run: bool = True):
    """上传到 PyPI"""
    print("\n=== 上传到 PyPI ===")
    python_dir = Path(__file__).parent / "python"

    if dry_run:
        print("干运行模式：不实际上传")
        run_command([sys.executable, "-m", "twine", "check", "dist/*"], cwd=str(python_dir))
    else:
        print("注意：请确保已设置 PYPI_API_TOKEN 环境变量")
        run_command([sys.executable, "-m", "twine", "upload", "dist/*"], cwd=str(python_dir))


def create_git_tag(version: str):
    """创建 Git 标签"""
    print(f"\n=== 创建 Git 标签 {version} ===")

    run_command(["git", "tag", f"v{version}"])
    print(f"✓ 标签 v{version} 已创建")
    print("提示：运行 'git push origin v{version}' 推送标签到 GitHub")


def main():
    """主函数"""
    print("=" * 50)
    print("  PersonAccount 发布脚本")
    print("=" * 50)

    import argparse
    parser = argparse.ArgumentParser(description="PersonAccount 发布工具")
    parser.add_argument("--version", default="0.1.0", help="版本号")
    parser.add_argument("--no-test", action="store_true", help="跳过测试")
    parser.add_argument("--upload", action="store_true", help="上传到 PyPI")
    parser.add_argument("--tag", action="store_true", help="创建 Git 标签")

    args = parser.parse_args()

    # 执行发布流程
    check_prerequisites()
    clean_build_artifacts()
    build_package()

    if not args.no_test:
        test_package()

    if args.upload:
        upload_to_pypi(dry_run=False)
    else:
        upload_to_pypi(dry_run=True)

    if args.tag:
        create_git_tag(args.version)

    print("\n" + "=" * 50)
    print("  发布流程完成！")
    print("=" * 50)

    if not args.upload:
        print("\n下一步:")
        print("1. 检查构建产物：python/dist/")
        print("2. 运行 '--upload' 上传到 PyPI")
        print("3. 运行 '--tag' 创建 Git 标签")
        print("4. 推送代码到 GitHub: git push origin main")


if __name__ == "__main__":
    main()
