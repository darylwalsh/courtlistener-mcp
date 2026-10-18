"""Reject plaintext secret entries in the committed fnox configuration."""

import base64
import binascii
import sys
import tomllib
from pathlib import Path


def _valid_entry(entry: object) -> bool:
    if not isinstance(entry, dict) or not isinstance(entry.get("provider"), str):
        return False
    if "default" in entry or not isinstance(entry.get("value"), str):
        return False
    # Remote providers store references rather than age ciphertext.
    if entry["provider"] != "age":
        return bool(entry["provider"])
    try:
        decoded = base64.b64decode(entry["value"], validate=True)
    except (ValueError, binascii.Error):
        return False
    return decoded.startswith(b"age-encryption.org/v1\n")


def check_config(config: dict[str, object]) -> bool:
    """Validate age ciphertext without decrypting or printing secret values."""
    secrets = config.get("secrets", {})
    if not isinstance(secrets, dict) or not all(_valid_entry(entry) for entry in secrets.values()):
        return False
    profiles = config.get("profiles", {})
    if not isinstance(profiles, dict):
        return False
    return all(isinstance(profile, dict) and check_config(profile) for profile in profiles.values())


def main() -> int:
    """Check the template's provider-backed storage policy."""
    try:
        config = tomllib.loads(Path("fnox.toml").read_text())
        valid = check_config(config)
    except (OSError, ValueError):
        valid = False
    if not valid:
        print("fnox.toml requires provider-backed secrets without plaintext defaults.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
