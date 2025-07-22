from celery.schedules import crontab

CELERY_BROKER_URL = 'redis://redis:6379/0'
CELERY_RESULTS_BACKEND = 'django-db'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

CELERY_BEAT_SCHEDULE = {
    'update-exchange-rates-daily': {
        'task': 'apps.exchange_rates.tasks.update_exchange_rates_task',
        'schedule': crontab(hour=0, minute=0),  # щодня о 00:00
    },
}