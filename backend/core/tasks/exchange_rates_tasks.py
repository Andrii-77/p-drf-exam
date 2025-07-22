from django.core.management import call_command

from celery import shared_task
from configs.celery import app


@shared_task
# @ app.task
def update_exchange_rates_task():
    print("Оновлюю курси валют...")
    call_command('update_rates')
