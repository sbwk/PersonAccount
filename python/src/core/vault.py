"""
仓库模块 - 管理加密的账号数据存储
"""

import base64
import json
import os
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Any

from .crypto import CryptoManager


# 默认仓库路径
DEFAULT_VAULT_PATH = Path.home() / ".personaccount" / "vault.dat"
SETTINGS_PATH = Path.home() / ".personaccount" / "settings.json"


class Vault:
    """账号仓库类"""

    def __init__(self, crypto: CryptoManager, data: dict = None):
        self.crypto = crypto
        self.data = data or {"accounts": [], "version": 1}
        self.vault_path = DEFAULT_VAULT_PATH

    @classmethod
    def create(cls, password: str) -> "Vault":
        """创建新仓库"""
        crypto = CryptoManager(password)
        vault = cls(crypto)
        vault.vault_path = DEFAULT_VAULT_PATH
        # 确保目录存在
        vault.vault_path.parent.mkdir(parents=True, exist_ok=True)
        vault._save()
        # 保存盐值到设置文件（用于后续解锁）
        vault._save_settings({
            "salt": base64.b64encode(crypto.get_salt()).decode(),
            "created_at": datetime.now().isoformat(),
        })
        return vault

    @classmethod
    def load(cls, password: str) -> "Vault":
        """加载现有仓库"""
        if not DEFAULT_VAULT_PATH.exists():
            raise ValueError("仓库不存在，请先初始化")

        # 读取设置获取盐值
        settings = cls._load_settings()
        salt = base64.b64decode(settings.get("salt", ""))

        crypto = CryptoManager(password, salt)
        vault = cls(crypto)

        # 解密仓库数据
        with open(DEFAULT_VAULT_PATH, "rb") as f:
            encrypted_data = f.read()

        vault.data = crypto.decrypt(encrypted_data)
        return vault

    def _save(self):
        """保存仓库数据"""
        encrypted_data = self.crypto.encrypt(self.data)
        with open(self.vault_path, "wb") as f:
            f.write(encrypted_data)

    @staticmethod
    def _save_settings(settings: dict):
        """保存设置"""
        SETTINGS_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(SETTINGS_PATH, "w") as f:
            json.dump(settings, f, indent=2)

    @staticmethod
    def _load_settings() -> dict:
        """加载设置"""
        if not SETTINGS_PATH.exists():
            raise ValueError("仓库设置不存在")
        with open(SETTINGS_PATH, "r") as f:
            return json.load(f)

    def add_account(self, account_data: dict) -> dict:
        """添加账号"""
        account = {
            "id": self._generate_id(),
            "title": account_data.get("title", ""),
            "category": account_data.get("category", "未分类"),
            "login": account_data.get("login", ""),
            "password": account_data.get("password", ""),
            "url": account_data.get("url"),
            "registered_at": account_data.get("registered_at"),
            "level": account_data.get("level"),
            "expires_at": account_data.get("expires_at"),
            "billing": account_data.get("billing"),
            "note": account_data.get("note"),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        }
        self.data["accounts"].append(account)
        self._save()
        return account

    def list_accounts(self) -> List[dict]:
        """列出所有账号"""
        return self.data.get("accounts", [])

    def search_accounts(self, keyword: str) -> List[dict]:
        """搜索账号"""
        keyword = keyword.lower()
        results = []
        for account in self.list_accounts():
            if (keyword in account.get("title", "").lower() or
                keyword in account.get("login", "").lower() or
                keyword in account.get("category", "").lower()):
                results.append(account)
        return results

    def get_account(self, account_id: str) -> Optional[dict]:
        """获取单个账号"""
        for account in self.list_accounts():
            if account.get("id") == account_id:
                return account
        return None

    def update_account(self, account_id: str, data: dict) -> Optional[dict]:
        """更新账号"""
        account = self.get_account(account_id)
        if not account:
            return None

        for key, value in data.items():
            if key in account and key not in ["id", "created_at"]:
                account[key] = value

        account["updated_at"] = datetime.now().isoformat()
        self._save()
        return account

    def delete_account(self, account_id: str) -> bool:
        """删除账号"""
        accounts = self.list_accounts()
        for i, account in enumerate(accounts):
            if account.get("id") == account_id:
                del self.data["accounts"][i]
                self._save()
                return True
        return False

    @staticmethod
    def _generate_id() -> str:
        """生成唯一 ID"""
        import uuid
        return str(uuid.uuid4())
