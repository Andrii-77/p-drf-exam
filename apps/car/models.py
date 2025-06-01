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
    price = models.DecimalField(max_digits=10, decimal_places=2,
                                validators=[V.MinValueValidator(1), V.MaxValueValidator(99999999.99)])
    # currency = models.CharField(max_length=3, choices=[('USD', 'USD'), ('EUR', 'EUR'), ('UAH', 'UAH')])
    currency = models.CharField(max_length=3, choices=CurrencyChoices.choices, default=CurrencyChoices.USD)
    location = models.CharField(max_length=100)
