from django.test import TestCase

from apps.user.filter import UserFilter
from apps.user.models import UserModel


class UserFilterTestCase(TestCase):

    def setUp(self):
        # Користувач-продавець з преміум-аккаунтом
        self.user1 = UserModel.objects.create_user(
            email='user1@example.com',
            password='123',
            role='seller',
            account_type='premium',
            is_active=True
        )

        # Користувач-покупець (account_type автоматично обнулиться)
        self.user2 = UserModel.objects.create_user(
            email='user2@example.com',
            password='123',
            role='buyer',
            is_active=False
        )

    def test_filter_by_role(self):
        qs = UserFilter({'role': 'seller'}, queryset=UserModel.objects.all()).qs
        self.assertIn(self.user1, qs)
        self.assertNotIn(self.user2, qs)

    def test_filter_by_account_type(self):
        # Фільтруємо тільки серед seller
        qs = UserFilter({'account_type': 'premium'}, queryset=UserModel.objects.filter(role='seller')).qs
        self.assertIn(self.user1, qs)
        self.assertNotIn(self.user2, qs)

    def test_filter_by_is_active(self):
        qs = UserFilter({'is_active': 'true'}, queryset=UserModel.objects.all()).qs
        self.assertIn(self.user1, qs)
        self.assertNotIn(self.user2, qs)