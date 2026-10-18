"""Exercise plaintext rejection without storing any actual credentials."""

import base64
import runpy
from pathlib import Path

import pytest

check_config = runpy.run_path(str(Path(__file__).parents[1] / "scripts/check_secrets.py"))[
    "check_config"
]


@pytest.mark.parametrize(
    "config",
    [
        {"secrets": {"EXAMPLE": "placeholder"}},
        {"secrets": {"EXAMPLE": {"provider": "age", "value": "invalid"}}},
        {"profiles": {"prod": {"secrets": {"EXAMPLE": "placeholder"}}}},
    ],
)
def test_rejects_unencrypted_configuration(config: dict[str, object]) -> None:
    assert not check_config(config)


def test_empty_template_needs_no_key():
    assert check_config({"secrets": {}})


def test_accepts_age_envelope_and_remote_reference():
    # Synthetic envelope tests the format guard, not cryptographic validity.
    envelope = base64.b64encode(b"age-encryption.org/v1\nexample").decode()
    assert check_config({"secrets": {"EXAMPLE": {"provider": "age", "value": envelope}}})
    assert check_config({"secrets": {"EXAMPLE": {"provider": "vault", "value": "project/example"}}})


def test_rejects_plaintext_default_even_with_encrypted_value():
    envelope = base64.b64encode(b"age-encryption.org/v1\nexample").decode()
    assert not check_config(
        {"secrets": {"EXAMPLE": {"provider": "age", "value": envelope, "default": "example"}}}
    )
