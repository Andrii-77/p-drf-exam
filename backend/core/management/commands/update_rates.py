from django.core.management.base import BaseCommand

from core.services.currency_conversion_service import CurrencyConverter

from apps.car.models import CarPosterModel


class Command(BaseCommand):
    help = "Оновити курси валют та перерахувати ціни в оголошеннях"

    def handle(self, *args, **kwargs):
        rates = CurrencyConverter.get_today_rates_from_api()

        for listing in CarPosterModel.objects.all():
            converted = CurrencyConverter.convert_price(
                price=listing.original_price,
                currency=listing.original_currency,
                rates=rates
            )
            listing.price_uah = converted["price_uah"]
            listing.price_usd = converted["price_usd"]
            listing.price_eur = converted["price_eur"]
            listing.exchange_rate_used = converted["exchange_rate_used"]
            listing.save()

        self.stdout.write(self.style.SUCCESS("✅ Курси оновлено, оголошення перераховані"))