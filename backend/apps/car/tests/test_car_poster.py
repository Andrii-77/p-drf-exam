from unittest.mock import patch

from django.test import TestCase

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel
from apps.car.serializers import CarPosterSerializer
from apps.user.models import UserModel


class TestCarPoster(TestCase):

    def setUp(self):
        # Створюємо користувача з email
        self.user = UserModel.objects.create_user(
            email="user1@example.com",
            password="pass123"
        )

        # Унікальні бренди і моделі для тестів
        self.brand = CarBrandModel.objects.create(brand="ToyotaTest")
        self.model = CarModelModel.objects.create(
            brand=self.brand,
            model="CamryTest"
        )

    # -----------------------------------------------------------------------------------
    # CREATE TESTS
    # -----------------------------------------------------------------------------------
    @patch("apps.car.serializers.apply_currency_conversion")
    def test_create_carposter_sets_status_active(self, mocked_conversion):
        mocked_conversion.return_value = {
            "price_usd": 10000,
            "price_eur": 9500,
            "price_uah": 400000,
            "exchange_rate_used": "test"
        }

        data = {
            "brand_id": self.brand.id,
            "model_id": self.model.id,
            "description": "Very good car",
            "original_price": 10000,
            "original_currency": "USD",
            "location": "Kyiv"
        }

        serializer = CarPosterSerializer(data=data, context={"request": self._fake_request(self.user)})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        obj = serializer.save(user=self.user)

        self.assertEqual(obj.status, "active")
        self.assertEqual(obj.edit_attempts, 0)

    @patch("apps.car.serializers.contains_bad_words", return_value=True)
    @patch("apps.car.serializers.apply_currency_conversion")
    def test_create_carposter_with_bad_words_sets_status_draft(self, mocked_conversion, mocked_bad_words):
        mocked_conversion.return_value = {
            "price_usd": 10000,
            "price_eur": 9500,
            "price_uah": 400000,
            "exchange_rate_used": "test"
        }

        data = {
            "brand_id": self.brand.id,
            "model_id": self.model.id,
            "description": "badword",
            "original_price": 10000,
            "original_currency": "USD",
            "location": "Lviv"
        }

        serializer = CarPosterSerializer(data=data, context={"request": self._fake_request(self.user)})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        obj = serializer.save(user=self.user)

        self.assertEqual(obj.status, "draft")
        self.assertEqual(obj.edit_attempts, 0)

    # -----------------------------------------------------------------------------------
    # UPDATE TESTS
    # -----------------------------------------------------------------------------------
    @patch("apps.car.serializers.contains_bad_words", return_value=True)
    @patch("apps.car.serializers.EmailService.manager_email_for_car_poster_edit")
    @patch("apps.car.serializers.apply_currency_conversion")
    def test_update_increments_edit_attempts_and_triggers_email(self, mocked_conversion, mocked_email, mocked_bad_words):
        mocked_conversion.return_value = {
            "price_usd": 5000,
            "price_eur": 4500,
            "price_uah": 200000,
            "exchange_rate_used": "test"
        }

        car = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="clean",
            original_price=5000,
            original_currency="USD",
            price_usd=5000,
            price_eur=4500,
            price_uah=200000,
            exchange_rate_used="test",
            location="Kyiv",
            status="active"
        )

        # Симулюємо 3 редагування для перевірки EmailService
        car.edit_attempts = 2
        car.save()

        serializer = CarPosterSerializer(
            instance=car,
            data={
                "description": "badword",
                "original_price": car.original_price,
                "original_currency": car.original_currency
            },
            partial=True,
            context={"request": self._fake_request(self.user)}
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()

        self.assertEqual(updated.edit_attempts, 3)
        self.assertEqual(updated.status, "inactive")
        mocked_email.assert_called_once_with(car=updated)

    @patch("apps.car.serializers.contains_bad_words", return_value=False)
    @patch("apps.car.serializers.apply_currency_conversion")
    def test_update_resets_edit_attempts_if_no_bad_words(self, mocked_conversion, mocked_bad_words):
        mocked_conversion.return_value = {
            "price_usd": 5000,
            "price_eur": 4500,
            "price_uah": 200000,
            "exchange_rate_used": "test"
        }

        car = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="old text",
            original_price=5000,
            original_currency="USD",
            price_usd=5000,
            price_eur=4500,
            price_uah=200000,
            exchange_rate_used="test",
            location="Kyiv",
            status="draft",
            edit_attempts=2
        )

        serializer = CarPosterSerializer(
            instance=car,
            data={
                "description": "clean",
                "original_price": car.original_price,
                "original_currency": car.original_currency
            },
            partial=True,
            context={"request": self._fake_request(self.user)}
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()

        self.assertEqual(updated.edit_attempts, 0)
        self.assertEqual(updated.status, "active")

    @patch("apps.car.serializers.contains_bad_words", return_value=True)
    @patch("apps.car.serializers.EmailService.manager_email_for_car_poster_edit")
    @patch("apps.car.serializers.apply_currency_conversion")
    def test_update_with_bad_words_less_than_three_attempts_does_not_trigger_email(self, mocked_conversion, mocked_email, mocked_bad_words):
        mocked_conversion.return_value = {
            "price_usd": 5000,
            "price_eur": 4500,
            "price_uah": 200000,
            "exchange_rate_used": "test"
        }

        car = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="old clean",
            original_price=5000,
            original_currency="USD",
            price_usd=5000,
            price_eur=4500,
            price_uah=200000,
            exchange_rate_used="test",
            location="Kyiv",
            status="active",
            edit_attempts=1  # менше 3
        )

        serializer = CarPosterSerializer(
            instance=car,
            data={
                "description": "badword",
                "original_price": car.original_price,
                "original_currency": car.original_currency
            },
            partial=True,
            context={"request": self._fake_request(self.user)}
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()

        self.assertEqual(updated.edit_attempts, 2)
        self.assertEqual(updated.status, "draft")
        mocked_email.assert_not_called()

    # -----------------------------------------------------------------------------------
    # HELPER
    # -----------------------------------------------------------------------------------
    def _fake_request(self, user):
        """Створюємо фейковий request з користувачем для serializer.context"""
        class FakeReq:
            pass

        req = FakeReq()
        req.user = user
        return req