from django.core.management import call_command

from celery import shared_task


@shared_task
def update_exchange_rates_task():
    print("Оновлюю курси валют...")
    call_command('update_rates')
