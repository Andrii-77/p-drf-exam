from celery.schedules import crontab

CELERY_BROKER_URL = 'redis://redis:6379/0'
CELERY_RESULTS_BACKEND = 'django-db'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

CELERY_BEAT_SCHEDULE = {
    'update-exchange-rates-daily': {
        'task': 'core.tasks.exchange_rates_tasks.update_exchange_rates_task',
        'schedule': crontab(hour=8, minute=55),  # щодня о 08:55
        # 'schedule': crontab(),  # щохвилини
    },
}