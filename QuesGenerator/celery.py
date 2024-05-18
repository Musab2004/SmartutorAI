from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
from celery.schedules import timedelta
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'QuesGenerator.settings')

app = Celery('QuesGenerator')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
app.conf.beat_schedule = {
    'check_completion_of_weekly_goals_every_day': {
        'task': 'fypbackend.tasks.check_completion_of_weekly_goals',
        'schedule': timedelta(seconds=10),  # Runs every second
    },
        'check_completion_of_weekly_goals_every_day': {
        'task': 'fypbackend.tasks.check_completion_of_weekly_goals',
        'schedule': timedelta(seconds=10),  # Runs every second
    },
        'check_completion_of_weekly_goals_every_day': {
        'task': 'fypbackend.tasks.check_completion_of_weekly_goals',
        'schedule': timedelta(seconds=10),  # Runs every second
    },
}
