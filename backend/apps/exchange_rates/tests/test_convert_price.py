from decimal import ROUND_HALF_UP, Decimal

from django.test import TestCase

from core.services.currency_conversion_service import CurrencyConverter


class ConvertPriceTests(TestCase):
    def setUp(self):
        # Фіксовані курси для тесту
        self.rates = {
            "USD": Decimal("40.00"),
            "EUR": Decimal("45.00")
        }

    def test_convert_from_usd(self):
        price_usd = Decimal("1600.00")
        res = CurrencyConverter.convert_price(price_usd, "USD", self.rates)
        expected_eur = (price_usd * self.rates["USD"] / self.rates["EUR"]).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        self.assertEqual(res["price_eur"], expected_eur)

    def test_convert_from_eur(self):
        price_eur = Decimal("2025.00")
        res = CurrencyConverter.convert_price(price_eur, "EUR", self.rates)
        expected_usd = (price_eur * self.rates["EUR"] / self.rates["USD"]).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        self.assertEqual(res["price_usd"], expected_usd)