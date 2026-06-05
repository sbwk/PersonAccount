"""
命令行接口模块
"""

import getpass
import sys
from typing import Optional


class CLI:
    """命令行接口类"""

    def __init__(self):
        self.vault = None
        self.is_unlocked = False

    def run(self):
        """运行 CLI 主循环"""
        print("=" * 50)
        print("  PersonAccount - 个人账号存储管理系统 v0.1.0")
        print("=" * 50)
        print()

        while True:
            if not self.is_unlocked:
                self._show_login_menu()
            else:
                self._show_main_menu()

    def _show_login_menu(self):
        """显示登录菜单"""
        print("\n=== 登录菜单 ===")
        print("1. 解锁仓库")
        print("2. 初始化新仓库")
        print("3. 退出")

        choice = input("\n请选择 (1-3): ").strip()

        if choice == "1":
            self._unlock_vault()
        elif choice == "2":
            self._init_vault()
        elif choice == "3":
            print("再见！")
            sys.exit(0)
        else:
            print("无效选择，请重试")

    def _show_main_menu(self):
        """显示主菜单"""
        print("\n=== 主菜单 ===")
        print("1. 查看所有账号")
        print("2. 搜索账号")
        print("3. 添加新账号")
        print("4. 查看账号详情")
        print("5. 编辑账号")
        print("6. 删除账号")
        print("7. 锁定仓库")
        print("8. 退出")

        choice = input("\n请选择 (1-8): ").strip()

        if choice == "1":
            self._list_accounts()
        elif choice == "2":
            self._search_accounts()
        elif choice == "3":
            self._add_account()
        elif choice == "4":
            self._view_account()
        elif choice == "5":
            self._edit_account()
        elif choice == "6":
            self._delete_account()
        elif choice == "7":
            self.is_unlocked = False
            print("仓库已锁定")
        elif choice == "8":
            print("再见！")
            sys.exit(0)
        else:
            print("无效选择，请重试")

    def _init_vault(self):
        """初始化新仓库"""
        from src.core.vault import Vault

        print("\n=== 初始化新仓库 ===")
        print("请设置主密码（用于加密您的账号数据）")

        while True:
            password = getpass.getpass("设置主密码：")
            confirm = getpass.getpass("确认主密码：")

            if password != confirm:
                print("两次输入的密码不一致，请重试")
                continue

            if len(password) < 8:
                print("主密码长度至少为 8 位")
                continue

            break

        try:
            self.vault = Vault.create(password)
            self.is_unlocked = True
            print("\n仓库初始化成功！")
        except Exception as e:
            print(f"初始化失败：{e}")

    def _unlock_vault(self):
        """解锁仓库"""
        from src.core.vault import Vault

        print("\n=== 解锁仓库 ===")
        password = getpass.getpass("输入主密码：")

        try:
            self.vault = Vault.load(password)
            self.is_unlocked = True
            print("解锁成功！")
        except Exception as e:
            print(f"解锁失败：{e}")

    def _list_accounts(self):
        """列出所有账号"""
        if not self.vault:
            return

        accounts = self.vault.list_accounts()
        if not accounts:
            print("\n暂无账号记录")
            return

        print("\n=== 账号列表 ===")
        for i, acc in enumerate(accounts, 1):
            print(f"{i}. [{acc.get('category', '未分类')}] {acc.get('title', '无标题')}")
            print(f"   登录账号：{acc.get('login', 'N/A')}")
            print()

    def _search_accounts(self):
        """搜索账号"""
        if not self.vault:
            return

        keyword = input("输入搜索关键词：").strip()
        if not keyword:
            print("关键词不能为空")
            return

        results = self.vault.search_accounts(keyword)
        if not results:
            print("\n未找到匹配的账号")
            return

        print(f"\n=== 搜索结果（共{len(results)}条）===")
        for i, acc in enumerate(results, 1):
            print(f"{i}. [{acc.get('category', '未分类')}] {acc.get('title', '无标题')}")
            print(f"   登录账号：{acc.get('login', 'N/A')}")
            print()

    def _add_account(self):
        """添加新账号"""
        if not self.vault:
            return

        print("\n=== 添加新账号 ===")
        title = input("账号名称 (*): ").strip()
        category = input("账号类型 (如：游戏/工具/邮箱/金融/社交/学习): ").strip() or "未分类"
        login = input("登录账号 (*): ").strip()
        password = getpass.getpass("密码 (*): ")
        url = input("官网/登录地址 (可选): ").strip() or None

        if not all([title, login, password]):
            print("必填字段不能为空")
            return

        account_data = {
            "title": title,
            "category": category,
            "login": login,
            "password": password,
            "url": url,
        }

        try:
            self.vault.add_account(account_data)
            print("账号添加成功！")
        except Exception as e:
            print(f"添加失败：{e}")

    def _view_account(self):
        """查看账号详情"""
        if not self.vault:
            return

        index = input("输入账号序号：").strip()
        if not index.isdigit():
            print("请输入有效序号")
            return

        accounts = self.vault.list_accounts()
        idx = int(index) - 1
        if idx < 0 or idx >= len(accounts):
            print("序号超出范围")
            return

        account = accounts[idx]
        print(f"\n=== {account.get('title', '无标题')} ===")
        print(f"类别：{account.get('category', '未分类')}")
        print(f"登录账号：{account.get('login', 'N/A')}")
        print(f"网址：{account.get('url', 'N/A')}")
        print(f"创建时间：{account.get('created_at', 'N/A')}")

        show_pwd = input("是否显示密码？(y/N): ").strip().lower()
        if show_pwd == 'y':
            print(f"密码：{account.get('password', 'N/A')}")

    def _edit_account(self):
        """编辑账号"""
        print("功能开发中...")

    def _delete_account(self):
        """删除账号"""
        print("功能开发中...")
