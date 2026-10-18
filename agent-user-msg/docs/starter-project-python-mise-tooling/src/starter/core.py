"""Example module. Delete it once you have real code."""

from collections.abc import Sequence


def normalize(values: Sequence[float]) -> list[float]:
    """Scale values linearly into the range [0, 1].

    A constant input maps to all zeros rather than dividing by zero.
    """
    if not values:
        return []
    lo, hi = min(values), max(values)
    span = hi - lo
    if span == 0:
        return [0.0 for _ in values]
    return [(v - lo) / span for v in values]
