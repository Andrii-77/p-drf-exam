from django_filters import rest_framework as filters


class CarFilter(filters.FilterSet):
    lt = filters.NumberFilter(field_name='original_price', lookup_expr='lt')
    gt = filters.NumberFilter(field_name='original_price', lookup_expr='gt')
    range = filters.RangeFilter(field_name='original_price')  # range_min=2&range_max=100
    price_in = filters.BaseInFilter(field_name='original_price')  # price_in=30,25,2000
    order = filters.OrderingFilter(
        fields=(
            'id',
            'brand',
            'model',
            'original_price',
        )
    )

