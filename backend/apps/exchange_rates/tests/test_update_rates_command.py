from decimal import Decimal

from django.test import TestCase

from core.tasks import update_exchange_rates_task

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel
from apps.user.models import UserModel


class UpdateRatesCommandTests(TestCase):
    def setUp(self):
        # Створюємо користувача
        self.user = UserModel.objects.create_user(
            email="test@example.com",
            password="password"
        )
        # Створюємо бренд і модель
        self.brand = CarBrandModel.objects.create(brand="Toyota")
        self.model = CarModelModel.objects.create(brand=self.brand, model="Camry")

    def test_command_updates_car_prices(self):
        # Створюємо авто
        car = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="Test car",
            original_price=Decimal("4000.00"),
            original_currency="USD",
            location="Kyiv"
        )

        # Мокнімо задачу, щоб одразу виконати
        update_exchange_rates_task()

        car.refresh_from_db()

        # Тестуємо, що конвертація пройшла
        self.assertIsNotNone(car.price_usd)
        self.assertIsNotNone(car.price_eur)
        self.assertIsNotNone(car.price_uah)