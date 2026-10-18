import pytest

from starter import normalize


def test_normalize_scales_to_unit_range():
    assert normalize([2.0, 4.0, 6.0]) == [0.0, 0.5, 1.0]


def test_normalize_constant_input_is_zero():
    assert normalize([3.0, 3.0]) == [0.0, 0.0]


def test_normalize_empty():
    assert normalize([]) == []


@pytest.mark.slow
def test_example_slow_marker_is_skipped_by_default():
    assert normalize(list(map(float, range(10_000))))[-1] == 1.0
