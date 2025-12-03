from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase

from core.services.currency_conversion_service import CurrencyConverter


class GetTodayRatesAPITests(TestCase):

    @patch('core.services.currency_conversion_service.requests.get')
    def test_api_fetch_and_save(self, mock_get):
        mock_get.return_value.json.return_value = [
            {"ccy": "USD", "base_ccy": "UAH", "buy": "38.00", "sale": "39.00"},
            {"ccy": "EUR", "base_ccy": "UAH", "buy": "40.00", "sale": "41.00"},
        ]

        rates = CurrencyConverter.get_today_rates_from_api()
        self.assertEqual(rates["USD"], Decimal("39.00"))