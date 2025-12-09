from unittest import TestCase
from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient, APITestCase

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel


class TestCarRetrieveUpdateDestroyView(APITestCase):

    def setUp(self):
        User = get_user_model()

        # Користувачі
        self.user = User.objects.create_user(username="user1", email="user1@example.com", password="password")
        self.manager = User.objects.create_user(username="manager", email="manager@example.com", password="password", role="manager")
        self.other_user = User.objects.create_user(username="other", email="other@example.com", password="password")

        # Бренд і модель
        self.brand = CarBrandModel.objects.create(brand="Toyota")
        self.model = CarModelModel.objects.create(brand=self.brand, model="Corolla")

        # CarPoster
        self.car = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="Nice car",
            original_price=10000,
            original_currency="USD",
            location="Kyiv"
        )

        self.client = APIClient()

    def test_retrieve_car_creates_view(self):
        url = reverse('car-detail', kwargs={'pk': self.car.id})
        with patch("apps.car.views.register_car_view") as mock_register:
            response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        mock_register.assert_called_once()

    def test_update_description_with_bad_words(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('car-detail', kwargs={'pk': self.car.id})
        with patch("core.services.banned_words_service.contains_bad_words", return_value=True):
            response = self.client.patch(url, {"description": "bad word"}, format='json')

        self.car.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.car.status, "draft")
        self.assertEqual(self.car.edit_attempts, 1)
        self.assertIn("⚠️", response.data["message"])

    def test_update_description_inactive_after_three_attempts(self):
        self.client.force_authenticate(user=self.user)
        self.car.edit_attempts = 2
        self.car.save()
        url = reverse('car-detail', kwargs={'pk': self.car.id})

        with patch("core.services.banned_words_service.contains_bad_words", return_value=True), \
             patch("core.services.email_service.EmailService.manager_email_for_car_poster_edit") as mock_email:
            response = self.client.patch(url, {"description": "bad again"}, format='json')

        self.car.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.car.status, "inactive")
        self.assertEqual(self.car.edit_attempts, 3)
        mock_email.assert_called_once()

    def test_update_price_and_currency(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('car-detail', kwargs={'pk': self.car.id})

        new_price = 20000
        new_currency = "USD"

        with patch("core.services.currency_conversion_utils.apply_currency_conversion") as mock_convert:
            mock_convert.return_value = {
                "price_usd": new_price,
                "price_eur": 18000,
                "price_uah": 750000,
                "exchange_rate_used": {"USD": "1.0", "EUR": "0.9", "UAH": "37.5"}
            }
            response = self.client.patch(url, {"original_price": new_price, "original_currency": new_currency}, format='json')

        self.car.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.car.original_price, new_price)
        self.assertEqual(self.car.price_eur, 18000)
        self.assertEqual(self.car.price_uah, 750000)

    def test_update_location_brand_model(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('car-detail', kwargs={'pk': self.car.id})

        new_location = "Lviv"
        new_brand = CarBrandModel.objects.create(brand="Honda")
        new_model = CarModelModel.objects.create(brand=new_brand, model="Civic")

        response = self.client.patch(url, {
            "location": new_location,
            "brand_id": new_brand.id,
            "model_id": new_model.id
        }, format='json')

        self.car.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.car.location, new_location)
        self.assertEqual(self.car.brand, new_brand)
        self.assertEqual(self.car.model, new_model)

    def test_permissions_owner_vs_other_user(self):
        self.client.force_authenticate(user=self.other_user)
        url = reverse('car-detail', kwargs={'pk': self.car.id})

        response = self.client.patch(url, {"description": "Try change"}, format='json')
        self.assertEqual(response.status_code, 403)

    def test_permissions_manager_can_edit(self):
        self.client.force_authenticate(user=self.manager)
        url = reverse('car-detail', kwargs={'pk': self.car.id})

        response = self.client.patch(url, {"description": "Manager change"}, format='json')
        self.assertEqual(response.status_code, 200)
        self.car.refresh_from_db()
        self.assertEqual(self.car.description, "Manager change")