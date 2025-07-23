import os

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configs.settings')

app = Celery('p-drf-exam')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.timezone = 'Europe/Kiev'

app.autodiscover_tasks()