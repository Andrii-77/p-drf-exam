import django_filters

from .models import SupportRequestModel


class SupportRequestFilter(django_filters.FilterSet):
    type = django_filters.CharFilter(field_name="type", lookup_expr="iexact")
    processed = django_filters.BooleanFilter(field_name="processed")
    # brand = django_filters.CharFilter(field_name="brand__brand", lookup_expr="icontains")
    brand = django_filters.NumberFilter(field_name="brand__id")
    model_name = django_filters.CharFilter(field_name="model_name", lookup_expr="icontains")
    text = django_filters.CharFilter(field_name="text", lookup_expr="icontains")  # 🔑 новий фільтр

    class Meta:
        model = SupportRequestModel
        fields = ["type", "processed", "brand", "model_name", "text"]