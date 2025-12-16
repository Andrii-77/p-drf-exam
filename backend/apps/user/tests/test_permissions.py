from django.test import TestCase

from rest_framework.exceptions import PermissionDenied
from rest_framework.test import APIRequestFactory

from apps.user.models import UserModel
from apps.user.permissions import HasPremiumAccessPermission, IsOwnerOrManagerOrAdmin


class DummyObject:
    def __init__(self, user):
        self.user = user


class PermissionsTestCase(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()

        # Користувачі для тестів
        self.owner = UserModel.objects.create_user(
            email='owner@example.com',
            password='pass123',
            role='seller',
            account_type='premium'
        )

        self.basic_seller = UserModel.objects.create_user(
            email='basic@example.com',
            password='pass123',
            role='seller',
            account_type='basic'
        )

        self.seller = UserModel.objects.create_user(
            email='seller@example.com',
            password='pass123',
            role='seller',
            account_type='basic'
        )

        self.manager = UserModel.objects.create_user(
            email='manager@example.com',
            password='pass123',
            role='manager',
            account_type='basic'
        )

        self.admin = UserModel.objects.create_superuser(
            email='admin@example.com',
            password='admin123'
        )

        # Об’єкт для перевірки permissions
        self.obj = DummyObject(user=self.owner)

    # Тест для IsOwnerOrManagerOrAdmin
    def test_is_owner_or_manager_or_admin(self):
        perm = IsOwnerOrManagerOrAdmin()
        request = self.factory.get('/')

        # Admin має доступ
        request.user = self.admin
        self.assertTrue(perm.has_object_permission(request, None, self.basic_seller))

        # Manager має доступ
        request.user = self.manager
        self.assertTrue(perm.has_object_permission(request, None, self.basic_seller))

        # Owner (basic_seller) має доступ до свого об’єкта
        request.user = self.basic_seller
        self.assertTrue(perm.has_object_permission(request, None, self.basic_seller))

        # Інший простий seller не має доступу
        request.user = self.seller
        self.assertFalse(perm.has_object_permission(request, None, self.basic_seller))

    # Тест для HasPremiumAccessPermission
    def test_has_premium_access_permission(self):
        perm = HasPremiumAccessPermission()
        request = self.factory.get('/')

        # ✅ premium seller (owner)
        request.user = self.owner
        self.assertTrue(
            perm.has_object_permission(request, None, self.obj)
        )

        # ❌ admin → PermissionDenied
        request.user = self.admin
        with self.assertRaises(PermissionDenied):
            perm.has_object_permission(request, None, self.obj)

        # ❌ basic seller → PermissionDenied
        request.user = self.basic_seller
        with self.assertRaises(PermissionDenied):
            perm.has_object_permission(request, None, self.obj)