"""
加密模块测试
"""

import pytest
from src.core.crypto import CryptoManager


class TestCryptoManager:
    """加密管理器测试类"""

    def test_encrypt_decrypt(self):
        """测试加密解密流程"""
        password = "test_password_123"
        crypto = CryptoManager(password)

        original_data = {"username": "test", "secret": "my_secret"}
        encrypted = crypto.encrypt(original_data)
        decrypted = crypto.decrypt(encrypted)

        assert decrypted == original_data

    def test_different_passwords(self):
        """测试不同密码无法解密"""
        password1 = "password_one"
        password2 = "password_two"

        crypto1 = CryptoManager(password1)
        crypto2 = CryptoManager(password2, crypto1.get_salt())

        data = {"test": "data"}
        encrypted = crypto1.encrypt(data)

        # 使用错误密码解密应该失败
        with pytest.raises(Exception):
            crypto2.decrypt(encrypted)

    def test_same_password_same_salt(self):
        """测试相同密码和盐值可以解密"""
        password = "consistent_password"
        salt = b"fixed_salt_12345"  # 16 bytes

        crypto1 = CryptoManager(password, salt)
        crypto2 = CryptoManager(password, salt)

        data = {"test": "data"}
        encrypted = crypto1.encrypt(data)
        decrypted = crypto2.decrypt(encrypted)

        assert decrypted == data
