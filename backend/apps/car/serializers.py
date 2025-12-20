import logging

from rest_framework import serializers

from core.services.banned_words_service import contains_bad_words
from core.services.currency_conversion_utils import apply_currency_conversion
from core.services.email_service import EmailService

from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel
from apps.statistic.services import get_average_prices, get_view_counts
from apps.user.serializers import UserShortSerializer  # 🔹 новий імпорт
from apps.user.utils.access import has_premium_access

logger = logging.getLogger(__name__)


class CarBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrandModel
        fields = ("id", 'brand',)


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModelModel
        fields = ("id", "brand", "model")


class CarPosterSerializer(serializers.ModelSerializer):
    # 🔹 Виводимо бренд і модель у вигляді вкладених об’єктів
    brand = CarBrandSerializer(read_only=True)
    model = CarModelSerializer(read_only=True)

    # 🔹 Приймаємо brand_id і model_id для створення/оновлення
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=CarBrandModel.objects.all(),
        source='brand',
        write_only=True,
        required=True
    )
    model_id = serializers.PrimaryKeyRelatedField(
        queryset=CarModelModel.objects.all(),
        source='model',
        write_only=True,
        required=True
    )

    user = UserShortSerializer(read_only=True)

    region_average_price = serializers.SerializerMethodField()
    country_average_price = serializers.SerializerMethodField()
    total_views = serializers.SerializerMethodField()
    daily_views = serializers.SerializerMethodField()
    weekly_views = serializers.SerializerMethodField()
    monthly_views = serializers.SerializerMethodField()
    stats_message = serializers.SerializerMethodField()

    class Meta:
        model = CarPosterModel
        fields = (
            'id', 'user',
            'brand', 'brand_id',
            'model', 'model_id',
            'description',
            'original_price', 'original_currency',
            'price_usd', 'price_eur', 'price_uah',
            'exchange_rate_used', 'location', 'status', 'edit_attempts',
            'region_average_price', 'country_average_price',
            'total_views', 'daily_views', 'weekly_views', 'monthly_views',
            'stats_message', 'updated_at', 'created_at'
        )

    # 🔧 Валідації
    def validate_original_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Ціна має бути більшою за 0.')
        return value

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

    # 🔧 Статистика
    def _can_view_stats(self, obj):
        user = self.context['request'].user
        return has_premium_access(user, obj.user)

    def get_stats_message(self, obj):
        if not self._can_view_stats(obj):
            return "Статистика доступна тільки для преміум-продавця, менеджера або адміністратора."
        return None

    def get_region_average_price(self, obj):
        if self._can_view_stats(obj):
            return get_average_prices(obj)['region_average_price']
        return None

    def get_country_average_price(self, obj):
        if self._can_view_stats(obj):
            return get_average_prices(obj)['country_average_price']  # 🩵 тут було помилково region_average_price
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

    # 🔧 Створення
    def create(self, validated_data):
        description = validated_data.get('description', '')

        # Автоматична зміна статусу залежно від контенту
        if contains_bad_words(description):
            validated_data['status'] = 'draft'
        else:
            validated_data['status'] = 'active'

        return super().create(validated_data)


    # --- Оновлення ---
    def update(self, instance, validated_data):
        description = validated_data.get('description', instance.description)
        instance.description = description

        # Перевірка на нецензурну лексику
        if contains_bad_words(description):
            instance.edit_attempts += 1
            if instance.edit_attempts >= 3:
                instance.status = 'inactive'
                EmailService.manager_email_for_car_poster_edit(car=instance)
            else:
                instance.status = 'draft'
        else:
            instance.status = 'active'
            instance.edit_attempts = 0

        # Ціна та валюта
        if 'original_price' in validated_data:
            instance.original_price = validated_data['original_price']
        if 'original_currency' in validated_data:
            instance.original_currency = validated_data['original_currency']
        if 'original_price' in validated_data and 'original_currency' in validated_data:
            converted = apply_currency_conversion(
                instance.original_price,
                instance.original_currency
            )
            for field, value in converted.items():
                setattr(instance, field, value)

        # Локація
        if 'location' in validated_data:
            instance.location = validated_data['location']

        # Бренд/модель
        if 'brand' in validated_data:
            instance.brand = validated_data['brand']
        if 'model' in validated_data:
            instance.model = validated_data['model']

        instance.save()
        return instance


class BannedWordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannedWordsModel
        fields = ('id', 'word', 'updated_at', 'created_at')