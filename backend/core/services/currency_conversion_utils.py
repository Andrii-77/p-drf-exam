import logging
from decimal import InvalidOperation

from rest_framework.serializers import ValidationError

from core.services.currency_conversion_service import CurrencyConverter

logger = logging.getLogger(__name__)


def apply_currency_conversion(price, currency):
    """
    Отримує курси і виконує конвертацію. Повертає словник з полями:
    'price_usd', 'price_eur', 'price_uah', 'exchange_rate_used'
    """
    try:
        rates = CurrencyConverter.get_latest_rates()
        return CurrencyConverter.convert_price(price, currency, rates)
    except (InvalidOperation, KeyError, TypeError, ValueError) as e:
        logger.exception("Помилка при конвертації валюти:")
        raise ValidationError(f"Помилка при конвертації валюти: {e}")
