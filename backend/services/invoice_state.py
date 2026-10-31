from decimal import Decimal
from django.core.exceptions import ValidationError
from django.db import transaction
from apps.billing.models import Invoice

class InvoiceStateMachine:
    """
    Enforces valid invoice state transitions per Part 4.1:
    DRAFT -> CONFIRMED -> PAID
    DRAFT or CONFIRMED -> CANCELLED
    Direct DRAFT -> PAID is explicitly forbidden!
    """

    ALLOWED_TRANSITIONS = {
        Invoice.Status.DRAFT: [Invoice.Status.CONFIRMED, Invoice.Status.CANCELLED],
        Invoice.Status.CONFIRMED: [Invoice.Status.PAID, Invoice.Status.CANCELLED],
        Invoice.Status.PAID: [],       # Settled terminal state
        Invoice.Status.CANCELLED: [],  # Void terminal state
    }

    @classmethod
    def can_transition(cls, invoice: Invoice, target_status: str) -> bool:
        allowed = cls.ALLOWED_TRANSITIONS.get(invoice.status, [])
        return target_status in allowed

    @classmethod
    @transaction.atomic
    def transition(cls, invoice: Invoice, target_status: str, force: bool = False) -> Invoice:
        if not cls.can_transition(invoice, target_status) and not force:
            raise ValidationError(
                f"Invalid invoice transition: Cannot transition from {invoice.status} to {target_status}."
            )

        if target_status == Invoice.Status.CONFIRMED:
            # Freeze snapshot immutability per Part 6.2
            invoice.is_frozen = True
            invoice.status = Invoice.Status.CONFIRMED
        elif target_status == Invoice.Status.PAID:
            if invoice.amount_paid < invoice.grand_total and not force:
                raise ValidationError(
                    f"Cannot mark invoice as PAID: Paid amount (${invoice.amount_paid}) is less than grand total (${invoice.grand_total})."
                )
            invoice.status = Invoice.Status.PAID
            invoice.outstanding_balance = Decimal('0.0000')
        elif target_status == Invoice.Status.CANCELLED:
            invoice.status = Invoice.Status.CANCELLED

        invoice.save()
        return invoice
