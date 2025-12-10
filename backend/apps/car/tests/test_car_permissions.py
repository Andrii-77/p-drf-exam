from types import SimpleNamespace

from django.test import TestCase

from rest_framework.exceptions import PermissionDenied

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel, StatusChoices
from apps.user.models import UserModel
from apps.user.permissions import EditCarPosterPermission, IsManagerOrAdmin


class TestEditCarPosterPermission(TestCase):

    def setUp(self):
        self.permission = EditCarPosterPermission()

        # --- Користувачі ---
        self.owner = UserModel.objects.create_user(email="owner@example.com", password="pass1234")
        self.other = UserModel.objects.create_user(email="other@example.com", password="pass1234")
        self.staff = UserModel.objects.create_user(email="staff@example.com", password="pass1234", is_staff=True)

        self.manager = UserModel.objects.create_user(
            email="manager@example.com", password="pass1234", role="manager"
        )

        self.admin = UserModel.objects.create_user(
            email="admin@example.com", password="pass1234", role="admin"
        )

        # --- Бренд і модель ---
        self.brand = CarBrandModel.objects.create(brand="TestBrand")
        self.car_model = CarModelModel.objects.create(brand=self.brand, model="TestModel")

        # --- Оголошення ---
        self.active_car = CarPosterModel.objects.create(
            user=self.owner,
            brand=self.brand,
            model=self.car_model,
            description="Active",
            original_price=1000,
            original_currency="USD",
            location="Kyiv",
            status=StatusChoices.ACTIVE
        )

        self.inactive_car = CarPosterModel.objects.create(
            user=self.owner,
            brand=self.brand,
            model=self.car_model,
            description="Inactive",
            original_price=1000,
            original_currency="USD",
            location="Kyiv",
            status=StatusChoices.INACTIVE
        )

        self.draft_car = CarPosterModel.objects.create(
            user=self.owner,
            brand=self.brand,
            model=self.car_model,
            description="Draft",
            original_price=1000,
            original_currency="USD",
            location="Kyiv",
            status=StatusChoices.DRAFT
        )

    def _make_request(self, user, method="PUT"):
        return SimpleNamespace(user=user, method=method)

    # --- ТЕСТИ ---
    def test_owner_can_edit_active_car(self):
        request = self._make_request(self.owner)
        self.assertTrue(self.permission.has_object_permission(request, None, self.active_car))

    def test_owner_cannot_edit_inactive_car(self):
        request = self._make_request(self.owner)
        with self.assertRaisesMessage(PermissionDenied, "Ви не можете редагувати оголошення зі статусом 'неактивне'."):
            self.permission.has_object_permission(request, None, self.inactive_car)

    def test_staff_can_edit_any_car(self):
        request = self._make_request(self.staff)
        self.assertTrue(self.permission.has_object_permission(request, None, self.active_car))

    def test_manager_can_edit_any_car(self):
        request = self._make_request(self.manager)
        self.assertTrue(self.permission.has_object_permission(request, None, self.active_car))

    def test_admin_can_edit_any_car(self):
        request = self._make_request(self.admin)
        self.assertTrue(self.permission.has_object_permission(request, None, self.active_car))

    def test_other_user_cannot_edit_car(self):
        request = self._make_request(self.other)
        with self.assertRaisesMessage(PermissionDenied, "У вас немає прав змінювати або видаляти це оголошення."):
            self.permission.has_object_permission(request, None, self.active_car)

    def test_anonymous_cannot_edit_car(self):
        request = self._make_request(SimpleNamespace(is_authenticated=False))
        with self.assertRaisesMessage(PermissionDenied, "Неавторизовані користувачі не можуть змінювати дані."):
            self.permission.has_object_permission(request, None, self.active_car)


class TestIsManagerOrAdmin(TestCase):

    def setUp(self):
        self.permission = IsManagerOrAdmin()

        self.staff = UserModel.objects.create_user(email="staff@example.com", password="pass", is_staff=True)
        self.manager = UserModel.objects.create_user(email="manager@example.com", password="pass", role="manager")
        self.admin = UserModel.objects.create_user(email="admin@example.com", password="pass", role="admin")
        self.user = UserModel.objects.create_user(email="user@example.com", password="pass")

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