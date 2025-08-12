from django_filters import rest_framework as filters

from apps.car.models import CarPosterModel, StatusChoices


class CarFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=StatusChoices.choices)
    price_usd_min = filters.NumberFilter(field_name='price_usd', lookup_expr='gte')
    price_usd_max = filters.NumberFilter(field_name='price_usd', lookup_expr='lte')
    price_usd_range = filters.RangeFilter(field_name='price_usd')  # range_min=2&range_max=100
    price_usd_in = filters.BaseInFilter(field_name='price_usd')  # price_in=30,25,2000
    brand = filters.CharFilter(field_name='brand__brand', lookup_expr='iexact')
    brand_contains = filters.CharFilter(field_name='brand__brand', lookup_expr='icontains')
    model = filters.CharFilter(field_name='model__model', lookup_expr='iexact')
    model_contains = filters.CharFilter(field_name='model__model', lookup_expr='icontains')
    order = filters.OrderingFilter(
        fields=(
            'id',
            'brand',
            'model',
            'price_usd',
        )
    )

    class Meta:
        model = CarPosterModel
        fields = [
            'status',
            'price_usd_min', 'price_usd_max', 'price_usd_range', 'price_usd_in',
            'brand', 'brand_contains',
            'model', 'model_contains',
            'order',
        ]

    # lt = filters.NumberFilter(field_name='original_price', lookup_expr='lt')
    # gt = filters.NumberFilter(field_name='original_price', lookup_expr='gt')

