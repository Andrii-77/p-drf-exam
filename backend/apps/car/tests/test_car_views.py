from decimal import Decimal
from unittest import TestCase
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient, APITestCase

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel


class TestCarViews(APITestCase):

    def setUp(self):
        User = get_user_model()

        # Користувачі
        self.user = User.objects.create_user(username="user1", password="pass123")
        self.staff_user = User.objects.create_user(username="staff", password="pass123", is_staff=True)
        self.other_user = User.objects.create_user(username="other", password="pass123")

        # Бренд і модель
        self.brand = CarBrandModel.objects.create(brand="Toyota")
        self.model = CarModelModel.objects.create(brand=self.brand, model="Corolla")

        # CarPoster
        self.car = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="Nice car",
            original_price=Decimal("10000"),
            original_currency="USD",
            location="Kyiv",
            status="active",
            price_usd=Decimal("10000")
        )

        self.client = APIClient()

    def test_list_cars_only_active_for_anonymous(self):
        url = reverse("car-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        # робимо car неактивним
        self.car.status = "draft"
        self.car.save()

        response = self.client.get(url)
        self.assertEqual(len(response.json()), 0)

    def test_list_cars_all_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("car-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        # створюємо ще draft авто
        CarPosterModel.objects.create(
            user=self.staff_user,
            brand=self.car.brand,
            model=self.car.model,
            description="Draft car",
            original_price=5000,
            original_currency="USD",
            location="Lviv",
            status="draft",
            price_usd=5000
        )

        response = self.client.get(url)
        self.assertEqual(len(response.json()), 2)

    @patch("apps.car.views.register_car_view")
    def test_retrieve_registers_view(self, mock_register):
        url = reverse("car-detail", args=[self.car.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        mock_register.assert_called_once()

    @patch("apps.car.views.contains_bad_words")
    def test_update_car_with_permission_and_bad_words(self, mock_bad_words):
        self.client.force_authenticate(user=self.user)
        mock_bad_words.return_value = True
        url = reverse("car-detail", args=[self.car.id])

        response = self.client.put(url, {"description": "bad text"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())

    def test_update_car_without_permission(self):
        self.client.force_authenticate(user=self.other_user)
        url = reverse("car-detail", args=[self.car.id])
        response = self.client.put(url, {"description": "test"}, format="json")
        self.assertEqual(response.status_code, 403)

    def test_filter_cars_by_brand(self):
        url = reverse("car-list") + f"?brand={self.car.brand.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["brand"]["id"], self.car.brand.id)

    def test_ordering_by_price(self):
        car2 = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="Expensive car",
            original_price=Decimal("20000"),
            original_currency="USD",
            location="Kyiv",
            status="active",
            price_usd=Decimal("20000")
        )

        self.car.price_usd = Decimal("10000")
        self.car.save()

        url = reverse("car-list") + "?ordering=price_usd"
        response = self.client.get(url)

        prices = [item["price_usd"] for item in response.json()]
        self.assertEqual(prices, sorted(prices))