import logging

from rest_framework import serializers

from core.services.banned_words_service import contains_bad_words
from core.services.currency_conversion_utils import apply_currency_conversion
from core.services.email_service import EmailService

from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel
from apps.statistic.services import get_average_prices, get_view_counts
from apps.user.utils.access import has_premium_access

logger = logging.getLogger(__name__)


class CarBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrandModel
        # fields = ('id', 'brand', 'updated_at', 'created_at')
        fields = ('brand',)


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModelModel
        # fields = ('id', 'brand', 'model', 'updated_at', 'created_at')
        fields = ('model',)


class CarPosterSerializer(serializers.ModelSerializer):
    # brand = CarBrandSerializer(read_only=True)
    # model = CarModelSerializer(read_only=True)
    brand = CarBrandSerializer
    model = CarModelSerializer
    region_average_price = serializers.SerializerMethodField()
    country_average_price = serializers.SerializerMethodField()
    total_views = serializers.SerializerMethodField()
    daily_views = serializers.SerializerMethodField()
    weekly_views = serializers.SerializerMethodField()
    monthly_views = serializers.SerializerMethodField()
    stats_message = serializers.SerializerMethodField()

    class Meta:
        model = CarPosterModel
        fields = ('id', 'brand', 'model', 'description', 'original_price', 'original_currency', 'price_usd',
                  'price_eur', 'price_uah', 'exchange_rate_used', 'location', 'status', 'edit_attempts',
                  'region_average_price', 'country_average_price', 'total_views', 'daily_views', 'weekly_views',
                  'monthly_views', 'stats_message', 'updated_at', 'created_at')
        # read_only_fields = ['status', 'edit_attempts']  # щоб не підміняли вручну

    def validate_original_price(self, original_price):
        if original_price <= 0:
            raise serializers.ValidationError('Price must be greater than 0.')
        return original_price

    def validate(self, attrs):
        price = attrs.get('original_price')
        currency = attrs.get('original_currency')

        if not price:
            raise serializers.ValidationError("Щоб змінити валюту, також передайте ціну.")
        if not currency:
            raise serializers.ValidationError("Щоб змінити ціну, також передайте валюту.")

        converted = apply_currency_conversion(price, currency)
        attrs.update(converted)
        return attrs

    def _can_view_stats(self, obj):
        user = self.context['request'].user
        return has_premium_access(user, obj.user)

    def get_stats_message(self, obj):
        if not self._can_view_stats(obj):
            return "Статистика доступна тільки для преміум-продавця власника оголошення, менеджера або адміністратора"
        return None

    def get_region_average_price(self, obj):
        if self._can_view_stats(obj):
            return get_average_prices(obj)['region_average_price']
        return None

    def get_country_average_price(self, obj):
        if self._can_view_stats(obj):
            return get_average_prices(obj)['region_average_price']
        return None

    def get_total_views(self, obj):
        if self._can_view_stats(obj):
            return get_view_counts(obj)['total_views']
        return None

    def get_daily_views(self, obj):
        if self._can_view_stats(obj):
            return get_view_counts(obj)['daily_views']
        return None

    def get_weekly_views(self, obj):
        if self._can_view_stats(obj):
            return get_view_counts(obj)['weekly_views']
        return None

    def get_monthly_views(self, obj):
        if self._can_view_stats(obj):
            return get_view_counts(obj)['monthly_views']
        return None

    def create(self, validated_data):
        description = validated_data.get('description', '')
        if contains_bad_words(description):
            validated_data['status'] = 'draft'
            # validated_data['edit_attempts'] = 1
        else:
            validated_data['status'] = 'active'
            # validated_data['edit_attempts'] = 0
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Спочатку оновлюємо всі звичайні поля (включно з description)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Тепер обробляємо модерацію description
        description = validated_data.get('description', instance.description)

        if contains_bad_words(description):
            # збільшуємо кількість спроб редагування
            instance.edit_attempts += 1

            if instance.edit_attempts >= 3:
                instance.status = 'inactive'
                EmailService.manager_email_for_car_poster_edit(car=instance)
            else:
                instance.status = 'draft'

        else:
            instance.status = 'active'
            instance.edit_attempts = 0  # скидаємо лічильник при успішній модерації

        instance.description = description

        if 'original_price' in validated_data and 'original_currency' in validated_data:
            converted = apply_currency_conversion(
                validated_data['original_price'],
                validated_data['original_currency']
            )
            instance.price_usd = converted['price_usd']
            instance.price_eur = converted['price_eur']
            instance.price_uah = converted['price_uah']
            instance.exchange_rate_used = converted['exchange_rate_used']

        instance.save()
        return instance


class BannedWordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannedWordsModel
        fields = ('id', 'word', 'updated_at', 'created_at')
