from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient

from apps.user.models import UserModel


class UserViewsTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.admin = UserModel.objects.create_superuser(
            email='admin@example.com',
            password='admin123'
        )
        self.manager = UserModel.objects.create_user(
            email='manager@example.com',
            password='manager123',
            role='manager'
        )
        self.seller = UserModel.objects.create_user(
            email='seller@example.com',
            password='seller123',
            role='seller',
            account_type='premium'
        )
        self.basic_user = UserModel.objects.create_user(
            email='basic@example.com',
            password='basic123',
            role='seller',
            account_type='basic'
        )

    def test_user_list(self):
        url = reverse('user_list_create')

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertIn('data', response.data)

    def test_create_user_as_admin(self):
        url = reverse('user_list_create')

        data = {
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'role': 'seller',
            'account_type': 'basic',
            'profile': {
                'name': 'Test',
                'surname': 'User',
                'phone_number': '123456789'
            }
        }

        self.client.force_authenticate(user=self.admin)
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            UserModel.objects.filter(email='newuser@example.com').exists()
        )

    def test_current_user_endpoint(self):
        url = reverse('user-me')

        self.client.force_authenticate(user=self.seller)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], self.seller.email)

    def test_block_unblock_user(self):
        self.client.force_authenticate(user=self.admin)

        block_url = reverse('user_block', args=[self.basic_user.id])
        unblock_url = reverse('user_unblock', args=[self.basic_user.id])

        response = self.client.patch(block_url)
        self.assertEqual(response.status_code, 200)

        self.basic_user.refresh_from_db()
        self.assertFalse(self.basic_user.is_active)

        response = self.client.patch(unblock_url)
        self.assertEqual(response.status_code, 200)

        self.basic_user.refresh_from_db()
        self.assertTrue(self.basic_user.is_active)

    def test_change_roles_and_account_types(self):
        self.client.force_authenticate(user=self.admin)

        # to_manager_role
        url = reverse('user_to_manager_role', args=[self.basic_user.id])
        response = self.client.patch(url)
        self.assertEqual(response.status_code, 200)

        self.basic_user.refresh_from_db()
        self.assertEqual(self.basic_user.role, 'manager')

        # to_admin_role
        url = reverse('user_to_admin_role', args=[self.basic_user.id])
        response = self.client.patch(url)
        self.assertEqual(response.status_code, 200)

        self.basic_user.refresh_from_db()
        self.assertEqual(self.basic_user.role, 'admin')

        # to_seller_role (basic account)
        url = reverse('user_to_seller_role_basic_account_type', args=[self.basic_user.id])
        response = self.client.patch(url)
        self.assertEqual(response.status_code, 200)

        self.basic_user.refresh_from_db()
        self.assertEqual(self.basic_user.role, 'seller')
        self.assertEqual(self.basic_user.account_type, 'basic')

        # to_basic_account_type
        url = reverse('user_seller_to_basic_account_type', args=[self.basic_user.id])
        response = self.client.patch(url)
        self.assertEqual(response.status_code, 200)

        self.basic_user.refresh_from_db()
        self.assertEqual(self.basic_user.account_type, 'basic')

        # to_premium_account_type
        url = reverse('user_seller_to_premium_account_type', args=[self.basic_user.id])
        response = self.client.patch(url)
        self.assertEqual(response.status_code, 200)

        self.basic_user.refresh_from_db()
        self.assertEqual(self.basic_user.account_type, 'premium')