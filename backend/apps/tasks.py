import logging
from celery import shared_task
from services.recurring_billing import RecurringBillingEngine
from services.reminder_scheduler import ReminderSchedulerService

logger = logging.getLogger(__name__)

@shared_task
def task_run_recurring_billing_cycle():
    """Periodic automation to process subscriptions due for billing."""
    logger.info("Executing Celery scheduled recurring billing cycle...")
    invoices = RecurringBillingEngine.process_due_subscriptions()
    logger.info(f"Billing cycle finished. {len(invoices)} invoices generated.")
    return len(invoices)

@shared_task
def task_run_calendar_scheduler():
    """Periodic automation to identify upcoming renewals, quote expirations, and overdue collections."""
    logger.info("Executing Celery scheduled operational calendar reminder sweep...")
    results = ReminderSchedulerService.run_all()
    logger.info(f"Calendar scheduler sweep finished: {results}")
    return results
