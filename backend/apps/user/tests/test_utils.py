from django.test import TestCase

from apps.user.models import UserModel
from apps.user.utils.access import has_premium_access


class UserUtilsTestCase(TestCase):

    def setUp(self):
        # 🔹 Преміум користувач — продавець
        self.premium_user = UserModel.objects.create_user(
            email='premium@example.com',
            password='123',
            role='seller',
            account_type='premium'
        )

        # 🔹 Базовий користувач — продавець
        self.basic_user = UserModel.objects.create_user(
            email='basic@example.com',
            password='123',
            role='seller',
            account_type='basic'
        )

        # 🔹 Менеджер (role='manager', account_type не потрібен)
        self.manager = UserModel.objects.create_user(
            email='manager@example.com',
            password='123',
            role='manager'
        )

        # 🔹 Адмін (role='admin', account_type не потрібен)
        self.admin = UserModel.objects.create_user(
            email='admin@example.com',
            password='123',
            role='admin'
        )

    # === Тести ===

    def test_has_premium_access_owner_premium(self):
        """Власник з преміум акаунтом має доступ"""
        self.assertTrue(has_premium_access(self.premium_user, self.premium_user))

    def test_has_premium_access_owner_basic(self):
        """Власник з базовим акаунтом не має преміум доступу"""
        self.assertFalse(has_premium_access(self.basic_user, self.basic_user))

    def test_has_premium_access_manager(self):
        """Менеджер має доступ до будь-якого користувача"""
        self.assertTrue(has_premium_access(self.manager, self.basic_user))

    def test_has_premium_access_admin(self):
        """Адмін має доступ до будь-якого користувача"""
        self.assertTrue(has_premium_access(self.admin, self.basic_user))

    def test_has_premium_access_other_basic_user(self):
        """Базовий користувач не має доступу до преміум іншого користувача"""
        self.assertFalse(has_premium_access(self.basic_user, self.premium_user))