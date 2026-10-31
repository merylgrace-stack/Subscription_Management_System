import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('brightloop')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Celery Beat Scheduled Periodic Automations
app.conf.beat_schedule = {
    'daily-recurring-billing-cycle': {
        'task': 'apps.tasks.task_run_recurring_billing_cycle',
        'schedule': crontab(hour=0, minute=5), # Runs daily at 00:05 UTC
    },
    'daily-operational-reminders-scheduler': {
        'task': 'apps.tasks.task_run_calendar_scheduler',
        'schedule': crontab(hour=1, minute=0), # Runs daily at 01:00 UTC
    },
}
