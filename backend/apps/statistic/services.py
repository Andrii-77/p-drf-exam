from datetime import timedelta

from django.db.models import Avg
from django.utils import timezone

from apps.car.models import CarPosterModel
from apps.statistic.models import CarViewModel


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

# Щоб уникати повторних звернень до БД
def get_view_counts(car):
    now_ts = timezone.now()
    day_ago = now_ts - timedelta(days=1)
    week_ago = now_ts - timedelta(weeks=1)
    month_ago = now_ts - timedelta(days=30)

    recent_views = CarViewModel.objects.filter(car=car, timestamp__gte=month_ago)

    return {
        "total_views": CarViewModel.objects.filter(car=car).count(),  # залишаємо окремо
        "daily_views": recent_views.filter(timestamp__gte=day_ago).count(),
        "weekly_views": recent_views.filter(timestamp__gte=week_ago).count(),
        "monthly_views": recent_views.count(),
    }