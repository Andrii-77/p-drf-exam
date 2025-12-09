from decimal import Decimal
from unittest import TestCase
from unittest.mock import MagicMock, patch

from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel
from apps.car.serializers import CarPosterSerializer


class TestCarPoster(TestCase):

    def setUp(self):
        # Створюємо бренд і модель
        self.brand = CarBrandModel.objects.create(brand="Toyota")
        self.model = CarModelModel.objects.create(brand=self.brand, model="Corolla")

        # Створюємо користувача
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.user = User.objects.create_user(username="user1", password="pass123")

        # Створюємо banned word
        self.banned_word = BannedWordsModel.objects.create(word="badword")

        # Базові дані для CarPoster
        self.valid_data = {
            "brand_id": self.brand.id,
            "model_id": self.model.id,
            "description": "Nice car",
            "original_price": Decimal("10000"),
            "original_currency": "USD",
            "location": "Kyiv"
        }

    @patch("core.services.currency_conversion_utils.apply_currency_conversion")
    def test_create_carposter_sets_status_active(self, mock_convert):
        mock_convert.return_value = {
            "price_usd": Decimal("10000"),
            "price_eur": Decimal("9200"),
            "price_uah": Decimal("370000"),
            "exchange_rate_used": {"USD": "1", "EUR": "0.92", "UAH": "37"}
        }

        request = MagicMock()
        request.user = self.user

        serializer = CarPosterSerializer(data=self.valid_data, context={"request": request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        car = serializer.save(user=self.user)

        self.assertEqual(car.status, "active")
        self.assertEqual(car.price_usd, Decimal("10000"))
        self.assertEqual(car.price_eur, Decimal("9200"))
        self.assertEqual(car.price_uah, Decimal("370000"))

    @patch("core.services.currency_conversion_utils.apply_currency_conversion")
    def test_create_carposter_with_bad_words_sets_status_draft(self, mock_convert):
        mock_convert.return_value = {
            "price_usd": Decimal("10000"),
            "price_eur": Decimal("9200"),
            "price_uah": Decimal("370000"),
            "exchange_rate_used": {"USD": "1", "EUR": "0.92", "UAH": "37"}
        }

        # Додаємо bad word у description
        data = self.valid_data.copy()
        data["description"] = f"This car is {self.banned_word.word}"

        request = MagicMock()
        request.user = self.user

        serializer = CarPosterSerializer(data=data, context={"request": request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        car = serializer.save(user=self.user)

        self.assertEqual(car.status, "draft")

    @patch("core.services.currency_conversion_utils.apply_currency_conversion")
    def test_update_resets_edit_attempts_if_no_bad_words(self, mock_convert):
        mock_convert.return_value = {
            "price_usd": Decimal("10000"),
            "price_eur": Decimal("9200"),
            "price_uah": Decimal("370000"),
            "exchange_rate_used": {"USD": "1", "EUR": "0.92", "UAH": "37"}
        }

        request = MagicMock()
        request.user = self.user

        serializer = CarPosterSerializer(data=self.valid_data, context={"request": request})
        self.assertTrue(serializer.is_valid())
        car = serializer.save(user=self.user)

        # Симулюємо редагування
        car.edit_attempts = 2
        car.save()

        update_data = {"description": "Updated description"}
        serializer = CarPosterSerializer(car, data=update_data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        car = serializer.save()

        self.assertEqual(car.status, "active")
        self.assertEqual(car.edit_attempts, 0)

    @patch("core.services.email_service.EmailService.manager_email_for_car_poster_edit")
    @patch("core.services.currency_conversion_utils.apply_currency_conversion")
    def test_update_increments_edit_attempts_and_triggers_email(self, mock_convert, mock_email):
        mock_convert.return_value = {
            "price_usd": Decimal("10000"),
            "price_eur": Decimal("9200"),
            "price_uah": Decimal("370000"),
            "exchange_rate_used": {"USD": "1", "EUR": "0.92", "UAH": "37"}
        }

        request = MagicMock()
        request.user = self.user

        serializer = CarPosterSerializer(data=self.valid_data, context={"request": request})
        self.assertTrue(serializer.is_valid())
        car = serializer.save(user=self.user)

        update_data = {"description": f"Contains {self.banned_word.word}"}

        # Перша спроба
        serializer = CarPosterSerializer(car, data=update_data, partial=True, context={"request": request})
        serializer.is_valid()
        car = serializer.save()
        self.assertEqual(car.status, "draft")
        self.assertEqual(car.edit_attempts, 1)
        mock_email.assert_not_called()

        # Третя спроба (trigger email)
        car.edit_attempts = 2
        car.save()
        serializer = CarPosterSerializer(car, data=update_data, partial=True, context={"request": request})
        serializer.is_valid()
        car = serializer.save()
        self.assertEqual(car.status, "inactive")
        self.assertEqual(car.edit_attempts, 3)
        mock_email.assert_called_once_with(car)