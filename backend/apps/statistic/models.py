from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

from core.models import BaseModel

from apps.car.models import CarPosterModel

User = get_user_model()


class CarViewModel(BaseModel):
    car = models.ForeignKey(CarPosterModel, on_delete=models.CASCADE, related_name='views')
    timestamp = models.DateTimeField(default=timezone.now)
    # Це змінюю, бо не підходить для тестів.
    # timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True) # В майбутньому це поле можна використати при аналітиці.
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'car_views'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=["car", "user"]),
            models.Index(fields=["car", "ip_address"]),
            models.Index(fields=["car", "session_key"]),
        ]