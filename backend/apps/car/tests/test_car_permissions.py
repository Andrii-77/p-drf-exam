from types import SimpleNamespace
from unittest import TestCase

from rest_framework.exceptions import PermissionDenied

from apps.car.models import CarPosterModel
from apps.user.models import UserModel
from apps.user.permissions import EditCarPosterPermission, IsManagerOrAdmin


class TestEditCarPosterPermission(TestCase):

    def setUp(self):
        # Створюємо користувачів
        self.owner = UserModel.objects.create_user(username="owner", email="owner@example.com", password="pass")
        self.staff = UserModel.objects.create_user(username="staff", email="staff@example.com", password="pass", is_staff=True)
        self.manager = UserModel.objects.create_user(username="manager", email="manager@example.com", password="pass", role="manager")
        self.admin = UserModel.objects.create_user(username="admin", email="admin@example.com", password="pass", role="admin")
        self.other = UserModel.objects.create_user(username="other", email="other@example.com", password="pass")

        # Створюємо CarPoster
        self.car = CarPosterModel.objects.create(
            user=self.owner,
            brand_id=1,
            model_id=1,
            description="Test car",
            original_price=10000,
            original_currency="USD",
            location="Kyiv"
        )
        self.permission = EditCarPosterPermission()

    def _make_request(self, user, method="PUT"):
        return SimpleNamespace(user=user, method=method)

    def test_owner_can_edit_active_car(self):
        request = self._make_request(self.owner)
        self.assertTrue(self.permission.has_object_permission(request, None, self.car))

    def test_owner_cannot_edit_inactive_car(self):
        self.car.status = "inactive"
        self.car.save()
        request = self._make_request(self.owner)
        with self.assertRaisesMessage(PermissionDenied, "Ви не можете редагувати оголошення зі статусом 'неактивне'."):
            self.permission.has_object_permission(request, None, self.car)

    def test_staff_can_edit_any_car(self):
        request = self._make_request(self.staff)
        self.assertTrue(self.permission.has_object_permission(request, None, self.car))

    def test_manager_can_edit_any_car(self):
        request = self._make_request(self.manager)
        self.assertTrue(self.permission.has_object_permission(request, None, self.car))

    def test_admin_can_edit_any_car(self):
        request = self._make_request(self.admin)
        self.assertTrue(self.permission.has_object_permission(request, None, self.car))

    def test_other_user_cannot_edit_car(self):
        request = self._make_request(self.other)
        with self.assertRaisesMessage(PermissionDenied, "У вас немає прав змінювати або видаляти це оголошення."):
            self.permission.has_object_permission(request, None, self.car)

    def test_anonymous_cannot_edit_car(self):
        request = self._make_request(SimpleNamespace(is_authenticated=False))
        with self.assertRaisesMessage(PermissionDenied, "Неавторизовані користувачі не можуть змінювати дані."):
            self.permission.has_object_permission(request, None, self.car)


class TestIsManagerOrAdmin(TestCase):

    def setUp(self):
        self.permission = IsManagerOrAdmin()
        self.staff = UserModel.objects.create_user(username="staff", email="staff@example.com", password="pass", is_staff=True)
        self.manager = UserModel.objects.create_user(username="manager", email="manager@example.com", password="pass", role="manager")
        self.admin = UserModel.objects.create_user(username="admin", email="admin@example.com", password="pass", role="admin")
        self.user = UserModel.objects.create_user(username="user", email="user@example.com", password="pass")

    def _make_request(self, user):
        return SimpleNamespace(user=user)

    def test_staff_has_permission(self):
        request = self._make_request(self.staff)
        self.assertTrue(self.permission.has_permission(request, None))

    def test_manager_has_permission(self):
        request = self._make_request(self.manager)
        self.assertTrue(self.permission.has_permission(request, None))

    def test_admin_has_permission(self):
        request = self._make_request(self.admin)
        self.assertTrue(self.permission.has_permission(request, None))

    def test_regular_user_has_no_permission(self):
        request = self._make_request(self.user)
        self.assertFalse(self.permission.has_permission(request, None))