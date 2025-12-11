from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient, APITestCase

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel

User = get_user_model()


class TestCarViews(APITestCase):

    def setUp(self):
        # Користувачі
        self.user = User.objects.create_user(email="user1@example.com", password="pass123")
        self.staff_user = User.objects.create_user(email="staff@example.com", password="pass123", is_staff=True)
        self.other_user = User.objects.create_user(email="other@example.com", password="pass123")

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
        self.url_list = reverse("car-list")
        self.url_detail = reverse("car-detail", args=[self.car.id])

    def test_list_cars_only_active_for_anonymous(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, 200)
        results = response.json()["data"]
        self.assertEqual(len(results), 1)

        # робимо car неактивним
        self.car.status = "draft"
        self.car.save()

        response = self.client.get(self.url_list)
        results = response.json()["data"]
        self.assertEqual(len(results), 0)

    def test_list_cars_all_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, 200)
        results = response.json()["data"]
        self.assertEqual(len(results), 1)

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

        response = self.client.get(self.url_list)
        results = response.json()["data"]
        self.assertEqual(len(results), 2)

    @patch("apps.car.views.register_car_view")
    def test_retrieve_registers_view(self, mock_register):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, 200)
        mock_register.assert_called_once()

    @patch("apps.car.serializers.contains_bad_words")
    @patch("apps.car.serializers.apply_currency_conversion")
    def test_update_car_with_permission_and_bad_words(self, mock_convert, mock_bad_words):
        self.client.force_authenticate(user=self.user)
        mock_bad_words.return_value = True
        mock_convert.return_value = {
            "price_usd": Decimal("10000"),
            "price_eur": Decimal("9200"),
            "price_uah": Decimal("400000"),
            "exchange_rate_used": {"USD": "40.00", "EUR": "43.48"}
        }

        data = {
            "description": "bad text",
            "original_price": Decimal("10000"),
            "original_currency": "USD"
        }
        response = self.client.patch(self.url_detail, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.json())

    def test_update_car_without_permission(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.patch(self.url_detail, {"description": "test"}, format="json")
        self.assertEqual(response.status_code, 403)

    def test_filter_cars_by_brand(self):
        url = self.url_list + f"?brand={self.car.brand.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        results = response.json()["data"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["brand"]["id"], self.car.brand.id)

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

        url = self.url_list + "?ordering=price_usd"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        results = response.json()["data"]
        prices = [Decimal(item["price_usd"]) for item in results]
        self.assertEqual(prices, sorted(prices))

    def test_post_not_allowed(self):
        """Перевіряємо, що POST на car-list не підтримується"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url_list, {
            "description": "Test",
            "brand": self.brand.id,
            "model": self.model.id,
            "original_price": 10000,
            "original_currency": "USD"
        }, format="json")
        self.assertEqual(response.status_code, 405)