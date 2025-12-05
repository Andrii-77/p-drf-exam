from datetime import timedelta
from decimal import Decimal
from types import SimpleNamespace

from django.test import RequestFactory, TestCase
from django.utils import timezone

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel
from apps.statistic.models import CarViewModel
from apps.statistic.services import can_register_view, get_average_prices, get_view_counts, register_car_view
from apps.user.models import UserModel


class StatisticServicesTests(TestCase):
    def setUp(self):
        # Створюємо користувача, бренд і модель
        self.user = UserModel.objects.create_user(email="owner@example.com", password="pass")
        self.brand = CarBrandModel.objects.create(brand="Toyota")
        self.model = CarModelModel.objects.create(brand=self.brand, model="Camry")

        # Створюємо авто (усі авто мають user, щоб не було IntegrityError)
        self.car1 = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="Car 1",
            original_price=Decimal("1000.00"),
            original_currency="USD",
            price_usd=Decimal("1000.00"),
            price_eur=Decimal("900.00"),
            price_uah=Decimal("40000.00"),
            location="Kyiv",
        )

        self.car2 = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="Car 2",
            original_price=Decimal("2000.00"),
            original_currency="USD",
            price_usd=Decimal("2000.00"),
            price_eur=Decimal("1800.00"),
            price_uah=Decimal("80000.00"),
            location="Kyiv",
        )

        self.car3 = CarPosterModel.objects.create(
            user=self.user,
            brand=self.brand,
            model=self.model,
            description="Car 3",
            original_price=Decimal("3000.00"),
            original_currency="USD",
            price_usd=Decimal("3000.00"),
            price_eur=Decimal("2700.00"),
            price_uah=Decimal("120000.00"),
            location="Lviv",
        )

        # RequestFactory для створення "request" у тестах
        self.factory = RequestFactory()

    def test_get_average_prices(self):
        """
        Перевіряємо, що:
        - region_average_price бере тільки авто з тієї ж локації (окрім поточного)
        - country_average_price бере всі авто тієї ж моделі/бренду (окрім поточного)
        """
        res = get_average_prices(self.car1)

        # region: тільки car2 (Kyiv), тому usd = 2000, eur = 1800, uah = 80000
        self.assertEqual(res["region_average_price"]["usd"], 2000)
        self.assertEqual(res["region_average_price"]["eur"], 1800)
        self.assertEqual(res["region_average_price"]["uah"], 80000)

        # country: car2 + car3 => avg usd = (2000+3000)/2 = 2500, eur = 2250, uah = 100000
        self.assertEqual(res["country_average_price"]["usd"], 2500)
        self.assertEqual(res["country_average_price"]["eur"], 2250)
        self.assertEqual(res["country_average_price"]["uah"], 100000)

    def test_get_view_counts(self):
        """
        Створюємо перегляди з різними timestamp і перевіряємо підрахунки:
        total, daily (24h), weekly (7d), monthly (30d recent)
        """
        now = timezone.now()

        # Створюємо перегляди
        CarViewModel.objects.create(car=self.car1, timestamp=now)  # сьогодні
        CarViewModel.objects.create(car=self.car1, timestamp=now - timedelta(hours=2))  # сьогодні
        CarViewModel.objects.create(car=self.car1, timestamp=now - timedelta(days=2))  # 2 дні тому
        CarViewModel.objects.create(car=self.car1, timestamp=now - timedelta(days=10))  # 10 днів тому
        CarViewModel.objects.create(car=self.car1, timestamp=now - timedelta(days=31))  # за межами місяця

        counts = get_view_counts(self.car1)

        self.assertEqual(counts["total_views"], 5)  # усі записи
        self.assertEqual(counts["daily_views"], 2)  # сьогодні + 2 години тому
        self.assertEqual(counts["weekly_views"], 3)  # сьогодні, 2 дні, 10 днів назад
        self.assertEqual(counts["monthly_views"], 4)  # всі крім 31 день назад

    def test_can_register_view(self):
        """
        Перевіряємо правила у can_register_view:
        - якщо user вже був за останню годину => False
        - якщо ip вже був => False
        - якщо session_key вже був => False
        - якщо немає ідентифікатора => True
        """
        now = timezone.now()

        # 1) user case: створюємо новий реальний користувача (не MagicMock)
        other_user = UserModel.objects.create_user(email="u2@example.com", password="p")
        CarViewModel.objects.create(car=self.car1, user=other_user, timestamp=now)
        self.assertFalse(can_register_view(self.car1, user=other_user))

        # 2) ip case
        ip = "123.123.123.123"
        CarViewModel.objects.create(car=self.car1, ip_address=ip, timestamp=now)
        self.assertFalse(can_register_view(self.car1, ip_address=ip))

        # 3) session case
        session_key = "sess-1"
        CarViewModel.objects.create(car=self.car1, session_key=session_key, timestamp=now)
        self.assertFalse(can_register_view(self.car1, session_key=session_key))

        # 4) no identifier -> allow
        self.assertTrue(can_register_view(self.car1))

    def test_register_car_view_creates_view(self):
        """
        Перевіряємо, що register_car_view створює CarViewModel,
        зберігає ip і session_key, і не встановлює user для анонімного запиту.
        """
        request = self.factory.get("/")
        # анонімний користувач
        request.user = SimpleNamespace(is_authenticated=False)
        # підроблена сесія: create встановлює session_key
        class DummySession:
            def __init__(self):
                self.session_key = None
            def create(self):
                self.session_key = "session1"
        request.session = DummySession()
        request.META = {"REMOTE_ADDR": "1.2.3.4"}

        register_car_view(request, self.car1)

        self.assertEqual(CarViewModel.objects.count(), 1)
        v = CarViewModel.objects.first()
        self.assertEqual(v.car, self.car1)
        self.assertEqual(v.ip_address, "1.2.3.4")
        self.assertEqual(v.session_key, "session1")
        self.assertIsNone(v.user)

    def test_register_car_view_skips_owner(self):
        """
        Якщо запит від власника — перегляд не реєструється.
        """
        request = self.factory.get("/")
        # owner
        request.user = self.user
        request.session = SimpleNamespace(session_key="sess")
        request.META = {}

        register_car_view(request, self.car1)

        self.assertEqual(CarViewModel.objects.count(), 0)