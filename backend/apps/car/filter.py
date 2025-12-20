from django_filters import rest_framework as filters

from apps.car.models import CarPosterModel, StatusChoices


class CarFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=StatusChoices.choices)

    price_usd_min = filters.NumberFilter(field_name='price_usd', lookup_expr='gte')
    price_usd_max = filters.NumberFilter(field_name='price_usd', lookup_expr='lte')
    price_usd_range = filters.RangeFilter(field_name='price_usd')
    price_usd_in = filters.BaseInFilter(field_name='price_usd')

    # Приймаємо brand/model як ID (exact) — зручно для фронту, який посилає id
    brand = filters.NumberFilter(field_name='brand__id', lookup_expr='exact')
    model = filters.NumberFilter(field_name='model__id', lookup_expr='exact')

    # Додаткові фільтри по імені (якщо потрібно)
    brand_name = filters.CharFilter(field_name='brand__brand', lookup_expr='iexact')
    brand_contains = filters.CharFilter(field_name='brand__brand', lookup_expr='icontains')
    model_name = filters.CharFilter(field_name='model__model', lookup_expr='iexact')
    model_contains = filters.CharFilter(field_name='model__model', lookup_expr='icontains')

    class Meta:
        model = CarPosterModel
        fields = [
            'status',
            'price_usd_min', 'price_usd_max', 'price_usd_range', 'price_usd_in',
            'brand', 'brand_name', 'brand_contains',
            'model', 'model_name', 'model_contains',
        ]