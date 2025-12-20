from django.test import TestCase

from apps.user.models import UserModel


class UserModelTestCase(TestCase):

    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'strongpassword123',
            'role': 'seller',
            'account_type': 'basic',
        }

    def test_create_user_success(self):
        user = UserModel.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data['email'])
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.check_password(self.user_data['password']))

    def test_create_user_without_email(self):
        data = self.user_data.copy()
        data['email'] = ''
        with self.assertRaises(ValueError):
            UserModel.objects.create_user(**data)

    def test_create_user_without_password(self):
        data = self.user_data.copy()
        data['password'] = ''
        with self.assertRaises(ValueError):
            UserModel.objects.create_user(**data)

    def test_create_superuser_success(self):
        superuser = UserModel.objects.create_superuser(
            email='admin@example.com',
            password='adminpassword'
        )
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_create_superuser_wrong_flags(self):
        with self.assertRaises(ValueError):
            UserModel.objects.create_superuser(
                email='admin2@example.com',
                password='adminpassword',
                is_staff=False
            )