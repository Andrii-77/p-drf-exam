from datetime import date
from decimal import Decimal

from django.core.management.base import BaseCommand

import requests

from apps.car.models import CarPosterModel
from apps.exchange_rates.models import ExchangeRate


class Command(BaseCommand):
    help = "Оновити курси валют та перерахувати ціни в оголошеннях"

    def handle(self, *args, **kwargs):
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

        usd = rates.get("USD")
        eur = rates.get("EUR")

        for listing in CarPosterModel.objects.all():
            price = listing.original_price
            currency = listing.original_currency

            if currency == "USD":
                uah = price * usd
                eur_calc = uah / eur
                listing.price_usd = price
                listing.price_uah = uah
                listing.price_eur = eur_calc
            elif currency == "EUR":
                uah = price * eur
                usd_calc = uah / usd
                listing.price_eur = price
                listing.price_uah = uah
                listing.price_usd = usd_calc
            elif currency == "UAH":
                listing.price_uah = price
                listing.price_usd = price / usd
                listing.price_eur = price / eur

            listing.exchange_rate_used = {
                "USD": str(usd),
                "EUR": str(eur)
            }
            listing.save()

        self.stdout.write(self.style.SUCCESS("✅ Курси оновлено, оголошення перераховані"))
