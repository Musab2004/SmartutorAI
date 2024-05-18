from celery import shared_task
from django.utils import timezone
from .models import WeeklyGoals
import logging

logger = logging.getLogger(__name__)
@shared_task
def check_completion_of_weekly_goals():
    today = timezone.localdate()
    goals_to_complete = WeeklyGoals.objects.filter(end_date__lte=today)
    for goal in goals_to_complete:
        goal.is_completed = True
        goal.save()
    logger.info('check_completion_of_weekly_goals task has run')   