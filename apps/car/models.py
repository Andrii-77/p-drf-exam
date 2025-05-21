from django.db import models

from core.models import BaseModel

# class CarBrandModel(BaseModel):
#     class Meta:
#         db_table = 'car_brands'
#
#     name = models.CharField(max_length=50, unique=True)
#
#
# class CarModelModel(BaseModel):
#     class Meta:
#         db_table = 'car_models'
#
#     brand = models.ForeignKey(CarBrandModel, on_delete=models.CASCADE, related_name='models')
#     name = models.CharField(max_length=50)


# class CurrencyChoices(models.TextChoices):
#     USD = 'USD'
#     EUR = 'EUR'
#     UAH = 'UAH'


class CarPosterModel(BaseModel):
    class Meta:
        db_table = 'cars'

    # brand = models.ForeignKey(CarBrandModel, on_delete=models.PROTECT)
    # model = models.ForeignKey(CarModelModel, on_delete=models.PROTECT)
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=[('USD', 'USD'), ('EUR', 'EUR'), ('UAH', 'UAH')])
    location = models.CharField(max_length=100)
