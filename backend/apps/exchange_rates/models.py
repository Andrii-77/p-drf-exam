from django.db import models

from core.models import BaseModel


class CurrencyChoices(models.TextChoices):
    USD = 'USD', 'US Dollar'
    EUR = 'EUR', 'Euro'
    
class ExchangeRate(BaseModel):
    class Meta:
        db_table = 'exchange_rates'
        ordering = ('-id',)
        unique_together = ('currency', 'date')

    currency = models.CharField(max_length=3, choices=CurrencyChoices.choices)
    rate = models.DecimalField(max_digits=10, decimal_places=4)
    date = models.DateField()

