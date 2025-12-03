from decimal import Decimal
from unittest import TestCase
from unittest.mock import MagicMock, patch

from django.utils import timezone

from core.services.currency_conversion_service import CurrencyConverter

from apps.exchange_rates.models import ExchangeRate


class GetTodayRatesAPITests(TestCase):

    @patch("core.services.currency_conversion_service.requests.get")
    def test_api_fetch_and_save(self, mock_get):
        """
        Тестуємо get_today_rates_from_api: мокаємо API ПриватБанку
        і перевіряємо, що курси зберігаються в базі і повертаються словником
        """
        # Мок відповідь API
        mock_get.return_value = MagicMock()
        mock_get.return_value.json.return_value = [
            {"ccy": "USD", "base_ccy": "UAH", "sale": "40.00"},
            {"ccy": "EUR", "base_ccy": "UAH", "sale": "45.00"},
            {"ccy": "RUB", "base_ccy": "UAH", "sale": "0.50"},  # не враховується
        ]

        rates = CurrencyConverter.get_today_rates_from_api()

        # Перевіряємо словник результату
        self.assertEqual(rates["USD"], Decimal("40.00"))
        self.assertEqual(rates["EUR"], Decimal("45.00"))
        self.assertNotIn("RUB", rates)

        # Перевіряємо, що курси збереглися в базі
        usd_rate = ExchangeRate.objects.get(currency="USD", date=timezone.now().date())
        eur_rate = ExchangeRate.objects.get(currency="EUR", date=timezone.now().date())

        self.assertEqual(usd_rate.rate, Decimal("40.00"))
        self.assertEqual(eur_rate.rate, Decimal("45.00"))