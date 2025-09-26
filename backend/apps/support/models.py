from django.conf import settings
from django.db import models

from core.models import BaseModel


class SupportRequestModel(BaseModel):
    class Meta:
        db_table = 'support'
        ordering = ('-id',)

    TYPE_CHOICES = [
        ("brand", "Missing brand"),
        ("model", "Missing model"),
    ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    text = models.CharField(max_length=255)  # назва бренду або моделі

    brand = models.ForeignKey(
        "car.CarBrandModel",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="support_requests",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="support_requests",  # <-- опціонально
    )

    processed = models.BooleanField(default=False)