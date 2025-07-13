from django.core import validators as V
from django.db import models

from core.enums.regex_enum import RegexEnum
from core.models import BaseModel

from apps.user.models import UserModel


class CarBrandModel(BaseModel):
    class Meta:
        db_table = 'car_brands'
        ordering = ('brand',)

    brand = models.CharField(max_length=50, unique=True,
                             validators=[V.RegexValidator(RegexEnum.BRANDNAME.pattern, RegexEnum.BRANDNAME.msg)])


class CarModelModel(BaseModel):
    class Meta:
        db_table = 'car_models'
        ordering = ('model',)

    brand = models.ForeignKey(CarBrandModel, on_delete=models.CASCADE, related_name='models')
    model = models.CharField(max_length=50,
                             validators=[V.RegexValidator(RegexEnum.MODELNAME.pattern, RegexEnum.MODELNAME.msg)])


class CurrencyChoices(models.TextChoices):
    USD = 'USD', 'US Dollar'
    EUR = 'EUR', 'Euro'
    UAH = 'UAH', 'Hryvnia'


class StatusChoices(models.TextChoices):
    DRAFT = 'draft', 'Чернетка'
    # PENDING = 'pending', 'На перевірці'  # Це може знадобитися в майбутньому.
    ACTIVE = 'active', 'Активне'
    INACTIVE = 'inactive', 'Неактивне'


class CarPosterModel(BaseModel):
    class Meta:
        db_table = 'cars'
        ordering = ('-id',)

    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='cars')
    brand = models.ForeignKey(CarBrandModel, on_delete=models.PROTECT)
    model = models.ForeignKey(CarModelModel, on_delete=models.PROTECT)
    # brand = models.CharField(max_length=50)
    # model = models.CharField(max_length=50)
    description = models.TextField()
    # price = models.DecimalField(max_digits=10, decimal_places=2,
    #                            validators=[V.MinValueValidator(1), V.MaxValueValidator(99999999.99)])
    # currency = models.CharField(max_length=3, choices=[('USD', 'USD'), ('EUR', 'EUR'), ('UAH', 'UAH')])
    # currency = models.CharField(max_length=3, choices=CurrencyChoices.choices, default=CurrencyChoices.USD)

    original_price = models.DecimalField(max_digits=10, decimal_places=2,
                                         validators=[V.MinValueValidator(1), V.MaxValueValidator(99999999.99)])
    original_currency = models.CharField(max_length=3, choices=CurrencyChoices.choices)
    price_usd = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    price_eur = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    price_uah = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    exchange_rate_used = models.JSONField(null=True, blank=True)

    location = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default='draft')
    edit_attempts = models.PositiveIntegerField(default=0)  # для обмеження в 3 редагування

class BannedWordsModel(BaseModel):
    class Meta:
        db_table = 'banned_words'
        ordering = ('word',)
    word = models.CharField(max_length=255, unique=True)
