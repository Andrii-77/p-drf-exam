from django.db.models import Avg

from apps.car.models import CarPosterModel


def get_average_prices(car: CarPosterModel):
    """Повертає середні ціни по регіону та по Україні в USD, EUR, UAH"""

    region_queryset = CarPosterModel.objects.filter(
        brand=car.brand,
        model=car.model,
        location=car.location,
    ).exclude(id=car.id)

    country_queryset = CarPosterModel.objects.filter(
        brand=car.brand,
        model=car.model,
    ).exclude(id=car.id)

    region_avg = region_queryset.aggregate(
        usd=Avg('price_usd'),
        eur=Avg('price_eur'),
        uah=Avg('price_uah'),
    )

    country_avg = country_queryset.aggregate(
        usd=Avg('price_usd'),
        eur=Avg('price_eur'),
        uah=Avg('price_uah'),
    )

    return {
        "region_average_price": {
            "usd": round(region_avg["usd"], 2),
            "eur": round(region_avg["eur"], 2),
            "uah": round(region_avg["uah"], 2),
        },
        "country_average_price": {
            "usd": round(country_avg["usd"], 2),
            "eur": round(country_avg["eur"], 2),
            "uah": round(country_avg["uah"], 2),
        },
    }
