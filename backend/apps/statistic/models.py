from django.db import models
from django.utils import timezone

from core.models import BaseModel

from apps.car.models import CarPosterModel


class CarViewModel(BaseModel):
    car = models.ForeignKey(CarPosterModel, on_delete=models.CASCADE, related_name='views')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'car_views'
        ordering = ['-timestamp']
