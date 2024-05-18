from django.apps import AppConfig
from celery.schedules import crontab



class FypbackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'fypbackend'
