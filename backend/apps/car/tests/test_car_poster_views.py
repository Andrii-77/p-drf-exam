from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APITestCase

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel

User = get_user_model()


class TestCarRetrieveUpdateDestroyView(APITestCase):
    def setUp(self):
        # Створюємо користувача
        self.user = User.objects.create_user(
            email='user@example.com', password='password', role='seller', account_type='premium'
        )
        self.client.force_authenticate(user=self.user)

        # Створюємо бренд та модель авто
        self.brand = CarBrandModel.objects.create(brand='TestBrand')
        self.model = CarModelModel.objects.create(brand=self.brand, model='TestModel')

        # Створюємо оголошення авто
        self.car = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description='Test car description',
            original_price=Decimal('10000.00'),
            original_currency='USD'
        )

        self.url = reverse('car-detail', kwargs={'pk': self.car.id})

        # Мок конвертації
        self.mock_conversion = {
            "price_uah": Decimal('400000.00'),
            "price_usd": Decimal('10000.00'),
            "price_eur": Decimal('9200.00'),
            "exchange_rate_used": {"USD": "40.00", "EUR": "43.48"}
        }

    # --- Тест оновлення опису з поганими словами ---
    @patch('apps.car.serializers.contains_bad_words')
    @patch('apps.car.serializers.apply_currency_conversion')
    def test_update_description_with_bad_words(self, mock_convert, mock_bad_words):
        mock_convert.return_value = self.mock_conversion
        mock_bad_words.return_value = True  # Завжди вважаємо, що є погане слово

        data = {
            "description": "погане слово",
            "original_price": self.car.original_price,
            "original_currency": self.car.original_currency
        }
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('draft', response.data['status'])

    # --- Тест оновлення після трьох спроб ---
    @patch('apps.car.serializers.contains_bad_words')
    @patch('apps.car.serializers.apply_currency_conversion')
    def test_update_description_inactive_after_three_attempts(self, mock_convert, mock_bad_words):
        mock_convert.return_value = self.mock_conversion
        mock_bad_words.return_value = True

        self.car.edit_attempts = 3
        self.car.save()

        data = {
            "description": "погане слово вдруге",
            "original_price": self.car.original_price,
            "original_currency": self.car.original_currency
        }
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'inactive')

    # --- Тест оновлення location, brand, model ---
    @patch('apps.car.serializers.apply_currency_conversion')
    def test_update_location_brand_model(self, mock_convert):
        mock_convert.return_value = self.mock_conversion
        new_brand = CarBrandModel.objects.create(brand='NewBrand')
        new_model = CarModelModel.objects.create(brand=new_brand, model='NewModel')
        data = {
            "location": "New Location",
            "brand_id": new_brand.id,
            "model_id": new_model.id,
            "original_price": self.car.original_price,
            "original_currency": self.car.original_currency
        }
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['location'], 'New Location')
        self.assertEqual(response.data['brand']['id'], new_brand.id)
        self.assertEqual(response.data['model']['id'], new_model.id)

    # --- Тест оновлення ціни і валюти ---
    @patch('apps.car.serializers.apply_currency_conversion')
    def test_update_price_and_currency(self, mock_convert):
        mock_convert.return_value = self.mock_conversion
        data = {
            "original_price": Decimal('20000.00'),
            "original_currency": "EUR"
        }
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Decimal(response.data['original_price']), Decimal('20000.00'))
        self.assertEqual(response.data['original_currency'], 'EUR')
        self.assertIn('price_usd', response.data)
        self.assertIn('price_eur', response.data)
        self.assertIn('price_uah', response.data)

    # --- Тест прав менеджера ---
    @patch('apps.car.serializers.apply_currency_conversion')
    def test_permissions_manager_can_edit(self, mock_convert):
        mock_convert.return_value = self.mock_conversion
        manager = User.objects.create_user(
            email='manager@example.com', password='password', role='manager'
        )
        self.client.force_authenticate(user=manager)
        data = {
            "description": "Updated by manager",
            "original_price": self.car.original_price,
            "original_currency": self.car.original_currency
        }
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['description'], "Updated by manager")

    # --- Тест, що POST на detail ендпоінт заборонений ---
    def test_post_method_not_allowed(self):
        data = {
            "description": "Спроба створити авто",
            "brand_id": self.brand.id,
            "model_id": self.model.id,
            "original_price": Decimal('15000.00'),
            "original_currency": "USD"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 405)