import logging
from decimal import InvalidOperation

from rest_framework import serializers

from core.services.banned_words_service import contains_bad_words
from core.services.currency_conversion_service import CurrencyConverter
from core.services.currency_conversion_utils import apply_currency_conversion
from core.services.email_service import EmailService

from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel
from apps.statistic.services import get_average_prices
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

    class Meta:
        model = CarPosterModel
        # fields = ('id', 'brand', 'model', 'description', 'price', 'currency', 'location', 'status', 'edit_attempts',
        #           'updated_at', 'created_at')
        fields = ('id', 'brand', 'model', 'description', 'original_price', 'original_currency', 'price_usd',
                  'price_eur', 'price_uah', 'exchange_rate_used', 'location', 'status', 'edit_attempts',
                  'region_average_price', 'country_average_price', 'updated_at', 'created_at')
        # read_only_fields = ['status', 'edit_attempts']  # щоб не підміняли вручну

    def validate_original_price(self, original_price):
        if original_price <= 0:
            raise serializers.ValidationError('Price must be greater than 0.')
        return original_price

    def validate(self, attrs):
        price = attrs.get('original_price')
        currency = attrs.get('original_currency')

        # if not price or not currency:
        #     raise serializers.ValidationError("Ціна та валюта обов’язкові.")
        # Це не потрібне, бо перевірка наявності цих полів виконується в моделі.

        if not price:
            raise serializers.ValidationError("Щоб змінити валюту, також передайте ціну.")
        if not currency:
            raise serializers.ValidationError("Щоб змінити ціну, також передайте валюту.")

        #     rates = self.get_latest_exchange_rates()
        #
        #     if currency not in rates and currency != 'UAH':
        #         raise serializers.ValidationError(f"Немає курсу для валюти {currency}")
        #
        #     try:
        #         if currency == 'UAH':
        #             price_uah = price
        #         else:
        #             price_uah = (price * rates[currency]).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        #
        #         # Конвертація в USD і EUR — незалежно від валюти
        #         price_usd = (price_uah / rates['USD']).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        #         price_eur = (price_uah / rates['EUR']).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        #
        #         attrs['price_uah'] = price_uah
        #         attrs['price_usd'] = price_usd
        #         attrs['price_eur'] = price_eur
        #         attrs['exchange_rate_used'] = {k: str(v) for k, v in rates.items()}
        #
        #     except (InvalidOperation, KeyError, TypeError, ValueError) as e:
        #         logger.exception("Помилка при конвертації валюти:")
        #         raise serializers.ValidationError(f"Помилка при конвертації валюти: {e}")
        #
        #     return attrs
        #
        # def get_latest_exchange_rates(self):
        #     latest_date = ExchangeRate.objects.aggregate(latest=Max("date"))["latest"]
        #     if not latest_date:
        #         raise serializers.ValidationError("У базі немає записів із курсами валют.")
        #
        #     rates = ExchangeRate.objects.filter(date=latest_date)
        #     rates_dict = {}
        #
        #     for rate in rates:
        #         try:
        #             rates_dict[rate.currency] = Decimal(str(rate.rate))
        #         except (InvalidOperation, TypeError, ValueError) as e:
        #             raise serializers.ValidationError(f"Невірне значення курсу для {rate.currency}: {e}")
        #
        #     # Перевірка обов’язкових валют
        #     if 'USD' not in rates_dict or 'EUR' not in rates_dict:
        #         raise serializers.ValidationError("Не знайдено всіх обов’язкових курсів (USD, EUR).")
        #
        #     return rates_dict

        # try:
        #     rates = CurrencyConverter.get_latest_rates()
        #     converted = CurrencyConverter.convert_price(price, currency, rates)
        #
        #     attrs.update(converted)
        # except (InvalidOperation, KeyError, TypeError, ValueError) as e:
        #     logger.exception("Помилка при конвертації валюти:")
        #     raise serializers.ValidationError(f"Помилка при конвертації валюти: {e}")
        #
        # return attrs

        converted = apply_currency_conversion(price, currency)
        attrs.update(converted)
        return attrs

        # rates = CurrencyConverter.get_latest_rates()
        # converted = CurrencyConverter.convert_price(price, currency, rates)
        # attrs.update(converted)

    def get_region_average_price(self, obj):
        user = self.context['request'].user
        if has_premium_access(user, obj.user):
            return get_average_prices(obj)['region_average_price']
        return "Ця інформація доступна тільки для преміум-продавця, менеджера або адміністратора"

    def get_country_average_price(self, obj):
        user = self.context['request'].user
        if has_premium_access(user, obj.user):
            return get_average_prices(obj)['region_average_price']
        return "Ця інформація доступна тільки для преміум-продавця, менеджера або адміністратора"

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

        # # Якщо змінено тільки одне з полів — повертаємо помилку
        # if 'original_price' in validated_data and 'original_currency' not in validated_data:
        #     raise serializers.ValidationError("Щоб змінити ціну, також передайте валюту.")
        # if 'original_currency' in validated_data and 'original_price' not in validated_data:
        #     raise serializers.ValidationError("Щоб змінити валюту, також передайте ціну.")

        # Якщо змінено ціну і валюту — перерахунок

        # currency = validated_data.get("original_currency", instance.original_currency)
        #             # price = validated_data.get("original_price", instance.original_price)
        #             # rates = self.get_latest_exchange_rates()
        #             #
        #             # # ❗️Фікс — перетворення Decimal → str
        #             # instance.exchange_rate_used = {k: str(v) for k, v in rates.items()}
        #             #
        #             # if currency == 'USD':
        #             #     instance.price_usd = price
        #             #     instance.price_uah = round(price * rates['USD'], 2)
        #             #     instance.price_eur = round((price * rates['USD']) / rates['EUR'], 2)
        #             # elif currency == 'EUR':
        #             #     instance.price_eur = price
        #             #     instance.price_uah = round(price * rates['EUR'], 2)
        #             #     instance.price_usd = round((price * rates['EUR']) / rates['USD'], 2)
        #             # elif currency == 'UAH':
        #             #     instance.price_uah = price
        #             #     instance.price_usd = round(price / rates['USD'], 2)
        #             #     instance.price_eur = round(price / rates['EUR'], 2)

        if 'original_price' in validated_data and 'original_currency' in validated_data:
            # try:
            #     rates = CurrencyConverter.get_latest_rates()
            #     converted = CurrencyConverter.convert_price(
            #         validated_data['original_price'],
            #         validated_data['original_currency'],
            #         rates
            #     )
            #     instance.price_usd = converted['price_usd']
            #     instance.price_eur = converted['price_eur']
            #     instance.price_uah = converted['price_uah']
            #     instance.exchange_rate_used = converted['exchange_rate_used']
            # except Exception as e:
            #     logger.exception("Помилка при оновленні ціни:")
            #     raise serializers.ValidationError(f"Помилка при оновленні ціни: {e}")

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


ields = ('id', 'word', 'updated_at', 'created_at')
