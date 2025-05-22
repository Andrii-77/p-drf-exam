from django.db import models

from core.models import BaseModel


class CarBrandModel(BaseModel):
    class Meta:
        db_table = 'car_brands'

    brand = models.CharField(max_length=50, unique=True)


class CarModelModel(BaseModel):
    class Meta:
        db_table = 'car_models'

    brand = models.ForeignKey(CarBrandModel, on_delete=models.CASCADE, related_name='models')
    model = models.CharField(max_length=50)


# class CurrencyChoices(models.TextChoices):
#     USD = 'USD', 'US Dollar'
#     EUR = 'EUR', 'Euro'
#     UAH = 'UAH', 'Hryvnia'


class CarPosterModel(BaseModel):
    class Meta:
        db_table = 'cars'

    brand = models.ForeignKey(CarBrandModel, on_delete=models.PROTECT)
    model = models.ForeignKey(CarModelModel, on_delete=models.PROTECT)
    # brand = models.CharField(max_length=50)
    # model = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=[('USD', 'USD'), ('EUR', 'EUR'), ('UAH', 'UAH')])
    # currency = models.CharField(max_length=3, choices=CurrencyChoices.choices, default=CurrencyChoices.USD)
    location = models.CharField(max_length=100)
