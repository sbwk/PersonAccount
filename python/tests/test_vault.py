"""
仓库模块测试
"""

import pytest
import os
import tempfile
from pathlib import Path

from src.core.crypto import CryptoManager
from src.core.vault import Vault


class TestVault:
    """仓库测试类"""

    @pytest.fixture
    def temp_vault_path(self, tmp_path):
        """创建临时仓库路径"""
        old_path = Vault._Vault__default_path
        Vault._Vault__default_path = tmp_path / "vault.dat"
        yield tmp_path
        Vault._Vault__default_path = old_path

    def test_create_vault(self, temp_vault_path):
        """测试创建仓库"""
        password = "test_password_123"
        vault = Vault.create(password)

        assert vault.data is not None
        assert "accounts" in vault.data
        assert vault.data["version"] == 1

    def test_add_account(self, temp_vault_path):
        """测试添加账号"""
        password = "test_password_123"
        vault = Vault.create(password)

        account_data = {
            "title": "Test Account",
            "category": "测试",
            "login": "test@example.com",
            "password": "secret123",
        }

        account = vault.add_account(account_data)

        assert account["title"] == "Test Account"
        assert account["category"] == "测试"
        assert "id" in account
        assert "created_at" in account

    def test_list_accounts(self, temp_vault_path):
        """测试列出账号"""
        password = "test_password_123"
        vault = Vault.create(password)

        # 初始为空
        assert len(vault.list_accounts()) == 0

        # 添加账号
        vault.add_account({
            "title": "Account 1",
            "category": "测试",
            "login": "test1@example.com",
            "password": "secret1",
        })

        accounts = vault.list_accounts()
        assert len(accounts) == 1
        assert accounts[0]["title"] == "Account 1"

    def test_search_accounts(self, temp_vault_path):
        """测试搜索账号"""
        password = "test_password_123"
        vault = Vault.create(password)

        vault.add_account({
            "title": "Steam Account",
            "category": "游戏",
            "login": "gamer@example.com",
            "password": "secret1",
        })

        vault.add_account({
            "title": "Gmail Account",
            "category": "邮箱",
            "login": "email@gmail.com",
            "password": "secret2",
        })

        # 按标题搜索
        results = vault.search_accounts("steam")
        assert len(results) == 1
        assert results[0]["category"] == "游戏"

        # 按登录账号搜索
        results = vault.search_accounts("gmail")
        assert len(results) == 1

    def test_delete_account(self, temp_vault_path):
        """测试删除账号"""
        password = "test_password_123"
        vault = Vault.create(password)

        account = vault.add_account({
            "title": "To Delete",
            "category": "测试",
            "login": "delete@example.com",
            "password": "secret",
        })

        assert len(vault.list_accounts()) == 1

        result = vault.delete_account(account["id"])
        assert result is True
        assert len(vault.list_accounts()) == 0
