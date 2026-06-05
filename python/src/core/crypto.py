"""
加密模块 - 提供数据加密/解密功能
使用 Fernet 对称加密
"""

import base64
import json
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


class CryptoManager:
    """加密管理器"""

    SALT_LENGTH = 16
    ITERATIONS = 100000

    def __init__(self, password: str, salt: bytes = None):
        self.salt = salt or os.urandom(self.SALT_LENGTH)
        self.key = self._derive_key(password)
        self.fernet = Fernet(self.key)

    def _derive_key(self, password: str) -> bytes:
        """从密码派生加密密钥"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=self.salt,
            iterations=self.ITERATIONS,
        )
        return base64.urlsafe_b64encode(kdf.derive(password.encode()))

    def encrypt(self, data: dict) -> bytes:
        """加密数据"""
        json_data = json.dumps(data).encode()
        return self.fernet.encrypt(json_data)

    def decrypt(self, encrypted_data: bytes) -> dict:
        """解密数据"""
        decrypted = self.fernet.decrypt(encrypted_data)
        return json.loads(decrypted.decode())

    def get_salt(self) -> bytes:
        """获取盐值"""
        return self.salt
