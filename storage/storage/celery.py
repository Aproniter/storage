import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'storage.settings')

app = Celery('storage')

app.config_from_object('django.conf:settings', namespace='CELERY')


app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check-preview-every-ten-minutes': {
        'task': 'docs.tasks.test',
        'schedule': crontab(),
    },
}