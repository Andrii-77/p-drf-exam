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


def get_client_ip(request):
    """Отримує IP-адресу користувача з запиту."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')


def can_register_view(car, ip_address=None, session_key=None, user=None):
    """
    Перевіряє, чи можна зареєструвати перегляд авто.
    Один перегляд за годину з user / session / IP.
    """
    time_limit = timezone.now() - timedelta(hours=1)

    filters = {
        'car': car,
        'timestamp__gte': time_limit,  # Якщо використовувати created_at то прописати: 'created_at__gte': time_limit
    }

    if user and user.is_authenticated:
        filters['user'] = user
    elif session_key:
        filters['session_key'] = session_key
    elif ip_address:
        filters['ip_address'] = ip_address
    else:
        # return False  # немає способу ідентифікувати — не реєструємо
        return True # немає жодної ідентифікації — але дозволяємо реєстрацію (перегляд унікальний)

    return not CarViewModel.objects.filter(**filters).exists()


def register_car_view(request, car):
    """
    Реєструє перегляд оголошення, якщо дозволено.
    Не враховує перегляд власника.
    """
    user = request.user if request.user.is_authenticated else None
    ip_address = get_client_ip(request) or "unknown"
    session_key = request.session.session_key

    if not session_key:
        request.session.create()
        session_key = request.session.session_key

    session_key = session_key or "anonymous"

    if user and car.user == user:
        return  # Не враховуємо перегляд власника

    if can_register_view(car, ip_address=ip_address, session_key=session_key, user=user):
        CarViewModel.objects.create(
            car=car,
            ip_address=ip_address or "unknown",
            session_key=session_key or "anonymous",
            user=user
        )
