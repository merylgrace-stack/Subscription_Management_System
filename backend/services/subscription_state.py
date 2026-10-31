from django.core.exceptions import ValidationError
from apps.subscriptions.models import Subscription

class SubscriptionStateMachine:
    """
    Enforces valid state transitions according to Part 3.5:
    Allowed:
    DRAFT -> QUOTATION -> CONFIRMED -> ACTIVE -> CLOSED
    ACTIVE <-> PAUSED (subject to plan permissions: allow_pausing)
    ACTIVE -> CLOSED (cancellation or expiry)
    QUOTATION -> CLOSED (rejection, cancellation or expiration)
    """

    ALLOWED_TRANSITIONS = {
        Subscription.Status.DRAFT: [Subscription.Status.QUOTATION, Subscription.Status.CONFIRMED],
        Subscription.Status.QUOTATION: [Subscription.Status.CONFIRMED, Subscription.Status.CLOSED],
        Subscription.Status.CONFIRMED: [Subscription.Status.ACTIVE, Subscription.Status.CLOSED],
        Subscription.Status.ACTIVE: [Subscription.Status.PAUSED, Subscription.Status.CLOSED],
        Subscription.Status.PAUSED: [Subscription.Status.ACTIVE, Subscription.Status.CLOSED],
        Subscription.Status.CLOSED: [], # Terminal state
    }

    @classmethod
    def can_transition(cls, subscription: Subscription, target_status: str) -> bool:
        current_status = subscription.status
        allowed = cls.ALLOWED_TRANSITIONS.get(current_status, [])
        if target_status not in allowed:
            return False

        # Additional plan-level permission checks
        if target_status == Subscription.Status.PAUSED:
            if subscription.plan and not subscription.plan.allow_pausing:
                return False

        if target_status == Subscription.Status.CLOSED:
            if current_status == Subscription.Status.ACTIVE and subscription.plan and not subscription.plan.allow_early_cancellation:
                # Unless expired
                pass

        return True

    @classmethod
    def transition(cls, subscription: Subscription, target_status: str, reason: str = '') -> Subscription:
        if not cls.can_transition(subscription, target_status):
            raise ValidationError(
                f"Invalid subscription transition: Cannot move from {subscription.status} to {target_status}."
            )

        subscription.status = target_status
        if target_status == Subscription.Status.PAUSED:
            subscription.pause_reason = reason
        elif target_status == Subscription.Status.CLOSED:
            subscription.cancellation_reason = reason

        subscription.save(update_fields=['status', 'pause_reason', 'cancellation_reason', 'updated_at'])
        return subscription
