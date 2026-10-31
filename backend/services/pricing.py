from decimal import Decimal, ROUND_HALF_EVEN

TWO_PLACES = Decimal('0.01')
FOUR_PLACES = Decimal('0.0001')

def round_currency(value) -> Decimal:
    """
    Rounds final monetary values to two decimal places using Banker's rounding (ROUND_HALF_EVEN)
    strictly as specified in Part 6.1.
    """
    if value is None:
        return Decimal('0.00')
    if not isinstance(value, Decimal):
        value = Decimal(str(value))
    return value.quantize(TWO_PLACES, rounding=ROUND_HALF_EVEN)

def calculate_line_item(unit_price: Decimal, variant_adjustment: Decimal, quantity: int, discount_amount: Decimal = Decimal('0'), tax_rate_percent: Decimal = Decimal('0')):
    """
    Calculates line total:
    Final Unit Price = Base Unit Price + Variant Adjustment
    Net Amount = (Final Unit Price * Quantity) - Discount
    Tax Amount = Net Amount * (tax_rate_percent / 100)
    Line Total = Net Amount + Tax Amount
    """
    if not isinstance(unit_price, Decimal):
        unit_price = Decimal(str(unit_price))
    if not isinstance(variant_adjustment, Decimal):
        variant_adjustment = Decimal(str(variant_adjustment))
    if not isinstance(discount_amount, Decimal):
        discount_amount = Decimal(str(discount_amount))
    if not isinstance(tax_rate_percent, Decimal):
        tax_rate_percent = Decimal(str(tax_rate_percent))

    effective_unit_price = unit_price + variant_adjustment
    subtotal = effective_unit_price * quantity
    net_after_discount = max(Decimal('0.0000'), subtotal - discount_amount)
    tax_amount = net_after_discount * (tax_rate_percent / Decimal('100.00'))
    line_total = net_after_discount + tax_amount

    return {
        'effective_unit_price': round_currency(effective_unit_price),
        'subtotal': round_currency(subtotal),
        'net_after_discount': round_currency(net_after_discount),
        'tax_amount': round_currency(tax_amount),
        'line_total': round_currency(line_total),
    }
