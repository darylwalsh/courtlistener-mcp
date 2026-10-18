"""Validate opt-in key initialization in temporary directories only."""

import os
import shutil
import subprocess
import tomllib
from pathlib import Path

import pytest


@pytest.mark.parametrize("key_source", ["xdg", "explicit", "home"])
def test_init_reuses_identity_and_preserves_existing_recipients(
    tmp_path: Path, key_source: str
) -> None:
    root = Path(__file__).parents[1]
    project = tmp_path / "project"
    scripts = project / "scripts"
    scripts.mkdir(parents=True)
    helper = scripts / "secrets-init.sh"
    shutil.copyfile(root / "scripts/secrets-init.sh", helper)
    config = project / "fnox.toml"
    config.write_text(
        'default_provider = "age"\n[providers]\n'
        'age = { type = "age", recipients = [] }\n[secrets]\n'
        'EXAMPLE = { provider = "vault", value = "project/example" }\n'
    )
    env = os.environ.copy()
    env.pop("FNOX_AGE_KEY", None)
    env.pop("FNOX_AGE_KEY_FILE", None)
    env["HOME"] = str(tmp_path / "home")
    env["XDG_CONFIG_HOME"] = str(tmp_path / "config")
    key = tmp_path / "config/fnox/age.txt"
    if key_source == "explicit":
        key = tmp_path / "custom/identity.txt"
        env["FNOX_AGE_KEY_FILE"] = str(key)
    elif key_source == "home":
        env.pop("XDG_CONFIG_HOME", None)
        key = tmp_path / "home/.config/fnox/age.txt"
    bash = shutil.which("bash")
    assert bash is not None

    def initialize() -> None:
        # Executes only the checked-in helper, with all writes under tmp_path.
        subprocess.run(  # noqa: S603
            [bash, str(helper)],
            cwd=tmp_path,
            env=env,
            check=True,
            capture_output=True,
            text=True,
            timeout=10,
        )

    initialize()
    original_key = key.read_bytes()
    original_config = config.read_bytes()
    recipients = tomllib.loads(config.read_text())["providers"]["age"]["recipients"]
    assert tomllib.loads(config.read_text())["secrets"] == {
        "EXAMPLE": {"provider": "vault", "value": "project/example"}
    }
    assert len(recipients) == 1 and recipients[0].startswith("age1")
    assert key.stat().st_mode & 0o777 == 0o600
    initialize()
    assert key.read_bytes() == original_key
    assert config.read_bytes() == original_config

    # An existing recipient requires manual enrollment/re-encryption, not replacement.
    config.write_text(config.read_text().replace(recipients[0], "age1existing-recipient"))
    with_recipient = config.read_bytes()
    initialize()
    assert config.read_bytes() == with_recipient
    assert key.read_bytes() == original_key


@pytest.mark.parametrize("args,returncode", [(["--help"], 0), (["--unknown"], 2)])
def test_usage_does_not_initialize_secrets(
    tmp_path: Path, args: list[str], returncode: int
) -> None:
    scripts = tmp_path / "scripts"
    scripts.mkdir()
    helper = scripts / "secrets-init.sh"
    shutil.copyfile(Path(__file__).parents[1] / "scripts/secrets-init.sh", helper)
    env = os.environ.copy()
    key = tmp_path / "identity.txt"
    env["FNOX_AGE_KEY_FILE"] = str(key)
    bash = shutil.which("bash")
    assert bash is not None
    result = subprocess.run(  # noqa: S603
        [bash, str(helper), *args],
        cwd=tmp_path,
        env=env,
        capture_output=True,
        text=True,
        timeout=10,
        check=False,
    )
    assert result.returncode == returncode
    assert not key.exists()
    assert not (tmp_path / "fnox.toml").exists()
