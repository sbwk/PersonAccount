"""
PersonAccount - 个人账号存储管理系统
主程序入口
"""

import sys
from pathlib import Path

# 添加项目根目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.cli import CLI


def main():
    """主函数"""
    cli = CLI()
    cli.run()


if __name__ == "__main__":
    main()
