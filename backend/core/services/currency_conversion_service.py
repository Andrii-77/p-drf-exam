from datetime import date
from decimal import ROUND_HALF_UP, Decimal

from django.db.models import Max

import requests

from apps.exchange_rates.models import ExchangeRate


class CurrencyConverter:

    @staticmethod
    def get_latest_rates():
        latest_date = ExchangeRate.objects.aggregate(latest=Max("date"))["latest"]
        if not latest_date:
            raise ValueError("Курси валют не знайдено.")
        rates = ExchangeRate.objects.filter(date=latest_date)
        return {r.currency: Decimal(str(r.rate)) for r in rates}

    @staticmethod
    def get_today_rates_from_api():
        url = "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5"
        response = requests.get(url)
        data = response.json()

        rates = {}
        for item in data:
            if item["ccy"] in ["USD", "EUR"] and item["base_ccy"] == "UAH":
                rate = Decimal(item["sale"])
                ExchangeRate.objects.update_or_create(
                    currency=item["ccy"],
                    date=date.today(),
                    defaults={"rate": rate}
                )
                rates[item["ccy"]] = rate
        return rates

    @staticmethod
    def convert_price(price: Decimal, currency: str, rates: dict) -> dict:
        if currency == "UAH":
            price_uah = price
        else:
            price_uah = (price * rates[currency]).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        price_usd = (price_uah / rates["USD"]).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        price_eur = (price_uah / rates["EUR"]).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        return {
            "price_uah": price_uah,
            "price_usd": price_usd,
            "price_eur": price_eur,
            "exchange_rate_used": {k: str(v) for k, v in rates.items()}
        }
