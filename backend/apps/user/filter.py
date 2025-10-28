from django.contrib.auth import get_user_model

import django_filters

UserModel = get_user_model()


class UserFilter(django_filters.FilterSet):
    """
    Фільтрація користувачів за роллю, типом акаунта та активністю.
    Підтримує query-параметри:
    - ?role=seller
    - ?account_type=premium
    - ?is_active=true / false
    """

    role = django_filters.CharFilter(field_name="role", lookup_expr="iexact")
    account_type = django_filters.CharFilter(field_name="account_type", lookup_expr="iexact")
    is_active = django_filters.BooleanFilter(field_name="is_active")

    class Meta:
        model = UserModel
        fields = ["role", "account_type", "is_active"]